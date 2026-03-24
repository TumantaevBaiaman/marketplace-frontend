<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productApi } from '@/entities/product'
import { offerApi } from '@/entities/offer'
import { sellerApi } from '@/entities/seller'
import type { AdminProduct } from '@/entities/product'
import type { AdminOffer, CreateOfferPayload } from '@/entities/offer'
import type { Seller } from '@/entities/seller'
import { AppButton, AppInput, AppSelect, AppTextarea, AppLoader, AppAlert, AppModal } from '@/shared/ui'
import { categoryApi } from '@/entities/category'
import type { Category } from '@/entities/category'
import { ProductAuditLog } from '@/widgets/product-audit-log'
import type { AuditLogEntry } from '@/entities/product'

const route = useRoute()
const router = useRouter()
const productId = computed(() => route.params.id ? String(route.params.id) : null)
const isNew = computed(() => !productId.value)

// ── Form state ────────────────────────────────────────────────────────────
const saving = ref(false)
const loadingProduct = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)

const categories = ref<Category[]>([])
const categoryOptions = computed(() => [
  { value: '', label: 'Без категории' },
  ...categories.value.map((c) => ({ value: c.id, label: c.name })),
])

const form = ref({
  name: '',
  description: '',
  sku: '',
  price_amount: '',
  price_currency: 'USD',
  stock: '0',
  is_active: true,
  category_id: '',
})
const attributes = ref<{ key: string; value: string }[]>([])
const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)

// ── Audit log ─────────────────────────────────────────────────────────────
const auditEntries = ref<AuditLogEntry[]>([])
const loadingAudit = ref(false)

// ── Offers state ──────────────────────────────────────────────────────────
const offers = ref<AdminOffer[]>([])
const sellers = ref<Seller[]>([])
const loadingOffers = ref(false)
const offerError = ref<string | null>(null)
const showOfferModal = ref(false)
const editingOffer = ref<AdminOffer | null>(null)
const savingOffer = ref(false)
const deletingOffer = ref<string | null>(null)

const offerForm = ref({
  seller_id: '',
  price_amount: '',
  price_currency: 'USD',
  delivery_date: '',
  condition: 'new',
  quantity: '1',
  is_available: true,
  delivery_days_min: '',
  delivery_days_max: '',
})

const sellerOptions = computed(() =>
  sellers.value.map((s) => ({ value: s.id, label: `${s.name} (★${Number(s.rating).toFixed(1)})` }))
)

const conditionOptions = [
  { value: 'new', label: 'Новый' },
  { value: 'used', label: 'Б/у' },
  { value: 'refurbished', label: 'Восстановленный' },
]

const currencyOptions = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'RUB', label: 'RUB' },
  { value: 'KZT', label: 'KZT' },
  { value: 'KGZ', label: 'KGZ' },
]

// ── Load ──────────────────────────────────────────────────────────────────
onMounted(async () => {
  const [sellersData, categoriesData] = await Promise.all([sellerApi.list(), categoryApi.adminList()])
  sellers.value = sellersData
  categories.value = categoriesData

  if (productId.value) {
    loadingProduct.value = true
    try {
      const p = await productApi.adminGet(productId.value)
      fillForm(p)
    } finally {
      loadingProduct.value = false
    }
    await Promise.all([loadOffers(), loadAuditLog()])
  }
})

function fillForm(p: AdminProduct) {
  form.value.name = p.name
  form.value.description = p.description ?? ''
  form.value.sku = p.sku ?? ''
  form.value.price_amount = p.price.amount
  form.value.price_currency = p.price.currency
  form.value.stock = String(p.stock)
  form.value.is_active = p.is_active
  form.value.category_id = p.category_id ?? ''
  attributes.value = p.attributes.map((a) => ({ ...a }))
  imagePreview.value = p.thumbnail_url
}

async function loadOffers() {
  if (!productId.value) return
  loadingOffers.value = true
  try {
    offers.value = await offerApi.getByProduct(productId.value)
  } finally {
    loadingOffers.value = false
  }
}

