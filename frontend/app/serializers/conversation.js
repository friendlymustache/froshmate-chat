import DS from 'ember-data';

export default DS.ActiveModelSerializer.extend(DS.EmbeddedRecordsMixin, {
	attrs : {
		page : {serialize : 'records', deserialize: 'ids'},
	},
	isNewSerializerAPI : true
});
