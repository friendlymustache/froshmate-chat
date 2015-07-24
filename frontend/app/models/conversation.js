import DS from 'ember-data';

export default DS.Model.extend({
	student : DS.belongsTo('student'),
	mentor : DS.belongsTo('mentor'),
	messages : DS.hasMany('message', {async: true})
});
