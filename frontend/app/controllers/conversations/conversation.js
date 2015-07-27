import Ember from 'ember';

export default Ember.Controller.extend({
	socket: Ember.inject.service('socket'),
	  
	init: function() {
		var websocket = this.get('socket').connect();
		var auth_token = this.get('session.secure.auth_token');

		websocket.on('connect', function(event) {
			console.log('Socket connected');
			websocket.emit('auth_token', auth_token);
		}, this);

		var self = this;

		websocket.on('rt-change/' + auth_token, function(message) {
			console.log('Got message!');
			var msg = JSON.parse(message);
			console.log(msg);
			self.store.push(self.store.normalize('message', msg));
		}, this);

		websocket.on('disconnect', function(event) {
			console.log('On close event has been called: ' + event);
		}, this);
	},

	other_user : function() {
		var conversation = this.get('model');
		var cur_id = this.get('session.secure.id');
		var student = conversation.get('mentor');
		var mentor = conversation.get('student');
		if (student.get('id') == cur_id) {
			return mentor;
		}
		return student;
	}.property('conversation'),

	actions : {
		send_message : function() {
			var text = this.get('message_text');
			var sender_id = this.get('session.secure.id');
			var recipient_id = parseInt(this.get('model.student.id')) + parseInt(this.get('model.mentor.id')) - sender_id;
			var conversation = this.get('model');
			var message = this.store.createRecord('message', {'conversation' : conversation, 'text' : text,
			 'sender_id' : sender_id, 'recipient_id' : recipient_id});
			message.save().then(function(result) {
				var conversation = this.get('model');
				conversation.get('messages').filterBy('isNew').invoke('unloadRecord');
			}.bind(this));

			this.set('message_text', "");

		}
	}
});
