require 'parse-ruby-client'
require 'feedzirra'

class Crawler
  attr_accessor :url, :canvas

  def initialize(options = {})
    self.url = options[:url]
  end

  def crawl(path = nil)
    self.canvas = HTTParty.get(self.url).body
  end

  def match(rgx)
    self.canvas.scan(rgx).flatten
  end

  def self.clean
    query = Parse::Query.new('News').tap do |q|
      q.eq('section', Parse::Pointer.new({'className' => 'Section', 'objectId' => '44bBINITa6'}))
    end
    query.get.each do |news|
      news.parse_delete
    end
  end

  def self.crawl source_id = nil
    query = Parse::Query.new('Source')
    if source_id
      query.tap do |q|
        q.eq 'objectId', source_id
      end
    end
    query.not_eq 'excluded_for_crawler', true
    query.get.each do |source|
      next unless source['feeds']
      source['feeds'].each do |feed|
        puts "|~> Crowling #{source['name']} at #{feed}..."
        rss = Feedzirra::Feed.fetch_and_parse feed
        next unless rss.try(:entries)
        rss.entries.first(5).each do |entry|
          yield entry, source if block_given?
        end
      end
    end    
  end
end
