const path = require('path')
const protobuf = require('protobufjs')
const xmljs = require('xml-js')

const root = protobuf.loadSync(path.join(__dirname, '../assets/takmessage.proto'))
const TakMessage = root.lookupType("atakmap.commoncommo.protobuf.v1.TakMessage")

exports.proto2js = (message) => {
	if (typeof message === 'undefined' || message === null) {
		throw new Error('Attempted to parse empty TAK proto message')
	}

	const buf = Buffer.from(message, 'hex')
	const result = TakMessage.decode(buf)
	return TakMessage.toObject(result, {
		longs: String,
	}) // or decode
}

exports.protojs2cotjs = (proto) => {
	if(!proto.cotEvent) return null

	const cot = {
		"event": {
			"_attributes": {
				"version": "2.0",
				"uid": proto.cotEvent.uid,
				"type": proto.cotEvent.type,
				"time": new Date(parseInt(proto.cotEvent.sendTime)).toISOString(),
				"start": new Date(parseInt(proto.cotEvent.startTime)).toISOString(),
				"stale": new Date(parseInt(proto.cotEvent.staleTime)).toISOString(),
				"how": proto.cotEvent.how
			},
			"point": {
				"_attributes": {
					"lat": proto.cotEvent.lat ?? 0,
					"lon": proto.cotEvent.lon ?? 0,
					"hae": proto.cotEvent.hae ?? 0,
					"ce": proto.cotEvent.ce,
					"le": proto.cotEvent.le
				}
			},
		}
	}
	if (proto.cotEvent.detail) {
		cot.event.detail = {}
		if (proto.cotEvent.detail.takv) {
			cot.event.detail.takv = {
				"_attributes": {
					"os": proto.cotEvent.detail.takv.os,
					"version": proto.cotEvent.detail.takv.version,
					"device": proto.cotEvent.detail.takv.device,
					"platform": proto.cotEvent.detail.takv.platform
				}
			}
		}
		if (proto.cotEvent.detail.contact) {
			cot.event.detail.contact = {
				"_attributes": {
					"endpoint": proto.cotEvent.detail.contact.endpoint,
					"callsign": proto.cotEvent.detail.contact.callsign
				}
			}
			//todo add phone
		}
		if (proto.cotEvent.detail.xmlDetail) {
			const result = xmljs.xml2js(proto.cotEvent.detail.xmlDetail, {compact: true})
			cot.event.detail = {
				...cot.event.detail,
				...result
			}
		}
		if (proto.cotEvent.detail.group) {
			cot.event.detail.__group = {
				"_attributes": {
					"role": proto.cotEvent.detail.group.role,
					"name": proto.cotEvent.detail.group.name
				}
			}
		}
		if (proto.cotEvent.detail.status) {
			cot.event.detail.status = {
				"_attributes": {
					"battery": proto.cotEvent.detail.status.battery
				}
			}
		}
		/*
			"precisionlocation": {
				"_attributes": {
					"altsrc": "GPS",
						"geopointsrc": "GPS"
				}
			},

			"track": {
				"_attributes": {
					"course": "228.71039582198793",
						"speed": "0.0"
				}
			}
		}*/
	}
	return cot
}