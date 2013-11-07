Model = require 'models/base/model'

module.exports = class Language extends Model

	defaults:
		items: [
			{value: 'en', name: 'Anglais'}
      {value: 'fr', name: 'Francais'}
		]
