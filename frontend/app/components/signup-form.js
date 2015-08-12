/* global FB, ga */
import Ember from 'ember';
export default Ember.Component.extend({
  highschooler: false,
  collegestudent: false,
  issigningup: false,
  college: undefined,
  email : "",

  something_selected: function() {
    return (this.get('highschooler') || this.get('collegestudent'));
  }.property('highschooler', 'collegestudent'),

  show_email_suffix : function() {
    return this.get('college') !== undefined && this.get('collegestudent');
  }.property('college', 'collegestudent'),

  dropdown_prompt : function() {
    return this.get('highschooler') ? "What's your dream college?" : "Select your college";
  }.property('highschooler'),

  display_form : function() {
    // First string will be displayed until JQuery slide-down animation overwrites the
    // style attribute (i.e. until slide-down animation is complete)
    // Second string will be displayed when form is not visible
    return this.get('something_selected') ? "overflow: hidden; height: 0px;" : "display: none;";
  }.property('something_selected'),

  invalid_college: false,
  invalid_name: false,
  invalid_school: false,
  invalid_email: false,
  email_taken: false,


	/* Validate the HS signup form */
	validate_highschool: function() {
	  this.validate_common();
	  this.set('invalid_school', !this.get('hschool'));
	  if(this.get('invalid_name') || this.get('invalid_email') || this.get('invalid_school') || this.get('invalid_college')) {
	    return false;
	  }
	  return true;
	},

	/* Validate the college signup form */
	validate_college: function() {
	  this.validate_common();
	  var invalid = this.get('invalid_name') || this.get('invalid_email') || this.get('invalid_college');
	  return !invalid;
	},

	/* Generic validator */
	validate : function() {
		if (this.get('highschooler')) {
			return this.validate_highschool();
		}
		return this.validate_college();
	},

  get_email : function() {
    var email = this.get('email');
    var width = Ember.$('body').width();
    if (this.get('collegestudent') && width > 600 && email !== undefined && email.length > 0) {
      email += "@";
      email += this.get('college.email_suffix');      
    }
    return email;
  },

	/* Get a JSON object containing the form attributes
	 * for the current high schooler/college student
	 */
	 get_form_attributes : function() {
	 	var result = {};
    result.email = this.get_email();
    if (this.get('highschooler')) {
    	result.high_school_name = this.get('hschool');
    }
    else {
	    result.college = this.get('college');
      result.major = this.get('major');
    }
    return result;
	 },

  actions: {
    /* pass function to college-dropdown to allow it to set college */
    setCollege: function(college) {
      this.set('college', college);
    },

  	/* Toggle the student sign-up form */
    isStudent: function() {
      if (!this.get('highschooler')) {
        ga('send', 'event', 'signup', 'open hs signup');        
      }


      if(!this.get('collegestudent') && !this.get('highschooler')) {
        Ember.$('.ui.center.aligned.form').slideDown();
      }      
      this.set('highschooler', !(this.get('highschooler')));
      this.set('collegestudent', false);
    },
    /* Toggle the college-student sign-up form */
    isCollege: function() {
      if (!this.get('collegestudent')) {
        ga('send', 'event', 'signup', 'open college signup');        
      }

      if(!this.get('highschooler') && !this.get('collegestudent')) {
        ga('send', 'event', 'signup', 'open college signup');      
        Ember.$('.ui.center.aligned.form').slideDown();
      }
      this.set('highschooler', false);
      this.set('collegestudent', !(this.get('collegestudent')));
    },

  	/* Handles the entire signup flow */
    signup: function() {
      if (this.validate()) {    
	      var self = this;
	      /* Determines if the user is logged in */
            self.set('issigningup', true);
			      /* Tries to get an access token for the current user, launching
			       * the FB login dialog */
			      self.getAccessToken().then(function(accessToken) {
			        /* Save the access token to our backend via a POST request */
			        self.getUserAttributes(accessToken).then(self.handleFBLoginSuccess.bind(self), self.handleFBLoginFailure.bind(self));
			      }, self.handleFBLoginFailure.bind(self));
	  	}
    },

    invalidateSession : function() {
      this.get('session').invalidate();
    },
  },

  validate_common : function() {
    this.set('invalid_college', !this.get("college"));
  	var valid_email = this.isEmailValid(this.get_email());
  	this.set('invalid_email', !valid_email);
  },

  merge : function(object_1, object_2) {
  	  for (var attrname in object_2) {
  	  	object_1[attrname] = object_2[attrname];
  	  }
  	  return object_1;
  },


  isEmailValid : function(email) {
    var regex = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";
    return (email !== undefined && email.match(regex) != null);
  },

  onSignup : function(result) {    
    var user_json = result.toJSON();
    this.get('session').authenticate('authenticator:froshmate-authenticator', {'user' : user_json}).then(
      function(user) {            
        this.set('issigningup', false);
        this.sendAction('success', user);
      }.bind(this),
      // NOTE: We should never end up here - this.get('session').authenticate() should always
      // resolve
      function(reason) {
        // console.log("FB login worked but server login failed...");
        this.set('issigningup', false);
        this.sendAction('failure', reason);
      }.bind(this)
    );
  },

  onSignupFailure : function(reason) {
    this.set('issigningup', false);
    alert("It looks like you already have an account! Try logging in above");
  },

  /* Facebook auth methods */

  handleFBLoginSuccess : function(user_object) {
      var datastore = this.get('datastore');
      var user_json = this.merge(user_object, this.get_form_attributes());
      var user;
      ga('send', 'event', 'signup', 'fb login', 'success');      
      if (this.get('highschooler')) {
        var college = this.get('college');

        // Add the selected target college to the user's colleges
        user = datastore.createRecord('high-schooler', user_json);
        user.get('colleges').pushObject(college);

        // Create a mentor request object with the current major
        var mentor_request = datastore.createRecord('mentor-request', {intended_major: this.get('major')});
        user.get('mentor_requests').pushObject(mentor_request);
        ga('send', 'event', 'signup', 'click', 'high school signup');      
      }
      else {
        user = datastore.createRecord('college-student', user_json);
        ga('send', 'event', 'signup', 'click', 'college student signup');      
      }
      user.save().then(this.onSignup.bind(this)).catch(this.onSignupFailure.bind(this));
  },

  handleFBLoginFailure : function(reason) {
    ga('send', 'event', 'signup', 'fb login', 'failure');      
    console.log("Unable to log in user via FB (maybe they cancelled FB auth dialog?)");
    this.sendAction('login_failure', reason);      
    this.set('issigningup', false);
  },





/* Returns a promise desecribing whetheror not the user is already
   * logged in */
  getLoginStatus: function() {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      FB.getLoginStatus(function(response) {
        if (response.status) {
          resolve(response.status);
        } else {
          reject();
        }
      });
    });
  },

  /* Returns a promise that attempts to log the user in through FB,
   * resolving to return the resulting access token if login was successful
   * or rejecting if login failed
   */
  getAccessToken: function() {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      FB.login(function(response) {
        if (response.authResponse) {
          resolve(response.authResponse.accessToken);
        } else {
          reject(response);
        }
      }, { scope: 'email' });
    });
  },

  /* Returns a promise that resolves to the user's attributes, or
   * rejects if the attributes can't be accessed
   */
  getAccountAttributes: function() {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      FB.api('/me', function(response) {
        if (!response || response.error || Ember.isEmpty(response.email)) {
          reject("An error occured or privileges required to sign up were not granted.");
        } else {
          resolve(response);
        }
      }, { fields: 'email,name,id' });
    });
  },

  /* Gets a user's account attributes from FB */
  getUserAttributes: function(accessToken) {
    var token = accessToken;
    return this.getAccountAttributes().then(function(accountAttributes) {
      accountAttributes['fb_user_id'] = accountAttributes['id'];
      delete accountAttributes['id'];
      accountAttributes['access_token'] = token;
      return accountAttributes;
    });
  },









});
