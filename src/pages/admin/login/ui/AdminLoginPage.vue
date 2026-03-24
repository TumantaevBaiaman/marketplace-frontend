<script setup lang="ts">
import { ref } from 'vue'
import { useLogin } from '@/features/auth/login'

const { login, error, loading } = useLogin()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
</script>

<template>
  <div class="adm-login">

    <!-- ── Left panel ─────────────────────────────────────────── -->
    <aside class="adm-login__panel">
      <div class="adm-login__brand">
        <div class="adm-login__logo">M</div>
        <div>
          <p class="adm-login__brand-name">Marketplace</p>
          <p class="adm-login__brand-sub">Панель управления</p>
        </div>
      </div>

      <div class="adm-login__features">
        <div class="adm-login__feature">
          <span class="adm-login__feature-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </span>
          <div>
            <p class="adm-login__feature-title">Управление товарами</p>
            <p class="adm-login__feature-desc">Создавайте, редактируйте и публикуйте товары</p>
          </div>
        </div>

        <div class="adm-login__feature">
          <span class="adm-login__feature-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
          </span>
          <div>
            <p class="adm-login__feature-title">Аналитика и статистика</p>
            <p class="adm-login__feature-desc">Следите за показателями в реальном времени</p>
          </div>
        </div>

        <div class="adm-login__feature">
          <span class="adm-login__feature-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </span>
          <div>
            <p class="adm-login__feature-title">Продавцы и заказы</p>
            <p class="adm-login__feature-desc">Управляйте партнёрами и верифицируйте продавцов</p>
          </div>
        </div>
      </div>

      <p class="adm-login__copy">© {{ new Date().getFullYear() }} Marketplace · v1.0</p>
    </aside>

    <!-- ── Right form ──────────────────────────────────────────── -->
    <main class="adm-login__form-wrap">
      <div class="adm-login__glow" />

      <div class="adm-login__form-box">
        <div class="adm-login__card">

          <!-- header -->
          <div class="adm-login__form-header">
            <div class="adm-login__shield">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h1 class="adm-login__title">Вход в систему</h1>
            <p class="adm-login__subtitle">Доступ только для администраторов</p>
          </div>

          <!-- error -->
          <Transition name="shake">
            <div v-if="error" class="adm-login__error" role="alert">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {{ error }}
            </div>
          </Transition>

          <!-- form -->
          <form class="adm-login__form" novalidate @submit.prevent="login(email, password)">
            <div class="adm-field">
              <label class="adm-field__label" for="adm-email">Email</label>
              <div class="adm-field__wrap">
                <span class="adm-field__icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input
                  id="adm-email"
                  v-model="email"
                  type="email"
                  class="adm-field__input"
                  placeholder="admin@example.com"
                  autocomplete="username"
                  required
                />
              </div>
            </div>

            <div class="adm-field">
              <label class="adm-field__label" for="adm-password">Пароль</label>
              <div class="adm-field__wrap">
                <span class="adm-field__icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  id="adm-password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  class="adm-field__input"
                  placeholder="••••••••"
                  autocomplete="current-password"
                  required
                />
                <button
                  type="button"
                  class="adm-field__toggle"
                  :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
                  @click="showPassword = !showPassword"
                >
                  <svg v-if="showPassword" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                  <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>
            </div>

            <button type="submit" class="adm-login__submit" :disabled="loading">
              <span v-if="loading" class="adm-login__spinner" />
              <template v-else>
                <span>Войти в панель</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </template>
            </button>
          </form>

          <div class="adm-login__secure">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Защищённое соединение
          </div>
        </div>

        <p class="adm-login__back">
          <RouterLink to="/">← Вернуться на сайт</RouterLink>
        </p>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* ── Layout ─────────────────────────────────────────────────── */
.adm-login {
  display: flex;
  min-height: 100vh;
}

/* ── Left panel ─────────────────────────────────────────────── */
.adm-login__panel {
  display: flex;
  flex-direction: column;
  width: 400px;
  flex-shrink: 0;
  background: #0f172a;
  padding: 48px 40px;
  color: #e2e8f0;
  position: relative;
  overflow: hidden;
}

.adm-login__panel::before {
  content: '';
  position: absolute;
  top: -120px;
  right: -120px;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%);
  pointer-events: none;
}

.adm-login__panel::after {
  content: '';
  position: absolute;
  bottom: -80px;
  left: -80px;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%);
  pointer-events: none;
}

