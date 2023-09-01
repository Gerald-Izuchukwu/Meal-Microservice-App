const User = require('../models/UserModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const secret = process.env.JWTSECRET


const register = async(req, res)=>{
    try {
        const {name, email, password} = req.body;
        const userExists = await User.findOne({email})
        if(userExists){
            console.log('This user exists');
            return res.status(404).send('This email is already registered, please log in')
        }
        const user = {
            name, email, password
        }
        const newUser = await User.create(user)
        return res.status(201).json({msg: 'You have been registered successfully', newUser})
    }catch(error){
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
                email, name:user.name
            }
            jwt.sign(payload, secret, (err, token)=>{
                if(err){
                    console.log(err);
                    return res.status(400).send('there was an error signing you in')
                }
                return res.status(200).json({token})
            })
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

module.exports = {register, login, getUserByID}