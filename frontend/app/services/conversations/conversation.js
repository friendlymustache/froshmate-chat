export default Ember.Service.extend({
  socket: {},
  setup: function () {
    this.set('socket', io())
  }.on('init')
});