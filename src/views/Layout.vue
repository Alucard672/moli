<template>
  <div class="layout">
    <el-container>
      <el-aside width="200px" class="sidebar">
        <div class="logo">
          <img src="../assets/mlbb-logo.png" alt="Logo" />
          <span>后台管理</span>
        </div>
        <el-menu
          :default-active="$route.path"
          router
          class="menu"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409eff"
        >
          <el-menu-item index="/">
            <el-icon><DataBoard /></el-icon>
            <span>仪表盘</span>
          </el-menu-item>
          <el-menu-item index="/articles">
            <el-icon><Document /></el-icon>
            <span>文章管理</span>
          </el-menu-item>
          <el-menu-item index="/categories">
            <el-icon><Folder /></el-icon>
            <span>分类管理</span>
          </el-menu-item>
          <el-menu-item index="/banners">
            <el-icon><Picture /></el-icon>
            <span>轮播图管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="header">
          <div class="header-left">
            <el-icon class="menu-toggle"><Menu /></el-icon>
            <span class="page-title">{{ getPageTitle() }}</span>
          </div>
          <div class="header-right">
            <el-dropdown>
              <span class="user-info">
                <el-avatar size="small" src="../assets/avatar.png" />
                <span>管理员</span>
                <el-icon><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        <el-main class="main-content">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { DataBoard, Document, Folder, Picture, Menu, ArrowDown } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const getPageTitle = () => {
  const titles = {
    '/dashboard': '仪表盘',
    '/articles': '文章管理',
    '/categories': '分类管理',
    '/banners': '轮播图管理'
  }
  return titles[route.path] || '后台管理'
}

const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style src="./layout.css"></style> 