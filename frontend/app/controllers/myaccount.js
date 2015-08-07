import Ember from 'ember';

export default Ember.Controller.extend({
  needs: "application",
  invalid_email : false,
  /* Returns only the colleges that haven't already been selected as
   * target colleges by the current user
   */
  filteredColleges : function() {
    return this.get('controllers.application.colleges');
    // var userCollegeIds = this.get('model.colleges').getEach("id");
    // return this.get('controllers.application.colleges').filter(function(item) {
    //   return this.indexOf(item.get('id')) == -1;
    // }.bind(userCollegeIds));
  }.property('model'),

   colleges_with_conversations : function() {
    return this.get('model.target_colleges').filter(function(tc) {
      return tc.get('conversations').length != 0;
    })
  }.property('model', 'model.target_colleges'),

   colleges_with_mentor_requests : function() {
    return this.get('model.target_colleges').filter(function(tc) {
      return tc.get('mentor_requests').length != 0;
    })
  }.property('model', 'model.target_colleges'),  

  isEmailValid : function(email) {
    var regex = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";
    return (email !== undefined && email.match(regex) != null);
  },  

  actions: {
    setCollege: function(college) {
      this.set('college', college);
    },

    changeEmail: function() {
      var new_email = this.get('new_email');
      var valid = this.isEmailValid(new_email);
      this.set('invalid_email', !valid);
      var self = this;
      if (valid) {
        var modelName = this.get('session.secure.isHighSchooler') ? 'high-schooler' : 'college-student';
        this.store.find(modelName, this.get('session.secure.id')).then(function(user) {
          user.set('email', new_email);
          user.save().then(function(/* result */) {
            self.set('new_email', "");
            self.set('email_updated', true);
          });
        });    
      }  
    },

    requestNewMentor : function() {
      var college = this.get('college'); 
      var curr_user = this.store.find('high-schooler', this.get('session.secure.id')).then(function(user) {
        if (college) {        
            // Create a mentor request for the college embedded in a "new" target
            // college
            var properties = this.getProperties('intended_major', 'activities');
            var mentor_request = this.store.createRecord('mentor-request', properties);
            var target_college = this.store.createRecord('target-college', {college: college, high_schooler : user});
            target_college.get('mentor_requests').pushObject(mentor_request);
            target_college.save().then(function(tc) {
              tc.get('mentor_requests').filterBy('isNew').invoke('unloadRecord');
              this.set('activities', "");
              this.set('intended_major', "");
            }.bind(this));
            // var user = this.get('model');
            // user.get('colleges').pushObject(college);
            // user.save();
        }
      }.bind(this));


    },

    destroy : function(mentor_request) {
      if (confirm("Delete this request?")) {
        this.store.deleteRecord(mentor_request);
        mentor_request.save();
      }
    },
  }
});
