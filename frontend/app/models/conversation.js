import DS from 'ember-data';

export default DS.Model.extend({
	high_schooler : DS.belongsTo('high-schooler', {async: false}),
	college_student : DS.belongsTo('college-student', {async: false}),
	num_pages : DS.attr('number'),	
	page : DS.belongsTo('page'),
	target_college : DS.belongsTo('target-college'),
});
