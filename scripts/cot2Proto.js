const path = require('path')
const {cot, proto} = require(path.join(__dirname, '../index.js'))

const run = (cotMessage) => {
	if (!cotMessage) {
		console.error('Enter a COT message')
		return
	}
console.log(cotMessage)
	const cotJs = cot.xml2js(cotMessage)
	console.log('COT JS intermediate format')
	console.log(cotJs)
	const protoJs = proto.cotjs2protojs(cotJs)
	console.log('Proto JS intermediate format')
	console.log(protoJs)
	const protoMessage = proto.js2proto(protoJs)
	console.log('COT XML format')
	console.log(protoMessage.toString())
}

run(process.argv[2])
