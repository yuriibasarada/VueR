<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{ 'Create' | localize }}</h4>
      </div>

      <form @submit.prevent="submitHandler">
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
          {{ 'Create' | localize }}
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
  data: () => ({
    name: '',
    limit: 100
  }),
  validations: {
    name: { required },
    limit: { minValue: minValue(100) }
  },
  mounted() {
    M.updateTextFields()
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      try {
        const category = await this.$store.dispatch('createCategory', {
          name: this.name,
          limit: this.limit
        })
        this.name = ''
        this.limit = 100
        this.$v.$reset()
        this.$message(localizeFilter('CategoryWasBeenCreated'))
        this.$emit('created', category)
      } catch (e) {}
    }
  }
}
</script>
