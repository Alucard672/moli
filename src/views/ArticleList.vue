<template>
  <div class="article-list">
    <div class="header-bar">
      <el-input v-model="search.title" placeholder="搜索标题" class="search-input" clearable />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button type="success" @click="handleAdd">发布文章</el-button>
    </div>
    <el-table :data="articles" v-loading="loading" border stripe class="article-table">
      <el-table-column prop="title" label="标题" min-width="200" />
      <el-table-column prop="mainCategoryName" label="分类" min-width="100" />
      <el-table-column prop="createdAt" label="发布时间" min-width="140">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-bar">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="form.content" type="textarea" :rows="6" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.category_id" placeholder="请选择分类">
            <el-option v-for="cat in categories" :key="cat._id" :label="cat.name" :value="cat._id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetchArticles, addArticle, updateArticle, deleteArticle } from '../api/article'
import { fetchCategories } from '../api/category'

const articles = ref([])
const loading = ref(false)
const pagination = ref({ page: 1, pageSize: 10, total: 0 })
const search = ref({ title: '' })
const dialogVisible = ref(false)
const dialogTitle = ref('')
const form = ref({ title: '', content: '', category_id: '' })
const categories = ref([])
const isEdit = ref(false)

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString()
}

const loadArticles = async () => {
  loading.value = true
  const res = await fetchArticles({
    page: pagination.value.page,
    pageSize: pagination.value.pageSize,
    title: search.value.title
  })
  articles.value = res.data || []
  pagination.value.total = res.total || 0
  loading.value = false
}

const loadCategories = async () => {
  categories.value = await fetchCategories()
}

const handleSearch = () => {
  pagination.value.page = 1
  loadArticles()
}
const handleSizeChange = (size) => {
  pagination.value.pageSize = size
  loadArticles()
}
const handleCurrentChange = (page) => {
  pagination.value.page = page
  loadArticles()
}
const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '发布文章'
  form.value = { title: '', content: '', category_id: '' }
  dialogVisible.value = true
  loadCategories()
}
const handleEdit = (row) => {
  isEdit.value = true
  dialogTitle.value = '编辑文章'
  form.value = { ...row }
  dialogVisible.value = true
  loadCategories()
}
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该文章吗？', '提示', { type: 'warning' })
    .then(async () => {
      await deleteArticle(row._id)
      ElMessage.success('删除成功')
      loadArticles()
    })
}
const handleSubmit = async () => {
  if (!form.value.title || !form.value.content || !form.value.category_id) {
    ElMessage.error('请填写完整信息')
    return
  }
  const selectedCat = categories.value.find(cat => cat._id === form.value.category_id)
  const articleData = {
    ...form.value,
    mainCategory: form.value.category_id,
    mainCategoryName: selectedCat ? selectedCat.name : ''
  }
  if (isEdit.value) {
    await updateArticle(form.value._id, articleData)
    ElMessage.success('更新成功')
  } else {
    await addArticle(articleData)
    ElMessage.success('发布成功')
  }
  dialogVisible.value = false
  loadArticles()
}
onMounted(() => {
  loadArticles()
})
</script>

<style src="./article-list.css"></style> 