<script setup lang="ts">
import type { AuditLogEntry } from '@/entities/product/api/productApi'

defineProps<{ entries: AuditLogEntry[] }>()

const ACTION_LABEL: Record<string, string> = {
  create: 'Создание',
  update: 'Обновление',
  delete: 'Удаление',
  upload_image: 'Загрузка фото',
}

const FIELD_LABEL: Record<string, string> = {
  name: 'Название',
  description: 'Описание',
  sku: 'Артикул',
  category_id: 'Категория',
  price_amount: 'Цена',
  price_currency: 'Валюта',
  stock: 'Остаток',
  is_active: 'Статус',
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso))
}

function actionClass(action: string): string {
  return ({
    create: 'audit-badge--create',
    update: 'audit-badge--update',
    delete: 'audit-badge--delete',
    upload_image: 'audit-badge--image',
  })[action] ?? 'audit-badge--update'
}

function hasDiff(entry: AuditLogEntry): boolean {
  return Object.keys(entry.diff).length > 0
}
</script>

<template>
  <div class="audit-log">
    <p v-if="entries.length === 0" class="audit-log__empty">История изменений пуста</p>

    <div v-for="entry in entries" :key="entry.id" class="audit-entry">
      <div class="audit-entry__header">
        <span :class="['audit-badge', actionClass(entry.action)]">
          {{ ACTION_LABEL[entry.action] ?? entry.action }}
        </span>
        <span class="audit-entry__meta">
          <span class="audit-entry__actor">{{ entry.actor_email ?? 'Система' }}</span>
          <span class="audit-entry__sep">·</span>
          <span class="audit-entry__date">{{ formatDate(entry.created_at) }}</span>
        </span>
      </div>

      <table v-if="hasDiff(entry)" class="audit-diff">
        <thead>
          <tr>
            <th class="audit-diff__field">Поле</th>
            <th class="audit-diff__before">Было</th>
            <th class="audit-diff__after">Стало</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(change, field) in entry.diff" :key="field">
            <td class="audit-diff__field">{{ FIELD_LABEL[field] ?? field }}</td>
            <td class="audit-diff__before">
              <span v-if="change.before !== null" class="audit-diff__val audit-diff__val--old">
                {{ change.before }}
              </span>
              <span v-else class="audit-diff__null">—</span>
            </td>
            <td class="audit-diff__after">
              <span v-if="change.after !== null" class="audit-diff__val audit-diff__val--new">
                {{ change.after }}
              </span>
              <span v-else class="audit-diff__null">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.audit-log { display: flex; flex-direction: column; gap: 12px; }
.audit-log__empty { color: #9ca3af; font-size: 13px; text-align: center; padding: 16px 0; }

.audit-entry {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.audit-entry__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 12px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  flex-wrap: wrap;
}

.audit-entry__meta { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #6b7280; }
.audit-entry__actor { font-weight: 500; color: #374151; }
.audit-entry__sep { color: #d1d5db; }

.audit-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
  letter-spacing: 0.4px;
}
.audit-badge--create  { background: #d1fae5; color: #065f46; }
.audit-badge--update  { background: #dbeafe; color: #1e40af; }
.audit-badge--delete  { background: #fee2e2; color: #991b1b; }
.audit-badge--image   { background: #ede9fe; color: #5b21b6; }

.audit-diff {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.audit-diff th, .audit-diff td {
  padding: 6px 12px;
  text-align: left;
  border-bottom: 1px solid #f3f4f6;
}
.audit-diff th {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #9ca3af;
  background: #fafafa;
}
.audit-diff__field { color: #374151; font-weight: 500; width: 110px; }
.audit-diff__before { width: 45%; }
.audit-diff__after  { width: 45%; }

.audit-diff__val {
  display: inline-block;
  padding: 1px 6px;
  border-radius: 4px;
  word-break: break-all;
}
.audit-diff__val--old { background: #fee2e2; color: #991b1b; }
.audit-diff__val--new { background: #d1fae5; color: #065f46; }
.audit-diff__null { color: #d1d5db; }
</style>
