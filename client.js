/*
* Lander Van Breda
* 
*/


function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}
//Select multiple

var AngularCollection = function(Collection,selector,$scope,subSelector) {	
	var self = this;
	self.value = [];
	self.length = self.value.length;
	self.$scope = $scope;
	self.query = Collection.find(selector,subSelector);
	self.Collection = Collection;
	self.handle = self.query.observe({
				added : function(object) {
					try{
						self.value.push(object);
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
							if (self.value[at_index][i] !== new_document[i]) {
								self.value[at_index][i] = new_document[i];
							}
						}
						self.$scope.$digest();
					}catch(e){
						
					}
				}
			});
};
AngularCollection.prototype.value = function(){
	return self.value;
}
AngularCollection.prototype.add = function(item) {
	var self = this;
	index = self.value.length;
	self.value[index] = item;
	self.length = self.value.length;
	return index;
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
	var self = this;
	for(i in self.arr){
		current = clone(self.arr[i]);
		delete current._id;
		self.Collection.update({_id:self.arr[i]._id},{$set:current});
	}
}
AngularCollection.prototype.$delete = function(id){
	var self = this;
	self.Collection.remove({_id:id});
}
// Select single

var AngularObject = function(Collection,selector,$scope,subSelector) {
	var self = this;
	self.value = {};
	self.$scope = $scope;
	self.query = {};
	self.Collection = Collection
	Meteor.autosubscribe(function(){
			try{
					self.value = self.Collection.findOne(selector,subSelector);
					self.$scope.$digest();
			}catch(e){
					
			}
   });
};
AngularObject.prototype.$save = function(){
	var self = this;
	current = clone(self.value);
	delete current._id;
	console.log(current );
	console.log(self.value._id);
	self.Collection.update({_id:self.value._id},{$set:current});
}
AngularObject.prototype.$delete = function(){
	var self = this;
	self.Collection.remove({_id:self.value._id});
}

