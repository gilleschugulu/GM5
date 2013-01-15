Controller = require 'controllers/base/controller'
PortalView = require 'views/portal_view'
mediator = require 'mediator'

module.exports = class PortalController extends Controller

	initialize: ->
		@subscribeEvent 'login', @login

	index: ->
		return @loginSuccess(mediator.user) if mediator.user
		@view = new PortalView()

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
		@redirectTo('news?page=1')

	loginFail: (error) ->
		@publishEvent('loginEnded')
		alert(error.message)	