<template>
  <div class="grey darken-1 empty-layout">
    <router-view />
  </div>
</template>

<script>
import messages from '@/utils/messages'
import localizeFilter from '@/filters/localize.filter'
export default {
  computed: {
    error() {
      return this.$store.getters.error
    }
  },
  watch: {
    error(ServerError) {
      this.$error(messages[ServerError] || localizeFilter('SomethingWentWrong'))
    }
  }
}
</script>
