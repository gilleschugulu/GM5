View = require 'views/base/view'
template = require 'views/templates/crawled_news_list_template'
News = require 'models/news'
CrawledNewsListItemView = require 'views/crawled_news_list_item_view'
Section = require 'models/section'

module.exports = class NewsView extends View
  template: template
  container: '#page-container'
  autoRender: true

  addNewsItem: (news) ->
    row = new CrawledNewsListItemView(model: news)
    $("#news_list").append(row.render().el);

  reloadData: ->
    $("#news_list > tbody").empty()
    @addNewsItem(news) for news in @model.get('news')
    @newsDidLoad()

  newsDidLoad: ->
    $('#news-loader').fadeOut complete: ->
      $('#news_list').fadeIn()
      $('#news-pagination').fadeIn()

  showLoading: ->
    $('#news_list').hide()
    $('#news-pagination').hide()
    $('#news-loader').fadeIn()
