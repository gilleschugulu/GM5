
Parse.Cloud.beforeSave('News', function(request, response) {
  if (request.object.get('crowled') == 'true') {
	response.success();
  } else if (!request.object.get('title')) {
    response.error('A title must be set')
  } else if (!request.object.get('section')) {
    response.error('A section must be choosen')
  } else if (!request.object.get('section')) {
    response.error('Please pick a section')
  } else if (!request.object.get('category')) {
    response.error('Please select a category')
  } else if (!request.object.get('priority')) {
    response.error('Please select a priority')
  } else if (!request.object.get('lang')) {
    response.error('Please select a language')
  } else if (!request.object.get('source')) {
    response.error('Please select a source')
  } else if (!request.object.get('description')) {
    response.error('You must write a description for the news')
  } else if (request.object.get('applicationRanking') > 5 || request.object.get('applicationRanking') < 1) {
    response.error('Application ranking must be set between 1 and 5')
  } else {
    response.success();
  }
});

Parse.Cloud.define("search", function(request, response){
  var queries = []

  // If search into sections relation
  if (request.params.search_sections) {
    sectionQuery = new Parse.Query('Section').matches('name', request.params.queryString, 'i')
    queries.push(new Parse.Query('News').matchesQuery('section', sectionQuery));
  }

  // If search into sources relation
  if (request.params.search_sources) {
    sourceQuery = new Parse.Query('Source').matches('name', request.params.queryString, 'i')
    queries.push(new Parse.Query('News').matchesQuery('source', sourceQuery));
  }

  if (request.params.search_contents)
    queries.push(new Parse.Query('News').matches('description', request.params.queryString, 'i'));
  if (request.params.search_titles)
    queries.push(new Parse.Query('News').matches('title', request.params.queryString, 'i'));
  if (request.params.search_tags)
    queries.push(new Parse.Query('News' ).matches('tags', request.params.queryString, 'i'));
  if (request.params.search_categories)
    queries.push(new Parse.Query('News').matches('category', request.params.queryString, 'i'));
  if (request.params.search_app_types)
    queries.push(new Parse.Query('News').matches('application_type', request.params.queryString, 'i'));

  var query = Parse.Query.or.apply(null, queries);
  query.include(['section', 'source']);
  query.descending('createdAt')
  query.find({
    success: function(results) {
      response.success(results);
    },
    error: function (error) {
      response.error(error);
    }
  })
});