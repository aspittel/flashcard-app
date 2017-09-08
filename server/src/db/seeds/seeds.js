const mongoose = require('mongoose')
const seedData = require('./seeds.json')

require('dotenv').load()

require('../connection')

const Word = mongoose.model('Word')

mongoose.connect(process.env.DB)
mongoose.set('debug', true)

Word.remove({}).then(() => 
    seedData.forEach((seed) => {
        let word = new Word(seed)
        word.save(function (err, res) {
            console.log(err)
        })
    })
)

