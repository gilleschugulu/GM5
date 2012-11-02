Model = require 'models/base/model'

module.exports = class Section extends Parse.Object

	className: 'Section'

	serialize: ->
		this
