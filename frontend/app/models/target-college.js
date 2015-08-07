import DS from 'ember-data';

export default DS.Model.extend({
  college : DS.belongsTo('college'),
  high_schooler : DS.belongsTo('high-schooler'),
  conversations : DS.hasMany('conversation'),
  mentor_requests : DS.hasMany('mentor-request'),
});
