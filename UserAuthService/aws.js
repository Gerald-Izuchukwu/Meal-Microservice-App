const dotenv = require('dotenv')
dotenv.config({path: './config.env'})
const AWS = require('aws-sdk')
AWS.config.update({
    accessKeyId: process.env.AccessKeyID,
    secretAccessKey: process.env.SecretAccessKey,
    region: process.env.Region
})

const ses = new AWS.SES({region: process.env.Region})
const params = {
  Source: 'geraldlouisjnr8@gmail.com',
  Destination: {
    ToAddresses: ['jfof'],
  },
  Message: {
    Subject: {
      Data: 'Password Reset',
    },
    Body: {
      Text: {
        Data: 'Update password route',
      },
    },
  },
};

const createVerifyEmailIdentityCommand = (emailAddress)=>{
  return ses.verifyEmailAddress({EmailAddress: emailAddress})
}

module.exports = ses
console.log(params.Destination.ToAddresses)