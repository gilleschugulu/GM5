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

	fixedHTML: (html) ->
		d = document.createElement('div')
		d.innerHTML = html
		d.innerHTML

	getTextFromHTML: (html) ->
		html.replace(/<(.)*?>/gm, '').replace(/<(.)*/, '') # TODO: refactor regex to remote html AND invalid html

	applyLegalLimitation: (news) ->
		newsContentHTML = news.get 'description'
		newsContentTextLegalLimit = @getTextFromHTML(newsContentHTML).length * 0.2
		for newsContentLegalLimitationModifier in [0.05..1] by 0.025
			newsContentHTMLLegal = newsContentHTML.substring(0, newsContentHTML.length * newsContentLegalLimitationModifier)
			news.set 'legalDescription', @fixedHTML("#{newsContentHTMLLegal}...") if @getTextFromHTML(newsContentHTMLLegal).length > newsContentTextLegalLimit
			news.save null	

	refresh: ->
		from = @model.get('page') * @model.get('per')				
		new Parse.Query(News).skip(from).limit(@model.get('per')).include(['section', 'source']).descending('createdAt').find({
			success: (news) =>
				@model.set('news', news)
				@reloadData()
				@newsDidLoad()
		})

	# TODO: need to move this in a helper
	# -----------------------------------
	legalize: ->
		s1 = new Section()
		s1.id = '5RrmrJOtYY'

		s2 = new Section()
		s2.id = 'Zytx8X61em'

		new Parse.Query(News).limit(400).containedIn('section', [s1, s2]).find
			success: (news) =>
				for newsObject in news
					newsObject.set('legalDescription', newsObject.get('description'))
					newsObject.save null
			error: (error) =>
				console.log error

		new Parse.Query(News).limit(400).notContainedIn('section', [s1, s2]).find
			success: (news) =>
				@applyLegalLimitation(newsObject) for newsObject in news
			error: (error) =>
				console.log error
