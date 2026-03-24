<script setup lang="ts">
import type { ProductListItem } from '@/entities/product'
import { AppButton } from '@/shared/ui'

defineProps<{ products: ProductListItem[] }>()
defineEmits<{ edit: [id: string]; delete: [id: string] }>()
</script>

<template>
  <div class="admin-table-wrapper">
    <table class="admin-table">
      <thead>
        <tr>
          <th class="admin-table__th">Фото</th>
          <th class="admin-table__th">Название</th>
          <th class="admin-table__th">Мин. цена</th>
          <th class="admin-table__th">Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id" class="admin-table__row">
          <td class="admin-table__td">
            <img
              v-if="product.image"
              :src="product.image"
              :alt="product.name"
              class="admin-table__thumb"
            />
            <span v-else class="admin-table__no-img">—</span>
          </td>
          <td class="admin-table__td">{{ product.name }}</td>
          <td class="admin-table__td">
            {{ product.min_price !== null ? product.min_price + ' ₽' : '—' }}
          </td>
          <td class="admin-table__td admin-table__actions">
            <AppButton size="sm" variant="ghost" @click="$emit('edit', product.id)">
              Редактировать
            </AppButton>
            <AppButton size="sm" variant="danger" @click="$emit('delete', product.id)">
              Удалить
            </AppButton>
          </td>
        </tr>
        <tr v-if="products.length === 0">
          <td colspan="4" class="admin-table__empty">Нет товаров</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
