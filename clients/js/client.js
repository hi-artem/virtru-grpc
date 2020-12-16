var PROTO_PATH = __dirname + '/../../protos/virtru.proto'

var grpc = require('@grpc/grpc-js')
var protoLoader = require('@grpc/proto-loader')
var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})
var virtruProto = grpc.loadPackageDefinition(packageDefinition).virtru

function main() {
  var target = 'localhost:50051'
  var client = new virtruProto.Virtru(
    target,
    grpc.credentials.createInsecure()
  )

  client.encrypt({ unprotectedString: 'hello world' }, function (err, response) {
    let { protectedString } = response
    console.log(protectedString)
    client.decrypt({ protectedString }, function (err, response) {
      let { unprotectedString } = response 
      console.log(unprotectedString)
    })
  })
}

main()
