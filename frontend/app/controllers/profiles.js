import Ember from 'ember';

export default Ember.Controller.extend({
  data_fields: function() {
    var lines = this.get('model').get('text').split("\n");
    return lines.filter(function(n){ return n !== ""; });
  }.property('model'),

  guessed: false,
  correct: false,

  actions: {
    reload: function() {
      this.set('guessed', false);
      var self = this;
      Ember.$.getJSON('http://localhost:3000/profiles/1', function(post) {
        self.set('model', Ember.Object.create(post.profile));
      });
    },

    guess: function(value, actual) {
      this.set('guessed', true);
      this.set('correct', value === actual);
    }
  }

});
