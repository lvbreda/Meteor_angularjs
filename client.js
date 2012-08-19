/*
* Lander Van Breda
* 
*/
Meteor.watched = false;
/**
 * Util
 */
function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}
/*
 * Controller for the angular collections.
 */
Meteor.AngularCollection = function(name,$scope,autosave){
	self = this;
	self.name = name;
	self.$scope = $scope;
	self.autosave = autosave
	try{
		self._collection = new Meteor.Collection(name);
	}catch(e){
		self._collection = Meteor._LocalCollectionDriver.collections[name];
	}
	return self;
}
Meteor.AngularCollection.prototype.find = function(selector, options){
    return new AngularCollection(self._collection,selector,options,self.$scope,self.autosave);
}
Meteor.AngularCollection.prototype.findOne = function(selector, options){
    return new AngularObject(self._collection,selector,options,self.$scope,self.autosave);
}
Meteor.AngularCollection.prototype.insert = function(selector){
    self._collection.insert(selector);
}
Meteor.AngularCollection.prototype.remove = function(selector){
    self._collection.remove(selector);
}
Meteor.AngularCollection.prototype.update = function(selector,options){
	for(i in this.find({})){
		self._collection.update(selector,options);
	}  
}




var AngularCollection = function(Collection,selector,subSelector,$scope,autosave) {	
	var self = this;
	self.value = [];
	self.value.$save = self.$save;
	self.value.$delete = self.$delete;
	self.value.$add = self.$add;
	self.value.parent = self;
	self.length = self.value.length;
	self.$scope = $scope;
	self.query = Collection.find(selector,subSelector);
	self.Collection = Collection;
	self.selector = selector,
	self.subSelector = subSelector;
	self.handle = self.query.observe({
				added : function(object) {
					try{
						self.value.push(new AngularObject(self.Collection,self.selector,self.subSelector,self.$scope,object,autosave));
						self.$scope.$digest();
					}catch(e){
						
					}
				},
				removed : function(old, index) {
					try{
						self.value.splice(index, 1);
						self.$scope.$digest();
					}catch(e){
						
					}
						
				},
				changed : function(new_document, at_index, old_document) {
					try{
						for (i in self.value[at_index]) {
							if("function" != typeof self.value[at_index][i] && "object" != typeof self.value[at_index][i]){
								if (self.value[at_index][i] !== new_document[i]) {
									self.value[at_index][i] = new_document[i];
								}
							}
						}
						self.$scope.$digest();
					}catch(e){
						
					}
				}
			});
    if(autosave){ 
		$scope.$watch(function($scope){
			 //$scope.players;
			 for(i in $scope){
			 	var name = i;
			 	if(name.indexOf("$")<0){
			 		if($scope[i].$save){
			 			$scope[i].$save();
			 		}
			 		
			 	}
			 }
		},function(newValue, oldValue) {  },undefined,false);

	}
	return self.value;
	
	
};
AngularCollection.prototype.value = function(){
	return self.value;
}
AngularCollection.prototype.$add = function(item) {
	var self = this.parent;
	self.Collection.insert(item);
};
AngularCollection.prototype.get = function(index) {
	var self = this;
	return self.value[index];
};
AngularCollection.prototype.forEach = function(fn) {
	var self = this;
	if (self.value.forEach)
		self.value.forEach(fn);
	else {
			for (i in self.value) {
				fn(i, self.value[i], self.value);
			}
	}
};
AngularCollection.prototype.$save = function(){
	try{
		var self = this.parent;
		for(i in self.value){
			i.$save;
		}
	}catch(e){
		
	}
	
}
AngularCollection.prototype.$delete = function(id){
	var self = this.parent;
	self.Collection.remove({_id:id});
}
// Select single
var AngularObject = function(Collection,selector,subSelector,$scope,values,autosave) {
	var self = this;
	self.value = new Array();
	self.value.$save = self.$save;
	self.value.$delete = self.$delete;
	self.value._parent = self;
	self.$scope = $scope;
	self.query = {};
	self.Collection = Collection;
	self.subSelector = subSelector;
	if(typeof values != "object"){
		Meteor.autosubscribe(function(){
				try{
						temp = self.Collection.findOne(selector,subSelector);
						for(i in temp){
							self.value[i] = undefined;
							self.value[i]  = temp[i];
						}
						self.value = self.value?self.value:new Array();
					
						self.$scope.$digest();
				}catch(e){
						
				}
	   });
	   
	 if(autosave){  
		 $scope.$watch(function($scope){
			for(i in $scope){
				 	var name = i;
				 	try{
					 	if(name.indexOf("$")<0){
					 		if($scope[i].$save)	{
					 			$scope[i].$save();
					 		}
					 	}
				 	}catch(e){
				 		
				 	}
				 }
			},function(newValue, oldValue) { },undefined,false);
		
	}
  }else{
  		for(i in values){
			self.value[i] = undefined;
			self.value[i]  = values[i];
		}
  }
 
   return self.value;
};
AngularObject.prototype.$save = function(){
			var self = this._parent;
	
			if(self.value){
				current = {};
				for(i in self.value){
					if("function" != typeof self.value[i] && "object" != typeof self.value[i]){
						current[i] = self.value[i];
					}
					
				}
					var temp = self.Collection.findOne({_id:self.value._id},self.subSelector);
					
					if(!_.isEqual(temp,current)){
						delete current._id;
						self.Collection.update({_id:self.value["_id"]},{$set : current});
					}
					
				
			}
		
}
AngularObject.prototype.$delete = function(){
	var self = this._parent;
	self.Collection.remove({_id:self.value._id});
}

