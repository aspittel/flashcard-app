# flashcard_app
Automatically pulls vocabulary words from the Oxford Dictionary API and provides a flashcard interface from which to study.

# Motivation
I was studying for the GRE and realized that it would be much easier to pull definitions from an external source and just worry about finding new words to learn! This app has a flashcard style interface as well to cycle through the vocab words you want to learn!

# Tech/Frameworks
I used a Mongo database with the Mongoose querying features layered on top. I used a Node server with the Express framework for the rest of the back-end.

The front end uses Vue via Vue-Loader. In the future I will probably integrate Vuetify, but it didn't seem necessary yet.

# Installation
The front and back-ends of the app are completely separate and designed to run on separate servers. Because of this, there is separate configuration for each. Run 
```bash
$ cd server
$ yarn install

$ cd ..

$ cd client
$ yarn install
```

The application is set up to draw from a `.env` file with data about the application. In `/src` create a `.env` file.
```bash
$ cd src
$ touch .env
```

In that file add three variables. One will contain the MongoDB data:
`DB = 'mongodb://user:pw@url/gre_study_plan'` I recommend the `mlab` site for hosting your database.

Then, navigate to the Oxford Dictionary API here: https://developer.oxforddictionaries.com/ and generate an API_KEY and an APP_ID.
```
APP_ID = 'app_id'
API_KEY = 'api_key'
```

Both run locally with the command.
`$ yarn run dev`

# Currently Working on...
- [ ] Adding users
- [ ] Adding a home page with a dashboard view
- [ ] Cleaning up and modularizing the code