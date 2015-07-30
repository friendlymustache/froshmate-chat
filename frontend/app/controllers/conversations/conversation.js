import Ember from 'ember';

export default Ember.Controller.extend({
	socket: Ember.inject.service('socket'),
	forceRecompute : false,
	  
	init: function() {
		var websocket = this.get('socket').connect();
		var auth_token = this.get('session.secure.auth_token');

		websocket.on('connect', function(event) {
			console.log('Socket connected');
			websocket.emit('auth_token', auth_token);
		}, this);

		var self = this;

		websocket.on('rt-change/' + auth_token, function(message) {
			var msg = JSON.parse(message);
			self.store.push(self.store.normalize('message', msg));	
			self.force_recompute_of_properties();
			Ember.run.scheduleOnce('afterRender', this, function() {
					$("#messages-grid").scrollTop($('#messages-grid').prop("scrollHeight"));
			})			
		}, this);

		websocket.on('disconnect', function(event) {
			console.log('On close event has been called: ' + event);
		}, this);
	},
	other_user : function() {
		var conversation = this.get('model');
		var cur_id = this.get('session.secure.id');
		var high_schooler = conversation.get('high_schooler');
		var college_student = conversation.get('college_student');
		if (high_schooler.get('id') == cur_id) {
			return college_student;
		}
		return high_schooler;
	}.property('model'),

	no_messages : function() {
		return this.get('model.messages.length') == 0;
	}.property('model', 'forceRecompute'),

	force_recompute_of_properties : function() {
		this.set('forceRecompute', !(this.get('forceRecompute')));
	},

	actions : {
		send_message : function() {			
			var self = this;
			var text = this.get('message_text');
			var sender_id = this.get('session.secure.id');
			var recipient_id = parseInt(this.get('model.high_schooler.id')) + parseInt(this.get('model.college_student.id')) - sender_id;
			var conversation = this.get('model');
			
			var message = this.store.createRecord('message', {'conversation' : conversation, 'text' : text,
			 'sender_id' : sender_id, 'recipient_id' : recipient_id,
			  sent_by_high_schooler : this.get('session.secure.isHighSchooler')});


			Ember.run.scheduleOnce('afterRender', this, function() {
					$("#messages-grid").scrollTop($('#messages-grid').prop("scrollHeight"));
			});		

			message.save().then(function(result) {
				result.unloadRecord();								
				self.force_recompute_of_properties();
			});

			this.set('message_text', "");

		}
	}
});
