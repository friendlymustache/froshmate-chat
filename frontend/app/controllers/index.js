import Ember from 'ember';

export default Ember.Controller.extend({
	actions : {
	    scrolltosignup: function() {
	      Ember.$.fn.scrollView = function () {
	          return this.each(function () {
	              $('html, body').animate({
	                  scrollTop: $(this).offset().top
	              }, 1000);
	          });
	      }
	      Ember.$('#scrollto').scrollView();
	    }		
	}
});
