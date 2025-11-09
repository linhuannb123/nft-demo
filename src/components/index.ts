import type { App } from 'vue'
import Header from './Header.vue'

const components: Record<string, any> = {
  'a-header': Header,
}

export function registerCommonComponent(app: App<Element>): void {
  Object.keys(components).forEach((name) => {
    app.component(name, components[name])
  })
}
