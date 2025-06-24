<template>
  <div class="dashboard">
    <div class="stat-row">
      <div class="stat-card">
        <div class="stat-icon article"><i-ep-Document /></div>
        <div class="stat-info">
          <div class="stat-number">{{ stats.articleCount }}</div>
          <div class="stat-label">文章总数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon category"><i-ep-Folder /></div>
        <div class="stat-info">
          <div class="stat-number">{{ stats.categoryCount }}</div>
          <div class="stat-label">分类总数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon banner"><i-ep-Picture /></div>
        <div class="stat-info">
          <div class="stat-number">{{ stats.bannerCount }}</div>
          <div class="stat-label">轮播图总数</div>
        </div>
      </div>
    </div>
    <div class="welcome">欢迎使用魔力宝贝后台发布系统！</div>
    <div class="recent-articles">
      <div class="recent-title">最近发布文章</div>
      <el-empty v-if="recentArticles.length === 0" description="暂无数据" />
      <ul v-else>
        <li v-for="item in recentArticles" :key="item._id">
          <span class="article-title">{{ item.title }}</span>
          <span class="article-date">{{ formatDate(item.createdAt) }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Document, Folder, Picture } from '@element-plus/icons-vue'
import { getArticleCount, getCategoryCount, getBannerCount, getRecentArticles } from '../api/dashboard'

const stats = ref({ articleCount: 0, categoryCount: 0, bannerCount: 0 })
const recentArticles = ref([])

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString()
}

onMounted(async () => {
  stats.value.articleCount = await getArticleCount()
  stats.value.categoryCount = await getCategoryCount()
  stats.value.bannerCount = await getBannerCount()
  recentArticles.value = await getRecentArticles()
})
</script>


<style src="./dashboard.css"></style> 

