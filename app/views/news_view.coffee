View = require 'views/base/view'
template = require 'views/templates/news'
News = require 'models/news'
Model = require 'models/base/model'
Collection = require 'models/base/collection'
NewsListItemView = require 'views/news_list_item_view'
Section = require 'models/section'

module.exports = class NewsView extends View
  template: template
  container: '#page-container'

  initialize: ->
    super
    @subscribeEvent 'newsHasBeenUpdated', @reloadData
    Handlebars.registerHelper 'pagination', =>
      html = ""
      from = Math.max [@model.get('page') - 8, 1]...
      to = Math.min [@model.get('page') + 8, @model.get('pages')]...
      for page in [from..to]
        if page == @model.get('page') + 1
          html += "<li class=\"active\"><a href=\"/news?page=#{page}\">#{page}</a></li>"
        else
          html += "<li><a href=\"/news?page=#{page}\">#{page}</a></li>"
      return new Handlebars.SafeString(html)

  addNewsItem: (news) ->
    row = new NewsListItemView(model: news)
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
