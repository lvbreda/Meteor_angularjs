var app = angular.module('meteorapp', []).
  config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider) {
  	$locationProvider.html5Mode(true);
    $routeProvider.when('/:id', {controller: MainCtrl,templateUrl:'partials/lists.html'});
}]);
app.directive('ngEnter', function() {
    return function(scope, elm, attrs) {
        elm.bind('keypress', function(e) {
            if (e.charCode === 13) scope.$apply(attrs.ngEnter);
        });
    };
});    
