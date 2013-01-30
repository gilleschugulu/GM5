module.exports = class LegalizeHelper


  @fixedHTML: (html) ->
    d = document.createElement('div')
    d.innerHTML = html
    d.innerHTML

  @getTextFromHTML: (html) ->
    html.replace(/<(.)*?>/gm, '').replace(/<(.)*/, '') # TODO: refactor regex to remote html AND invalid html

  @applyLegalLimitation: (news) ->
    newsContentHTML = news.get 'description'
    newsContentTextLegalLimit = @getTextFromHTML(newsContentHTML).length * 0.2
    for newsContentLegalLimitationModifier in [0.05..1] by 0.025
      newsContentHTMLLegal = newsContentHTML.substring(0, newsContentHTML.length * newsContentLegalLimitationModifier)
      news.set 'legalDescription', @fixedHTML("#{newsContentHTMLLegal}...") if @getTextFromHTML(newsContentHTMLLegal).length > newsContentTextLegalLimit
      news.save null

  @legalize: ->
    s1 = new Section()
    s1.id = '5RrmrJOtYY'

    s2 = new Section()
    s2.id = 'Zytx8X61em'

    new Parse.Query(News).limit(400).containedIn('section', [s1, s2]).find
      success: (news) =>
        for newsObject in news
          newsObject.set('legalDescription', newsObject.get('description'))
          newsObject.save null
      error: (error) =>
        console.log error

    new Parse.Query(News).limit(400).notContainedIn('section', [s1, s2]).find
      success: (news) =>
        @applyLegalLimitation(newsObject) for newsObject in news
      error: (error) =>
        console.log error
