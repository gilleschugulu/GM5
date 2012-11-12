
Parse.Cloud.beforeSave('News', function(request, response) {
	if (!request.object.get('title')) {
		response.error('A title must be set')
	} else if (!request.object.get('section')) {		
		response.error('A section must be choosen')
	} else if (!request.object.get('originUrl')) {
		response.error('An origin url must be set')
	} else if (!request.object.get('tags')) {
		response.error('At least one tag must be set')
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