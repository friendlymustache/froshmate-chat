import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement: function() {
    var self = this;
    Ember.$('.ui.search.selection.dropdown').dropdown({
      onChange:function(value,text)
        {
          var item = self.get('items').filterBy('name', text)[0];
          self.sendAction('action', item);
        }
      });

  },

  actions : {
    selectItem : function(item) {
      this.sendAction('action', item);
    }
  }

});
