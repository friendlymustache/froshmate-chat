import Ember from 'ember';


export default Ember.Component.extend({
  highschooler: false,
  collegestudent: false,
  issigningup: false,
  something_selected: function() {
    return (this.get('highschooler') || this.get('collegestudent'));
  }.property('highschooler', 'collegestudent'),

  invalid_college: false,
  invalid_name: false,
  invalid_dream_college: false,
  invalid_school: false,
  invalid_email: false,
  email_taken: false,


	/* Validate the HS signup form */
	validate_highschool: function() {
	  this.validate_common();
	  this.set('invalid_dream_college', !this.get("dream_college1"));           
	  this.set('invalid_school', !this.get('hschool'));
	  if(this.get('invalid_name') || this.get('invalid_email') || this.get('invalid_school') || this.get('invalid_dream_college')) {
	    return false;
	  }
	  return true;
	},

	/* Validate the college signup form */
	validate_college: function() {
	  this.validate_common();
	  this.set('invalid_college', !document.getElementById("college").value);
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

	/* Get a JSON object containing the form attributes
	 * for the current high schooler/college student
	 */
	 get_form_attributes : function() {
	 	var result = {};
    result.email = this.get('email');	 
    if (this.get('highschooler')) {
    	result.school = this.get('hschool');
    	result.dream_college = this.get('dream_college1');
    }	
    else {
	    result.college = document.getElementById("college").value;
    }
    return result;
	 },


  signup_college : function() {
    this.set('issigningup', true);
    document.getElementById("cbutton").disabled = true;
    var self = this;

    Ember.$.post('http://localhost:3000/login3cs', body, function(post) {
      self.set('issigningup', false);
      console.log(post);
      if(post.response === "There was an error.") {
        self.set('email_taken', true);
      }
      else {
        self.set('email_taken', false);
        window.location.replace("/");
      }
    });

  },

  signup_highschool : function() {
    var self = this;
    Ember.$.post('http://localhost:3000/login3hs', body, function(post) {
      self.set('issigningup', false);
      console.log(post);
      if(post.response === "There was an error.") {
        self.set('email_taken', true);
      }
      else {
        self.set('email_taken', false);
      }
    });
  },


  actions: {
  	/* Open the student sign-up form */
    isStudent: function() {
      if(!this.get('collegestudent') || this.get('highschooler')) {
        Ember.$('.ui.center.aligned.form').transition('slide down');
      }
      this.set('highschooler', true);
      this.set('collegestudent', false);
    },
    /* Open the college-student sign-up form */
    isCollege: function() {
      if(!this.get('highschooler') || this.get('collegestudent')) {
        Ember.$('.ui.center.aligned.form').transition('slide down');
      }
      this.set('highschooler', false);
      this.set('collegestudent', true);
    },

  	/* Handles the entire signup flow */
    signup: function() {
      if (this.validate()) {
      	var user_attributes = this.get_form_attributes();
	      var self = this;

	      /* Determines if the user is logged in */
	      this.getLoginStatus().then(function() {
			      /* Tries to get an access token for the current user, launching
			       * the FB login dialog */
			      self.getAccessToken().then(function(accessToken) {
			        /* Save the access token to our backend via a POST request */
			        self.authenticate(accessToken).then(
			          /* Executes if we were able to get user attributes using the FB auth token */
			          function(user) {
			              // NOTE: We could assume here that if the user was able to log in via FB, the authentication attempt
			              // on the server side will be successful
			              // See https://github.com/simplabs/ember-simple-auth#authenticators
			              var user_json = self.merge(user.toJSON(), user_attributes);
			              self.get('session').authenticate('authenticator:froshmate-authenticator', {'user' : user_json}).then(
			                function(user) {
			                  self.sendAction('success', user);
			                },
			                // NOTE: We should never end up here - this.get('session').authenticate() should always
			                // resolve
			                function(reason) {
			                  // console.log("FB login worked but server login failed...");
			                  self.sendAction('failure', reason);
			              	}
			              );
			          },
			          /* Executes if we were unable to log the user in / get her attributes using the FB auth token */
			          function(reason) {
			              console.log("Unable to log in user via FB (maybe they cancelled FB auth dialog?)");
			              self.sendAction('login_failure', reason);
			          }
			      );
			      });
				});
	  	}
    },

    invalidateSession : function() {
      this.get('session').invalidate();
    },
  },

  validate_common : function() {
  	var valid_email = this.isEmailValid(this.get('email'));  	
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



  /* Facebook auth methods */








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
    var self = this;

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

  /* Authenticates the user on the server after they've logged in via
   * Facebook. Gets the user's account attributes, then
   * makes a request to a login endpoint on the server */
  authenticate: function(accessToken) {
    var datastore = this.get('datastore');  
    var token = accessToken;
    return this.getAccountAttributes().then(function(accountAttributes) {
      accountAttributes['fb_user_id'] = accountAttributes['id'];
      delete accountAttributes['id'];
      accountAttributes['access_token'] = token;
      var user = datastore.createRecord('user', accountAttributes);  
      return user;
    });
  },  









});




