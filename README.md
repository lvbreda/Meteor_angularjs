#Angularjs in Meteor
##How to use it
Add these files to the packages directory of your meteor install in a directory called angularjs. Then in your project do:

    meteor add angularjs
    
Or use meteorite

    https://atmosphere.meteor.com/
    
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
Will be updated for the new release