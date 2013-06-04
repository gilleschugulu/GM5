View = require 'views/base/view'
template = require 'views/templates/source_list_item_template'
EventHelper = require 'helpers/event_helper'

module.exports = class SourceListItemView extends View
  template: template
  autoRender: true

  initialize: ->
    # Iterates trough source's feeds, passing a reference on the source itself
    Handlebars.registerHelper 'feedList', (source, options) =>
      index = 0
      options.fn {feed, source, index: index++} for feed in (source.attributes.feeds || [])

    # Check if given feeds is the last element of the source's feed list
    Handlebars.registerHelper 'isLastFeed', (source, index, block) =>
      if index == (source.attributes.feeds.length - 1) then block.fn() else block.inverse()

  events: ->
    "change .source-name-input" : "sourceNameChanged"
    "change .source-url-input" : "sourceUrlChanged"
    "change .source-feed-input" : "sourceFeedChanged"
    "click .add-source-feed-button" : "addSourceFeed"
    "click .destroy-source-feed-button" : "deleteSourceFeed"
    "click .save-source-button" : "saveSource"
    "click .destroy-source-button" : "destroySource"

  sourceNameChanged: (event) ->
    @model.set {name: event.target.value}

  sourceUrlChanged: (event) ->
    @model.set {URL: event.target.value}

  sourceFeedChanged: (event) ->
    index = EventHelper.getTargetAttr event, 'index'
    @model.attributes.feeds[index] = event.target.value

  addSourceFeed: (event) ->
    @model.attributes.feeds ||= []
    @model.attributes.feeds.push ''
    @render()

  deleteSourceFeed: (event) ->
    @model.attributes.feeds.splice $(event.target).prev().data('index'), 1
    @render()

  saveSource: (event) ->
    # Controller should handle that
    @publishEvent 'source.save', @model

  destroySource: (event) =>
    if confirm 'Are you sure?'
      $(@el).remove()
      # Controller should handle destroying the model
      @publishEvent 'source.destroy', @model
