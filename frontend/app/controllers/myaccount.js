import Ember from 'ember';

export default Ember.Controller.extend({

  college: "",

  actions: {
    setCollege: function(college_name) {
      this.set('college', college_name);
    },

    changePassword: function() {

    },


    changeEmail: function() {

    }
  }
});
