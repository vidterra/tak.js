const path = require('path')
const protobuf = require('protobufjs')

exports.js2proto = (js) => {
	if (typeof js === 'undefined' || !js) {
		throw new Error('Attempted to parse empty Object')
	}

	return TakMessage.encode(js).finish()
}

exports.cotjs2protojs = (cotjs) => {
	const protojs = {
		takControl: {},
		cotEvent: {
			type: cotjs.event._attributes.type,
			uid: cotjs.event._attributes.uid,
			sendTime: (new Date(cotjs.event._attributes.time)).getTime().toString(),
			startTime: (new Date(cotjs.event._attributes.start)).getTime().toString(),
			staleTime: (new Date(cotjs.event._attributes.stale)).getTime().toString(),
			how: cotjs.event._attributes.how,
			ce: parseFloat(cotjs.event.point._attributes.ce),
			le: parseFloat(cotjs.event.point._attributes.le),
		}
	}
	return protojs
}

const root = protobuf.loadSync(path.join(__dirname, '../assets/takmessage.proto'))
TakMessage = root.lookupType("atakmap.commoncommo.protobuf.v1.TakMessage")