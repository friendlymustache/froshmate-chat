import Ember from 'ember';

export default Ember.Component.extend({
	classNames : ['item'],
	show_date : false,
	dateOutputFormat : 'MMMM Do YYYY, h:mm:ss a',
	dateInputFormat : '',
	sent_by_curr_user : function() {
		return this.get('session.secure.id') == this.get('message.sender_id');
	}.property('message.sender_id'),


	actions : {
		toggle_date : function() {
			debugger;
			var value = this.get('show_date');
			this.set('show_date', !value);
		}		
	}
});
