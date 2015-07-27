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

	afterModel : function(model) {
		var messages = model.get('messages').then(function() {
			$("#messages-grid").scrollTop($('#messages-grid').prop("scrollHeight"));
		});

		Ember.run.scheduleOnce('afterRender', function() {
			$("#messages-grid").scrollTop($('#messages-grid').prop("scrollHeight"));			
		})
	}
});
