import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model : function() {
		var modelName = this.get('session.secure.isHighSchooler') ? 'high-schooler' : 'college-student';
		var id = this.get('session.secure.id');
		var result = this.store.find(modelName, id, {reload: true});
		return result;
	},

	setupController : function(controller, model) {
		this._super(controller, model);
	}
});
