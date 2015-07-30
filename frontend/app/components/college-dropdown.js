import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement: function() {
    var self = this;
    Ember.$('.ui.search.selection.dropdown').dropdown({
      onChange:function(value,text)
        {
          var college = self.get('colleges').filterBy('name', text)[0];
          self.sendAction('action', college);
        }
      });

  },

  actions : {
    selectCollege : function(college) {
      this.sendAction('action', college);
    }
  }

});
