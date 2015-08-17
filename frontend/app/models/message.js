import DS from 'ember-data';

export default DS.Model.extend({
  // So that we can determine who sent/received each message

  // Check whether the current user ID
  // (can obtain through session.secure.id) matches the sender
  // ID -- if so, it should show up on the right in blue.
  // If not, it should show up on the left in grey
  sent_by_high_schooler : DS.attr('boolean'),
  sender_id : DS.attr('number'),
  recipient_id : DS.attr('number'),
  // Datetime at which message was sent
  created_at: DS.attr('date'),
  text: DS.attr('string'),
  page : DS.belongsTo('page', {async: true}),


});
