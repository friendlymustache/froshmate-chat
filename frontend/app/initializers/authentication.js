// app/initializers/authentication.js
import FroshmateAuthenticator from '../authorizers/froshmate-authorizer';

export default {
  name:       'authentication',
  before:     'simple-auth',
  initialize: function(instance) {
    instance.register('authenticator:froshmate-authenticator', FroshmateAuthenticator);
  }
};