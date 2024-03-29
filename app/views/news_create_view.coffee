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
    s = super
    Handlebars.registerHelper('isSelectedSection', (section, block) =>
      if @model.get('news').get('section') and section.id == @model.get('news').get('section').id then block.fn(section) else block.inverse(section)
    )
    Handlebars.registerHelper('isSelectedSource', (source, block) =>
      if @model.get('news').get('source') and source.id == @model.get('news').get('source').id then block.fn(source) else block.inverse(source)
    )
    Handlebars.registerHelper('isSelectedCategory', (category, block) =>
      if @model.get('news').get('category') == category.value then block.fn(category) else block.inverse(category)
    )
    Handlebars.registerHelper('isSelectedPriority', (priority, block) =>
      if @model.get('news').get('priority') == priority.value then block.fn(priority) else block.inverse(priority)
    )
    Handlebars.registerHelper('isSelectedLanguage', (language, block) =>
      if @model.get('news').get('lang') == language.value then block.fn(language) else block.inverse(language)
    )
    s

  events: ->
    'change #input-news-image, #input-application-icon': 'showImagePreview'
    'change input[name=input-section]:checked': 'sectionChanged'
    'change input#input-origin-url': 'originUrlChanged'
    'change input#input-tags': 'tagsChanged'
    'change input#input-title': 'titleChanged'
    'change input#input-published-at': 'publishedAtChanged'
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

  publishedAtChanged: (event) ->
    @model.get('news').set('publishedAt', $(event.target).datepicker('getDate'))

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

# - recupere & strip html
# - recupere text
# - set news_text_legal_limit_length (en taille) du text a recupere (10% de text)

# => pour html_limit = 10 % du html
# => tant que le texte present dans range(0, html_limit) < news_text_limit_percentage
# => html_limit += 5%

# - set html_limit -= 5%
# - set legal_html = range(0, html_limit)

  fixedHTML: (html) ->
    d = document.createElement('div')
    d.innerHTML = html
    d.innerHTML

  getTextFromHTML: (html) ->
    html.replace(/<(.)*?>/gm, '').replace(/<(.)*/, '') # TODO: refactor regex to remote html AND invalid html

  getNewsDescription: ->
    CKEDITOR.instances.inputDescription.getData()

  getLegalNewsDescription: ->
    newsContentHTML = @getNewsDescription()
    newsContentTextLegalLimit = @getTextFromHTML(@getNewsDescription()).length * 0.2
    for newsContentLegalLimitationModifier in [0.05..1] by 0.025
      newsContentHTMLLegal = newsContentHTML.substring(0, newsContentHTML.length * newsContentLegalLimitationModifier)
      return @fixedHTML("#{newsContentHTMLLegal}...") if @getTextFromHTML(newsContentHTMLLegal).length > newsContentTextLegalLimit

  submit: ->
    news = @model.get('news')
    news.set('description', @getNewsDescription())

    # if coups de coeurs || best ever, don't crop description
    if news.get('section').id is 'Zytx8X61em' or news.get('section').id is '5RrmrJOtYY'
      news.set('legalDescription', @getNewsDescription())
    else
      news.set('legalDescription', @getLegalNewsDescription())


    # TODO: refactor, use library to work well with stupid javascript dates....
    # Set default publication date to today and ajust to 00:00 for hours because we want to discard the time
    # need UTC date set to 00:00
    publishedAt = news.get('publishedAt') || new Date()
    publishedAt.setHours(1)
    publishedAt.setMinutes(0)
    publishedAt.setSeconds(0)
    publishedAt.setMilliseconds(0)

    news.set('publishedAt', publishedAt)

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

  render: ->
    console.log arguments
    super

  afterRender: ->
    s = super
    formatedPublicationDate = moment(@model.get('news').get('publishedAt')).format('YYYY/MM/DD') if @model.get('news').get('publishedAt')
    $('#input-published-at').datepicker(dateFormat: 'yy/mm/dd')
    $('#input-published-at').datepicker("setDate", if formatedPublicationDate then formatedPublicationDate else new Date());
    if (sid = @model.get('news').get('section')?.id)
      $('input[name=input-section][value='+sid+']').prop('checked', yes)
    CKEDITOR.replace 'inputDescription',
      toolbarCanCollapse     : yes
      toolbarStartupExpanded : yes
      height: 450
      toolbar : [
        ['Undo', 'Redo', '-', 'Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat', '-', 'Link', 'Unlink', 'Image']#, '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock']
      ]
    s
