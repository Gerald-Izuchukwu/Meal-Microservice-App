const amqp = require('amqplib/callback_api')

async function connect(){
    const amqpServer = 'amqp://localhost:5672'
    return new Promise((resolve, reject)=>{
        amqp.connect(amqpServer, (connectionErr, connection)=>{
            if(connectionErr){
                console.log(connectionErr)
                reject(connectionErr)
            }
            connection.createChannel((channelError, channel)=>{
                if(channelError){
                    console.log(channelError)
                    reject(channelError)
                }
                channel.assertQueue("ORDER")
                resolve(channel)
            })
    
        })
    })
}


module.exports = connect

