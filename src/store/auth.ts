import { defineStore } from 'pinia'
interface AuthState {
  currentAccount: string
}
const useAuthStore = defineStore('auth', {
  state: (): AuthState => {
    return {
      currentAccount: '',
    }
  },
  actions: {
    setAuth(value: string) {
      this.currentAccount = value
    },
  },
})

export default useAuthStore
