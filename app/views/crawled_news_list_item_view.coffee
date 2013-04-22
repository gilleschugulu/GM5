View = require 'views/base/view'
template = require 'views/templates/crawled_news_list_item_template'
mediator = require 'mediator'
NewsListItemView = require 'views/news_list_item_view'

module.exports = class CrawledNewsListItemView extends NewsListItemView
  template: template
  autoRender: true
  tagName: 'tr'
