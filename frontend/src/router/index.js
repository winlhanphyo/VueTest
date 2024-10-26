import { createRouter, createWebHistory } from 'vue-router';
import SlotMachine from '@/components/SlotMachine.vue';
import LeaderBoard from '@/components/LeaderBoard.vue';

const routes = [
  { path: '/', name: 'SlotMachine', component: SlotMachine },
  { path: '/leaderboard', name: 'LeaderBoard', component: LeaderBoard },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
