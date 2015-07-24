import Ember from 'ember';

export default Ember.Component.extend({
	classNames : ['item'],
	sent_by_curr_user : function() {
		console.log("message id: " + this.get('message.id') + " sender id: " + this.get('message.sender_id'));
		return this.get('session.secure.id') == this.get('message.sender_id');
	}.property('message.sender_id'),


	actions : {
		reveal : function() {
			debugger;
		}		
	}
});
