import { createRouter, createWebHashHistory } from 'vue-router'
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

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: Dashboard },
    {
      path: '/academy',
      component: Academy,
      children: [
        { path: '', component: LearningCenter },
        { path: 'lesson/:id', component: LearningCenter },
        { path: 'knowledge', component: KnowledgeBase },
        { path: 'live', component: () => import('../views/AcademyLive.vue') },
        { path: 'resources', component: () => import('../views/AcademyResources.vue') },
      ]
    },
    { path: '/lab', component: OptionsLab },
    { path: '/strategies', component: StrategyLibrary },
    { path: '/glossary', component: Glossary },
    { path: '/calculator', component: RetirementCalculator },
    { path: '/assignments', component: Assignments },
    { path: '/ai', component: AIAssistant },
  ]
})

export default router
