require 'helpers/heyphay/caching-strategy'

module.exports = class LocalStorageCacheStrategy extends CachingStrategy

  clearCache: ->
    LocalStorageHelper.clear()

  cacheResponseForRequest: (request) ->
    hash = @getRequestHash request
    LocalStorageHelper.set hash if hash

  cachedResponseForRequest: (request) ->
    hash = @getRequestHash request
    LocalStorageHelper.get hash if hash and LocalStorageHelper.exist hash
