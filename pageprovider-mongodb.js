var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

PageProvider = function(host, port) {
  this.db= new Db('node-cms', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};

//getCollection

PageProvider.prototype.getCollection= function(callback) {
  this.db.collection('pages', function(error, page_collection) {
    if( error ) callback(error);
    else callback(null, page_collection);
  });
};

//findAll
PageProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, page_collection) {
      if( error ) callback(error)
      else {
        page_collection.find({}, {title: 1, url: 1}).sort({nr: 1}).toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//findAllLive
PageProvider.prototype.findAllLive = function(callback) {
    this.getCollection(function(error, page_collection) {
      if( error ) callback(error)
      else {
        page_collection.find({stage: 'live'}, {_id: 1, title: 1, url: 1}).sort({nr: 1}).toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//findById
PageProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, page_collection) {
      if( error ) callback(error)
      else {
        page_collection.findOne({_id: page_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

//findByUrl
PageProvider.prototype.findByUrl = function(url, callback) {
    this.getCollection(function(error, page_collection) {
      if( error ) callback(error)
      else {
        page_collection.findOne({url: url}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

//save
PageProvider.prototype.save = function(pages, callback) {
    this.getCollection(function(error, page_collection) {
      if( error ) callback(error)
      else {
        if( typeof(pages.length)=="undefined")
          pages = [pages];

        page_collection.insert(pages, function() {
          callback(null, pages);
        });
      }
    });
};

//update
PageProvider.prototype.update = function(page, callback) {
    this.getCollection(function(error, page_collection) {
		if( error ) callback(error)
		else {
			page_collection.update({ _id: page._id }, { 
				$set: { title: page.title, url: page.url, content: page.content, stage: page.stage }
			}, 
			function() {
				callback(null);
			});
		}
    });
};

//update
PageProvider.prototype.updateNr = function(id, nr, callback) {
	this.getCollection(function(error, page_collection) {
		if( error ) callback(error)
		else {
			page_collection.update({ _id: page_collection.db.bson_serializer.ObjectID.createFromHexString(id) }, { 
				$set: { nr: parseInt(nr) }
			}, 
			function() {
				callback(null);
			});
		}
    });
};


//delete
PageProvider.prototype.del = function(page, callback) {
    this.getCollection(function(error, page_collection) {
      if( error ) callback(error)
      else {
        page_collection.remove({ _id: page._id }, function() {
          callback(null);
        });
      }
    });
};

exports.PageProvider = PageProvider;
