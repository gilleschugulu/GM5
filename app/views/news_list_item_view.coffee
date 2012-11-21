View = require 'views/base/view'
template = require 'views/templates/news_list_item'
mediator = require 'mediator'

module.exports = class NewsListItemView extends View
	template: template
	autoRender: true
	tagName: 'tr'

	events: ->
		"click .news-actions-destroy": "clickDestroy"
		"click .news-actions-edit": "clickEdit"
		"click .news-actions-status-toggle": "toggleStatus"

	clickEdit: (event) ->
		mediator.publish '!startupController', 'news', 'show', {
			id: @model.id
		}

	clickDestroy: (event) ->
		if confirm('Vraiment?! :O')
			$(@el).remove()
			@model.destroy()

	toggleStatus: (event) ->
		@model.set('active', !@model.get('active'))
		@model.save(null);
		if @model.get('active')
			$(event.target).removeClass('btn-danger')
			$(event.target).addClass('btn-success')
			$(event.target).val('Active')
		else
			$(event.target).removeClass('btn-success')
			$(event.target).addClass('btn-danger')
			$(event.target).val('Inactive')

	render: ->
		super
		switch
			when @model.get('priority') == 1 then $(@el).find('.priority-label').addClass('label-info')
			when @model.get('priority') == 2 then $(@el).find('.priority-label').addClass('label-warning')
			when @model.get('priority') == 3 then $(@el).find('.priority-label').addClass('label-important')

	initialize: ->
		super
		Handlebars.registerHelper('formatedCreationDate', (block) =>
			@model.createdAt.substring(0, 10)
		)
		Handlebars.registerHelper('formatedPriority', (block) =>
			switch
				when @model.get('priority') == 1 then 'Low'
				when @model.get('priority') == 2 then 'Medium'
				when @model.get('priority') == 3 then 'High'
		)
		Handlebars.registerHelper('isActive', (block) =>
			if @model.get('active') then block(@) else block.inverse(@)
		)
