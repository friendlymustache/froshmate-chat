import Ember from 'ember';

export default Ember.Controller.extend({
	needs : "application",
	actions : {
	    scrolltosignup: function() {
	      Ember.$.fn.scrollView = function () {
	          return this.each(function () {
	              Ember.$('html, body').animate({
	                  scrollTop: Ember.$(this).offset().top
	              }, 1000);
	          });
	      };
	      Ember.$('#scrollto').scrollView();
	    },

		login_success : function(/* user */) {
			this.transitionTo('conversations');
		},

		login_failure : function(/* reason */) {
		},		    
	}
});
