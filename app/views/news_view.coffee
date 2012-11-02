View = require 'views/base/view'
template = require 'views/templates/news'
News = require 'models/news'
Model = require 'models/base/model'
Collection = require 'models/base/collection'
NewsListItemView = require 'views/news_list_item_view'

module.exports = class NewsView extends View
  template: template
  container: '#page-container'
  autoRender: true

  initialize: -> 
  	super
  	@refresh()

  add_news_item: (news) -> 
  	row = new NewsListItemView(model: news)
  	$("#news_list").append(row.render().el);

  reload_data: ->
  	$("#news_list").html('')
  	@add_news_item(news) for news in @model.news

  refresh: ->
  	new Parse.Query(News).find({
  		success: (news) =>
  			@model = new Model()
  			@model.news = news
  			@reload_data()
  	})