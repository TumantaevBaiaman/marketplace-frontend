<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminProductList } from '@/features/admin/product-list'
import { productApi } from '@/entities/product'
import { useInfiniteScroll } from '@/shared/lib/useInfiniteScroll'
import { AppButton, AppLoader, AppInput, AppSelect } from '@/shared/ui'

const router = useRouter()

const search = ref('')
const isActive = ref<boolean | null>(null)
const inStock = ref(false)
const priceMin = ref<number | null>(null)
const priceMax = ref<number | null>(null)

const { products, loading, hasMore, loadMore } = useAdminProductList(() => ({
  search: search.value || undefined,
  isActive: isActive.value,
  inStock: inStock.value,
  priceMin: priceMin.value,
  priceMax: priceMax.value,
}))

const statusOptions = [
  { value: '', label: 'Все статусы' },
  { value: 'true', label: 'Активен' },
  { value: 'false', label: 'Скрыт' },
]

function onStatusChange(val: string) {
  isActive.value = val === '' ? null : val === 'true'
}

const deleting = ref<string | null>(null)
const { sentinel } = useInfiniteScroll(loadMore)

async function handleDelete(id: string) {
  if (!confirm('Удалить товар? Это действие необратимо.')) return
  deleting.value = id
  try {
    await productApi.adminDelete(id)
    products.value = products.value.filter((p) => p.id !== id)
  } finally {
    deleting.value = null
  }
}
</script>

<template>
  <div class="admin-page">
    <div class="admin-page__header">
      <div>
        <h1 class="admin-page__title">Товары</h1>
        <p class="admin-page__subtitle">{{ products.length }} товаров загружено</p>
      </div>
      <AppButton @click="router.push('/admin/products/new')">+ Создать товар</AppButton>
    </div>

    <div class="admin-card">
      <div class="admin-card__toolbar">
        <AppInput v-model="search" placeholder="Поиск по названию, SKU..." />
        <AppSelect
          :model-value="isActive === null ? '' : String(isActive)"
          :options="statusOptions"
          @update:model-value="onStatusChange"
        />
        <AppInput
          :model-value="priceMin ?? ''"
          type="number"
          placeholder="Цена от"
          @update:model-value="priceMin = $event !== '' ? Number($event) : null"
        />
        <AppInput
          :model-value="priceMax ?? ''"
          type="number"
          placeholder="Цена до"
          @update:model-value="priceMax = $event !== '' ? Number($event) : null"
        />
        <label class="filter-chip" :class="{ active: inStock }">
          <input v-model="inStock" type="checkbox" style="display:none" />
          В наличии
        </label>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th style="width:60px">Фото</th>
            <th>Название</th>
            <th>SKU</th>
            <th>Цена</th>
            <th>Остаток</th>
            <th>Статус</th>
            <th style="width:140px">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!loading && products.length === 0">
            <td colspan="7" class="data-table__empty">Товары не найдены</td>
          </tr>
          <tr v-for="product in products" :key="product.id">
            <td>
              <img
                v-if="product.thumbnail_url"
                :src="product.thumbnail_url"
                :alt="product.name"
                class="data-table__thumb"
              />
              <div v-else class="data-table__no-img">—</div>
            </td>
            <td>
              <RouterLink :to="`/admin/products/${product.id}/edit`" class="data-table__link">
                {{ product.name }}
              </RouterLink>
              <p v-if="product.description" class="data-table__sub">
                {{ product.description.slice(0, 60) }}{{ product.description.length > 60 ? '…' : '' }}
              </p>
            </td>
            <td>
              <span v-if="product.sku" class="data-table__code">{{ product.sku }}</span>
            </td>
            <td class="data-table__num">
              {{ Number(product.price.amount).toFixed(2) }} {{ product.price.currency }}
            </td>
            <td class="data-table__num" :class="{ 'data-table__num--warn': product.stock <= 5 }">
              {{ product.stock }}
            </td>
            <td>
              <span :class="['badge', product.is_active ? 'badge--success' : 'badge--neutral']">
                {{ product.is_active ? 'Активен' : 'Скрыт' }}
              </span>
            </td>
            <td>
              <div class="data-table__actions">
                <AppButton size="sm" variant="ghost" @click="router.push(`/admin/products/${product.id}/edit`)">
                  Изменить
                </AppButton>
                <AppButton
                  size="sm"
                  variant="danger"
                  :loading="deleting === product.id"
                  @click="handleDelete(product.id)"
                >
                  Удалить
                </AppButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div ref="sentinel" />
      <AppLoader v-if="loading" />
      <p v-if="!hasMore && products.length > 0" class="product-list__end">
        Все товары загружены
      </p>
    </div>
  </div>
</template>
