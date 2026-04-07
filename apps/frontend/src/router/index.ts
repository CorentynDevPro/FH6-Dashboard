import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/pages/HomePage.vue'),
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/pages/DashboardPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'garage',
        name: 'garage',
        component: () => import('@/pages/GaragePage.vue'),
      },
      {
        path: 'garage/:id',
        name: 'car-detail',
        component: () => import('@/pages/CarDetailPage.vue'),
      },
      {
        path: 'community',
        name: 'community',
        component: () => import('@/pages/CommunityPage.vue'),
      },
      {
        path: 'leaderboard',
        name: 'leaderboard',
        component: () => import('@/pages/LeaderboardPage.vue'),
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/pages/ProfilePage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'profile/:id',
        name: 'user-profile',
        component: () => import('@/pages/ProfilePage.vue'),
      },
    ],
  },
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/pages/auth/LoginPage.vue'),
        meta: { guestOnly: true },
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/pages/auth/RegisterPage.vue'),
        meta: { guestOnly: true },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return next({ name: 'login', query: { redirect: to.fullPath } });
  }

  if (to.meta.guestOnly && authStore.isLoggedIn) {
    return next({ name: 'dashboard' });
  }

  next();
});

export default router;
