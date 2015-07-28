import DS from 'ember-data';

export default DS.Model.extend({
  name : DS.attr('string'),
  college_students : DS.hasMany('college-student')
});
