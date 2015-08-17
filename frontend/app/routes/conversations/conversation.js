import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';
import InfinityRoute from "ember-infinity/mixins/route";
import config from "admissions-game/config/environment";

export default Ember.Route.extend(AuthenticatedRouteMixin, InfinityRoute, {
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
		controller.set('lastPage', model.get('page'));

		var messages = controller.get('messages');
		if (messages === undefined) {
			messages = this.infinityModel('message', {perPage : config.messagesPerPage, startingPage : model.get('page'), 
				modelPath: 'controller.messages'});
			controller.set('messages', messages);			
		}


		/* Scroll to the bottom of the messages after render and also
		 * after the messages are loaded (so it doesn't matter which comes
		 * first)
		 */
		messages.then(function(/* messages */) {
			Ember.$("#messages-grid").scrollTop(Ember.$('#messages-grid').prop("scrollHeight"));
		});

		Ember.run.scheduleOnce('afterRender', function() {
			Ember.$("#messages-grid").scrollTop(Ember.$('#messages-grid').prop("scrollHeight"));			
		});
	}
});
