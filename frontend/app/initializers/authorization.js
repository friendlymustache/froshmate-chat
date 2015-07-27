import FroshmateAuthorizer from '../authorizers/froshmate-authorizer';

export default {
  name:       'authorization',
  before:     'simple-auth',
  initialize: function(instance) {
    instance.register('authorizer:froshmate-authorizer', FroshmateAuthorizer);
  }
};