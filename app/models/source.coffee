Model = require 'models/base/model'

module.exports = class Source extends Parse.Object
	
	className: 'Source'

	serialize: ->
		this
