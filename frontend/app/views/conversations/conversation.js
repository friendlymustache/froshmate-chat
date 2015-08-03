import Ember from 'ember';

export default Ember.View.extend({
	tagName : '',
	didInsertElement : function() {
		Ember.run.scheduleOnce('afterRender', this, function() {
			Ember.$("#messages-grid").scrollTop(Ember.$('#messages-grid').prop("scrollHeight"));
		});		
	}
});
