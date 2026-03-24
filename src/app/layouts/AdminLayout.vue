<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/entities/user'

const store = useUserStore()
const route = useRoute()

function isActive(path: string) {
  return route.path.startsWith(path)
}

const userInitials = computed(() => {
  const u = store.user
  if (!u) return 'A'
  return ((u.first_name?.[0] ?? '') + (u.last_name?.[0] ?? '')).toUpperCase() || 'A'
})
</script>

<template>
  <div class="admin-shell">
    <aside class="admin-nav">
      <div class="admin-nav__brand">
        <span class="admin-nav__logo">M</span>
        <span class="admin-nav__title">Marketplace</span>
      </div>

      <nav class="admin-nav__menu">
        <p class="admin-nav__section-label">Управление</p>

        <RouterLink
          to="/admin/dashboard"
          :class="['admin-nav__link', { 'admin-nav__link--active': isActive('/admin/dashboard') }]"
        >
          <span class="admin-nav__link-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
          </span>
          <span>Дашборд</span>
        </RouterLink>

        <RouterLink
          to="/admin/products"
          :class="['admin-nav__link', { 'admin-nav__link--active': isActive('/admin/products') }]"
        >
          <span class="admin-nav__link-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </span>
          <span>Товары</span>
        </RouterLink>

        <RouterLink
          to="/admin/sellers"
          :class="['admin-nav__link', { 'admin-nav__link--active': isActive('/admin/sellers') }]"
        >
          <span class="admin-nav__link-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </span>
          <span>Продавцы</span>
        </RouterLink>
      </nav>

      <div class="admin-nav__user">
        <div class="admin-nav__avatar">{{ userInitials }}</div>
        <div class="admin-nav__user-info">
          <span class="admin-nav__user-name">{{ store.user?.first_name }} {{ store.user?.last_name }}</span>
          <span class="admin-nav__user-role">Администратор</span>
        </div>
        <RouterLink to="/admin/login" class="admin-nav__logout" title="Выйти" @click="store.logout()">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </RouterLink>
      </div>
    </aside>

    <div class="admin-content">
      <header class="admin-topbar">
        <div class="admin-topbar__breadcrumb">
          <span
            v-for="(seg, i) in route.matched.filter(r => r.name)"
            :key="i"
            class="admin-topbar__crumb"
          >
            <span v-if="i > 0" class="admin-topbar__sep">/</span>
            {{ seg.name?.toString().replace('admin-', '').replace('-', ' ') }}
          </span>
        </div>
        <RouterLink to="/" class="admin-topbar__site-link" target="_blank">
          ← На сайт
        </RouterLink>
      </header>

      <main class="admin-main">
        <RouterView />
      </main>
    </div>
  </div>
</template>
