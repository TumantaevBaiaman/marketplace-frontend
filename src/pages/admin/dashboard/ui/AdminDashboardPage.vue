<script setup lang="ts">
import { useAdminDashboard } from '@/features/admin/dashboard'
import { AppLoader } from '@/shared/ui'

const { stats, recentProducts, loading } = useAdminDashboard()
</script>

<template>
  <div class="admin-page">
    <div class="admin-page__header">
      <h1 class="admin-page__title">Дашборд</h1>
    </div>

    <AppLoader v-if="loading" />

    <template v-else>
      <div class="stat-grid">
        <div class="stat-card stat-card--blue">
          <div class="stat-card__icon">📦</div>
          <div class="stat-card__body">
            <p class="stat-card__label">Всего товаров</p>
            <p class="stat-card__value">{{ stats.products }}</p>
          </div>
        </div>
        <div class="stat-card stat-card--green">
          <div class="stat-card__icon">✓</div>
          <div class="stat-card__body">
            <p class="stat-card__label">Продавцов</p>
            <p class="stat-card__value">{{ stats.sellers }}</p>
          </div>
        </div>
      </div>

      <div class="admin-card">
        <div class="admin-card__header">
          <h2 class="admin-card__title">Последние товары</h2>
          <RouterLink to="/admin/products" class="admin-card__link">Все товары →</RouterLink>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Фото</th>
              <th>Название</th>
              <th>Цена</th>
              <th>Остаток</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in recentProducts" :key="p.id">
              <td>
                <img v-if="p.thumbnail_url" :src="p.thumbnail_url" :alt="p.name" class="data-table__thumb" />
                <div v-else class="data-table__no-img">—</div>
              </td>
              <td>
                <RouterLink :to="`/admin/products/${p.id}/edit`" class="data-table__link">
                  {{ p.name }}
                </RouterLink>
              </td>
              <td>{{ p.price?.amount }} {{ p.price?.currency }}</td>
              <td>{{ p.stock }}</td>
              <td>
                <span :class="['badge', p.is_active ? 'badge--success' : 'badge--neutral']">
                  {{ p.is_active ? 'Активен' : 'Скрыт' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>
