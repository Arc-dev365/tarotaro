<template>
  <view class="login-container">
    <!-- 图片容器 -->
    <view class="logo-container">
      <image class="logo-image" src="/static/tarot/start.png" mode="aspectFit"></image>
    </view>
    
    <!-- 登录表单 -->
    <view class="login-form-container">
      <view class="login-form">
        <view class="input-group">
          <input class="input-field" type="text" v-model="username" placeholder="请输入用户名" />
        </view>
        
        <view class="input-group">
          <input class="input-field" type="text" v-model="phone" placeholder="请输入手机号" maxlength="11" />
        </view>
        
        <view class="input-group">
          <input class="input-field" type="password" v-model="password" placeholder="请输入密码" />
        </view>
        
        <!-- 登录按钮 -->
        <view class="login-btn-container">
          <button class="login-btn" @click="login">登录</button>
        </view>
        
        <!-- 注册入口 -->
        <view class="register-container">
          <text class="register-text" @click="goToRegister">没有账号？立即注册</text>
        </view>
        
        <!-- 底部联系我们 -->
        <view class="contact-container">
          <text class="contact-text" @click="contactUs">联系我们</text>
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
      isLoading: false
    }
  },
  // 开发阶段不需要监听密码长度
  watch: {},
  methods: {
    async login() {
      // 开发阶段，点击登录直接进入主页，无需验证
      this.isLoading = true;
      
      try {
        // 显示加载中
        uni.showLoading({
          title: '登录中...'
        });
        
        // 模拟登录成功，存储默认用户信息
        uni.setStorageSync('userId', 'dev_user_123');
        uni.setStorageSync('username', 'dev_user');
        uni.setStorageSync('token', 'dev_token_123');
        
        uni.showToast({
          title: '登录成功',
          icon: 'success'
        });
        
        // 跳转到首页
        console.log('开发模式：直接跳转到首页');
        setTimeout(() => {
          uni.switchTab({
            url: '/pages/home/home',
            success: function() {
              console.log('跳转到首页成功');
            },
            fail: function(err) {
              console.error('跳转到首页失败:', err);
              // 尝试使用reLaunch作为备选方案
              uni.reLaunch({
                url: '/pages/home/home'
              });
            }
          });
        }, 1000);
      } catch (error) {
        uni.showToast({
          title: '登录失败，请重试',
          icon: 'none'
        });
      } finally {
        uni.hideLoading();
        this.isLoading = false;
      }
    },
    contactUs() {
      uni.showModal({
        title: '联系我们',
        content: '如有任何问题，请发送邮件至：support@tarotreader.com',
        showCancel: false
      })
    },
    
    goToRegister() {
      uni.navigateTo({
        url: '/pages/register/register'
      })
    }
  }
}
</script>

<style lang="scss">
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #FFFFFF;
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40rpx;
  width: 90%;
}

.logo-image {
  width: 100%;
  height: 400rpx;
  object-fit: contain;
}

.login-form-container {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  width: 80%;
  padding: 30rpx;
  /* 移除阴影边框 */
  box-shadow: none;
}

.login-form {
  width: 100%;
}

.input-group {
  margin-bottom: 25rpx;
}

.input-field {
  width: 100%;
  height: 80rpx;
  background-color: #F8F8F8;
  border-radius: 40rpx;
  padding: 0 25rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.login-btn-container {
  margin-top: 40rpx;
}

.login-btn {
  width: 100%;
  height: 80rpx;
  background: linear-gradient(to right, #8E2DE2, #4A00E0);
  color: #FFFFFF;
  border-radius: 40rpx;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-container {
  margin-top: 20rpx;
  display: flex;
  justify-content: center;
}

.register-text {
  color: #8E2DE2;
  font-size: 28rpx;
}

.contact-container {
  margin-top: 30rpx;
  display: flex;
  justify-content: center;
}

.contact-text {
  color: #666666;
  font-size: 28rpx;
}
</style>