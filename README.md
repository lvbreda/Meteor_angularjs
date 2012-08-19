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
####Selecting

    //Collection
    //controler.js
    function MeteorCtrl($scope,$rootScope) {
        $scope.Players = new Meteor.AngularCollection('players',$scope);
        $scope.players = $scope.Players.find({});
    }
    //partial.html
    <p ng-repeat="player in players">
        {{player.name}}
    </p>

    //Single
    //controller.js
    function MeteorCtrl($scope,$rootScope) {
        $scope.Players = new Meteor.AngularCollection('players',$scope);
        $scope.selectedplayer = $scope.Players.findOne({});
    }
    //partial.html
    <input type="text" value="{{selectedplayer.name}}" ng-model="selectedplayer.name" />

####Actions

    //Save: pushes model changes to the database
    $scope.selectedplayer.$save();
    $scope.players.$save();

    //Remove
    $scope.selectedplayer.$delete();
    $scope.players.$delete(id);


