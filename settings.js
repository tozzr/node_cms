module.exports = function (express, app) {
	app.configure(function(){
		app.set('port', process.env.PORT || 3000);
		app.set('views', __dirname + '/views');
		app.set('view engine', 'jade');
		app.use(express.favicon());
		app.use(express.logger('dev'));
		app.use(express.bodyParser());
		app.use(express.cookieParser());
		app.use(express.session({ secret: 'node_cms' }));
		app.use(express.methodOverride());
		app.use(app.router);
		//app.use(express.static(__dirname + '/public'));
		app.use(function(err, req, res, next){
		  // if an error occurs Connect will pass it down
		  // through these "error-handling" middleware
		  // allowing you to respond however you like
		  res.send(500, { error: 'Sorry something bad happened!' });
		});
	});

	app.configure('development', function(){
		app.use(express.errorHandler());
	});
};
