/* global FB */
import Ember from 'ember';

export default Ember.Component.extend({
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
      return accountAttributes;
      //var user = datastore.createRecord('user', accountAttributes);
      //return user;
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
              /* Executes if we were able to get user attributes using the FB auth token */
              function(user) {
                  // NOTE: We could assume here that if the user was able to log in via FB, the authentication attempt
                  // on the server side will be successful
                  // See https://github.com/simplabs/ember-simple-auth#authenticators
                  self.get('session').authenticate('authenticator:froshmate-authenticator', {'user' : user}).then(
                    function(user) {
                      self.sendAction('success', user);
                    },
                    // NOTE: We should never end up here - this.get('session').authenticate() should always
                    // resolve
                    function(reason) {
                      // console.log("FB login worked but server login failed...");
                      self.sendAction('failure', reason);
                  });
              },
              /* Executes if we were unable to log the user in / get her attributes using the FB auth token */
              function(reason) {
                  console.log("Unable to log in user via FB (maybe they cancelled FB auth dialog?)");
                  self.sendAction('login_failure', reason);
              }
          );
          });
        });
    },

    invalidateSession : function() {
      this.get('session').invalidate();
    },

  }
});
