View = require 'views/base/view'
template = require 'views/templates/portal'

module.exports = class PortalView extends View
	template: template
	container: '#page-container'
	autoRender: true
	id: 'portal'

	initialize: ->
		super
		@subscribeEvent 'loginStarted', ->
			$('#sign-in-button').attr('disabled', 'disabled')
		@subscribeEvent 'loginEnded', ->
			$('#sign-in-button').attr('disabled', null)

	events: ->
		"click #sign-in-button": "login"

	login: (event) ->
		@publishEvent 'login'

	getEmail: ->
		$('#inputEmail').attr('value')

	getPassword: ->
		$('#inputPassword').attr('value')
