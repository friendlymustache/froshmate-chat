/* global FB */
import Ember from 'ember';

export default Ember.View.extend({
  /* Returns a promise desecribing whetheror not the user is already
   * logged in */
  templateName : 'fb-login-view',   
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
    var self = this;
    var token = Ember.$('meta[name="csrf-token"]').attr('content');
    return self.getAccountAttributes().then(function(accountAttributes) {
      accountAttributes['fb_user_id'] = accountAttributes['id'];
      self.sendAction('action', accountAttributes);      
    });
  },

  actions: {
  	/* Handles the entire login flow */
    authorize: function() {
      var self = this;
      /* Determines if the user is logged in */
      this.getLoginStatus().then(
      	/* Executes if we were able to determine login status */
      	function() {
	      	/* Tries to get an access token for the current user, launching
	      	 * the FB login dialog */
	        self.getAccessToken().then(function(accessToken) {
	        	/* Save the access token to our backend via a POST request */
		        self.authenticate(accessToken).then(
		        	/* Executes if server authentication was successful using
		        	 * the FB access token */
			        function(user) {
			            self.sendAction('success', user);
			        },
			        /* Executes if we were unable to log the user in */
			        function(reason) {
			            self.sendAction('failure', reason);
			        }
			    );
	        });
      	});
    }
  }
});