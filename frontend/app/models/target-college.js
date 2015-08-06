import DS from 'ember-data';

export default DS.Model.extend({
  college : DS.belongsTo('college'),
  high_schooler_id : DS.attr('number'),
  conversations : DS.hasMany('conversation'),
  mentor_requests : DS.hasMany('mentor-request'),
});
