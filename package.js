Package.describe({
  summary: "Angularjs"
});

Package.on_use(function (api) {
 
 	
  api.add_files('angular.js', 'client');
   api.add_files('client.js', 'client');
 
  api.add_files('server.js', 'server');
});