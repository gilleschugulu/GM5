LocalStorageHelper = require 'helpers/local-storage-helper'

class HTTPHelper

  # Ajax Call
  # ---------
  request: (url, params, httpMethod, callbacks, apiVersion = 1) =>
    $.ajax
      type   : httpMethod
      url    : url
      data   : params
      headers: callbacks.headers() if callbacks and callbacks.headers
      success: (response) ->
        callbacks.success(response) if callbacks and callbacks.success
      error: (response) ->
        callbacks.error(response) if callbacks and callbacks.error

  module.exports = new HTTPHelper()
