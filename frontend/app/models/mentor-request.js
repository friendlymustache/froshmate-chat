import DS from 'ember-data';

export default DS.Model.extend({	
	priority : DS.attr('number'),
	target_college : DS.belongsTo('target-college'),
	intended_major: DS.attr('string'),
	activities : DS.attr('string'),
	created_at : DS.attr('date'),
	college_student : DS.belongsTo('college_student')
});
