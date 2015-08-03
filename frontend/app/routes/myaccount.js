import Ember from 'ember';
export default Ember.Route.extend({
	model : function() {
		var modelName = this.get('session.secure.isHighSchooler') ? 'high-schooler' : 'college-student';
		return this.store.find(modelName, this.get('session.secure.id'));
	}
});
