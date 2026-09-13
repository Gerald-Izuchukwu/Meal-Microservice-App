const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:  process.env.GMAIL_USER,
        pass:  process.env.GMAIL_PASS
        
    }
})

const sendMailPromise = (mailOptions)=>{
    return new Promise((resolve, reject)=>{
        transporter.sendMail(mailOptions, (err, info)=>{
            if(err){
                console.log(err)
                reject(err)
            }else{
                console.log('EMAIL Sent')
                // console.log(info)
                resolve(true)
            }
        })
    })
}
module.exports = {transporter, sendMailPromise}