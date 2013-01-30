module.exports = (match) ->
  match '', 'portal#index'
  match 'portal', 'portal#index'
  match 'news', 'news#index'
  match 'news/new', 'news#new'
  match 'news/:id', 'news#show'
  match 'news/search/:query', 'news#search'
