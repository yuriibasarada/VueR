<template>
  <div>
    <div class="page-title">
      <h3>{{ 'Categories' | localize }}</h3>
    </div>
    <section>
      <Loader v-if="loading" />
      <div class="row" v-else>
        <Create @created="addNewCategory" />

        <Edit
          v-if="categories.length"
          :categories="categories"
          :key="categories.lenth + updateCount"
          @updated="updateCategories"
        />
        <p v-else class="center">{{ 'NotFoundCategory' }}</p>
      </div>
    </section>
  </div>
</template>

<script>
import Create from '@/components/category/Create'
import Edit from '@/components/category/Edit'
export default {
  name: 'categories',
  metaInfo() {
    return {
      title: this.$title('Categories')
    }
  },
  data: () => ({
    categories: [],
    loading: true,
    updateCount: 0
  }),
  async mounted() {
    this.categories = await this.$store.dispatch('fetchCategories')
    this.loading = false
  },
  components: {
    Create,
    Edit
  },
  methods: {
    addNewCategory(category) {
      this.categories.push(category)
    },
    updateCategories(category) {
      const id = this.categories.findIndex(c => c.id === category.id)
      this.categories[id].name = category.name
      this.categories[id].limit = category.limit
      this.updateCount++
    }
  }
}
</script>
