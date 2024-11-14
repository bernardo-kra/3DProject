const { S3Client, PutBucketCorsCommand } = require('@aws-sdk/client-s3')
require('dotenv').config()

const s3Client = new S3Client({
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

const params = {
  Bucket: '3dmodelstorages',
  CORSConfiguration: {
    CORSRules: [
      {
        AllowedOrigins: ['http://localhost:3000'],
        AllowedMethods: ['GET'],
        AllowedHeaders: ['*'],
      },
    ],
  },
}

const run = async () => {
  try {
    const data = await s3Client.send(new PutBucketCorsCommand(params))
    console.log('CORS configurado com sucesso:', data)
  } catch (err) {
    console.error('Erro ao definir CORS:', err)
  }
}

run()
