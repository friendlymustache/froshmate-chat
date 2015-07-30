import Ember from 'ember';
import config from 'admissions-game/config/environment';
export default Ember.Route.extend({
	model : function() {
		var modelName = this.get('session.secure.isHighSchooler') ? 'high-schooler' : 'college-student';
		return this.store.find(modelName, this.get('session.secure.id'));
	}
});
