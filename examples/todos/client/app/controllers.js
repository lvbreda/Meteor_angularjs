function MainCtrl($scope,$rootScope,$routeParams,$location,$timeout){
	Meteor.subscribe('lists');
	Meteor.subscribe('todos');
	$scope.Lists = new Meteor.AngularCollection("lists",$scope);
	$scope.Todos = new Meteor.AngularCollection("todos",$scope);
	$scope.lists = $scope.Lists.find({});
	$scope.selectedList = $routeParams.id;
	$scope.selectedTags  = [];
	$scope.newlist = {};
	$scope.newTodo = {
		tags : [],
		list_id : $scope.selectedList
	}
	/**Nasty hack**/
	$scope.changeList = function(id){
		$scope.stopped = false;
		$scope.click = $timeout(function(){ 
			if(!$scope.stopped)   {
				 $scope.selectedList = id;
				 $scope.todos = $scope.Todos.find({list_id : $scope.selectedList});
				 $scope.newTodo = {
						tags : [],
						list_id : $scope.selectedList
					}
			}      
        },200);
	}
	$scope.stop  = function(){
		$scope.stopped = $timeout.cancel($scope.click);
	}
	/**Stop nasty **/
	$scope.currentTags = function(){
		var temp = {};
		for(var i in $scope.todos){
			for(var o in $scope.todos[i].tags){
				if(temp[$scope.todos[i].tags[o]]){
					temp[$scope.todos[i].tags[o]] = temp[$scope.todos[i].tags[o]] +1;
				}else{
					if(!($scope.todos[i].tags[o] instanceof Object)){
						temp[$scope.todos[i].tags[o]] = 1;
					}
					
				}
			}
		}
		return temp;
	}
	$scope.removeTag = function(todo,tag){
		todo.tags.splice(todo.tags.indexOf(tag),1);
		todo.$save();
	}
	$scope.filterByTag = function(todo){
		for(i in $scope.selectedTags){
			if(todo.tags.indexOf($scope.selectedTags[i]) >-1){
				return true;
			}
		}
		if($scope.selectedTags.length == 0){
			return true;
		}else{
			return false;
		}
	}
	$scope.addFilterTag = function(tag){
		if($scope.selectedTags.indexOf(tag)>-1){
			$scope.selectedTags.splice($scope.selectedTags.indexOf(tag),1);
		}else{
			$scope.selectedTags.push(tag);
		}
	}
	$scope.isFilterTag = function(tag){
		if($scope.selectedTags.indexOf(tag)>-1){
			return true;
		}
		return false;
	}
	if($routeParams.id){
		$scope.todos = $scope.Todos.find({list_id : $routeParams.id});
	}
	
}
