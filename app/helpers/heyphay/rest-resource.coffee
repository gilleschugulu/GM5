module.exports = class RestResource

  defaults =
    name: null
    client: null

  constructor: (@name, @client) ->

  create: (user, callbacks) ->
    @client.post "#{@name}.json", {user}, callbacks

  update:  (object_id, user, callbacks) ->
    @client.put  "#{@name}/#{object_id}.json", {user}, callbacks

  show:  (object_id, full, callbacks) ->
    @client.get  (if full then "#{@name}/#{object_id}/full.json" else "#{@name}/#{object_id}.json"), {}, callbacks

  delete: (object_id, callbacks) ->
    @client.delete "#{@name}/#{object_id}.json"

  resource: (name, options = null) ->
    RestResource.bindResource(@, @client, name, options)

  @bindResource: (object, client, name, configuration) ->
    resource = new RestResource(name, client)
    object[name] = resource
    configuration(resource) if configuration
    RestResource
