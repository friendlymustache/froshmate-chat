import DS from 'ember-data';

export default DS.Model.extend({
	high_schooler : DS.belongsTo('high-schooler', {async: false}),
	college_student : DS.belongsTo('college-student', {async: false}),
	messages : DS.hasMany('message', {async: true})
});
