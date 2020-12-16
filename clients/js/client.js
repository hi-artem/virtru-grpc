const PROTO_PATH = __dirname + '/../../protos/virtru.proto'

const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})
const virtruProto = grpc.loadPackageDefinition(packageDefinition).virtru

const serverUrl = '0.0.0.0:50051'
const client = new virtruProto.Virtru(
  serverUrl,
  grpc.credentials.createInsecure()
)

const currentTimestamp = Date.now()

client.encrypt(
  { unprotectedString: currentTimestamp },
  function (err, response) {
    let { protectedString } = response
    console.log(protectedString)
    client.decrypt({ protectedString }, function (err, response) {
      let { unprotectedString } = response
      console.log(unprotectedString)
    })
  }
)
