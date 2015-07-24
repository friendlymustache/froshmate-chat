import DS from 'ember-data';

export default DS.Model.extend({
  fb_user_id : DS.attr('number'),
  email : DS.attr('string'),
  access_token : DS.attr('string'),
  name : DS.attr('string')
});
