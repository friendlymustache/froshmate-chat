import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement: function() {
    var self = this;
    Ember.$('.ui.search.selection.dropdown').dropdown();
    Ember.$('.ui.search.selection.dropdown').dropdown({
      onChange:function(value,text)
        {
          self.sendAction('action', value);
        }
      });
  }

});
