import Ember from 'ember';
import config from 'admissions-game/config/environment'

export default Ember.Service.extend({
    connect: function () {
        console.log('Initializing socket!');
        return io(config.host + ':5001');
    }
});