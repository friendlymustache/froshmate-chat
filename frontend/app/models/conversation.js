import DS from 'ember-data';

export default DS.Model.extend({
	student : DS.belongsTo('student', {async: false}),
	mentor : DS.belongsTo('mentor', {async: false}),
	messages : DS.hasMany('message', {async: true})
});
