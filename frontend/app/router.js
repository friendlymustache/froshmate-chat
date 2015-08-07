import Ember from 'ember';
import config from './config/environment';
import googlePageview from './mixins/google-pageview';

var Router = Ember.Router.extend(googlePageview, {
  location: config.locationType
});

Router.map(function() {
  this.route('conversations', function() {
    this.route('conversation', {path : '/:id'});
  });
  this.route('faq');
  this.route('login');
  this.route('signup');
  this.route('about');
  this.route('myaccount');  
  this.route('mentor_requests', function() {
    this.route('mentor_request', {path: "/:id"});
  });
  this.route('confirm', {path : "/confirm/:confirmation_code"});
});

export default Router;
