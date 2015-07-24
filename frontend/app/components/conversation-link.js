import Ember from 'ember';

export default Ember.Component.extend({
	classNames : ['left-padded', 'item'],
	other_user : function() {
		var conversation = this.get('conversation');
		var cur_id = this.get('session.secure.id');
		var student = conversation.get('mentor');
		var mentor = conversation.get('student');
		if (student.get('id') == cur_id) {
			return mentor;
		}
		return student;
	}.property('conversation')
});
