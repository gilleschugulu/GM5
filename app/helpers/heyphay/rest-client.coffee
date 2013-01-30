HttpClient = require 'helpers/heyphay/http-client'
RestResource = require 'helpers/heyphay/rest-resource'

module.exports = class RestClient extends HttpClient

  resource: (name, options = null) ->
   RestResource.bindResource(@, @, name, options)
