import Ember from 'ember';

export default Ember.Route.extend({
	model : function() {
		return this.store.query('conversation', {user_id: this.get('session.secure.id')});
	},

	setupController : function(controller, model) {
		this._super(controller, model);
		var firstConversation = model.get('firstObject');
		if (firstConversation) {
			this.transitionTo('conversations.conversation', firstConversation);
		}
		else {
			controller.set('noConversations', true);			
		}
	}
});
