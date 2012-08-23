var app = angular.module('meteorapp', []);
function TournamentCtrl($scope){
	$scope.Players = new Meteor.AngularCollection("players",$scope, true);
	$scope.players = $scope.Players.find({});
	$scope.selected = 0;
	$scope.toggleSelect = function(ind){$scope.selected = ind;}
	$scope.sel = function($index){
		console.log($scope.selected);
		if($scope.selected  == $index ){
			return 'selected';
		}else{
			return '';
		}
	}

}
