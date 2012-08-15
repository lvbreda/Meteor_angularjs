#Angularjs in Meteor
##How to use it
Add these files to the packages directory of your meteor install in a directory called angularjs. Then in your project do:

    meteor add angularjs
    

###Directory structure

     /public
         /partials
         angular.html(Main screen should contain body content)

###Usage
####Selecting

    //Collection
    //controler.js
    function MeteorCtrl($scope,$rootScope) {
        $scope.players = new AngularCollection(Players,{},$scope);
    }
    //partial.html
    <p ng-repeat="player in players.value">
        {{player.name}}
    </p>

    //Single
    //controller.js
    function MeteorCtrl($scope,$rootScope) {
        $scope.selectedplayer = new AngularObject(Players,{_id:"9fce5f26-d40f-43ff-8ca0-bcecb1d4c2d2"},$scope);
    }
    //partial.html
    <input type="text" value="{{selectedplayer.value.name}}" ng-model="selectedplayer.value.name" />

####Actions

    //Save: pushes model changes to the database
    $scope.selectedplayer.$save();
    $scope.players.$save();

    //Remove
    $scope.selectedplayer.$delete();
    $scope.players.$delete(id);


