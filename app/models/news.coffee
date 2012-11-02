Model = require 'models/base/model'

module.exports = class News extends Parse.Object
	
	className: 'News'

#	defaults:
#		lang: '0'
#		priority: '0'
#		category: '0'

	serialize: -> 
		this