import Ember from 'ember';

export default Ember.Route.extend({
	model : function() {
		return this.store.find('conversation', {user_id: this.get('session.secure.id')});
	}
});
