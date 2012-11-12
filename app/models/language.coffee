Model = require 'models/base/model'

module.exports = class Language extends Model

	defaults:
		items: [
			{value: '', name: 'Selectionner'}
			{value: 'fr', name: 'Francais'}
			{value: 'en', name: 'Anglais'}
		]
