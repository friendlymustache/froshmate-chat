import Ember from 'ember';

export default Ember.View.extend({
	tagName : '',
	didInsertElement : function() {
		Ember.run.scheduleOnce('afterRender', this, function() {
			$("#messages-grid").scrollTop($('#messages-grid').prop("scrollHeight"));
		});		
	}
});
