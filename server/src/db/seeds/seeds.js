const mongoose = require('mongoose')
const seedData = require('./seeds.json')

require('../connection')

const Word = mongoose.model('Word')

mongoose.connect('mongodb://aspittel:Sp.51141@ds119064.mlab.com:19064/gre_study_plan')
mongoose.set('debug', true)

Word.remove({}).then(() => 
    seedData.forEach((seed) => {
        let word = new Word(seed)
        word.save(function (err, res) {
            console.log(err)
        })
    })
)

