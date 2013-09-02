Package.describe({
  summary: "Angularjs"
});

Package.on_use(function (api) {
  Npm.depends({
    connect: '2.8.8'
  });

  api.use('webapp', ['server']);

  api.add_files('angular.js', 'client');
  api.add_files('client.js', 'client');
 
  api.add_files('server.js', 'server');
});