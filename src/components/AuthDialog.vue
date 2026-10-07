<template>
  <v-dialog v-model="isOpen" max-width="440">
    <v-card rounded="lg">
      <v-card-title class="d-flex align-center pt-4">
        <span class="text-h6 font-weight-bold">Tu cuenta ModaUno</span>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" aria-label="Cerrar" @click="CLOSE_DIALOG" />
      </v-card-title>

      <v-tabs :model-value="tab" grow @update:model-value="onTabChange">
        <v-tab value="register" data-test="auth-tab-register">Crear cuenta</v-tab>
        <v-tab value="login" data-test="auth-tab-login">Ingresar</v-tab>
      </v-tabs>

      <v-card-text class="pt-6">
        <v-form ref="form" @submit.prevent="submit">
          <v-text-field
            v-if="isRegister"
            v-model="name"
            data-test="auth-name"
            label="Nombre"
            :rules="nameRules"
            autocomplete="name"
            variant="outlined"
          />
          <v-text-field
            v-model="email"
            label="Correo electrónico"
            data-test="auth-email"
            type="email"
            :rules="emailRules"
            autocomplete="email"
            variant="outlined"
          />
          <v-text-field
            v-model="password"
            label="Contraseña"
            data-test="auth-password"
            :type="showPassword ? 'text' : 'password'"
            :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
            :rules="passwordRules"
            :autocomplete="isRegister ? 'new-password' : 'current-password'"
            variant="outlined"
            @click:append-inner="showPassword = !showPassword"
          />

          <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mb-4" data-test="auth-error">
            {{ error }}
          </v-alert>

          <v-btn type="submit" color="primary" size="large" block :loading="loading" data-test="auth-submit">
            {{ isRegister ? 'Crear cuenta' : 'Ingresar' }}
          </v-btn>
        </v-form>

        <v-divider class="my-4" />
        <p class="text-subtitle-2 mb-2">Cuentas de prueba</p>
        <div class="demo-buttons">
          <v-btn
            v-for="demo in demoUsers"
            :key="demo.email"
            variant="tonal"
            size="small"
            prepend-icon="mdi-account-check-outline"
            :data-test="demo.role === 'admin' ? 'demo-admin-btn' : 'demo-customer-btn'"
            @click="loginAsDemo(demo)"
          >
            {{ demo.name }}
          </v-btn>
        </div>
        <p class="text-caption text-medium-emphasis mt-2">
          cliente@modauno.cl / Demo1234 · admin@modauno.cl / Admin1234
        </p>
        <p class="text-caption text-medium-emphasis mt-4">
          Proyecto de práctica: los datos se guardan solo en este navegador.
        </p>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { DEMO_USERS } from '@/utils/demoData'

export default {
  name: 'AuthDialog',
  data () {
    return {
      name: '',
      email: '',
      password: '',
      showPassword: false,
      demoUsers: DEMO_USERS,
      loading: false,
      error: '',
      nameRules: [(value) => (value && value.trim().length >= 2) || 'Escribe tu nombre'],
      emailRules: [(value) => /.+@.+\..+/.test(value || '') || 'Escribe un correo válido'],
      passwordRules: [(value) => (value && value.length >= 6) || 'Mínimo 6 caracteres']
    }
  },
  computed: {
    ...mapState('auth', ['dialog', 'tab']),
    isRegister () {
      return this.tab === 'register'
    },
    isOpen: {
      get () {
        return this.dialog
      },
      set (value) {
        if (!value) this.CLOSE_DIALOG()
      }
    }
  },
  watch: {
    dialog (isOpen) {
      if (isOpen) this.error = ''
    }
  },
  methods: {
    ...mapMutations('auth', ['CLOSE_DIALOG', 'SET_TAB']),
    ...mapActions('auth', ['register', 'login']),
    onTabChange (value) {
      this.error = ''
      this.SET_TAB(value)
    },
    // Rellena el formulario con la cuenta de prueba y entra de inmediato
    async loginAsDemo (demo) {
      this.SET_TAB('login')
      this.email = demo.email
      this.password = demo.password
      await this.$nextTick()
      await this.submit()
    },
    async submit () {
      const { valid } = await this.$refs.form.validate()
      if (!valid) return

      this.loading = true
      this.error = ''
      try {
        if (this.isRegister) {
          await this.register({ name: this.name, email: this.email, password: this.password })
        } else {
          await this.login({ email: this.email, password: this.password })
        }
        this.name = ''
        this.email = ''
        this.password = ''
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.demo-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
