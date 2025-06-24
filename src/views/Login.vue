<template>
  <div class="login-container">
    <div class="login-box">
      <img src="../assets/mlbb-logo.png" class="logo" alt="logo" />
      <h2 class="title">魔力宝贝后台管理系统</h2>
      <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" class="login-form">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="账号：admin" size="large" clearable />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="密码：123456" size="large" show-password clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" class="login-btn" :loading="loading" @click="handleLogin">登录</el-button>
        </el-form-item>
        <div class="login-tip">默认账号：admin&nbsp;&nbsp;密码：123456</div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loginForm = ref({ username: '', password: '' })
const loginRules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}
const loading = ref(false)
const loginFormRef = ref()

const handleLogin = async () => {
  await loginFormRef.value.validate()
  loading.value = true
  // 简单本地校验，后续可接云函数
  if (loginForm.value.username === 'admin' && loginForm.value.password === '123456') {
    localStorage.setItem('token', 'mock-token')
    router.push('/')
    ElMessage.success('登录成功')
  } else {
    ElMessage.error('账号或密码错误')
  }
  loading.value = false
}
</script>

<style src="./login.css"></style> 