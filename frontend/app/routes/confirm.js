import Ember from 'ember';
import config from 'admissions-game/config/environment';
export default Ember.Route.extend({
	model : function(params) {
		var url = config.host + "/confirm/" + params.confirmation_code;
		// If confirmation code was valid, model hook will return JSON
		// If not, it will return a 404 so we'll never get here.		
		return Ember.$.ajax(url, "GET");
	}
});
