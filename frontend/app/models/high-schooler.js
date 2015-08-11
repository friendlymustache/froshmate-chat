import DS from 'ember-data';

export default DS.Model.extend({
  fb_user_id : DS.attr('number'),
  email : DS.attr('string'),
  access_token : DS.attr('string'),
  name : DS.attr('string'),
  high_school_name : DS.attr('string'),
  colleges: DS.hasMany('college'),
  target_colleges: DS.hasMany('target-college'),
  mentor_requests : DS.hasMany('mentor-request')
});
