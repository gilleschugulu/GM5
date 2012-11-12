Model = require 'models/base/model'
mediator = require 'mediator'

module.exports = class File extends Parse.Object

	className: 'File'

	serialize: ->
		this

	upload: (callbacks) ->
		return unless @data 
		$.ajax({
			type: 'POST'
			url: "https://api.parse.com/1/files/#{@data.name}"
			data: @data
			processData: false
			contentType: false
			beforeSend: (request) ->
				request.setRequestHeader('X-Parse-Application-Id', mediator.parseApplicationId)
				request.setRequestHeader('X-Parse-REST-API-Key', mediator.parseApiKey)
				request.setRequestHeader('Content-Type', @data.type)
			success: (data) =>
				@name = data.name
				@url = data.url
				@bind(callbacks)
			error: (data) ->
				callbacks.error($.parseJSON(data)).error if callbacks.error
		})

	bind: (callbacks) ->
		return unless @name and @url
		$.ajax({
			type: 'POST'
			url: "https://api.parse.com/1/classes/#{@className}"
			data: JSON.stringify({
				image: {
					name: @name
					__type: 'File'
				}
			})
			beforeSend: (request) ->
				request.setRequestHeader('X-Parse-Application-Id', mediator.parseApplicationId)
				request.setRequestHeader('X-Parse-REST-API-Key', mediator.parseApiKey)
				request.setRequestHeader('Content-Type', 'application/json')
			success: (data) =>
				@id = data.objectId
				callbacks.success() if callbacks.success
			error: (data) ->
				console.log 'err'
				callbacks.error($.parseJSON(data)).error if callbacks.error
		})
