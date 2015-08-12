import DS from 'ember-data';

export default DS.Model.extend({
  fb_user_id : DS.attr('string'),
  email : DS.attr('string'),
  access_token : DS.attr('string'),
  name : DS.attr('string'),
  college: DS.belongsTo('college'),
  major : DS.attr('string'),
  activities : DS.attr('string')
});
