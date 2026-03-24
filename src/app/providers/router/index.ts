import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/entities/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Public layout
    {
      path: '/',
      component: () => import('@/app/layouts/DefaultLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/pages/home').then((m) => m.HomePage),
        },
        {
          path: 'products/:id',
          name: 'product',
          component: () => import('@/pages/product').then((m) => m.ProductPage),
        },
      ],
    },
    // Guest routes
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/login').then((m) => m.LoginPage),
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/pages/register').then((m) => m.RegisterPage),
      meta: { guestOnly: true },
    },
    // Admin layout
    {
      path: '/admin',
      component: () => import('@/app/layouts/AdminLayout.vue'),
      meta: { requiresAdmin: true },
      children: [
        {
          path: '',
          redirect: '/admin/dashboard',
        },
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('@/pages/admin/dashboard').then((m) => m.AdminDashboardPage),
        },
        {
          path: 'products',
          name: 'admin-products',
          component: () => import('@/pages/admin/products').then((m) => m.AdminProductsPage),
        },
        {
          path: 'products/new',
          name: 'admin-product-new',
          component: () => import('@/pages/admin/product-edit').then((m) => m.AdminProductEditPage),
        },
        {
          path: 'products/:id/edit',
          name: 'admin-product-edit',
          component: () => import('@/pages/admin/product-edit').then((m) => m.AdminProductEditPage),
        },
        {
          path: 'sellers',
          name: 'admin-sellers',
          component: () => import('@/pages/admin/sellers').then((m) => m.AdminSellersPage),
        },
      ],
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/pages/admin/login').then((m) => m.AdminLoginPage),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/not-found').then((m) => m.NotFoundPage),
    },
  ],
})

router.beforeEach(async (to) => {
  const store = useUserStore()

  // Restore session on any route if token exists but user not loaded
  if (store.token && !store.user) {
    try { await store.fetchMe() } catch { store.logout() }
  }

  if (to.meta.guestOnly && store.isAuthenticated) return '/'
  if (to.meta.requiresAdmin) {
    if (!store.isAuthenticated) return '/admin/login'
    if (!store.isAdmin) return '/'
  }
})

export default router
