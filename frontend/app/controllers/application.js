import Ember from 'ember';

export default Ember.Controller.extend({
	actions: {
		/* NOTE: user will currently be undefined because
		 * the authenticator doesn't return anything on
		 * authentication (it just stores session variables) */
		login_success : function(user) {
			this.transitionTo('conversations');
		},

		login_failure : function(reason) {
			this.transitionTo('signup');
		},	
	},

	

});
