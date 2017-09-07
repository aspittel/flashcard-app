<template>
  <div id="app">
    <router-view></router-view> 
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
    }
  }
}
</script>

<style lang="scss">
  body {
    text-align: center;
  }
  
  ::-webkit-input-placeholder {
    /* WebKit, Blink, Edge */
    color: white;
  }

  :-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: white;
    opacity: 1;
  }

  ::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: white;
    opacity: 1;
  }

  :-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: white;
  }

  ::-ms-input-placeholder {
    /* Microsoft Edge */
    color: white;
  }

</style>
