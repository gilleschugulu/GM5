Controller = require 'controllers/base/controller'
Section = require 'models/section'
News = require 'models/news'
NewsView = require 'views/news_view'
NewsCreateView = require 'views/news_create_view'
Source = require 'models/source'
Category = require 'models/category'
Priority = require 'models/priority'
Language = require 'models/language'
Model = require 'models/base/model'
mediator = require 'mediator'

module.exports = class NewsController extends Controller

	historyURL: (params) ->
		if params.id then "news/#{params.id}" else 'news'

	index: ->
		return @redirectTo 'portal' unless mediator.user
		@view = new NewsView()

	show: (params) ->
		return @redirectTo 'portal' unless mediator.user
		new Parse.Query(Section).find({
			success: (sections) =>
				new Parse.Query(Source).find({
					success: (sources) =>
						new Parse.Query(News).get(params.id, {
							success: (news) =>
								@view = new NewsCreateView(
									model: new Model({
										title: 'Edit a news'
										news: news
										sections: sections
										sources: sources
										categories: new Category()
										languages: new Language()
										priorities: new Priority()
									})
								)
							error: (news, error) =>
								alert(':(')
						})
				})
		})

	new: ->
		return @redirectTo 'portal' unless mediator.user
		new Parse.Query(Section).find({
			success: (sections) =>
				new Parse.Query(Source).find({
					success: (sources) =>
						@view = new NewsCreateView(
							model: new Model({
								title: 'Create a news'
								sections: sections
								sources: sources
								news: new News()
								categories: new Category()
								languages: new Language()
								priorities: new Priority()
							})
						)
				})
		})

