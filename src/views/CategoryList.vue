<template>
  <div class="category-list">
    <div class="header-bar">
      <el-button type="primary" @click="handleAdd">新增分类</el-button>
    </div>
    <el-table :data="categories" v-loading="loading" border stripe class="cat-table">
      <el-table-column prop="name" label="分类名称" min-width="120" />
      <el-table-column prop="iconUrl" label="图标" width="80">
        <template #default="{ row }">
          <img v-if="row.iconUrl" :src="row.iconUrl" class="cat-icon" />
        </template>
      </el-table-column>
      <el-table-column prop="parent" label="父级ID" width="80" />
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="400px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="图标">
          <el-upload
            class="upload-demo"
            :action="''"
            :http-request="uploadIcon"
            :show-file-list="false"
            accept="image/*"
          >
            <img v-if="form.iconUrl" :src="form.iconUrl" class="cat-icon" />
            <el-button v-else>上传图标</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="父级ID">
          <el-input v-model="form.parent" />
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
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../api/category'
import { uploadToCos } from '../api/cos'

const categories = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const form = ref({ name: '', iconUrl: '', parent: 0 })
const isEdit = ref(false)

const loadCategories = async () => {
  loading.value = true
  categories.value = await fetchCategories()
  loading.value = false
}
const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增分类'
  form.value = { name: '', iconUrl: '', parent: 0 }
  dialogVisible.value = true
}
const handleEdit = (row) => {
  isEdit.value = true
  dialogTitle.value = '编辑分类'
  form.value = { ...row }
  dialogVisible.value = true
}
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该分类吗？', '提示', { type: 'warning' })
    .then(async () => {
      await deleteCategory(row._id)
      ElMessage.success('删除成功')
      loadCategories()
    })
}
const handleSubmit = async () => {
  if (!form.value.name) {
    ElMessage.error('请填写分类名称')
    return
  }
  if (isEdit.value) {
    await updateCategory(form.value._id, form.value)
    ElMessage.success('更新成功')
  } else {
    await addCategory(form.value)
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
  loadCategories()
}
const uploadIcon = async (option) => {
  const url = await uploadToCos(option.file)
  form.value.iconUrl = url
  ElMessage.success('上传成功')
}
onMounted(() => {
  loadCategories()
})
</script>

<style src="./category-list.css"></style> 