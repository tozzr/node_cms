var PageProvider = require('../pageprovider-mongodb').PageProvider;

var pageProvider = new PageProvider('localhost', 27017);

exports.showPageFromUrl = function(req, res) {
	console.log(JSON.stringify(req.params));
	var url_segments = req.params[0].split('/');
	var url = 'home';
	if (url_segments.length > 0) {
		url = url_segments[0];
	}
	if (url == '')
		url = 'home';
	console.log(url_segments.length);
	console.log('show site: ' + url + '---\n\n');
	
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
            title: 'Admin', pages: docs, page: { url: '' }
        });
    });
};

exports.showAdminPage = function(req, res) {
	pageProvider.findAll( function(error, docs) {
		pageProvider.findById(req.params.id, function (error, page) {
			res.render('admin_page.jade', {
				title: 'Admin', pages: docs, page: page
			});
		});
    });
};

exports.updateAdminPage = function(req, res) {
	pageProvider.findById(req.params.id, function (error, page) {
		page.title = req.body.title;
		page.url = req.body.url;
		page.content = req.body.content;
		page.stage = req.body.stage;
		page.nr = req.body.nr;
		pageProvider.update(page, function(error) {
			res.redirect('/admin/page/' + req.params.id);
		});
	});
};

exports.newAdminPage = function(req, res) {
	pageProvider.findAll( function(error, docs) {
		res.render('admin_page_new.jade', {
			title: 'Admin', pages: docs, page: { url: '' }
		});
    });
};

exports.saveAdminPage = function(req, res) {
	page = {
		title: req.body.title,
		url: req.body.url,
		content: req.body.content,
		active: true
	}
	pageProvider.save(page, function(error) {
		res.redirect('/admin/page/' + page._id);
	});
};

exports.deleteAdminPage = function(req, res) {
	pageProvider.findById(req.params.id, function (error, page) {
		pageProvider.del(page, function(error) {
			res.redirect('/admin');
		});
	});
};