.adm-login__brand {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 56px;
}

.adm-login__logo {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #6366f1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
}

.adm-login__brand-name {
  font-size: 18px;
  font-weight: 700;
  color: #f1f5f9;
  line-height: 1.2;
}

.adm-login__brand-sub {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.adm-login__features {
  display: flex;
  flex-direction: column;
  gap: 28px;
  flex: 1;
}

.adm-login__feature {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.adm-login__feature-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #818cf8;
  flex-shrink: 0;
}

.adm-login__feature-title {
  font-size: 14px;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 3px;
}

.adm-login__feature-desc {
  font-size: 13px;
  color: #64748b;
  line-height: 1.4;
}

.adm-login__copy {
  font-size: 12px;
  color: #334155;
  margin-top: 40px;
}

/* ── Right side — white ──────────────────────────────────────── */
.adm-login__form-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
  background-size: 24px 24px;
  padding: 40px 24px;
  position: relative;
}

.adm-login__glow { display: none; }

.adm-login__form-box {
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
  animation: adm-fadein 0.4s ease both;
}

@keyframes adm-fadein {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Card ────────────────────────────────────────────────────── */
.adm-login__card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07), 0 10px 30px -5px rgba(0,0,0,0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  padding: 36px 36px 28px;
  position: relative;
}

.adm-login__card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%);
}

/* ── Header ──────────────────────────────────────────────────── */
.adm-login__form-header {
  margin-bottom: 28px;
}

.adm-login__shield {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-bottom: 16px;
}

.adm-login__title {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
  letter-spacing: -0.02em;
}

.adm-login__subtitle {
  font-size: 13.5px;
  color: #64748b;
}

/* ── Error ───────────────────────────────────────────────────── */
.adm-login__error {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-left: 3px solid #ef4444;
  color: #b91c1c;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  margin-bottom: 20px;
}

/* ── Fields ──────────────────────────────────────────────────── */
.adm-login__form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.adm-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.adm-field__label {
  font-size: 12.5px;
  font-weight: 600;
  color: #374151;
  letter-spacing: 0.01em;
}

.adm-field__wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.adm-field__icon {
  position: absolute;
  left: 12px;
  color: #94a3b8;
  display: flex;
  pointer-events: none;
}

.adm-field__input {
  width: 100%;
  padding: 11px 40px 11px 38px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  color: #0f172a;
  background: #f8fafc;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
}

.adm-field__input:focus {
  background: #fff;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.adm-field__toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  padding: 0;
  transition: color 0.15s;
}

.adm-field__toggle:hover {
  color: #6366f1;
}

/* ── Submit ──────────────────────────────────────────────────── */
.adm-login__submit {
  width: 100%;
  padding: 12px 20px;
  background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 14.5px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: opacity 0.15s, transform 0.1s, box-shadow 0.15s;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
}

.adm-login__submit:hover:not(:disabled) {
  opacity: 0.92;
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.45);
  transform: translateY(-1px);
}

.adm-login__submit:active:not(:disabled) {
  transform: translateY(0) scale(0.99);
}

.adm-login__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.adm-login__spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: adm-spin 0.7s linear infinite;
}

@keyframes adm-spin {
  to { transform: rotate(360deg); }
}

/* ── Secure ──────────────────────────────────────────────────── */
.adm-login__secure {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 11.5px;
  color: #94a3b8;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
}

/* ── Back link ───────────────────────────────────────────────── */
.adm-login__back {
  text-align: center;
  margin-top: 18px;
  font-size: 13px;
}

.adm-login__back a {
  color: #64748b;
  text-decoration: none;
  transition: color 0.15s;
}

.adm-login__back a:hover {
  color: #6366f1;
}

/* ── Shake ───────────────────────────────────────────────────── */
.shake-enter-active {
  animation: adm-shake 0.35s ease;
}

@keyframes adm-shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-6px); }
  40%       { transform: translateX(6px); }
  60%       { transform: translateX(-4px); }
  80%       { transform: translateX(4px); }
}

/* ── Mobile ──────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .adm-login {
    flex-direction: column;
  }

  .adm-login__panel {
    width: 100%;
    padding: 28px 24px;
  }

  .adm-login__features {
    display: none;
  }

  .adm-login__brand {
    margin-bottom: 0;
  }

  .adm-login__copy {
    display: none;
  }

  .adm-login__card {
    padding: 32px 24px 28px;
  }
}
</style>
