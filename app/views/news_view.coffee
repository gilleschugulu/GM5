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
		@subscribeEvent 'newsHasBeenUpdated', @refresh

	add_news_item: (news) -> 
		row = new NewsListItemView(model: news)
		$("#news_list").append(row.render().el);

	reload_data: ->
		$("#news_list > tbody").empty()
		@add_news_item(news) for news in @model.get('news')

	afterRender: ->
		super
		@refresh()

	refresh: ->
		new Parse.Query(News).include(['section', 'source']).find({
			success: (news) =>
				@model = new Model(news: news)
				@reload_data()
		})
