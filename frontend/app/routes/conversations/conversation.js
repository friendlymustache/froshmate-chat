import Ember from 'ember';

export default Ember.Route.extend({
	model : function(params) {
		return this.store.find('conversation', parseInt(params.id));
	},

	renderTemplate : function() {
		this.render('partner-name', {
			outlet : "partner-name"
		});
		this.render('conversations.conversation', {
			outlet : "conversation-content"
		});
	},

	setupController : function(controller, model) {
		this._super(controller, model);
		/* Scroll to the bottom of the messages after render and also
		 * after the messages are loaded (so it doesn't matter which comes
		 * first)
		 */
		model.get('messages').then(function(messages) {
			$("#messages-grid").scrollTop($('#messages-grid').prop("scrollHeight"));
		});

		Ember.run.scheduleOnce('afterRender', function() {
			$("#messages-grid").scrollTop($('#messages-grid').prop("scrollHeight"));			
		});

	}
});
