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
				for news_object in news
					# Set default publication date to today and ajust to 00:00 for hours because we want to discard the time
					publishedAt = news_object.get('publishedAt') || new Date()
					publishedAt.setHours(1)
					publishedAt.setMinutes(0)
					publishedAt.setSeconds(0)
					publishedAt.setMilliseconds(0)
					news_object.set('publishedAt', publishedAt)
					news_object.save(null)

				@model = new Model(news: news)
				@reload_data()
		})
