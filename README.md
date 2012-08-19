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
        $scope.Players = new Meteor.AngularCollection('players',$scope,autosave); //autosave is a boolean true to enable autosave (slow startup)
        $scope.players = $scope.Players.find({});
    }
    //partial.html
    <p ng-repeat="player in players">
        <a ng-click="player.$delete()">Delete</a>
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
    <button ng-click="selectedplayer.$save()">Save</button>

####Actions

    //Save: pushes model changes to the database
    $scope.selectedplayer.$save();
    $scope.players.$save();

    //Remove
    $scope.selectedplayer.$delete();
    $scope.players.$delete(id);


