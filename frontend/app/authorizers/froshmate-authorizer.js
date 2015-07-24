import Base from 'simple-auth/authorizers/base';

export default Base.extend({
  /**
    Authorizes an XHR request by sending the `auth_token` property from the
    session as a bearer token in the `Authorization` header:
    ```
    Authorization: Token token=<auth_token>
    ```
    @method authorize
    @param {jqXHR} jqXHR The XHR request to authorize (see http://api.jquery.com/jQuery.ajax/#jqXHR)
    @param {Object} requestOptions The options as provided to the `$.ajax` method (see http://api.jquery.com/jQuery.ajaxPrefilter/)
  */
  authorize: function(jqXHR, requestOptions) {
    var auth_token = this.get('session.secure.auth_token');
    if (this.get('session.isAuthenticated') && !Ember.isEmpty(auth_token)) {
      jqXHR.setRequestHeader('Authorization', 'Token token=' + auth_token);
    }
  }

});
