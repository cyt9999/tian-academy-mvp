/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@/stores/auth' {
  import { StoreDefinition } from 'pinia'
  const useAuthStore: StoreDefinition
  export default useAuthStore
}

declare module '@/stores/token' {
  import { StoreDefinition } from 'pinia'
  const useTokenStore: StoreDefinition
  export default useTokenStore
}

declare module '@/plugins/oidc/config' {
  const config: Record<string, any>
  export default config
}

declare module '@/plugins/oidc/checkUserToken' {
  const checkUserToken: () => Promise<void>
  export default checkUserToken
}

declare module '@/plugins/axios' {
  const api: {
    POST: (url: string, params?: any, config?: any) => Promise<any>
    GET: (url: string, params?: any, config?: any) => Promise<any>
    PUT: (url: string, params?: any, config?: any) => Promise<any>
    DELETE: (url: string, params?: any, config?: any) => Promise<any>
  }
  export default api
}

declare module '@/plugins/axios/instance' {
  import { AxiosInstance } from 'axios'
  const instance: AxiosInstance
  export default instance
}

declare module '@/composables/profile/member' {
  import { UnwrapNestedRefs } from 'vue'
  const member: {
    state: UnwrapNestedRefs<{
      data: any
      hasLoading: boolean
      error: string | null
    }>
    setInit: () => Promise<void>
  }
  export default member
}
