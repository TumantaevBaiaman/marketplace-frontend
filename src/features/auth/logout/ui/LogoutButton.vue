<script setup lang="ts">
import { useLogout } from '../model/useLogout'
import { AppButton } from '@/shared/ui'

const { logout } = useLogout()
</script>

<template>
  <AppButton variant="ghost" size="sm" @click="logout">Выйти</AppButton>
</template>
