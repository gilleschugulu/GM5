Model = require 'models/base/model'

module.exports = Parse.Object.extend
	
	className: 'News'

#	defaults:
#		lang: '0'
#		priority: '0'
#		category: '0'

	serialize: -> 
		this
