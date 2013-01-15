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
		Handlebars.registerHelper 'pagination', =>
			html = ""
			for page in [1..@model.get('pages')]
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

	newsDidLoad: ->
		$('#news-loader').fadeOut complete: ->
			$('#news_list').fadeIn()
			$('#news-pagination').fadeIn()	

	afterRender: ->
		super
		$('#news_list').hide()
		$('#news-pagination').hide()
		@refresh()

	refresh: ->
		from = @model.get('page') * @model.get('per')
		new Parse.Query(News).skip(from).limit(@model.get('per')).include(['section', 'source']).descending('createdAt').find({
			success: (news) =>
				@model.set('news', news)
				@reloadData()
				@newsDidLoad()
		})
