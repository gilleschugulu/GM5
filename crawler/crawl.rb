#/usr/local/bin/ruby

require 'rubygems'
require 'parse-ruby-client'
require 'httparty'
require './crawler'
require 'iconv'

# Ensure compatibility with ruby 1.8.7
# equivalent to str.force_encoding('UTF-8') in ruby 1.9.x
class String
  def force_utf8
    ::Iconv.conv('UTF-8//IGNORE', 'UTF-8', self + ' ')[0..-2]
  end
end

def crowlNewsFromFeed(feed, source)
  puts "|~> Crawling News at #{feed.url}..."

  # Crowl news page
  newsCrowler = Crawler.new :url => feed.url
  newsCrowler.crawl

  # Crowl news' image from fb opengraph or twitter objects
  imageURL = newsCrowler.match(/<meta[^>]property="og:image".*?content="(.*?)"[^>]*>/mi).first || newsCrowler.match(/<meta[^>]name="twitter:image".*?content="(.*?)"[^>]*>/mi).first

  if imageURL
    puts "|~> Crawled image at #{imageURL}"
    newsImage = Parse::File.new({:body => HTTParty.get(imageURL).body, :local_filename => 'news-image', :content_type => 'image/jpeg'}) rescue nil
    newsImage.save if newsImage
  else
    puts "|~> WARNING: Could NOT find image to crowl for news at #{feed.url}."
  end

  # Crowl itunes app id contained in "Download on app store" link
  applicationAppStoreId = newsCrowler.match(/#{source['appStoreIdExpression']}/mi).first if source['appStoreIdExpression']

  # Try to crowl full article according that we have the benining ot the article, so try to match it in full html canvas
  if source['fullDescriptionExpression']
    fullDescription = newsCrowler.match(/#{source['fullDescriptionExpression']}/mi).first || feed.summary
  else
    fullDescription = feed.summary
  end

  if fullDescription
    # <noscript> tags prevent images from being display on the WYSIWYG editor
    fullDescription.gsub! /<noscript>/, ''
    # If relative paths are used, match relative path and make them absolute!
    if source['usesRelativePathForResources']
      newsCrowler.match(/<img[^>]+src="(.*?)"/).each do |match|
        fullDescription.gsub! /#{match}/mi, "#{source['URL'] + match}" unless source['URL'].nil? || match.start_with?('http')
      end
    end
  else
    puts "|~> WARNING: Could NOT crowl full article body for news at #{feed.url}. Taking summary..."
    fullDescription = feed.summary
  end

  # Re-build news
  news = Parse::Object.new('News')

  # WARNING: To Define instead of hard coding
  news[:section] = Parse::Pointer.new({'className' => 'Section', 'objectId' => '44bBINITa6'})
  news[:category] = '6'
  news[:lang] = source['lang'] || 'en'

  news[:source] = source.pointer
  news[:title] = feed.title
  news[:originUrl] = feed.url
  news[:description] = fullDescription.force_utf8()
  news[:publishedAt] = {"__type" => "Date", "iso" => (feed.published || Time.now).strftime('%Y-%m-%dT%H:%M:%S.000Z')}
  news[:preview] = newsCrowler.match(/#{source['previewExpression']}/mi).first if source['previewExpression']

  if newsImage
      news[:image] = newsImage
      news[:priority] = 2
  else
      news[:priority] = 1
  end

  if applicationAppStoreId and applicationAppStoreId.length > 0
    puts "|~> Crowled application id #{applicationAppStoreId} for news at #{feed.url}"
    iTunesInfo = HTTParty.get('https://itunes.apple.com/lookup', :query => {:id => applicationAppStoreId})
    if iTunesInfo['resultCount'].to_i == 0
      puts "|~> WARNING: Could not get application information from iTunes API. Application id was #{applicationAppStoreId}"
    else
      iTunesInfo = iTunesInfo['results'].first
      if !iTunesInfo['trackName']
        puts "|~> WARNING: Crowled iTunes Id is not an App!!!, ignoring..."
      else
        puts "|~> Successfully got application information from iTunes API"
        appIconImage = Parse::File.new({:body => HTTParty.get(iTunesInfo['artworkUrl60']).body, :local_filename => 'app-icon', :content_type => 'image/jpeg'})
        appIconImage.save
        news[:applicationAppStoreId] = applicationAppStoreId
        news[:applicationName] = iTunesInfo['trackName']
        news[:applicationPrice] = iTunesInfo['price'].to_s if iTunesInfo['price']
        news[:applicationVersion] = iTunesInfo['version'].to_s if iTunesInfo['version']
        news[:applicationRanking] = iTunesInfo['averageUserRating'].to_s if iTunesInfo['averageUserRating']
        news[:applicationIcon] = appIconImage
      end
    end
  end

  duplicate_matches = query = Parse::Query.new('News').tap do |query|
    query.eq 'title', news[:title]
    query.limit = 0
    query.count
  end.get

  if duplicate_matches['count'].to_i > 0
    puts "|~> WARNING: Could not save the news because it is a duplicate"
  else
    # Persist the news!
    result = news.save rescue nil
    puts "|~> WARNING: Could not save the news." unless result
  end
end

def sourceRanking
  newsQuery = Parse::Query.new('News')
  newsQuery.include = 'source'
  newsQuery.limit = 9999
  newsQuery.get.inject({}) {|hash, news|
    hash[news['source']['name']] ||= 0
    hash[news['source']['name']] += 1
    hash
  }.sort {|a, b| b[1] <=> a[1]}
end

#########################
# Begin execution
#########################

Parse.init :application_id => 'HGoHF8NOmWIM8P3XjhcNcRi0euFsiiiRTV0dzkE3',
           :api_key => '7buOMQUxUWg2kEA0nQZtpvU3kOs9yLW0Jl4YJCfy'


Crawler::clean
Crawler::crawl do |feed, source|
  crowlNewsFromFeed feed, source
end


#########################
# End execution
#########################
