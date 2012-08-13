var page = function (id) {
	this._id     = id != null ? id : null;
	this.title   = 'NewPage';
	this.url     = 'newpage';
	this.content = 'Edit this content of the new page.';
	this.stage   = 'draft';
	this.nr      = -1;
	this.parent  = null;
	
	this.bindAndValidate = function (req) {
		this.title   = req.body.title;
		this.url     = req.body.url;
		this.content = req.body.content;
		this.stage   = req.body.stage;
		this.nr      = req.body.nr;
		this.parent  = req.body.parent;
			
		var errors = new Object();
		var errorCount = 0;
		
		if (typeof(this.title) == 'undefined' || this.title.trim().length == 0) {
			errors['title'] = 'title may not be empty', errorCount++;
		}
		if (typeof(this.url) == 'undefined' || this.url.trim().length == 0) {
			errors['url'] = 'url may not be empty', errorCount++;
		}
		
		if (errorCount == 0)
			return null;
			
		return errors;
	};
	
	return this;
};

module.exports = page;
