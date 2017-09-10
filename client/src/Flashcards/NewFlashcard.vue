<template>
    <div class="input-field right">
        <input v-model="card" @keyup.enter="submit" id="new-card" placeholder="add word">
    </div>
</template>

<script>
import axios from 'axios'
import { CLIENT_URL } from '../constants.js'

export default {
    data () {
        return { card: "" }
    },
    methods: {
        submit: function () {
            event.preventDefault()
            axios.post(`${CLIENT_URL}/api/words`, { word: this.card })
                .then(response => this.flashcards = response.data)
                .catch(err => console.log(err))
            this.card = ""
        }
    }
}
</script>
