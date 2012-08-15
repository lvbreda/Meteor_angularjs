var connect = __meteor_bootstrap__.require("connect");
var fs = __meteor_bootstrap__.require("fs");
var path = __meteor_bootstrap__.require("path");
__meteor_bootstrap__.app
    .use(connect.query())
    .use(function (req, res, next) {
      // Need to create a Fiber since we're using synchronous http calls
      Fiber(function() {
      	
      	var code = fs.readFileSync(path.resolve('.meteor/local/build/app.html'));
      	var angular = "";
      	if(path.existsSync("public/angular.html")){
      		angular = fs.readFileSync(path.resolve('public/angular.html'));
      	}else{
      		console.log("Angularjs\n______\nCreate public/angular.html\n This is used as your main page, this should contain the contents of the body.");
      	}
      	
      	code = new String(code);
      	code = code.replace("<body>",new String(angular));
		code = code.replace("<html>",'<html ng-app="meteorapp">');
        res.writeHead(200, {'Content-Type': 'text/html'});	
         res.write(code);
         res.end();
         return;
        //next();
    }).run();
});