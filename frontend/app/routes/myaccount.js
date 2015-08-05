import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model : function() {
		var modelName = this.get('session.secure.isHighSchooler') ? 'high-schooler' : 'college-student';
		return this.store.find(modelName, this.get('session.secure.id'));
	}
});
