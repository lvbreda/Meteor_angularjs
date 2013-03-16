#Angularjs in Meteor
##How to use it
The angularjs app is always called meteorapp.

    angular.module('meteorapp', []).
        config(['$routeProvider', function($routeProvider) {
        $routeProvider.
             when('/index', {templateUrl: 'partials/index.html',   controller: MeteorCtrl}).
             otherwise({redirectTo: '/'});
    }]);
###Directory structure

     /public
         /partials
         angular.html(Main screen should contain body content)

###Usage
    app.controller('MeteorCtrl', ['$scope','$meteor',function($scope,$meteor){
      $scope.todos = $meteor("todos").find({});
    	$meteor("todos").insert({
    	    name: "Do something",
    	    done: false
    	});
    }]);

    <div ng-repeat="todo in todos">
        <input type="text" ng-model="todo.name"/>
        <button ng-click="todo.save()">Save</button>
        <button ng-click="todo.remove()">Remove</button>
    </div>
###Deploying
Make sure that you always write angularjs code that can be minified, else use the --debug function. To deploy with Heroku use this buildpack. Thanks to @mimah
https://github.com/mimah/heroku-buildpack-meteorite
