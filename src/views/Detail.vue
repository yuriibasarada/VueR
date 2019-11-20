<template>
  <div>
    <Loader v-if="loading" />
    <div v-else-if="record">
      <div class="breadcrumb-wrap">
        <router-link to="/history" class="breadcrumb">{{
          'History' | localize
        }}</router-link>
        <a class="breadcrumb" @click.prevent>
          {{ record.recordType }}
        </a>
      </div>
      <div class="row">
        <div class="col s12 m6">
          <div class="card" :class="[record.recordClass]">
            <div class="card-content white-text">
              <p>{{ 'Description' | localize }}: {{ record.description }}</p>
              <p>{{ 'Sum' | localize }}: {{ record.amount | currency }}</p>
              <p>{{ 'Category' | localize }}: {{ record.categoryName }}</p>

              <small>{{ record.date | date('datetime') }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p class="center" v-else>
      {{ 'RecordWithId' | localize }}={{ $route.params.id }}
      {{ 'NotFound' | localize }}
    </p>
  </div>
</template>
<script>
import localizeFilter from '@/filters/localize.filter'
export default {
  name: 'deatail',
  metaInfo() {
    return {
      title: this.$title('Detail')
    }
  },
  data: () => ({
    record: null,
    loading: true
  }),
  async mounted() {
    const id = this.$route.params.id
    const record = await this.$store.dispatch('fetchRecordById', id)
    const category = await this.$store.dispatch(
      'fetchCategoryById',
      record.categoryId
    )

    this.record = {
      ...record,
      categoryName: category.name,
      recordClass: record.typeId === 1 ? 'green' : 'red',
      recordType:
        record.typeId === 1
          ? localizeFilter('Income')
          : localizeFilter('Outcome')
    }

    this.loading = false
  }
}
</script>
