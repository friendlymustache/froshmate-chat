import DS from 'ember-data';
import config from 'admissions-game/config/environment';

export default DS.ActiveModelAdapter.extend({
	host: config.host,
	
});
