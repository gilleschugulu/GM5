Model = require 'models/base/model'

module.exports = class Category extends Model

	defaults:
		items: [
			{value: '', name: 'Selectionner'}
			{value: '1', name: 'Test'}
			{value: '2', name: 'News'}
			{value: '3', name: 'Dossier'}
			{value: '4', name: 'Business'}
      {value: '5', name: 'Rumeur'}
			{value: '6', name: 'Crowled'}
		]
