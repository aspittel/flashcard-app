const mongoose = require('mongoose')
const request = require('request')
const pry = require('pryjs')

require('dotenv').load()

// TODO keep going with: https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens
const UserSchema = new mongoose.Schema({
    username: String,
    password: String
})
const User = mongoose.model('User', UserSchema)

const DefinitionSchema = new mongoose.Schema({
    etymologies: [String],
    definitions: [String],
    examples: [String],
    lexicalCategory: String
})
const Definition = mongoose.model('Definition', DefinitionSchema)


const WordSchema = new mongoose.Schema({
        user: UserSchema,
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


