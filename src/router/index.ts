import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Academy from '../views/Academy.vue'
import LearningCenter from '../views/LearningCenter.vue'
import KnowledgeBase from '../views/KnowledgeBase.vue'
import OptionsLab from '../views/OptionsLab.vue'
import RetirementCalculator from '../views/RetirementCalculator.vue'
import Assignments from '../views/Assignments.vue'
import AIAssistant from '../views/AIAssistant.vue'
import Glossary from '../views/Glossary.vue'
import StrategyLibrary from '../views/StrategyLibrary.vue'
import useTokenStore from '@/stores/token'
import checkUserToken from '@/plugins/oidc/checkUserToken'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: [
    // App routes (auth required)
    { path: '/', component: Dashboard, meta: { requiresAuth: true } },
    {
      path: '/academy',
      component: Academy,
      meta: { requiresAuth: true },
      children: [
        { path: '', component: LearningCenter },
        { path: 'lesson/:id', component: LearningCenter },
        { path: 'knowledge', component: KnowledgeBase },
        { path: 'live', component: () => import('../views/AcademyLive.vue') },
        { path: 'resources', component: () => import('../views/AcademyResources.vue') },
      ]
    },
    { path: '/lab', component: OptionsLab, meta: { requiresAuth: true } },
    { path: '/strategies', component: StrategyLibrary, meta: { requiresAuth: true } },
    { path: '/glossary', component: Glossary, meta: { requiresAuth: true } },
    { path: '/calculator', component: RetirementCalculator, meta: { requiresAuth: true } },
    { path: '/assignments', component: Assignments, meta: { requiresAuth: true } },
    { path: '/ai', component: AIAssistant, meta: { requiresAuth: true } },

    // Auth routes (no auth required)
    {
      path: '/login',
      component: () => import('../views/auth/Login.vue'),
    },
    {
      path: '/logout',
      component: () => import('../views/auth/Logout.vue'),
    },
    {
      path: '/renew',
      component: () => import('../views/auth/Renew.vue'),
    },
  ]
})

router.beforeEach(async (to, from, next) => {
  const tokenStore = useTokenStore()

  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('cmToken')

    if (token) {
      await checkUserToken()
      next()
    } else {
      tokenStore.loginRedirectUnityPage()
    }
  } else {
    next()
  }
})

export default router
