<template>
  <iframe :src="src" frameborder="0" width="100%" height="100%"></iframe>
</template>

<script lang="ts">
  export default {
    props: {
      src: {
        type: String,
        required: true,
      },
    },
  };
</script>
