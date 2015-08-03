import Ember from 'ember';

export default Ember.Component.extend({
	tagName : 'a',
	classNames : ['left-padded', 'item'],
	other_user : function() {
		var conversation = this.get('conversation');
		var high_schooler = conversation.get('high_schooler');
		var college_student = conversation.get('college_student');
		if (this.get('session.secure.isHighSchooler')) {
			return college_student;
		}
		return high_schooler;
	}.property('conversation'),
});
