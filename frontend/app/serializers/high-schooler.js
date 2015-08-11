import DS from 'ember-data';

export default DS.ActiveModelSerializer.extend(DS.EmbeddedRecordsMixin, {
	attrs : {
		colleges : {serialize : 'ids', deserialize: 'ids'},
		mentor_requests : {serialize: 'records', deserialize: 'ids'},
	},
	isNewSerializerAPI : true
});
