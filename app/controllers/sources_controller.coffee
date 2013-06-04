Controller = require 'controllers/base/controller'
SourceListView = require 'views/source_list_view'
SourceCollection = require 'models/source_collection'
EventHelper = require 'helpers/event_helper'

module.exports = class SourcesController extends Controller

  initialize: ->
    @subscribeEvent 'source.save', @save
    @subscribeEvent 'source.destroy', @destroy

  index: ->
    # Construct list view and bind events
    @view = new SourceListView collection: new SourceCollection()
    @view.collection.comparator = (source) ->
      source.createdAt

    # Fetch all sources
    @view.showLoading()
    @view.collection.fetch
      success: =>
        @view.hideLoading()
        @view.render()

  save: (source) ->
    source.save
      success: =>
        alert 'Source successfully saved'
        @view.render()
      error: ->
        alert 'Error while saving source!'

  destroy: (source) ->
    if source.id
      source.destroy
        error: ->
          alert 'Error while removing source!'    
