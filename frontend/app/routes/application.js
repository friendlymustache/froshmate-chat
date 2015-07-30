import Ember from 'ember';

import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
	setupController : function(controller, model) {
		controller.set('colleges', this.store.findAll('college'));
	}

});
