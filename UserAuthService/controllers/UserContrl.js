// how do i call saveUser now?
const dotenv = require('dotenv')
dotenv.config({path: '../config.env'})
const User = require('../models/UserModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const rabbitConnect = require('../rabbitConnect')
const access_secret = process.env.JWT_ACCESS_TOKEN_SECRET_DEV
const refresh_secret = process.env.JWT_REFRESH_TOKEN_SECRET_DEV
const ses = require('../aws')
const axios = require('axios').default

// do this. create remove the saving of user from the register controller. create a fucntion-save user
// once the user reisters, he receives a message and that user details is sent to a queue called user queue
// once the user click on the confirm mail, which is a route, save user route consumes the USER queue and saves that data to db


const listIdentities = () =>{
    return new Promise((resolve, reject)=>{
        ses.listIdentities((err, data)=>{
            if(err){
                console.log(err)
            }
            resolve(data.Identities)
        })
    })

}

const checkVerifiedEmail = (emailAddress)=>{
    return new Promise((resolve, reject)=>{
        const params = {
            Identities : [emailAddress]
        }
        ses.getIdentityVerificationAttributes(params, (err, data)=>{
            if(err){
                console.log(err)
                reject(err)
            }
            const verificationAttributes = data.VerificationAttributes[emailAddress]
            if(verificationAttributes.VerificationStatus === 'Success'){
                resolve(true)
            }else{
                resolve(false)
            }
        })
    })
}


const register = async(req, res)=>{
    try { //complete this route in such a way that it is only when a user verifies that the user is saved to db
        const {name, email, password,} = req.body;
        const userExists = await User.findOne({email})
        if(userExists){
            console.log('This user exists');
            return res.status(404).send('This email is already registered, please log in')
        }
        const user = {
            name, email, password
        }
        await rabbitConnect().then((channel)=>{
            channel.sendToQueue("USER", Buffer.from(JSON.stringify({user})))
            console.log('Sending user to USER queue');
            return
        })
        const Identities = await listIdentities()
        if(Identities.includes(email)){
            console.log('yes1')
            const verifiedEmail = await checkVerifiedEmail(email)
            console.log('yes2')
            if(!verifiedEmail){
                console.log('yes3')
                ses.verifyEmailIdentity({EmailAddress: email}).send()
                console.log('yes4')

                return res.status(200).send('A confirmation link has been sent to your email')
            }else if(verifiedEmail){
                console.log("email is verified")
                return res.status(200).send('You are already registered and subscribed to this mailing service. Please log or use the forgot password route if you have forgotten your password. if you didnt register previously, please contact support')
            }
        }else{
            ses.verifyEmailIdentity({EmailAddress: email}).send()
            return res.status(200).send('A confirmation link has been sent to your email')
        }
    }catch(error){
        console.log(error);
        return res.status(500).send('Internal server Error '+ error)

    }
}

const callSaveUser = (req, res)=>{
    axios.post("http://localhost:9602/meal-api/v1/auth/saveuser")
}

const saveUser = async(req, res)=>{
    try {

        await rabbitConnect().then((channel)=>{
            channel.consume("USER", (data)=>{
                const {user} = JSON.parse(data.content)
                console.log(user)
                ses.listIdentities((err, data)=>{
                    if(err){
                        console.log(err)
                        return
                    }
                    console.log(data.Identities)
                    const {email} = user
                    if(data.Identities.includes(email)){
                        checkVerifiedEmail(email).then((data)=>{
                            if(data === true){
                                User.create(user)
                                console.log(email)
                                console.log('yes')
                                return res.status(201).json({"msg":"User saved", user})
                            }
                            else if(data === false){
                                channel.sendToQueue("USER", Buffer.from(JSON.stringify({user})))
                                console.log('Sending user back to USER queue since user isnt verified ');
                                return
                            }
                        })


                    }
                })
                channel.ack(data)
                channel.close()
                
            })
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal server Error '+ error)
    }

}

const login = async(req, res)=>{
    try {
        const {email, password} = req.body
        const user = await User.findOne({email}) 
        if(!user){
            console.log('user does not exist');
            return res.status(404).send('This email is not registered, please register')
        }//this function is just for test, for production, detleted this function and just leave check for incorect pasword
        const passwordMatch = await bcrypt.compare(password, user.password)
        if(!passwordMatch){
            console.log('Password doesnt match');
            return res.status(404).send('Incorrect password')
        }else{
            const payload = {
                email, name:user.name, role: user.role
            }
            const access_token = jwt.sign(payload, access_secret, {expiresIn: '10m'})
            const refresh_token = jwt.sign({email}, refresh_secret, {expiresIn: '1d'})
            res.cookie('jwt', refresh_token, { 
                httpOnly: true, 
                sameSite: 'None', secure: true, 
                maxAge: 24 * 60 * 60 * 1000 
                }
            )
            return res.status(200).json({access_token})
            // const access_token = jwt.sign(payload, access_secret, {expiresIn: '1h'}, (err, token)=>{
            //     if(err){
            //         console.log(err);
            //         return res.status(400).send('there was an error signing you in')
            //     }
            //     return res.status(200).json({token})
            // })
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal server Error '+ error)
    }
}

const getUserByID = async(req, res)=>{
    try {
        const id = req.params.id
        const user = await User.findById(id)
        if(!user){
            console.log('No user found');
            return res.status(400).send('No user found')
        }
        return res.status(200).json({user})
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal server Error '+ error)
    }
}

// change password route
const updatePassword = async(req, res)=>{
    try {
        const id = req.params.id
        const {newPassword, retypeNewPassword} = req.body
        const user = await User.findOne({_id: id})
        if(!user){
            console.log('user not found')
            return res.status(404).send('No user with this email found. Try signing up')
        }
        if(!(newPassword) || !(retypeNewPassword)){
            return res.status(400).send('Please enter your new password')
        }
        if(!(newPassword === retypeNewPassword)){
            return res.status(400).send('Passwords do not match')
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        const updatedUser = await User.findOneAndUpdate({_id: id}, {password: hashedPassword }, {
            new:true,
            runValidators: true
        },)

            return res.status(200).json({"password updated": user})

    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal server Error '+ error)
    }

}
// reset Password -forgotten password
const resetPassword = async(req, res)=>{
    const {email} = req.body
    const user = await User.findOne({email})
    if(!user){
        console.log('user not found')
        return res.status(404).send('No user with this email found. Try signing up')
    }
    const params = {
        Source: 'geraldlouisugwunna@gmail.com',
        Destination: {
          ToAddresses: [email],
        },
        Message: {
          Subject: {
            Data: 'Password Reset',
          },
          Body: {
            Text: {
              Data: 'Hello from MealApp! This is a password reset link. Kindly follow the link to change your password. If you didnt request for this, please ignore '+ `http://localhost:9602/meal-api/v1/auth/updatepassword?id=${user.id}`,
            },
          },
        },
    };
    ses.sendEmail(params, (err, data) => {
        if (err) {
          console.error('Error sending email:', err);
          return res.status(400).send('There was an eerror')
        } else {
          console.log('Email sent successfully:', data);
          console.log('Reset link has been sent')
          return res.status(200).send(`A reset link has been sent to your email:${params.Destination.ToAddresses}`)
        }
    })

}
// email verification route
// user roles - admin or customer
// deactivate account
//token refresh
// signout route
const signOut = async(req, res)=>{
    // to blacklist token

}
module.exports = {register, saveUser, callSaveUser, login, getUserByID, resetPassword, updatePassword}

// console.log(transporter.options.auth.user)

// Scenario: Token Refresh

// In many web applications, authentication is implemented using JSON Web Tokens (JWT). JWTs are a secure way to transmit information between the client (usually a web or mobile app) and the server. These tokens typically have a limited lifespan (expiration time) to enhance security. When a JWT expires, the user needs to reauthenticate, which often involves providing their username and password again.

// However, asking users to sign in frequently can be inconvenient and may disrupt their experience. To address this, a "Token Refresh" mechanism is implemented.

// Steps in the Scenario:

// User Signs In: A user successfully signs in to the application using their credentials (username and password). Upon successful authentication, the server generates two tokens:

// An Access Token: This token has a short expiration time, typically a few minutes, and is used for authenticating and accessing protected resources.
// A Refresh Token: This token has a longer expiration time, possibly several days or weeks, and is used exclusively for obtaining new access tokens.
// Access Token Usage: The user includes the access token in the headers of their requests to access protected resources on the server (e.g., accessing their profile or performing actions that require authentication).

// Access Token Expires: Eventually, the access token expires (e.g., after 15 minutes). When this happens, any request made with the expired token will be denied by the server.

// Token Refresh Request: To maintain a seamless user experience, the client (app) automatically initiates a "Token Refresh" request to the server using the refresh token. This request typically goes to a specific "Token Refresh" route.

// Server Validates Refresh Token: The server receives the refresh token and validates it. It checks whether the refresh token is valid, hasn't expired, and matches one of the tokens issued during authentication.

// New Access Token Issued: If the refresh token is valid, the server generates a new access token (with a new short expiration time) and returns it to the client.

// Access Token Renewed: The client replaces the expired access token with the new one it received. This ensures the user can continue using the application without being prompted to sign in again.

// Why Token Refresh is Important:

// Enhanced User Experience: Token refresh prevents users from having to sign in frequently, improving the user experience by maintaining continuous access to the application.

// Security: While access tokens have short lifespans, refresh tokens can have longer lifespans. Even if an access token is compromised, it will expire shortly, reducing the risk of unauthorized access.

// Reduced Load on Authentication: Frequent sign-ins can place a heavy load on authentication systems. Token refresh reduces this load, as authentication occurs less frequently.

// Token refresh mechanisms are an important part of securing modern web applications and providing a seamless user experience. Proper implementation ensures both security and usability.