Controller = require 'controllers/base/controller'
Portal = require 'views/portal_view'
mediator = require 'mediator'

module.exports = class PortalController extends Controller

	historyURL: (params) ->
		"portal"

	initialize: ->
		@subscribeEvent 'login', @login

	index: ->
		if mediator.user then @loginSuccess(mediator.user) else @view = new Portal()

	login: ->
		@publishEvent('loginStarted')
		Parse.User.logIn(@view.getEmail(), @view.getPassword(), {
			success: (user) =>
				@loginSuccess(user)
			error: (user, error) =>
				@loginFail(error)
		})

	loginSuccess: (user) ->
		@publishEvent('loginEnded')
		mediator.user = user
		mediator.publish '!startupController', 'news', 'index'

	loginFail: (error) ->
		@publishEvent('loginEnded')
		alert(error.message)