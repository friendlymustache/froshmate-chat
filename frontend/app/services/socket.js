/* global io */
import Ember from 'ember';
import config from 'admissions-game/config/environment';

export default Ember.Service.extend({
    connect: function () {
		var portRegex = new RegExp(":[0-9]+");
		var target_string = config.host.replace(portRegex, "");
		target_string += ":5001";
	    return io(target_string);
    }
});
