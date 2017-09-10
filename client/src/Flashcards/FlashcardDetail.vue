<template>
    <div>
        <h1>{{ flashcard.word }}</h1>
        <div v-if="show">
            <div v-for="def, idx in flashcard.definitions"
                 v-bind:key="def._id"
                 class="card"
                 v-bind:style="{ backgroundColor: colors[idx] }">
                <h5>Definition {{ idx + 1 }}: </h5>
                <p>{{ def.definitions[0] }}</p>
                <p v-if="def.etymologies[0]">
                    <b>Etymology:</b> {{ def.etymologies[0] }}</p>
                <p>
                    <b>Part of Speech:</b> {{ def.lexicalCategory }}
                </p>
                <div v-for="example, idx in def.examples" v-bind:key="idx">
                    <b>Example:</b> {{ example }}
                </div>
            </div>
        </div>
    </div>

</template>

<script>
export default {
    props: ['flashcard', 'show']
}
</script>
