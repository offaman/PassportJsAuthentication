const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function configurePassport(passport, getUserByEmail, getUserById){

    const authenticateUser = async(email, password, done)=>{
        const user = getUserByEmail(email)
        if(user==null)
            return done(null, false, {message:"No user with that email"})
        try{
            if(await bcrypt.compare(password, user.password)){
                return done(null, user)
            }else{
                return done(null, false, {message:"Wrong Password"})
            }
        }catch(e){
                return done(e)
            }
    }
    passport.use(new localStrategy({usernameField:'email', passwordField:'password'}, authenticateUser))
    passport.serializeUser((user,done)=>{
        done(null,user.id)
    })

    passport.deserializeUser((id,done)=>{
        done(null,getUserById(id))
    })

}

module.exports = configurePassport