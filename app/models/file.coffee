Model = require 'models/base/model'
mediator = require 'mediator'

module.exports = class File extends Parse.Object

	className: 'File'

	serialize: ->
		this

	@upload: (data, callbacks) ->
		return unless data 
		$.ajax({
			type: 'POST'
			url: "https://api.parse.com/1/files/#{data.name}"
			data: data
			processData: false
			contentType: false
			beforeSend: (request) ->
				request.setRequestHeader('X-Parse-Application-Id', mediator.parseApplicationId)
				request.setRequestHeader('X-Parse-REST-API-Key', mediator.parseApiKey)
				request.setRequestHeader('Content-Type', data.type)
			success: (data) =>
				data.__type = 'File'
				callbacks.success(data) if callbacks.success
			error: (data) ->
				callbacks.error($.parseJSON(data)).error if callbacks.error
		})