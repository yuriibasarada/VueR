<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{ 'Edit' | localize }}</h4>
      </div>

      <form @submit.prevent="submitHandler">
        <div class="input-field">
          <select ref="select" v-model="current">
            <option v-for="c of categories" :key="c.id" :value="c.id">{{
              c.name
            }}</option>
          </select>
          <label>{{ 'SelectCategory' | localize }}</label>
        </div>

        <div class="input-field">
          <input
            id="name"
            type="text"
            v-model="name"
            :class="{ invalid: $v.name.$dirty && !$v.name.required }"
          />
          <label for="name">{{ 'Title' | localize }}</label>
          <span
            v-if="$v.name.$dirty && !$v.name.required"
            class="helper-text invalid"
            >{{ 'EnterCategoryName' | localize }}</span
          >
        </div>

        <div class="input-field">
          <input
            id="limit"
            type="number"
            v-model.number="limit"
            :class="{ invalid: $v.limit.$dirty && !$v.limit.minValue }"
          />
          <label for="limit">{{ 'Limit' | localize }}</label>
          <span
            v-if="$v.limit.$dirty && !$v.limit.minValue"
            class="helper-text invalid"
            >{{ 'MinValue' | localize }}
            {{ $v.limit.$params.minValue.min }}</span
          >
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          {{ 'Update' }}
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { required, minValue } from 'vuelidate/lib/validators'
import localizeFilter from '@/filters/localize.filter'
export default {
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    name: '',
    limit: 100,
    seelct: null,
    current: null
  }),
  validations: {
    name: { required },
    limit: { minValue: minValue(100) }
  },
  watch: {
    current(catId) {
      const { name, limit } = this.categories.find(c => c.id === catId)
      ;(this.name = name), (this.limit = limit)
    }
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      try {
        const categoryData = {
          id: this.current,
          name: this.name,
          limit: this.limit
        }
        await this.$store.dispatch('updateCategory', categoryData)
        this.$message(localizeFilter('CategoryWasBeenUpdated'))
        this.$emit('updated', categoryData)
      } catch (e) {}
    }
  },
  created() {
    const { id, name, limit } = this.categories[0]
    ;(this.current = id), (this.name = name), (this.limit = limit)
  },
  mounted() {
    M.updateTextFields()
    this.select = M.FormSelect.init(this.$refs.select)
  },
  destroyed() {
    if (this.select && this.select.destroyed) {
      this.select.destroy()
    }
  }
}
</script>
