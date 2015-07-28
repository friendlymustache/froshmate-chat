import { moduleForModel, test } from 'ember-qunit';

moduleForModel('high-schooler', 'Unit | Model | high schooler', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