async function loadAuditLog() {
  if (!productId.value) return
  loadingAudit.value = true
  try {
    const data = await productApi.adminGetAuditLog(productId.value)
    auditEntries.value = data.entries
  } finally {
    loadingAudit.value = false
  }
}

// ── Save product ──────────────────────────────────────────────────────────
async function handleSave() {
  saving.value = true
  error.value = null
  success.value = null
  try {
    const payload = {
      name: form.value.name,
      description: form.value.description || null,
      sku: form.value.sku || null,
      category_id: form.value.category_id || null,
      price: { amount: Number(form.value.price_amount), currency: form.value.price_currency },
      stock: Number(form.value.stock),
      is_active: form.value.is_active,
      attributes: attributes.value.filter((a) => a.key && a.value),
    }
    if (isNew.value) {
      const created = await productApi.adminCreate(payload)
      if (imageFile.value) {
        await productApi.adminUploadImage(created.id, imageFile.value)
      }
      router.push(`/admin/products/${created.id}/edit`)
    } else {
      await productApi.adminUpdate(productId.value!, payload)
      if (imageFile.value) {
        const urls = await productApi.adminUploadImage(productId.value!, imageFile.value)
        imagePreview.value = urls.thumbnail_url
        imageFile.value = null
      }
      success.value = 'Товар сохранён'
      setTimeout(() => (success.value = null), 3000)
      await loadAuditLog()
    }
  } catch (e: any) {
    error.value = e.response?.data?.detail ?? e.response?.data?.message ?? 'Ошибка сохранения'
  } finally {
    saving.value = false
  }
}

// ── Attributes ────────────────────────────────────────────────────────────
function addAttribute() {
  attributes.value.push({ key: '', value: '' })
}
function removeAttribute(i: number) {
  attributes.value.splice(i, 1)
}

// ── Image ─────────────────────────────────────────────────────────────────
function onImageChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

// ── Offers ────────────────────────────────────────────────────────────────
function openNewOffer() {
  editingOffer.value = null
  offerForm.value = {
    seller_id: sellerOptions.value[0]?.value?.toString() ?? '',
    price_amount: '',
    price_currency: 'USD',
    delivery_date: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
    condition: 'new',
    quantity: '1',
    is_available: true,
    delivery_days_min: '',
    delivery_days_max: '',
  }
  offerError.value = null
  showOfferModal.value = true
}

function openEditOffer(offer: AdminOffer) {
  editingOffer.value = offer
  offerForm.value = {
    seller_id: offer.seller_id,
    price_amount: String(offer.price.amount),
    price_currency: offer.price.currency,
    delivery_date: offer.delivery_date,
    condition: offer.condition,
    quantity: String(offer.quantity),
    is_available: offer.is_available,
    delivery_days_min: offer.delivery_days_min ? String(offer.delivery_days_min) : '',
    delivery_days_max: offer.delivery_days_max ? String(offer.delivery_days_max) : '',
  }
  offerError.value = null
  showOfferModal.value = true
}

async function saveOffer() {
  savingOffer.value = true
  offerError.value = null
  try {
    const payload: CreateOfferPayload = {
      seller_id: offerForm.value.seller_id,
      price: { amount: Number(offerForm.value.price_amount), currency: offerForm.value.price_currency },
      delivery_date: offerForm.value.delivery_date,
      condition: offerForm.value.condition,
      quantity: Number(offerForm.value.quantity),
      is_available: offerForm.value.is_available,
      delivery_days_min: offerForm.value.delivery_days_min ? Number(offerForm.value.delivery_days_min) : null,
      delivery_days_max: offerForm.value.delivery_days_max ? Number(offerForm.value.delivery_days_max) : null,
    }
    if (editingOffer.value) {
      const updated = await offerApi.update(editingOffer.value.id, payload)
      const idx = offers.value.findIndex((o) => o.id === editingOffer.value!.id)
      if (idx !== -1) offers.value[idx] = updated
    } else {
      const created = await offerApi.create(productId.value!, payload)
      offers.value.push(created)
    }
    showOfferModal.value = false
  } catch (e: any) {
    offerError.value = e.response?.data?.detail ?? 'Ошибка сохранения'
  } finally {
    savingOffer.value = false
  }
}

