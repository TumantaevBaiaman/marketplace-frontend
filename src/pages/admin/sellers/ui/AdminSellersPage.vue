<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { sellerApi } from '@/entities/seller'
import type { Seller, CreateSellerPayload, UpdateSellerPayload } from '@/entities/seller'
import { AppButton, AppInput, AppLoader, AppModal, AppAlert, AppTextarea } from '@/shared/ui'
import { extractApiError } from '@/shared/lib/extractApiError'

const sellers = ref<Seller[]>([])
const loading = ref(true)
const saving = ref(false)
const formError = ref<string | null>(null)

// ── Create ────────────────────────────────────────────────────────────────
const showCreateModal = ref(false)
const createForm = ref<CreateSellerPayload>({
  name: '',
  description: null,
  email: null,
  phone: null,
  website: null,
  country: null,
  rating: 5.0,
  is_verified: false,
})

// ── Edit ──────────────────────────────────────────────────────────────────
const showEditModal = ref(false)
const editingSeller = ref<Seller | null>(null)
const editForm = ref<UpdateSellerPayload>({
  name: '',
  description: null,
  email: null,
  phone: null,
  website: null,
  country: null,
  rating: null,
  is_verified: null,
})

onMounted(async () => {
  try {
    sellers.value = await sellerApi.list()
  } finally {
    loading.value = false
  }
})

function openCreate() {
  createForm.value = { name: '', description: null, email: null, phone: null, website: null, country: null, rating: 5.0, is_verified: false }
  formError.value = null
  showCreateModal.value = true
}

function openEdit(seller: Seller) {
  editingSeller.value = seller
  editForm.value = {
    name: seller.name,
    description: seller.description,
    email: seller.email,
    phone: seller.phone,
    website: seller.website,
    country: seller.country,
    rating: seller.rating,
    is_verified: seller.is_verified,
  }
  formError.value = null
  showEditModal.value = true
}

async function handleCreate() {
  saving.value = true
  formError.value = null
  try {
    const created = await sellerApi.create({
      ...createForm.value,
      rating: Number(createForm.value.rating),
    })
    sellers.value.push(created)
    showCreateModal.value = false
  } catch (e) {
    formError.value = extractApiError(e, 'Ошибка создания продавца')
  } finally {
    saving.value = false
  }
}

async function handleUpdate() {
  if (!editingSeller.value) return
  saving.value = true
  formError.value = null
  try {
    const updated = await sellerApi.update(editingSeller.value.id, {
      ...editForm.value,
      rating: editForm.value.rating != null ? Number(editForm.value.rating) : null,
    })
    const idx = sellers.value.findIndex((s) => s.id === editingSeller.value!.id)
    if (idx !== -1) sellers.value[idx] = updated
    showEditModal.value = false
  } catch (e) {
    formError.value = extractApiError(e, 'Ошибка сохранения продавца')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="admin-page">
    <div class="admin-page__header">
      <div>
        <h1 class="admin-page__title">Продавцы</h1>
        <p class="admin-page__subtitle">{{ sellers.length }} продавцов</p>
      </div>
      <AppButton @click="openCreate">+ Добавить продавца</AppButton>
    </div>

    <AppLoader v-if="loading" />

    <div v-else class="admin-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Email</th>
            <th>Телефон</th>
            <th>Страна</th>
            <th>Рейтинг</th>
            <th>Отзывов</th>
            <th>Статус</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="sellers.length === 0">
            <td colspan="8" class="data-table__empty">Нет продавцов</td>
          </tr>
          <tr v-for="seller in sellers" :key="seller.id">
            <td>
              <p class="data-table__name">{{ seller.name }}</p>
              <p v-if="seller.description" class="data-table__sub">
                {{ seller.description.slice(0, 50) }}{{ seller.description.length > 50 ? '…' : '' }}
              </p>
            </td>
            <td>{{ seller.email ?? '—' }}</td>
            <td>{{ seller.phone ?? '—' }}</td>
            <td>{{ seller.country ?? '—' }}</td>
            <td>
              <span class="rating-star">★ {{ Number(seller.rating).toFixed(1) }}</span>
            </td>
            <td>{{ seller.review_count }}</td>
            <td>
              <span :class="['badge', seller.is_verified ? 'badge--success' : 'badge--neutral']">
                {{ seller.is_verified ? 'Верифицирован' : 'Обычный' }}
              </span>
            </td>
            <td>
              <button class="icon-btn icon-btn--edit" title="Изменить" @click="openEdit(seller)">✎</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create Modal -->
    <AppModal v-if="showCreateModal" title="Новый продавец" size="md" @close="showCreateModal = false">
      <AppAlert v-if="formError" type="error" :message="formError" />
      <AppInput v-model="createForm.name" label="Название" required />
      <AppTextarea v-model="createForm.description as string" label="Описание" :rows="3" />
      <div class="form-row">
        <AppInput v-model="createForm.email as string" label="Email" type="email" />
        <AppInput v-model="createForm.phone as string" label="Телефон" />
      </div>
      <div class="form-row">
        <AppInput v-model="createForm.website as string" label="Сайт" />
        <AppInput v-model="createForm.country as string" label="Страна" placeholder="KZ, RU, US…" />
      </div>
      <AppInput v-model="createForm.rating as unknown as string" label="Рейтинг (1–5)" type="number" />
      <div class="form-toggle">
        <label class="toggle-label">
          <input v-model="createForm.is_verified" type="checkbox" class="toggle-input" />
          <span class="toggle-track"></span>
          <span class="toggle-text">Верифицированный продавец</span>
        </label>
      </div>
      <template #footer>
        <AppButton variant="ghost" @click="showCreateModal = false">Отмена</AppButton>
        <AppButton :loading="saving" @click="handleCreate">Создать</AppButton>
      </template>
    </AppModal>

    <!-- Edit Modal -->
    <AppModal v-if="showEditModal" title="Редактировать продавца" size="md" @close="showEditModal = false">
      <AppAlert v-if="formError" type="error" :message="formError" />
      <AppInput v-model="editForm.name as string" label="Название" required />
      <AppTextarea v-model="editForm.description as string" label="Описание" :rows="3" />
      <div class="form-row">
        <AppInput v-model="editForm.email as string" label="Email" type="email" />
        <AppInput v-model="editForm.phone as string" label="Телефон" />
      </div>
      <div class="form-row">
        <AppInput v-model="editForm.website as string" label="Сайт" />
        <AppInput v-model="editForm.country as string" label="Страна" placeholder="KZ, RU, US…" />
      </div>
      <AppInput v-model="editForm.rating as unknown as string" label="Рейтинг (1–5)" type="number" />
      <div class="form-toggle">
        <label class="toggle-label">
          <input v-model="editForm.is_verified" type="checkbox" class="toggle-input" />
          <span class="toggle-track"></span>
          <span class="toggle-text">Верифицированный продавец</span>
        </label>
      </div>
      <template #footer>
        <AppButton variant="ghost" @click="showEditModal = false">Отмена</AppButton>
        <AppButton :loading="saving" @click="handleUpdate">Сохранить</AppButton>
      </template>
    </AppModal>
  </div>
</template>
