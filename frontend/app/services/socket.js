import Ember from 'ember';

export default Ember.Service.extend({
    connect: function () {
        console.log('Initializing socket!');
        return io('http://localhost:5001');
    }
});