var PageProvider = require('../pageprovider-mongodb').PageProvider;
var Page = require('../models/page');

var pageProvider = new PageProvider('localhost', 27017);

exports.showPageFromUrl = function(req, res) {
	var url_segments = req.params[0].split('/');
	var url = 'home';
	if (url_segments.length > 0) {
		url = url_segments[1];
	}
	if (url == '')
		url = 'home';
	
	pageProvider.findAllLive( function(error, pages){
		pageProvider.findByUrl(url, function(error, page) {
			if (error) console.log(error);
			if (page)
				res.render('page.jade', { 
					pages: pages, title: page.title, page: page
				});
			else {
				console.log('404');
				res.render('page', { 
					pages: pages, title: '404', page: { title: 'not found', content: 'the requested page could not be found', url: ''}
				});
			}
		});
	});
};

exports.admin = function(req, res) {
	pageProvider.findAll( function(error, docs){
        res.render('admin.jade', {
            title: 'Admin', pages: docs, page: new Page()
        });
    });
};

exports.showAdminPage = function(req, res) {
	pageProvider.findAll( function(error, docs) {
		pageProvider.findById(req.params.id, function (error, doc) {
			res.render('admin_page.jade', {
				title: 'Admin', pages: docs, page: doc
			});
		});
    });
};

exports.updateAdminPage = function(req, res) {
	pageProvider.findById(req.params.id, function (error, doc) {
		var page = new Page(doc._id);
		var errors = page.bindAndValidate(req);
		
		if (errors) {
			console.log('update errors: ' + JSON.stringify(errors) );
			pageProvider.findAll( function(error, docs) {
				res.render('admin_page.jade', {
					title: 'Admin', pages: docs, page: page, errors: errors
				});
			});
		}
		else {
			pageProvider.update(page, function(error) {
				res.redirect('/admin/page/' + req.params.id);
			});
		}
	});
};

exports.newAdminPage = function(req, res) {
	pageProvider.findAll( function(error, docs) {
		var page = new Page();
		page.nr = docs.length;
		pageProvider.save(page, function(error) {
			res.redirect('/admin/page/' + page._id);
		});
	});
};

exports.deleteAdminPage = function(req, res) {
	pageProvider.findById(req.params.id, function (error, page) {
		pageProvider.del(page, function(error) {
			res.redirect('/admin');
		});
	});
};

exports.sortAdminPages = function(req, res) {
	var count = req.body.ids.length;
	for (index in req.body.ids) {
		var id = req.body.ids[index];
		pageProvider.updateNr(id, index, function (error) {
			if (--count <= 0) {
				res.json(200, {status: 'ok'});
			}
		});
	}
};

exports.showAssets = function(req, res) {
	console.log('assets?');
	pageProvider.findAll( function(error, docs){
        res.render('admin-assets.jade', {
            title: 'Admin', pages: docs, page: new Page()
        });
    });
};