async function deleteOffer(id: string) {
  if (!confirm('Удалить предложение?')) return
  deletingOffer.value = id
  try {
    await offerApi.remove(id)
    offers.value = offers.value.filter((o) => o.id !== id)
  } finally {
    deletingOffer.value = null
  }
}
</script>

<template>
  <div class="admin-page">
    <div class="admin-page__header">
      <div class="admin-page__back">
        <button class="admin-page__back-btn" @click="router.push('/admin/products')">← Назад</button>
        <h1 class="admin-page__title">{{ isNew ? 'Создание товара' : 'Редактирование товара' }}</h1>
      </div>
      <div class="admin-page__actions">
        <AppButton variant="ghost" @click="router.push('/admin/products')">Отмена</AppButton>
        <AppButton :loading="saving" @click="handleSave">
          {{ isNew ? 'Создать' : 'Сохранить' }}
        </AppButton>
      </div>
    </div>

    <AppLoader v-if="loadingProduct" />

    <template v-else>
      <AppAlert v-if="error" type="error" :message="error" />
      <AppAlert v-if="success" type="success" :message="success" />

      <div class="admin-edit-grid">
        <!-- Left column: main info -->
        <div class="admin-edit-main">
          <div class="admin-card">
            <h2 class="admin-card__title">Основная информация</h2>
            <AppInput v-model="form.name" label="Название" required />
            <AppTextarea v-model="form.description" label="Описание" :rows="4" />
            <AppInput v-model="form.sku" label="Артикул (SKU)" />
            <AppSelect v-model="form.category_id" label="Категория" :options="categoryOptions" />
            <div class="form-row">
              <AppInput v-model="form.price_amount" label="Цена" type="number" required />
              <AppSelect v-model="form.price_currency" label="Валюта" :options="currencyOptions" />
            </div>
            <AppInput v-model="form.stock" label="На складе (шт.)" type="number" />
          </div>

          <div class="admin-card">
            <h2 class="admin-card__title">Статус</h2>
            <div class="form-toggle">
              <label class="toggle-label">
                <input v-model="form.is_active" type="checkbox" class="toggle-input" />
                <span class="toggle-track"></span>
                <span class="toggle-text">Товар активен (виден покупателям)</span>
              </label>
            </div>
          </div>

          <!-- Attributes -->
          <div class="admin-card">
            <div class="admin-card__header">
              <h2 class="admin-card__title">Характеристики</h2>
              <AppButton size="sm" variant="ghost" @click="addAttribute">+ Добавить</AppButton>
            </div>
            <div v-if="attributes.length === 0" class="admin-empty-hint">
              Нет характеристик. Нажмите «+ Добавить» для добавления.
            </div>
            <div
              v-for="(attr, i) in attributes"
              :key="i"
              class="attr-row"
            >
              <AppInput v-model="attr.key" placeholder="Название (напр. Цвет)" />
              <AppInput v-model="attr.value" placeholder="Значение (напр. Чёрный)" />
              <button class="attr-row__remove" title="Удалить" @click="removeAttribute(i)">✕</button>
            </div>
          </div>
        </div>

        <!-- Right column: image + offers -->
        <div class="admin-edit-side">
          <!-- Image -->
          <div class="admin-card">
            <h2 class="admin-card__title">Изображение</h2>
            <div class="image-upload">
              <div class="image-upload__preview">
                <img v-if="imagePreview" :src="imagePreview" alt="preview" class="image-upload__img" />
                <div v-else class="image-upload__placeholder">
                  <span>📷</span>
                  <span>Нет изображения</span>
                </div>
              </div>
              <label class="image-upload__btn">
                Выбрать файл
                <input type="file" accept="image/*" class="image-upload__input" @change="onImageChange" />
              </label>
              <p class="image-upload__hint">JPG, PNG, WebP до 10 МБ</p>
            </div>
          </div>

          <!-- Offers (only in edit mode) -->
          <div v-if="!isNew" class="admin-card">
            <div class="admin-card__header">
              <h2 class="admin-card__title">Предложения продавцов</h2>
              <AppButton size="sm" @click="openNewOffer">+ Добавить</AppButton>
            </div>

            <AppLoader v-if="loadingOffers" />

            <div v-else-if="offers.length === 0" class="admin-empty-hint">
              Нет предложений
            </div>

            <div v-else class="offers-list offers-list--scrollable">
              <div v-for="offer in offers" :key="offer.id" class="offer-item">
                <div class="offer-item__seller">{{ offer.seller_name ?? offer.seller_id.slice(0, 8) }}</div>
                <div class="offer-item__price">
                  {{ Number(offer.price.amount).toFixed(2) }} {{ offer.price.currency }}
                </div>
                <div class="offer-item__meta">
                  <span class="badge badge--info">{{ offer.condition }}</span>
                  <span>{{ offer.quantity }} шт</span>
                  <span class="offer-item__date">до {{ offer.delivery_date }}</span>
                </div>
                <div class="offer-item__actions">
                  <button class="icon-btn icon-btn--edit" title="Изменить" @click="openEditOffer(offer)">✎</button>
                  <button
                    class="icon-btn icon-btn--delete"
                    :disabled="deletingOffer === offer.id"
                    title="Удалить"
                    @click="deleteOffer(offer.id)"
                  >✕</button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="isNew" class="admin-card admin-card--hint">
            <p>💡 После создания товара вы сможете добавить предложения продавцов.</p>
          </div>

        </div>
      </div>

      <!-- Audit log: full width below the grid -->
      <div v-if="!isNew" class="admin-card admin-card--audit">
        <div class="admin-card__header">
          <h2 class="admin-card__title">История изменений</h2>
          <span class="audit-count">{{ auditEntries.length }} записей</span>
        </div>
        <AppLoader v-if="loadingAudit" />
        <ProductAuditLog v-else :entries="auditEntries" />
      </div>
    </template>

    <!-- Offer Modal -->
    <AppModal
      v-if="showOfferModal"
      :title="editingOffer ? 'Изменить предложение' : 'Новое предложение'"
      size="md"
      @close="showOfferModal = false"
    >
      <AppAlert v-if="offerError" type="error" :message="offerError" />
      <AppSelect
        v-model="offerForm.seller_id"
        label="Продавец"
        :options="sellerOptions"
        placeholder="Выберите продавца"
        required
      />
      <div class="form-row">
        <AppInput v-model="offerForm.price_amount" label="Цена" type="number" required />
        <AppSelect v-model="offerForm.price_currency" label="Валюта" :options="currencyOptions" />
      </div>
      <AppInput v-model="offerForm.delivery_date" label="Дата доставки" type="date" required />
      <div class="form-row">
        <AppSelect v-model="offerForm.condition" label="Состояние" :options="conditionOptions" />
        <AppInput v-model="offerForm.quantity" label="Количество" type="number" />
      </div>
      <div class="form-row">
        <AppInput v-model="offerForm.delivery_days_min" label="Дней мин." type="number" />
        <AppInput v-model="offerForm.delivery_days_max" label="Дней макс." type="number" />
      </div>
      <div class="form-toggle">
        <label class="toggle-label">
          <input v-model="offerForm.is_available" type="checkbox" class="toggle-input" />
          <span class="toggle-track"></span>
          <span class="toggle-text">Доступно к заказу</span>
        </label>
      </div>
      <template #footer>
        <AppButton variant="ghost" @click="showOfferModal = false">Отмена</AppButton>
        <AppButton :loading="savingOffer" @click="saveOffer">Сохранить</AppButton>
      </template>
    </AppModal>
  </div>
</template>
