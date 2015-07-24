import FroshmateAuthorizer from '../authorizers/froshmate-authorizer';

export default {
  name:       'authorization',
  before:     'simple-auth',
  initialize: function(container, application) {
    application.register('authorizer:froshmate-authorizer', FroshmateAuthorizer);
  }
};