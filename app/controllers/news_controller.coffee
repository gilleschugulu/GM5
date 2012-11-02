Controller = require 'controllers/base/controller'
Section = require 'models/section'
News = require 'models/news'
NewsView = require 'views/news_view'
NewsCreateView = require 'views/news_create_view'
Source = require 'models/source'
Collection = require 'models/base/collection'
Model = require 'models/base/model'
mediator = require 'mediator'

module.exports = class NewsController extends Controller

	historyURL: (params) ->
		if params.id then "news/#{params.id}" else 'news'

	index: ->
		@view = new NewsView()

	show: (params) ->
		new Parse.Query(Section).find({
			success: (sections) =>
				new Parse.Query(Source).find({
					success: (sources) =>
						new Parse.Query(News).include(['applicationIcon', 'image']).get(params.id, {
							success: (news) =>
								@view = new NewsCreateView(
									model: new Model({
										title: 'Edit a news'
										news: news
										sections: sections
										sources: sources
									})
								)
							error: (news, error) =>
								alert(':(')
						})
				})
		})

	new: ->
		@view = new NewsCreateView(
			model: new Model({
				title: 'Create a news'
				news: new News()
			})
		)
		new Parse.Query(Section).find({
			success: (sections) =>
				@view.model.attributes.sections = sections
				@view.render()
		})
		new Parse.Query(Source).find({
			success: (sources) =>
				@view.model.attributes.sources = sources
				@view.render()
		})
