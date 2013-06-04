module.exports = class EventHelper

  @getTargetId: (event) ->
    $(event.target).data 'cid'

  @getTargetAttr: (event, attr) ->
    $(event.target).data attr
