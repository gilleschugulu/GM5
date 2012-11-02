View = require 'views/base/view'
template = require 'views/templates/news_list_item'
mediator = require 'mediator'

module.exports = class NewsListItemView extends View
  template: template
  autoRender: true
  tagName: 'tr'

  events: ->
  	"click": "click"

  click: (event) ->
  	mediator.publish '!startupController', 'news', 'show', {
  		id: @model.id
  	}

