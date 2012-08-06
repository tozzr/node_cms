
/**
 * Module dependencies.
 */

var express = require('express')
  , controllers = require('./controllers')
  , http = require('http');

var app = express();

require('./settings.js')(express, app);

app.get('/admin', controllers.admin);

app.get('/admin/page/new', controllers.newAdminPage);
app.post('/admin/page/new', controllers.saveAdminPage);

app.get('/admin/page/:id', controllers.showAdminPage);
app.put('/admin/page/:id', controllers.updateAdminPage);
app.del('/admin/page/:id', controllers.deleteAdminPage);

app.get('/static*', function(req, res) {
	res.sendfile(__dirname + '/public' + req.params[0]);
});

app.get('/*', controllers.showPageFromUrl);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
