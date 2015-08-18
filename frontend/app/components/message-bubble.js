import Ember from 'ember';

export default Ember.Component.extend({
	classNames : ['item', 'message-bubble'],
	show_date : false,
	dateOutputFormat : 'MMMM Do YYYY, h:mm:ss a',
	dateInputFormat : '',
	sent_by_curr_user : function() {
		return this.get('session.secure.isHighSchooler') === this.get('message.sent_by_high_schooler');
	}.property('message.sent_by_high_schooler'),

	unsaved : function() {
		// return this.get('message.isNew');
		return false;
	}.property('message.isNew'),



	actions : {
		toggle_date : function() {
			var value = this.get('show_date');
			this.set('show_date', !value);
		}		
	}
});
