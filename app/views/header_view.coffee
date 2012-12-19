View = require 'views/base/view'
template = require 'views/templates/header'
mediator = require 'mediator'

module.exports = class HeaderView extends View
	template: template
	id: 'header'
	className: 'header'
	container: '#header-container'
	autoRender: true

	events: ->
		"click #logout": "logout"
#  	"click #create-news": "createNews"
#  	"click #list-news": "listNews"

	initialize: ->
		super
		@subscribeEvent 'loginStatus', @render
		@subscribeEvent 'startupController', @render
		Handlebars.registerHelper('isLoggedIn', (block) =>
			block.fn() if mediator.user
		)

	logout: ->
		@publishEvent 'logout'

#  createNews: ->
#  	@publishEvent 'createNews'

#  listNews: ->
#  	@publishEvent 'listNews'