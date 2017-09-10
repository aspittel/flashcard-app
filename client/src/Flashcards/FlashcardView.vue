<template>
    <div>
        <nav>
            <div class="nav-wrapper red lighten-1">
                <a href="#" class="brand-logo left">Study</a>
                <div class="left hide-on-med-and-down">{{ flashcards.length }} cards</div>
                <new-flashcard></new-flashcard>
            </div>
        </nav>

        <main>
            <div class="container" v-if="flashcards[currentIndex]">
                <flashcard-detail 
                    :flashcard="flashcards[currentIndex]"
                    :show="show"
                    >
                </flashcard-detail>
                <button 
                    class="btn-floating btn-large waves-effect waves-light green lighten-1"
                    @click="done">
                    <i class="material-icons">done</i>
                </button>
            </div>

            <div class="container" v-else>
                <button 
                    v-if="show"
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
    import NewFlashcard from './NewFlashcard.vue'
    import FlashcardDetail from './FlashcardDetail.vue'

    export default {
        name: 'app',
        data () {
            return {
                currentIndex: 0,
                flashcards: [],
                show: false,
                colors: ['#673ab7', '#2196f3', '#26a69a', '#e91e63']
            }
        },
        mounted () {
            axios.get(`${CLIENT_URL}/api/words`)
                .then(response => this.flashcards = response.data)
                .catch(err => console.log(err))
            
            window.addEventListener('keyup', (event) => {
                // move to next card on right arrow
                if (event.keyCode === 39) this.next()
            })
        },
        components: {
            NewFlashcard,
            FlashcardDetail
        },
        methods: {
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
