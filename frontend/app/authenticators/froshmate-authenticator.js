/* global ga */
/* NOTE: See docs at http://ember-simple-auth.com/ember-simple-auth-api-docs.html#SimpleAuth-Authenticators-Base */
import Ember from 'ember';
import Base from 'simple-auth/authenticators/base';
import config from 'admissions-game/config/environment';

export default Base.extend({

  tokenAttributeName : 'auth_token',
  loginEndpoint : '/login',
  save(user) {
    var url = config.host + '/login';
    return Ember.$.ajax({'url' : url, 'data' : {'user' : user}, 'method' : 'GET'});
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
    var user = this.get_user_fields(options.user);
    return this.save(user);
  },

  invalidate(/* data */) {
    ga('send', 'event', 'logout', 'fb logout', 'success');          
    return Ember.RSVP.resolve();
  },


  get_user_fields(user) {
    var result = {};
    result.fb_user_id = user.fb_user_id;
    result.access_token = user.access_token;
    return result;
  }
});
