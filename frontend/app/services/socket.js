import Ember from 'ember';
import config from 'admissions-game/config/environment'

export default Ember.Service.extend({
    connect: function () {
	var portRegex = new RegExp(":[0-9]+");
	console.log("match: " + config.host.match(portRegex));
	var target_string = config.host.replace(portRegex, "");
	console.log("Target string: " + target_string);
	target_string += ":5001";
	console.log("Opening socket connection to: " + target_string);
        return io(target_string);
    }
});
