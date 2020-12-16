const protoPath = process.env.PROTO_PATH || __dirname + '/../protos/virtru.proto'

const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const { encryptString, decryptString } = require('./sdk')

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || '50051'

const packageDefinition = protoLoader.loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})

const virtruProto = grpc.loadPackageDefinition(packageDefinition).virtru

function run() {
  const server = new grpc.Server()
  server.addService(virtruProto.Virtru.service, {
    Decrypt: decrypt,
    Encrypt: encrypt,
  })
  server.bindAsync(
    `${host}:${port}`,
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start()
      console.log(`Server is listenning on ${host}:${port}`)
    }
  )
}

async function decrypt(call, callback) {
  console.log('Decrypt call from ' + call.metadata.internalRepr.get('user-agent'))
  let { protectedString } = call.request
  let unprotectedString = await decryptString(protectedString)
  callback(null, { unprotectedString })
}

async function encrypt(call, callback) {
  console.log('Encrypt call from ' + call.metadata.internalRepr.get('user-agent'))

  let { unprotectedString } = call.request
  let protectedString = await encryptString(unprotectedString)
  callback(null, { protectedString })
}

module.exports = { run }
