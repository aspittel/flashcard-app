const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const passport = require('passport')
const passportJWT = require('passport-jwt')
const jwt = require('jsonwebtoken')

require('dotenv').load()

const app = express()

app.use(logger('dev'))

app.use(express.static('public'))

app.use(bodyParser.json({ extended: true }))

app.use(cors())

mongoose.connect(process.env.DB)
mongoose.set('debug', true)

require('./db/connection.js')

const Word = mongoose.model('Word')
const User = mongoose.model('User')

app.use(passport.initialize())

let options = {
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'test test test'
}

passport.use(new passportJWT.Strategy(options, (payload, done) =>{
    User.findOne({
        id: payload.sub
    }, (err, user) => {
        if (err) return done(err, false)
        return user ? done(null, user) : done(null, false)  
    })
}))


const port = parseInt(process.env.PORT, 10) || 4000
app.set('port', port)


// Fisher Yates Shuffle
function shuffle (array) {
    let counter = array.length

    while (counter > 0) {
        let index = Math.floor(Math.random() * counter)
        counter--
        let val = array[counter]
        array[counter] = array[index]
        array[index] = val
    }
    return array
}

app.post('/api/register', (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.json({ 
            success: false, 
            message: 'please enter username + password'
        })
    } else {
        let newUser = new User({
            username: req.body.username,
            password: req.body.password
        })
        newUser.save((err) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'That username is already in use!'
                })
            }
            return res.json({
                success: true,
                message: 'Success!'
            })
        })
    }
})

app.post('/api/login', (req, res) => {
    User.findOne({
        username: req.body.username
    }, (err, user) => {
        if (err) throw err
        if (user) {
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (isMatch) {
                    let token = jwt.sign({
                        user: req.body.username, 
                    }, process.env.SECRET)
                    res.json({
                        success: true,
                        message: 'You are logged in',
                        token
                    })
                } else {
                    res.send({
                        success: false,
                        message: 'Passwords didn\'t match'
                    })
                }
            })
        } else {
            res.send({
                success: false,
                message: 'User not found'
            })
        }
    })
})

app.get('/api/words', (req, res) => {
    Word.find({ done: false }).then((words) => {
        words = shuffle(words)
        res.json(words)
    })
})

app.post('/api/words', (req, res) => {
    let word = new Word(req.body)
    word.done = false
    word.save().then(() =>{
        Word.find({ done: false }).then((words) => {
            res.json(words)
        })
    })
    .catch(err => console.log(err))
})

app.put('/api/words/:id/done', (req, res) => {
    let word = Word.findByIdAndUpdate(req.params.id, {
        $set: {
            done: true
        }
    }, (err, res) => {
        Word.find({ done: false }).then((words) => {
            res.json(words)
        })
    })
})

app.get('*', (req, res) => res.status(200).send({
    message: 'Page not found'
}))

app.listen(app.get("port"))
