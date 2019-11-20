<template>
  <div>
    <div class="page-title">
      <h3>{{ 'Planning' | localize }}</h3>
      <h4>{{ info.bill | currency('RUB') }}</h4>
    </div>

    <Loader v-if="loading" />
    <p class="center" v-else-if="!categories.length">
      {{ 'NotFoundCategory' | localize }}
      <router-link to="/categories">{{
        'AddNewCategory' | localize
      }}</router-link>
    </p>
    <section v-else>
      <div v-for="cat in categories" :key="cat.id">
        <p>
          <strong>{{ cat.name }}</strong>
          {{ cat.spend | currency }} {{ 'of' | localize }}
          {{ cat.limit | currency }}
        </p>
        <div class="progress" v-tooltip.noloc="cat.tooltip">
          <div
            class="determinate"
            :style="{ width: cat.progressPercent + '%' }"
            :class="[cat.progressColor]"
          ></div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import currencyFilter from '@/filters/currency.filter'
import localizeFilter from '@/filters/localize.filter'
export default {
  name: 'planning',
  metaInfo() {
    return {
      title: this.$title('Planning')
    }
  },
  data: () => ({
    loading: true,
    categories: []
  }),
  computed: {
    ...mapGetters(['info'])
  },
  async mounted() {
    const categories = await this.$store.dispatch('fetchCategories')
    const records = await this.$store.dispatch('fetchRecords')

    this.categories = categories.map(cat => {
      const spend = records
        .filter(r => r.categoryId === cat.id)
        .filter(r => r.typeId === 2)
        .reduce((total, record) => {
          return (total += +record.amount)
        }, 0)

      const percent = (100 * spend) / cat.limit
      const progressPercent = percent > 100 ? 100 : percent
      const progressColor =
        percent < 60 ? 'green' : percent < 100 ? 'yellow' : 'red'

      const tooltipValue = cat.limit - spend
      const tooltip = `${
        tooltipValue < 0 ? localizeFilter('ExcessOn') : localizeFilter('Left')
      } ${currencyFilter(Math.abs(tooltipValue))}`

      return {
        ...cat,
        progressPercent,
        progressColor,
        spend,
        tooltip
      }
    })

    this.loading = false
  }
}
</script>
