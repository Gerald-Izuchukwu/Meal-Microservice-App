// const dotenv = require('dotenv')
// dotenv.config({path: './config.env'})
const AWS = require('aws-sdk')
AWS.config.update({
    accessKeyId: process.env.AWS_AccessKeyID,
    secretAccessKey: process.env.AWS_SecretAccessKey,
    region: process.env.AWS_Region
})

const ses = new AWS.SES({region: process.env.AWS_Region})
// const params = {
//   Source: 'geraldlouisjnr8@gmail.com',
//   Destination: {
//     ToAddresses: ['jfof'],
//   },
//   Message: {
//     Subject: {
//       Data: 'Password Reset',
//     },
//     Body: {
//       Text: {
//         Data: 'Update password route',
//       },
//     },
//   },
// };

// const createVerifyEmailIdentityCommand = (emailAddress)=>{
//   return ses.verifyEmailAddress({EmailAddress: emailAddress})
// }


// ses.listIdentities((err, data)=>{
//   if(err){
//     console.log(err)
//     return
//   }else{
//     console.log(data.Identities)
//     return data.Identities

//   }
// })
// console.log(typeof(listIdentity))


module.exports = ses
// console.log(params.Destination.ToAddresses)