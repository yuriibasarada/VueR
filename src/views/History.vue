<template>
  <div>
    <div class="page-title">
      <h3>{{ 'RecordsHistory' | localize }}</h3>
    </div>

    <div class="history-chart">
      <canvas ref="canvas"></canvas>
    </div>
    <Loader v-if="loading" />
    <p class="center" v-else-if="!records.length">
      {{ 'RecordNotFound' | localize }}
      <router-link to="/record">{{ 'AddNewRecord' | localize }}</router-link>
    </p>
    <section v-else>
      <Table :records="items" />

      <Paginate
        v-model="page"
        :page-count="pageCount"
        :click-handler="pageChangeHandler"
        :prev-text="'Prev' | localize"
        :next-text="'Next' | localize"
        :container-class="'pagination'"
        :page-class="'waves-effect'"
      />
    </section>
  </div>
</template>
<script>
import Table from '@/components/history/Table'
import paginationMixin from '@/mixins/pagination.mixin'
import { Pie } from 'vue-chartjs'
import localizeFilter from '@/filters/localize.filter'

export default {
  name: 'history',
  metaInfo() {
    return {
      title: this.$title('History')
    }
  },
  extends: Pie,
  mixins: [paginationMixin],
  data: () => ({
    loading: true,
    records: []
  }),
  async mounted() {
    this.records = await this.$store.dispatch('fetchRecords')
    const categories = await this.$store.dispatch('fetchCategories')
    this.setup(categories)
    this.loading = false
  },
  methods: {
    setup(categories) {
      this.setupPagination(
        this.records.map(record => {
          return {
            ...record,
            categoryName: categories.find(c => c.id === record.categoryId).name,
            typeClass: record.typeId === 1 ? 'green' : 'red',
            typeText:
              record.typeId === 1
                ? localizeFilter('Outcome')
                : localizeFilter('Income')
          }
        })
      )
      this.renderChart({
        labels: categories.map(c => c.name),
        datasets: [
          {
            label: localizeFilter('CostsByCategory'),
            data: categories.map(c => {
              return this.records.reduce((total, r) => {
                if (r.categoryId === c.id && r.typeId === 2) {
                  total += +r.amount
                }
                return total
              }, 0)
            }),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }
        ]
      })
    }
  },
  components: {
    Table
  }
}
</script>
