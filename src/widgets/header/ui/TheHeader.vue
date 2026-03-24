<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/entities/user'
import { LogoutButton } from '@/features/auth/logout'
import { LayoutGrid, User, LogIn, Menu, X } from 'lucide-vue-next'

const store = useUserStore()
const mobileOpen = ref(false)

function closeMenu() {
  mobileOpen.value = false
}
</script>

<template>
  <nav class="topnav">
    <RouterLink to="/" class="topnav-brand" @click="closeMenu">
      <span class="topnav-logo">M</span>
      <span class="topnav-name">Marketplace</span>
    </RouterLink>

    <div v-if="store.isAdmin" class="topnav-links">
      <RouterLink to="/admin/products" class="topnav-link" @click="closeMenu">
        <LayoutGrid :size="16" />
        Панель управления
      </RouterLink>
    </div>

    <div class="topnav-right topnav-right--desktop">
      <template v-if="store.isAuthenticated">
        <span class="topnav-user">
          <User :size="15" />
          {{ store.user?.email }}
        </span>
        <LogoutButton />
      </template>
      <template v-else>
        <RouterLink to="/admin/login" class="nav-btn nav-btn--ghost">
          <LogIn :size="15" />
          Войти
        </RouterLink>
      </template>
    </div>

    <button
      class="topnav-burger"
      :aria-label="mobileOpen ? 'Закрыть меню' : 'Открыть меню'"
      :aria-expanded="mobileOpen"
      @click="mobileOpen = !mobileOpen"
    >
      <X v-if="mobileOpen" :size="22" />
      <Menu v-else :size="22" />
    </button>

    <div :class="['topnav-mobile', { 'topnav-mobile--open': mobileOpen }]">
      <template v-if="store.isAdmin">
        <RouterLink to="/admin/products" class="topnav-link" @click="closeMenu">
          <LayoutGrid :size="16" />
          Панель управления
        </RouterLink>
      </template>

      <template v-if="store.isAuthenticated">
        <span class="topnav-user">
          <User :size="15" />
          {{ store.user?.email }}
        </span>
        <LogoutButton @click="closeMenu" />
      </template>
      <template v-else>
        <RouterLink to="/admin/login" class="nav-btn nav-btn--ghost" @click="closeMenu">
          <LogIn :size="15" />
          Войти
        </RouterLink>
      </template>
    </div>
  </nav>
</template>

<style scoped>
.topnav-burger {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  padding: 4px;
}

.topnav-mobile {
  display: none;
}

@media (max-width: 640px) {
  .topnav-right--desktop {
    display: none;
  }

  .topnav-burger {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .topnav-mobile {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--color-surface, #fff);
    border-top: 1px solid var(--color-border, #e5e7eb);
    padding: 12px 16px;
    display: none;
    flex-direction: column;
    gap: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    z-index: 100;
  }

  .topnav-mobile--open {
    display: flex;
  }
}
</style>
