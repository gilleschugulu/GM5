Controller = require 'controllers/base/controller'
Section = require 'models/section'
News = require 'models/news'
NewsView = require 'views/news_view'
NewsCreateView = require 'views/news_create_view'
Source = require 'models/source'
Category = require 'models/category'
Priority = require 'models/priority'
Language = require 'models/language'
Model = require 'models/base/model'
mediator = require 'mediator'
HttpClient = require 'helpers/heyphay/http-client'

module.exports = class NewsController extends Controller

  perPage: 10

  historyURL: (params) ->
    if params.id then "news/#{params.id}" else 'news?page=1'

  search: (query) ->
    return @redirectTo 'portal' unless mediator.user

    @view.showLoading()

    client = new HttpClient url: 'https://api.parse.com/1/functions'
    client.customRequestHeaders =
      'X-Parse-Application-Id': 'HGoHF8NOmWIM8P3XjhcNcRi0euFsiiiRTV0dzkE3',
      'X-Parse-REST-API-Key': '7buOMQUxUWg2kEA0nQZtpvU3kOs9yLW0Jl4YJCfy'

    client.post 'search', {query: query},
      success: (response) =>
        news = (new News(news_data) for news_data in response.result)
        @view.model.set('news', news)
        @view.reloadData()
      error: (error) =>
        console.error error

  index: (params) ->
    return @redirectTo 'portal' unless mediator.user

    # Get number of news
    new Parse.Query(News).count
      success: (count) =>

        # Compute news segment
        pages = count / @perPage
        page = params.page - 1 || 0
        from = page * @perPage

        # Create the view
        @view = new NewsView model: new Model(page: page, pages: pages)
        @view.render()

        # Bind actions
        @view.delegate 'submit', '#news-search-form', (event) =>
          event.preventDefault()
          @search $('#news-search-input').val()

        # @view.delegate 'change', '#news-search-input', (event) =>
        #   @search $('#news-search-input').val()

        # Display loading while fetching news
        @view.showLoading()

        # Get corresponding page of news
        new Parse.Query(News).skip(from).limit(@perPage).include(['section', 'source']).descending('createdAt').find({
          success: (news) =>
            @view.model.set('news', news)
            @view.reloadData()
        })

  show: (params) ->
    return @redirectTo 'portal' unless mediator.user
    new Parse.Query(Section).find({
      success: (sections) =>
        new Parse.Query(Source).find({
          success: (sources) =>
            new Parse.Query(News).get(params.id, {
              success: (news) =>
                @view = new NewsCreateView(
                  model: new Model({
                    title: 'Edit a news'
                    news: news
                    sections: sections
                    sources: sources
                    categories: new Category()
                    languages: new Language()
                    priorities: new Priority()
                  })
                )
              error: (news, error) =>
                alert(':(')
            })
        })
    })

  new: ->
    return @redirectTo 'portal' unless mediator.user
    new Parse.Query(Section).find({
      success: (sections) =>
        new Parse.Query(Source).find({
          success: (sources) =>
            @view = new NewsCreateView(
              model: new Model({
                title: 'Create a news'
                sections: sections
                sources: sources
                news: new News()
                categories: new Category()
                languages: new Language()
                priorities: new Priority()
              })
            )
        })
    })

