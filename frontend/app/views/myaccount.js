import Ember from 'ember';

export default Ember.View.extend({

  didInsertElement: function() {
    Ember.$('#account_menu .item').tab();
  }

});
