const path = require('path')
const {cot, proto} = require(path.join(__dirname, '../index.js'))

const run = (protoMessage) => {
	if (!protoMessage) {
		console.error('Enter a TAK message')
		return
	}

	const bufferProto = typeof protoMessage !== Buffer ? Buffer.from(protoMessage, 'hex') : protoMessage

	if (bufferProto[0] === 191) { // TAK message format 0xbf
		console.log('TAK message received')
		const trimmedBuffer = bufferProto.slice(3, bufferProto.length) // remove tak message header from content
		if (bufferProto[1] === 0) { // is COT XML
			console.error('Enter a TAK proto message')
		} else if (bufferProto[1] === 1) { // is Protobuf
			const protoMessage = proto.proto2js(trimmedBuffer)
			console.log('Proto JS intermediate format')
			console.log(protoMessage)
			const cotMessage = proto.protojs2cotjs(protoMessage)
			console.log('COT JS intermediate format')
			console.log(JSON.stringify(cotMessage))
			console.log('COT XML format')
			console.log(cot.js2xml(cotMessage))
		}
	} else { // not TAK message format
		console.error('Enter a TAK proto message')
	}
}

run(process.argv[2])
