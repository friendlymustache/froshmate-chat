import Ember from 'ember';

export default Ember.Controller.extend({
	  // /*
	  // * 1) First step you need to do is inject the websocket service into your object. You
	  // * can inject the service into component, controllers, object, mixins, routes, and views.
	  // */
	  // socketService: Ember.inject.service('websockets'),

	  // init: function() {
	  //   this._super.apply(this, arguments);

	  //   /*
	  //   * 2) The next step you need to do is to create your actual websocket. Calling socketFor
	  //   * will retrieve a cached websocket if one exists or in this case it
	  //   * will create a new one for us.
	  //   */
	  //   var socket = this.get('socketService').socketFor('http://localhost:5001/');

	    
	  //   * 3) The final step is to define your event handlers. All event handlers
	  //   * are added via the `on` method and take 3 arguments: event name, callback
	  //   * function, and the context in which to invoke the callback. All 3 arguments
	  //   * are required.
	    
	  //   socket.on('open', this.myOpenHandler, this);
	  //   socket.on('rt-change', this.myMessageHandler, this);
	  //   socket.on('close', function(event) {
	  //     // anonymous functions work as well
	  //   }, this);
	  // },

	  // myOpenHandler: function(event) {
	  //   console.log('On open event has been called: ' + event);
	  // },

	  // myMessageHandler: function(event) {
	  //   console.log('Message: ' + event.data);
	  // },

	actions : {
		send_message : function() {
			var text = this.get('message_text');
			var sender_id = this.get('session.secure.id');
			var recipient_id = parseInt(this.get('model.student.id')) + parseInt(this.get('model.mentor.id')) - sender_id;
			var conversation = this.get('model');

			var message = this.store.createRecord('message', {'conversation' : conversation, 'text' : text,
			 'sender_id' : sender_id, 'recipient_id' : recipient_id});
			debugger;
			message.save();
			this.set('message_text', "");

		}
	}
});
