/* global FB */
/* NOTE: See docs at http://ember-simple-auth.com/ember-simple-auth-api-docs.html#SimpleAuth-Authenticators-Base */
import Ember from 'ember';
import Base from 'simple-auth/authenticators/base';
import config from 'admissions-game/config/environment';
import User from 'admissions-game/models/user';

export default Base.extend({

  tokenAttributeName : 'auth_token',
  save(user) {
    var url = config.host + "/users"
    console.log("Saving to " + url);
    return Ember.$.ajax({'url' : url, 'data' : {'user' : user}, 'method' : 'POST'});
  },

  restore(properties) {
    var _this = this;
    var propertiesObject = Ember.Object.create(properties);
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (!Ember.isEmpty(propertiesObject.get(_this.tokenAttributeName))) {
        resolve(properties);
      } else {
        reject();
      }
    });
  },

  authenticate(options) {
    var user = options.user;
    return this.save(user);
  },

  invalidate(data) {
    return Ember.RSVP.resolve();
  }
});
