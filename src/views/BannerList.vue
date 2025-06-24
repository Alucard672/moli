<template>
  <div class="banner-list">
    <div class="header-bar">
      <el-button type="primary" @click="handleAdd">新增轮播图</el-button>
    </div>
    <el-table :data="banners" v-loading="loading" border stripe class="banner-table">
      <el-table-column prop="title" label="标题" min-width="120" />
      <el-table-column prop="imageUrl" label="图片" width="120">
        <template #default="{ row }">
          <img v-if="row.imageUrl" :src="row.imageUrl" class="banner-img" />
        </template>
      </el-table-column>
      <el-table-column prop="link" label="链接" min-width="120" />
      <el-table-column prop="sort" label="排序" width="80" />
      <el-table-column prop="status" label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            class="upload-demo"
            :action="''"
            :http-request="uploadBanner"
            :show-file-list="false"
            accept="image/*"
          >
            <img v-if="form.imageUrl" :src="form.imageUrl" class="banner-img" />
            <el-button v-else>上传图片</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="链接">
          <el-input v-model="form.link" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
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
import { fetchBanners, addBanner, updateBanner, deleteBanner } from '../api/banner'
import { uploadToCos } from '../api/cos'

const banners = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const form = ref({ title: '', imageUrl: '', link: '', sort: 0, status: 1 })
const isEdit = ref(false)

const loadBanners = async () => {
  loading.value = true
  banners.value = await fetchBanners()
  loading.value = false
}
const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增轮播图'
  form.value = { title: '', imageUrl: '', link: '', sort: 0, status: 1 }
  dialogVisible.value = true
}
const handleEdit = (row) => {
  isEdit.value = true
  dialogTitle.value = '编辑轮播图'
  form.value = { ...row }
  dialogVisible.value = true
}
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该轮播图吗？', '提示', { type: 'warning' })
    .then(async () => {
      await deleteBanner(row._id)
      ElMessage.success('删除成功')
      loadBanners()
    })
}
const handleSubmit = async () => {
  if (!form.value.title || !form.value.imageUrl) {
    ElMessage.error('请填写完整信息')
    return
  }
  if (isEdit.value) {
    await updateBanner(form.value._id, form.value)
    ElMessage.success('更新成功')
  } else {
    await addBanner(form.value)
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
  loadBanners()
}
const uploadBanner = async (option) => {
  const url = await uploadToCos(option.file)
  form.value.imageUrl = url
  ElMessage.success('上传成功')
}
onMounted(() => {
  loadBanners()
})
</script>

<style src="./banner-list.css"></style> 