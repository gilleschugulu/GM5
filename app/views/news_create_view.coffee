View = require 'views/base/view'
template = require 'views/templates/news_details'
File = require 'models/file'
News = require 'models/news'
Section = require 'models/section'
Source = require 'models/source'
mediator = require 'mediator'

module.exports = class NewsCreateView extends View
	template: template
	autoRender: true
	container: '#page-container'

	initialize: ->
		super
		Handlebars.registerHelper('isSelectedSection', (section, block) =>
			if @model.get('news').get('section') and section.id == @model.get('news').get('section').id then block(section) else block.inverse(section)
		)
		Handlebars.registerHelper('isSelectedSource', (source, block) =>
			if @model.get('news').get('source') and source.id == @model.get('news').get('source').id then block(source) else block.inverse(source)
		)
		Handlebars.registerHelper('isSelectedCategory', (category, block) =>
			if @model.get('news').get('category') == category.value then block(category) else block.inverse(category)
		)
		Handlebars.registerHelper('isSelectedPriority', (priority, block) =>
			if @model.get('news').get('priority') == priority.value then block(priority) else block.inverse(priority)
		)
		Handlebars.registerHelper('isSelectedLanguage', (language, block) =>
			if @model.get('news').get('lang') == language.value then block(language) else block.inverse(language)
		)

	events: ->
		'change #input-news-image, #input-application-icon': 'showImagePreview'
		'change input[name=input-section]:checked': 'sectionChanged'
		'change input#input-origin-url': 'originUrlChanged'
		'change input#input-tags': 'tagsChanged'
		'change input#input-title': 'titleChanged'
		'change input#input-application-name': 'applicationNameChanged'
		'change input#input-application-appstore-id': 'applicationAppStoreIdChanged'
		'change input#input-application-type': 'applicationTypeChanged'
		'change input#input-application-version': 'applicationVersionChanged'
		'change input#input-application-price': 'applicationPriceChanged'
		'change input#input-application-ranking': 'applicationRankingChanged'
		'change textarea#input-preview': 'previewChanged'
		'change select#input-category': 'categoryChanged'
		'change select#input-priority': 'priorityChanged'
		'change select#input-lang': 'langChanged'
		'change select#input-source': 'sourceChanged'
		'click #submit-button': 'submit'

	showImagePreview: (event) ->
		data = (event.target.files || event.target.dataTransfer.files)[0]
		@model.set("#{event.target.id}-data", data)
		fileReader = new FileReader()
		fileReader.onload = () ->
			$("##{event.target.id}-preview").attr('src', fileReader.result)
		fileReader.readAsDataURL(data)

	sectionChanged: (event) ->
		@model.get('news').set('section', if event.target.value == '0' then null else new Section(id: event.target.value))

	originUrlChanged: (event) ->
		@model.get('news').set('originUrl', event.target.value)

	previewChanged: (event) ->
		@model.get('news').set('preview', event.target.value)

	tagsChanged: (event) ->
		@model.get('news').set('tags', event.target.value)

	titleChanged: (event) ->
		@model.get('news').set('title', event.target.value)

	categoryChanged: (event) ->
		@model.get('news').set('category', event.target.value)

	priorityChanged: (event) ->
		@model.get('news').set('priority', parseInt(event.target.value))

	langChanged: (event) ->
		@model.get('news').set('lang', event.target.value)

	sourceChanged: (event) ->
		@model.get('news').set('source', if event.target.value == '0' then null else new Source(id: event.target.value))

	applicationNameChanged: (event) ->
		@model.get('news').set('applicationName', event.target.value)

	applicationAppStoreIdChanged: (event) ->
		@model.get('news').set('applicationAppStoreId', event.target.value)

	applicationTypeChanged: (event) ->
		@model.get('news').set('applicationType', event.target.value)

	applicationVersionChanged: (event) ->
		@model.get('news').set('applicationVersion', event.target.value)

	applicationPriceChanged: (event) ->
		@model.get('news').set('applicationPrice', event.target.value)

	applicationRankingChanged: (event) ->
		@model.get('news').set('applicationRanking', event.target.value)

	getNewsImage: ->
		@model.get("input-news-image-data")

	getApplicationIcon: ->
		@model.get("input-application-icon-data")

	uploadImageWithAttributeName: (news, data, name) ->
		File.upload data,
			success: (file) =>
				news.set(name, file)
				news.save null,
					success: (news) =>
						@publishEvent 'newsHasBeenUpdated'

	submit: ->
		news = @model.get('news')
		news.set('description', $('#input-description').html())  
		news.save(null, {
			success: (news) =>
				if @getNewsImage()
					@uploadImageWithAttributeName(news, @getNewsImage(), 'image')
				if @getApplicationIcon()
					@uploadImageWithAttributeName(news, @getApplicationIcon(), 'applicationIcon')

				@publishEvent '!startupController', 'news', 'index'
			error: (news, error) ->
				alert(error.message)
		})

	afterRender: ->
		super
		$('#input-description').tinymce({
			# Location of TinyMCE script
			script_url: '/tiny_mce/tiny_mce.js'

			# General options
			theme : "advanced"
			plugins : "autolink,lists,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,advlist"

			# Theme options
			theme_advanced_buttons1 : "save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect"
			theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor"
			theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen"
			theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak"
			theme_advanced_toolbar_location : "top"
			theme_advanced_toolbar_align : "left"
			theme_advanced_statusbar_location : "bottom"
			theme_advanced_resizing : true
		})