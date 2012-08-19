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

        //! READ THIS:
//! Due to this post's publicity and the number of people asking if this is satire, or saying
//! that this is an awful idea, I feel the need to clarify. This was **never** intended to
//! actually be used, nor was it satirical. It was intended as a proof of concept to show what
//! Javascript is capable of.
var wrap = {};
var uid;
(function() {
  var lastId = 0;
  uid = function() {
    return lastId++;
  };
}());

wrap.$ = function(val) {
  var id = uid();
  wrap.$[id] = val;
  Object.defineProperty(wrap.$, id, {
    get: function() {
      return val;
    },
    set: function(newVal) {
      val = newVal;
      return newVal;
    },
    enumerable: false
  })
  return this;
};

wrap.$.free = function(ptr) {
  delete global.$[ptr];
};      
//Select multiple
Meteor.AngularCollection = function(name,$scope){
	self = this;
	self.name = name;
	self.$scope = $scope;
	try{
		self._collection = new Meteor.Collection(name);
	}catch(e){
		self._collection = Meteor._LocalCollectionDriver.collections[name];
	}
	return self;
}
Meteor.AngularCollection.prototype.find = function(selector, options){
    return new AngularCollection(self._collection,selector,options,self.$scope);
}
Meteor.AngularCollection.prototype.findOne = function(selector, options){
    return new AngularObject(self._collection,selector,options,self.$scope,1);
}
Meteor.AngularCollection.prototype.insert = function(selector){
    self._collection.insert(selector);
}
Meteor.AngularCollection.prototype.remove = function(selector){
    self._collection.insert(selector);
}
Meteor.AngularCollection.prototype.update = function(selector,options){
	for(i in this.find({})){
		self._collection.update(selector,options);
	}
    
}
var AngularCollection = function(Collection,selector,subSelector,$scope,type) {	
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
	if(type == 1){
		return self.value;
	}else{
		return self.value;
	}
	
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
var AngularObject = function(Collection,selector,subSelector,$scope) {
	var self = this;
	self.value = new Array();
	self.$scope = $scope;
	self.query = {};
	self.Collection = Collection
	Meteor.autosubscribe(function(){
			try{
					temp = self.Collection.findOne(selector,subSelector);
					for(i in temp){
						self.value[i] = undefined;
						self.value[i]  = temp[i];
					}
					self.value = self.value?self.value:new Array();
					console.log(self.value);
					self.$scope.$digest();
			}catch(e){
					
			}
   });
  
   return self.value;
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

