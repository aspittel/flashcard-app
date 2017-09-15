const mongoose = require('mongoose')
const request = require('request')
const pry = require('pryjs')
const bcrypt = require('bcrypt')

require('dotenv').load()

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    }
})

UserSchema.pre('save', function (next) {
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err)
        bcrypt.hash(this.password, salt, (err, hash) =>{
            if (err) return next(err)
            this.password = hash
            next()
        })
    })
})

UserSchema.methods.comparePassword = function (password, callback) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) return callback(err)
        callback(null, isMatch)
    })
}
const User = mongoose.model('User', UserSchema)

const DefinitionSchema = new mongoose.Schema({
    etymologies: [String],
    definitions: [String],
    examples: [String],
    lexicalCategory: String
})
const Definition = mongoose.model('Definition', DefinitionSchema)


const WordSchema = new mongoose.Schema({
        // user: UserSchema,
        word: String,
        definitions: [DefinitionSchema],
        done: Boolean
    }
)
mongoose.model('Word', WordSchema)


const headers = {
    'Accept': 'application/json',
    'app_id': process.env.APP_ID,
    'app_key': process.env.API_KEY
}

function getOpts (word) {
    return {
        url: `https://od-api.oxforddictionaries.com:443/api/v1/entries/en/${word.toLowerCase()}`,
        headers: headers
    }
}

function createDefinition(entry, wordDefinitions, examples) {
    let def = new Definition({
        etymologies: entry.etymologies,
        definitions: wordDefinitions,
        examples: examples,
        lexicalCategory: entry.lexicalCategory
    })
    
    def.save()
    return def
}

function getEntryData (entry) {
    let wordDefinitions = []
    let examples = []

    entry.senses.forEach(def => {
        wordDefinitions = wordDefinitions.concat(def.definitions)
        if (def.examples) {
            def.examples.forEach(example => {
                examples.push(example.text)
            })
        }
    })

    return createDefinition(entry, wordDefinitions, examples)
}

WordSchema.pre('save', function (next) {
    request(getOpts(this.word), (err, res, body) => {
        try {
            let results = JSON.parse(body).results[0].lexicalEntries[0]
            this.definitions = results.entries.map(getEntryData)
        } catch (e) {
            var err = new Error(e)
            return
        }        
        next()
    })
})


