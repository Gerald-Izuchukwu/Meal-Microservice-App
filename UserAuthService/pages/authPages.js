const successPage = (req, res)=>{
    res.render('confirmation', {message: 'A confirmation link has been sent to your email'})
}

const signUpPage = function(req, res){
    res.render("signUp", {title: "SignUp Page"})
}

const loginPage = function(req, res){
    res.render('login')
}

const tryPage = function(req, res){
    res.render('index', {title:"Hi JS"})
}

module.exports = {
    successPage,
    signUpPage,
    loginPage,
    tryPage
}