const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

require('dotenv').load()

const app = express()

app.use(logger('dev'))

app.use(express.static('public'))

app.use(bodyParser.json({ extended: true }))

app.use(cors())

const port = parseInt(process.env.PORT, 10) || 4000
app.set('port', port)

mongoose.connect(process.env.DB)
mongoose.set('debug', true)

require('./db/connection.js')

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

const Word = mongoose.model('Word')

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
