/* global ga */
import Ember from 'ember';
import config from "admissions-game/config/environment";
export default Ember.Controller.extend({
	socket: Ember.inject.service('socket'),
	forceRecompute : false,
	new_messages : Ember.A(), 

	init: function() {
		var websocket = this.get('socket').connect();
		var auth_token = this.get('session.secure.auth_token');

		this.set('loading', true);
		websocket.on('connect', function(/* event */) {
			this.set('loading', false);
			// console.log('Socket connected');
			websocket.emit('auth_token', auth_token);
		}.bind(this), this);

		// Name of event that signifies receiving a message
		var received_message = 'rt-change/' + auth_token;
		// console.log("Listening for " + received_message);		
		websocket.on(received_message, function(message) {
			var msg = this.store.normalize('message', JSON.parse(message));
			var message_obj = this.store.push(msg);	
			var page_id = message_obj.get('page.id');
			// If our conversation partner created a new page, create a new
			// local copy of that page to use for creating messages
			// TODO consider concurrency issues due to latency in receiving messages from websocket
			if (this.store.peekRecord('page', page_id) === null) {
				var model = this.get('model');
				message_obj.get('page').then(function(page) {
					model.set('page', page);
				}.bind(this));				
			}

			this.get('new_messages').pushObject(message_obj);
			this.force_recompute_of_properties();
			Ember.run.scheduleOnce('afterRender', this, function() {
					Ember.$("#messages-grid").scrollTop(Ember.$('#messages-grid').prop("scrollHeight"));
			});			
		}.bind(this));

		websocket.on('disconnect', function(event) {
			// console.log('On close event has been called: ' + event);
		}, this);
	},
	other_user : function() {
		var conversation = this.get('model');
		var high_schooler = conversation.get('high_schooler');
		var college_student = conversation.get('college_student');
		if (this.get('session.secure.isHighSchooler')) {
			return college_student;
		}
		return high_schooler;
	}.property('model'),

	no_messages : function() {
		return false;
		// return this.get('new_messages.length') + this.get('messages.length') === 0;
	}.property('model', 'forceRecompute'),

	force_recompute_of_properties : function() {
		this.set('forceRecompute', !(this.get('forceRecompute')));
	},

	actions : {
		send_message : function() {		
			var text = this.get('message_text');					
			if (text && text.length > 0) {
            	ga('send', 'event', 'conversation', 'send message', this.get('model.id'));                				
				var sender_id = this.get('session.secure.id');
				var recipient_id = parseInt(this.get('model.high_schooler.id')) + parseInt(this.get('model.college_student.id')) - sender_id;
				var conversation = this.get('model');
				var page = conversation.get('page');
				var promise = new Ember.RSVP.Promise(function(resolve, reject) {
					if (conversation !== undefined) {
						resolve(conversation);					
					}
					else {
						reject();
					}
				}.bind(this));

				// Check that the conversation's last page doesn't have too many messages
				if (page.get('messages.length') >= config.messagesPerPage) {
					// Create a new page whose previous page was the last page
					page = this.store.createRecord('page', {'conversation' : conversation, 'page' : page});
					conversation.set('num_pages', conversation.get('num_pages') + 1);
					conversation.set('page', page);
					// Update the conversation with its new last page
					promise = conversation.save();
				}


				promise.then(function(conversation) {
					page = conversation.get('page');
					// console.log("Page id:", page.get('id'));
					// Create a new message under the current last-page
					var message = this.store.createRecord('message', {'page' : page, 'text' : text,
					 'sender_id' : sender_id, 'recipient_id' : recipient_id,
					  sent_by_high_schooler : this.get('session.secure.isHighSchooler')});

					// Add the message to the list of recently-created messages
					this.get('new_messages').pushObject(message);
					// Scroll to the bottom of the existing messages
					Ember.run.scheduleOnce('afterRender', this, function() {
							Ember.$("#messages-grid").scrollTop(Ember.$('#messages-grid').prop("scrollHeight"));
					});									

					// Currently only forces the "no messages" property to recompute
					this.force_recompute_of_properties();
					this.set('message_text', "");		

					message.save().then(function(/* result */) {								
						Ember.$("#messages-grid").scrollTop(Ember.$('#messages-grid').prop("scrollHeight"));
					}.bind(this));


				}.bind(this));

			}

		}
	}
});
