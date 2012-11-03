/**
 * Utilities
 */
function clone(obj) {
	if (null == obj || "object" != typeof obj)
		return obj;
	var copy = obj.constructor();
	for (var attr in obj) {
		if (obj.hasOwnProperty(attr) && attr != '_id' && attr.indexOf('$') == -1)
			if ( typeof obj[attr] == "object") {
				copy[attr] = clone(obj[attr]);
			} else {
				copy[attr] = obj[attr];
			}
	}
	return copy;
}

_.isEqualLander = function(a, b) {
	if (!a && !b) {
		return true;
	}
	for (i in a) {
		if (i.indexOf('_') == -1 && i.indexOf('$') == -1) {
			if (a[i] instanceof Object) {
				if (!_.isEqualLander(a[i], b[i])) {
					return false;
				}
			} else {
				if (a[i] != b[i]) {
					console.log(i);
					return false;
				}
			}

		}
	}
	return true;
}
/*
 * Main
 */
Meteor.AngularCollectionHolder = {};
Meteor.preventChange = false;
Meteor.AngularCollection = function(name, $scope) {
	var self = this;
	self.name = name;
	self.$scope = $scope;
	if (!Meteor._LocalCollectionDriver.collections[self.name]) {
		self.collection = new Meteor.Collection(self.name);
		Meteor.AngularCollectionHolder[self.name] = self.collection;
	}else{
		self.collection = Meteor._LocalCollectionDriver.collections[self.name];
		Meteor.AngularCollectionHolder[self.name] = self.collection;
	}
	self.find = function(selector) {
		query = self.collection.find(selector);
		return new angularObjectCollection(self.$scope, self.name, query, selector);
	}
	self.findOne = function(selector) {
		query = self.collection.find(selector);
		return new angularObjectCollection(self.$scope, self.name, query, selector, true);
	}
	self.insert = function(object) {
		self.collection.insert(object);
	}
	self.emptyObject = function() {
		return new angularObject(self.name, {}, $scope);
	}
	return self;
}
Array.prototype.$save = function() {
	var self = this;
	for (i in self) {

		if (self[i].$save) {
			self[i].$save();
		}
	}
}
Array.prototype.$delete = function(id) {
	var self = this;
	Meteor.AngularCollectionHolder[self.name].remove({
		_id : id
	});
}
var angularObjectCollection = function($scope, name, query, selector, single) {
	var self = this;
	self.value = new Array();
	self.query = query;
	self.name = name;
	self.$scope = $scope;
	self.selector = selector;
	self.value.push(new angularObject(self.name, {}, self.$scope));
	self.first = true;
	for (var i in self.query.collection.docs) {
		try {
			if (self.query.selector_f(self.query.collection.docs[i])) {

				if (self.first && self.value.length == 1) {
					for (o in query.collection.docs[i]) {
						self.value[0][o] = query.collection.docs[i][o];
					}
					self.first = false;
				} else {
					var temp = new angularObject(self.name, query.collection.docs[i], $scope);
					self.value.push(temp);
				}
				$scope.$digest();
			}
		} catch(e) {

		}
	}
	self.handle = self.query.observe({
		added : function(object) {
			if (!self.query.selector_f(object)) {
				return;
			}
			for (i in self.value) {
				if (self.value[i]._id == object._id) {
					return;
				}
			}
			if (self.first && self.value.length == 1) {
				
				for (o in object) {
					self.value[0][o] = object[o];
				}
				self.first = false;
				
			} else {
				var temp = new angularObject(self.name, object, self.$scope);
				if (_.indexOf(self.value, temp, true) == -1) {
					self.value.push(temp);
				}
			}
			if (!$scope.$$phase)
				$scope.$apply();
		},
		removed : function(old, index) {

			self.value.splice(index, 1);
			if (!$scope.$$phase)
				$scope.$apply();
		},
		changed : function(old_document, at_index, new_document) {
			var change = false;
			for (var i in self.value) {
				var temp = self.value[i];
				if (temp._id == old_document._id) {
					for (var p in temp) {
						if (p.indexOf("$") == -1) {
							self.value[i][p] = old_document[p];
							change = true;
						}
					}
				}
			}

			if (change) {
				if (!$scope.$$phase)
					$scope.$apply();
			}
		}
	});
	if (!single) {
		return self.value;
	} else {
		return self.value[0];
	}

}
var angularObject = function(name, content, $scope, collection) {
	var self = this;
	if (!content) {
		return;
	}
	self.content = content;
	self.content.$collection = name;
	self.content.$delete = function() {
		var self = this;
		Meteor.AngularCollectionHolder[self.$collection].remove({
			_id : self._id
		});
	}
	self.content.$save = function() {
		Meteor.preventChange = true;
		var self = this;
		var temp = clone(self);
		if ( temp instanceof Object && Meteor.AngularCollectionHolder[self.$collection]) {
			if (!self._id) {
				Meteor.AngularCollectionHolder[self.$collection].insert(temp);
			} else {
				Meteor.AngularCollectionHolder[self.$collection].update({
					_id : self._id
				}, temp);
			}

		}

	}
	self.content.$update = function(obj) {
		var self = this;
		var temp = clone(obj);

		if ( temp instanceof Object && Meteor.AngularCollectionHolder[self.$collection]) {
			Meteor.AngularCollectionHolder[self.$collection].update({
				_id : self._id
			}, temp);
		}
	}
	self.$scope = $scope;
	self.name = name;
	return self.content;
}

