Model = require 'models/base/model'

module.exports = class Priority extends Model

	defaults:
		items: [
			{value: '', name: 'Selectionner'}
			{value: '1', name: 'Mineur'}
			{value: '2', name: 'Medium'}
			{value: '3', name: 'Majeur'}
		]
		