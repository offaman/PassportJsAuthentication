const express = require('express')
const bcrypt = require('bcrypt')
const app = express()
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

const configurePassport = require('./passportConfig')
configurePassport(passport, email =>{
    return users.find(user => user.email === email)
}, id =>{
    return users.find(user=>user.id ===id)
})

app.set('view-engine','ejs')
app.use(express.urlencoded({extended : false}))
app.use(flash())
app.use(session({
    secret: 'secret',
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())


const users = []



app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name })
})
  
app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})
  
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))
  
app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

app.post('/register',async(req,res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password,10)
        users.push({
            id: Date.now().toString(),
            name:req.body.name,
            email:req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')
    }catch{
        res.redirect('/register')
    }
    console.log(users)
})

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
}

app.listen(8000)