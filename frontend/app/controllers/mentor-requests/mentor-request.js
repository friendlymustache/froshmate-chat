import Ember from 'ember';

export default Ember.Controller.extend({
	college_student : undefined,
	mentor_selected : function() {
		return this.get('college_student') !== undefined;
	}.property('college_student'),

	actions : {
		deny_request : function() {
			var model = this.store.deleteRecord(this.get('model'));
			model.save();
		},

		approve_request : function() {
			var college_student = this.get('college_student');
			var model = this.get('model');
			model.set('college_student', college_student);
			model.save();
		},

		set_mentor : function(mentor) {
			this.set('college_student', mentor);
		}
	}
});
