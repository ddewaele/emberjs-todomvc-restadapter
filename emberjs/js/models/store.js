/*global Todos DS */
'use strict';


Todos.Adapter = DS.RESTAdapter.extend({
  serializer: DS.RESTSerializer.extend({
    primaryKey: function (type){
      return '_id';
   }
  })
});


Todos.Store = DS.Store.extend({
	revision: 12,
	adapter: 'Todos.Adapter'
});

DS.RESTAdapter.reopen({
  url: 'http://localhost:3000'
});