import DS from 'ember-data';

export default DS.Model.extend({
  // So that we can look up messages between two users easily
  conversation : DS.belongsTo('conversation'),
  // So that we can determine who sent/received each message

  // For each message, render a component to which we pass the
  // actual message.

  // Check whether the current user ID
  // (can obtain through session.secure.id) matches the sender
  // ID -- if so, it should show up on the right in blue.
  // If not, it should show up on the left in grey  
  sender_id : DS.attr('number'),
  recipient_id : DS.attr('number'),
  // Datetime at which message was sent
  created_at: DS.attr('date'),
  text: DS.attr('string')


});
