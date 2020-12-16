const {
  Client,
  EncryptParamsBuilder,
  DecryptParamsBuilder,
} = require('virtru-sdk')

const email = process.env.VIRTRU_SDK_EMAIL
const appId = process.env.VIRTRU_SDK_APP_ID

if (!email || !appId) {
  throw 'An environment variable is not set:\n- VIRTRU_SDK_EMAIL\n- VIRTRU_SDK_APP_ID'
}

const client = new Client({ email, appId })

async function encryptString(unprotectedString) {
  const encryptParams = new EncryptParamsBuilder()
    .withStringSource(unprotectedString)
    .withZipFormat()
    .build()

  const protectedStream = await client.encrypt(encryptParams)

  let result = await protectedStream.toString()
  return Buffer.from(result).toString('base64')
}

async function decryptString(protectedString) {
  const decryptParams = new DecryptParamsBuilder()
    .withStringSource(Buffer.from(protectedString, 'base64').toString())
    .build()

  return client
    .decrypt(decryptParams)
    .then((plaintextStream) => plaintextStream.toString())
    .catch((_) => null)
}

module.exports = {
  encryptString,
  decryptString
}
