
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  //app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/admin', routes.admin);

app.get('/admin/page/new', routes.newAdminPage);
app.post('/admin/page/new', routes.saveAdminPage);

app.get('/admin/page/:id', routes.showAdminPage);
app.put('/admin/page/:id', routes.updateAdminPage);
app.del('/admin/page/:id', routes.deleteAdminPage);

app.get('/static*', function(req, res) {
	res.sendfile(__dirname + '/public' + req.params[0]);
});

app.get('/*', routes.showPageFromUrl);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
