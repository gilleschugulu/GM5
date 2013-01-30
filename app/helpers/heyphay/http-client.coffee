HTTPHelper = require 'helpers/http_helper'
LocalStorageHelper = require 'helpers/local-storage-helper'
CachingStrategy = require 'helpers/heyphay/caching-strategy'
CachingPolicy= require 'helpers/heyphay/caching-policy'

module.exports = class HttpClient

  defaults:
    cachingStrategy: null
    cachingPolicy: CachingPolicy.CachingPolicyNone
    customRequestHeaders: null
    url: null

  constructor: (options = null) ->
    @url = options?.url
    @cachingPolicy = options?.cachingPolicy
    @cachingStrategy = options?.cachingStrategy
    @customRequestHeaders = options?.customRequestHeaders

  post: (path, params, callbacks) ->
    console.log @customRequestHeaders
    HTTPHelper.request "#{@url}/#{path}", params, 'POST',
      headers: => @customRequestHeaders
      success: (object) ->
        callbacks?.success object if callbacks?.success
      error: (error) ->
        callbacks?.error error if callbacks?.error

  get: (path, params, callbacks) ->
    HTTPHelper.request "#{@url}/#{path}", params, 'GET',
      headers: => @customRequestHeaders
      success: (object) ->
        callbacks?.success object if callbacks?.success
      error: (error) ->
        callbacks?.error error if callbacks?.error

  put: (path, params, callbacks) ->
    HTTPHelper.request "#{@url}/#{path}", params, 'PUT',
      headers: => @customRequestHeaders
      success: (object) ->
        callbacks?.success object if callbacks?.success
      error: (error) ->
        callbacks?.error error if callbacks?.error

  delete: (path, params, callbacks) ->
    alert @url
    alert "#{@url}/#{path}"
    HTTPHelper.request "#{@url}/#{path}", params, 'DELETE',
      headers: => @customRequestHeaders
      success: (object) ->
        callbacks?.success object if callbacks?.success
      error: (error) ->
        callbacks?.error error  if callbacks?.error
