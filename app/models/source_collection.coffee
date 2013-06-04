Model = require 'models/base/model'
Source = require 'models/source'

module.exports = class SourceCollection extends Parse.Collection

  model: Source

  serialize: ->
    this
