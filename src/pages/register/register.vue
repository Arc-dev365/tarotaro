<template>
  <view class="register-container">
    <!-- 顶部图片 -->
    <view class="logo-container">
      <image class="logo-image" src="/static/tarot/start.png" mode="aspectFit"></image>
    </view>
    
    <!-- 注册表单 -->
    <view class="register-form-container">
      <view class="register-form">
        <view class="input-group">
          <input class="input-field" type="text" v-model="username" placeholder="请输入用户名" />
        </view>
        
        <view class="input-group">
          <input class="input-field" type="text" v-model="phone" placeholder="请输入手机号" maxlength="11" />
        </view>
        
        <view class="input-group">
          <input class="input-field" type="password" v-model="password" placeholder="请输入密码" />
        </view>
        
        <view class="input-group">
          <input class="input-field" type="password" v-model="confirmPassword" placeholder="请确认密码" />
        </view>
        
        <!-- 注册按钮 -->
        <view class="register-btn-container">
          <button class="register-btn" @click="register">注册</button>
        </view>
        
        <!-- 返回登录 -->
        <view class="login-link-container">
          <text class="login-link" @click="goToLogin">已有账号？返回登录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { userApi } from '@/utils/api-service.js';

export default {
  data() {
    return {
      username: '',
      phone: '',
      password: '',
      confirmPassword: '',
      isLoading: false
    }
  },
  methods: {
    async register() {
      // 表单验证
      if (!this.username || !this.phone || !this.password || !this.confirmPassword) {
        uni.showToast({
          title: '请填写完整注册信息',
          icon: 'none'
        })
        return
      }
      
      // 验证用户名格式
      if (!/^[a-zA-Z0-9_]{3,20}$/.test(this.username)) {
        uni.showToast({
          title: '用户名只能包含字母、数字和下划线，长度3-20',
          icon: 'none'
        })
        return
      }
      
      // 验证手机号格式
      if (!/^1\d{10}$/.test(this.phone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        })
        return
      }
      
      // 验证密码格式
      if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/.test(this.password)) {
        uni.showToast({
          title: '密码必须包含字母和数字，长度6-20',
          icon: 'none'
        })
        return
      }
      
      // 验证密码一致性
      if (this.password !== this.confirmPassword) {
        uni.showToast({
          title: '两次输入的密码不一致',
          icon: 'none'
        })
        return
      }
      
      // 防止重复提交
      if (this.isLoading) return;
      
      this.isLoading = true
      
      try {
        // 显示加载中
        uni.showLoading({
          title: '注册中...'
        });
        
        // 构建注册数据
        const registerData = {
          username: this.username,
          phone: this.phone,
          password: this.password
        };
        
        // 调用注册API
        const response = await userApi.register(registerData);
        
        if (!response.success) {
          throw new Error(response.message || '注册失败');
        }
        
        const result = response.data;
        
        // 注册成功后跳转到登录页
        uni.showToast({
          title: '注册成功，请登录',
          icon: 'success'
        });
        
        setTimeout(() => {
          uni.navigateTo({
            url: '/pages/login/login'
          });
        }, 1500);
      } catch (error) {
        uni.showToast({
          title: error.message || '注册失败，请重试',
          icon: 'none'
        });
      } finally {
        uni.hideLoading();
        this.isLoading = false;
      }
    },
    goToLogin() {
      uni.navigateTo({
        url: '/pages/login/login'
      })
    }
  }
}
</script>

<style>
.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #F5F5F5;
}

.logo-container {
  margin-bottom: 40rpx;
  width: 100%;
  display: flex;
  justify-content: center;
}

.logo-image {
  width: 200rpx;
  height: 200rpx;
}

.register-form-container {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  width: 90%;
  padding: 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.register-form {
  width: 100%;
}

.input-group {
  margin-bottom: 30rpx;
}

.input-field {
  width: 100%;
  height: 90rpx;
  background-color: #F8F8F8;
  border-radius: 45rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.register-btn-container {
  margin-top: 40rpx;
  margin-bottom: 20rpx;
}

.register-btn {
  width: 100%;
  height: 90rpx;
  background: linear-gradient(to right, #8E2DE2, #4A00E0);
  color: #FFFFFF;
  border-radius: 45rpx;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-link-container {
  display: flex;
  justify-content: center;
  margin-top: 30rpx;
}

.login-link {
  color: #8E2DE2;
  font-size: 28rpx;
}
</style>