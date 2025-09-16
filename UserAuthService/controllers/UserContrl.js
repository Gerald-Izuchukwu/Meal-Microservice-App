const User = require('../models/UserModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const rabbitConnect = require('../rabbitConnect')
const access_secret = process.env.JWT_ACCESS_TOKEN_SECRET_DEV
const refresh_secret = process.env.JWT_REFRESH_TOKEN_SECRET_DEV
const { listIdentities, checkVerifiedEmail} = require('../utils/aws')
const axios = require('axios').default
const {registerServiceWithAWS, resetPasswordWithAWS,registerServiceWithNodeMailer, resetPasswordWithNodemailer, } = require('../services/authService.js')
const authHost = process.env.AUTH_SERVICE_HOST || 'localhost';
const PORT = process.env.PORT || 9602;
const client = require('prom-client')
const clientRegister = client.register;
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics()

const register = async(req, res)=>{
    try { 
        const {name, email, password, role} = req.body;
        // console.log(req.body)
        const userExists = await User.findOne({email})
        if(userExists){
            console.log('This user exists');
            return res.status(400).send('This email is already registered, please log in')
        }
        const user = {
            name, email, password, role
        }
        // console.log(user)
        await rabbitConnect().then((channel)=>{
            channel.sendToQueue("USER", Buffer.from(JSON.stringify({user})))
            console.log('Sending user to USER queue');
            return
        })

        const result = await registerServiceWithAWS(user)
        // const result = await registerServiceWithNodeMailer(user)
        console.log(result)
        if(result.success){
            if(result.emailVerificationRequired){
                console.log(user)
                await rabbitConnect().then((channel)=>{
                    channel.sendToQueue("USER", Buffer.from(JSON.stringify({user})))
                    console.log('Sending user to USER queue');
                    return
                })
                return res.status(200).send('A confirmation link has been sent to your email')
            }
            else if(!(result.emailVerificationRequired)){ //if the user's email is already verfied and it is not in the database, just proceed to create the user profile
                return res.status(200).send('A confirmation link has been sent to your email')
            }
        }else if(!(result.success)){
            return res.status(400).send('There was an error in creating this user')
        }
    }catch(error){
        console.log(error);
        return res.status(500).send('Internal server Error '+ error)
    }
}

const callSaveUser = (req, res)=>{
    axios.post(`http://${authHost}:${PORT}/meal-api/v1/auth/saveuser`) //for local dev
}

const saveUser = async (req, res) => {
    try {
        const identities = await listIdentities();
        const channel = await rabbitConnect();
        
        channel.consume("USER", async (data) => {
            try {
                const { user } = JSON.parse(data.content);
                const { email } = user;
                
                if (identities.includes(email)) {
                    const isVerified = await checkVerifiedEmail(email);
                    
                    if (!isVerified) {
                        await channel.sendToQueue("USER", Buffer.from(JSON.stringify({ user })));
                        console.log('Sending user back to USER queue since user isnt verified');
                        
                        channel.nack(data);
                        channel.close();
                        return res.status(400).json({ msg: "User not verified", user });
                    } else {
                        await User.create(user);  
                        console.log(email);
                        console.log("User saved successfully");
                        
                        channel.ack(data);
                        channel.close();
                        return res.status(201).json({ msg: "User saved", user });
                    }
                }
            } catch (error) {
                console.error(error);
                channel.nack(data);
                return res.status(500).json({ error: 'Error processing user' });
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server Error: ' + error });
    }
}


const login = async(req, res)=>{
    try {
        const {email, password} = req.body
        console.log(req.body)
        const user = await User.findOne({email}) 
        if(!user){
            console.log('user does not exist');
            return res.status(404).send('This email is not registered, please register')
        }//this function is just for test, for production, detlete this function and just leave check for incorect pasword
        const passwordMatch = await bcrypt.compare(String(password), user.password)
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
            res.status(200).json({access_token, payload})
            // return res.redirect(200, 'http://localhost:9601/meal-api/v1/food/home-page') // for local development
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
        const {oldPassword, newPassword, retypeNewPassword} = req.body
        const user = await User.findOne({_id: id})
        if(!(oldPassword) || !(newPassword) || !(retypeNewPassword)){
            return res.status(400).send('Please enter your new password')
        }
        if(!user){
            console.log('user not found')
            return res.status(404).send('No user with this email found. Try signing up')
        }
        const isMatch = await bcrypt.compare(String(oldPassword), user.password);
        if (!isMatch) {
            return res.status(400).send("Incorrect old password");
        }
        if(!(newPassword === retypeNewPassword)){
            return res.status(400).send('Passwords do not match')
        }

        const hashedPassword = await bcrypt.hash(String(newPassword), 10)
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
    try {
        const {email} = req.body
        const user = await User.findOne({email})
        if(!user){
            console.log('user not found')
            return res.status(404).send('No user with this email found. Try signing up')
        }
        const passwordReset = await resetPasswordWithAWS(user)
        // const passwordReset = await resetPasswordWithNodemailer(user)
        console.log('Email sent successfully:');
        console.log('Reset link has been sent')
        return res.status(200).send(`A reset link has been sent to your email:${email}`)

    } catch (err) {
        if (err) {
          console.error('Error sending email:', err);
          return res.status(400).send('There was an eerror')
        } 
    }



}
// signout route
const signOut = (req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          res.status(400).send('Unable to log out')
        } else {
          res.send('Logout successful')
        }
      });
    } else {
      res.end()
    }
}
module.exports = {
    register, saveUser, callSaveUser, 
    login, getUserByID, resetPassword, 
    updatePassword, signOut,
}




// // save user using aws----when i get my account back
// const saveUser = async(req, res)=>{
//     try {

//         await rabbitConnect().then((channel)=>{
//             channel.consume("USER", (data)=>{
//                 const {user} = JSON.parse(data.content)
//                 console.log(user)
//                 ses.listIdentities((err, data)=>{
//                     if(err){
//                         console.log(err)
//                         return
//                     }
//                     console.log(data.Identities)
//                     const {email} = user
//                     if(data.Identities.includes(email)){
//                         checkVerifiedEmail(email).then((data)=>{
//                             if(data === true){
//                                 User.create(user)
//                                 console.log(email)
//                                 console.log('yes')
//                                 return res.status(201).json({"msg":"User saved", user})
//                             }
//                             else if(data === false){
//                                 channel.sendToQueue("USER", Buffer.from(JSON.stringify({user})))
//                                 console.log('Sending user back to USER queue since user isnt verified ');
//                                 return
//                             }
//                         })


//                     }
//                 })
//                 channel.ack(data)
//                 channel.close()
                
//             })
//         })
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send('Internal server Error '+ error)
//     }

// }
