<template>
  <div>
    <div class="page-title">
      <h3>{{ 'NewRecord' | localize }}</h3>
    </div>

    <Loader v-if="loading" />

    <p class="center" v-else-if="!categories.length">
      {{ 'NotFoundCategory' | localize }}
      <router-link to="/categories">{{
        'AddNewRecord' | localize
      }}</router-link>
    </p>

    <form class="form" v-else @submit.prevent="handlerSubmit">
      <div class="input-field">
        <select ref="select" v-model="category">
          <option v-for="c in categories" :key="c.id" :value="c.id">{{
            c.name
          }}</option>
        </select>
        <label>{{ 'SelectCategory' | localize }}</label>
      </div>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="income"
            v-model="type"
          />
          <span>{{ 'Income' | localize }}</span>
        </label>
      </p>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="outcome"
            v-model="type"
          />
          <span>{{ 'Outcome' | localize }}</span>
        </label>
      </p>

      <div class="input-field">
        <input
          id="amount"
          type="number"
          v-model.number="amount"
          :class="{ invalid: $v.amount.$dirty && !$v.amount.minValue }"
        />
        <label for="amount">{{ 'Sum' | localize }}</label>
        <span
          v-if="$v.amount.$dirty && !$v.amount.minValue"
          class="helper-text invalid"
          >{{ 'MinValue' | localize }}
          {{ $v.amount.$params.minValue.min }}</span
        >
      </div>

      <div class="input-field">
        <input
          id="description"
          type="text"
          v-model="description"
          :class="{
            invalid: $v.description.$dirty && !$v.description.required
          }"
        />
        <label for="description">{{ 'Description' | localize }}</label>
        <span
          v-if="$v.description.$dirty && !$v.description.required"
          class="helper-text invalid"
          >{{ 'EnterDescription' | localize }}</span
        >
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{ 'Create' | localize }}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import { required, minValue } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'
import localizeFilter from '@/filters/localize.filter'
export default {
  name: 'record',
  metaInfo() {
    return {
      title: this.$title('NewRecord')
    }
  },
  data: () => ({
    loading: true,
    select: null,
    categories: [],
    category: null,
    type: 'outcome',
    amount: 1,
    description: ''
  }),
  validations: {
    amount: { minValue: minValue(1) },
    description: { required }
  },
  async mounted() {
    this.categories = await this.$store.dispatch('fetchCategories')
    this.loading = false

    if (this.categories.length) {
      this.category = this.categories[0].id
    }
    setTimeout(() => {
      this.select = M.FormSelect.init(this.$refs.select)
      M.updateTextFields()
    }, 0)
  },
  computed: {
    ...mapGetters(['info']),
    canCreateRecord() {
      if (this.type === 'income') {
        return true
      }

      return this.info.bill >= this.amount
    }
  },
  methods: {
    async handlerSubmit() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      if (this.canCreateRecord) {
        try {
          await this.$store.dispatch('createRecord', {
            category_id: this.category,
            amount: this.amount,
            description: this.description,
            type_id: this.type === 'income' ? 1 : 2,
            date: new Date()
              .toJSON()
              .slice(0, 19)
              .replace('T', ' ')
          })

          const bill =
            this.type === 'income'
              ? this.info.bill + this.amount
              : this.info.bill - this.amount

          await this.$store.dispatch('updateInfo', { bill })
          this.$message(localizeFilter('RecordCreatedSuccessfully'))
          this.$v.$reset()
          ;(this.amount = 1), (this.description = '')
        } catch (e) {}
      } else {
        this.$message(
          `${localizeFilter('InsufficientFundsInAccount')} (${this.amount -
            this.info.bill})`
        )
      }
    }
  },
  destroyed() {
    if (this.select && this.select.destroyed) {
      this.select.destroy()
    }
  }
}
</script>
