/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'admissions-game',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    contentSecurityPolicy: {
      'font-src': "'self' data: fonts.gstatic.com",
      'style-src': "'self' 'unsafe-inline' fonts.googleapis.com",
      'img-src': "*",
      'connect-src' : "*",
      'script-src' : "*",
      'default-src' : "*",
    },        
  };

  ENV['simple-auth'] = {
    authorizer: 'authorizer:froshmate-authorizer',
    store: 'simple-auth-session-store:local-storage',
  }  



  if (environment === 'development') {
    ENV.host = 'http://localhost:3000'
    ENV['simple-auth']['crossOriginWhitelist'] = ['http://localhost:3000']    
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.host = 'http://froshmate.com'
    ENV['simple-auth']['crossOriginWhitelist'] = ['http://froshmate.com', 'http://www.froshmate.com']        
  }

  return ENV;
};
