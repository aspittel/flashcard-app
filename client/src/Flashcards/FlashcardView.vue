<template>
    <div>
        <nav>
            <div class="nav-wrapper red lighten-1">
                <a href="#" class="brand-logo left">Study</a>
                <div class="input-field right">
                    <input v-model="card" @keyup.enter="submit" id="new-card" placeholder="add word">
                </div>
                <div class="left hide-on-med-and-down">{{ flashcards.length }} cards</div>
            </div>
        </nav>

        <main>
            <div class="container" v-if="flashcards[currentIndex]">
                <h1>{{ flashcards[currentIndex].word }}</h1>
                <div v-if="show">
                    <div 
                        v-for="def, idx in flashcards[currentIndex].definitions"
                        v-bind:key="def._id"
                        class="card"
                        v-bind:style="{ backgroundColor: colors[idx] }">
                        <h5>Definition {{ idx + 1 }}: </h5>
                        <p>{{ def.definitions[0] }}</p>
                        <p v-if="def.etymologies[0]">
                            <b>Etymology:</b> {{ def.etymologies[0] }}</p>
                        <p>
                        <b>Part of Speech:</b> {{ def.lexicalCategory }}</p>
                        <div v-for="example, idx in def.examples" v-bind:key="idx">
                            <b>Example:</b> {{ example }}
                        </div>
                    </div>
                    <button 
                        class="btn-floating btn-large waves-effect waves-light green lighten-1"
                        @click="done">
                        <i class="material-icons">done</i>
                    </button>
                </div>
            </div>

            <div class="container" v-else>
                <button 
                    class="blue lighten-1 waves-effect waves-light btn-large" 
                    @click="restart">
                    Restart
                </button>
            </div>
        </main>
    </div>
</template>

<script>
    import axios from 'axios'
    import { CLIENT_URL } from '../constants.js'

    export default {
        name: 'app',
        data () {
            return {
                currentIndex: 0,
                flashcards: [],
                card: "",
                show: false,
                colors: ['#673ab7', '#2196f3', '#26a69a', '#e91e63']
            }
        },
        mounted () {
            axios.get(`${CLIENT_URL}/api/words`)
                .then(response => this.flashcards = response.data)
                .catch(err => console.log(err))
            window.addEventListener('keyup', (event) => {
                if (event.keyCode === 13) this.next()
            })
        },
        methods: {
            submit: function () {
                event.preventDefault()
                axios.post(`${CLIENT_URL}/api/words`, { word: this.card })
                     .then(response => this.flashcards = response.data)
                     .catch(err => console.log(err))
                this.card = ""
            },
            next: function () {
                if (this.show) this.currentIndex ++
                this.show = !this.show
            },
            restart: function () {
                this.currentIndex = 0
            },
            done: function () {
                let cardId = this.flashcards[this.currentIndex]._id
                axios.put(`${CLIENT_URL }/api/words/${cardId}/done`)
                     .then(response => console.log(res))
                     .catch(err => console.log(err))
                this.next()
            }
        }
    }   
</script>

<style lang="scss" scoped>
    .card {
        color: white;
        padding: 10px;
    }
    
    button {
        margin-top: 50px;
    }
</style>
