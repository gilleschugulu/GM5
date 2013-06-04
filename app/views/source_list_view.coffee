View = require 'views/base/view'
template = require 'views/templates/source_list_template'
SourceListItemView = require 'views/source_list_item_view'
Source = require 'models/source'

module.exports = class SourceListView extends View
  template: template
  autoRender: true
  container: '#page-container'
  listContainer: '#sources-container'

  events: ->
    'click .add-source-button' : 'addSourceAction'

  renderSource: (source, dest = 'tail') ->
    sourceView = new SourceListItemView {model: source}
    sourceView.render()
    if dest == 'head' then $(@listContainer).prepend sourceView.el else $(@listContainer).append sourceView.el
    sourceView

  renderSources: ->
    @renderSource source, 'head' for source in @collection.models

  render: ->
    super
    @renderSources()

  addSourceAction: ->
    source = new Source()
    @collection.models.push source
    @renderSource source, 'head'
