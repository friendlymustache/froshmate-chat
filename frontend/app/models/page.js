import DS from 'ember-data';

export default DS.Model.extend({
  messages : DS.hasMany('message'),
  conversation : DS.belongsTo('conversation'),
  // Previous page
  // page : DS.belongsTo('page', {async: true}),
  page_id : DS.attr('number'),

});
