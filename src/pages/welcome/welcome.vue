<template>
  <view class="welcome-container" @click="navigateToHome">
    <image class="bg-image" src="/static/tarot/welcome-bg.svg" mode="aspectFill"></image>
    
    <view class="content">
      <view class="logo-container fade-in">
        <image class="logo" src="/static/tarot/logo.svg" mode="aspectFit"></image>
      </view>
      
      <view class="title-container slide-up">
        <text class="title">塔罗占卜</text>
        <text class="subtitle">探索命运的奥秘</text>
      </view>
      
      <view class="tap-hint fade-in">
        <text>点击任意位置进入</text>
        <view class="arrow-down">
          <view class="arrow"></view>
          <view class="arrow"></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {}
  },
  onLoad() {
    // 不再自动跳转，由用户点击进入
    console.log('Welcome page loaded');
  },
  methods: {
    navigateToHome() {
      // 标记欢迎页已显示
      uni.setStorageSync('welcome_shown', true)
      
      // 检查用户是否已登录
      const userId = uni.getStorageSync('userId');
      console.log('用户ID:', userId);
      
      if (userId) {
        // 已登录，跳转到主页
        console.log('用户已登录，跳转到主页');
        uni.switchTab({
          url: '/pages/home/home',
          success: function() {
            console.log('跳转到主页成功');
          },
          fail: function(err) {
            console.error('跳转到主页失败:', err);
          }
        });
      } else {
        // 未登录，跳转到登录页
        console.log('用户未登录，跳转到登录页');
        uni.navigateTo({
          url: '/pages/login/login',
          success: function() {
            console.log('跳转到登录页成功');
          },
          fail: function(err) {
            console.error('跳转到登录页失败:', err);
          }
        });
      }
    }
  }
}
</script>

<style>
.welcome-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.bg-image {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
}

.content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 15% 0 10%;
  box-sizing: border-box;
}

.logo-container {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 60rpx;
}

.logo {
  width: 100%;
  height: 100%;
}

.title-container {
  text-align: center;
  margin-bottom: 60rpx;
}

.title {
  display: block;
  font-size: 60rpx;
  font-weight: bold;
  color: #FFFFFF;
  margin-bottom: 20rpx;
  text-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.3);
}

.subtitle {
  display: block;
  font-size: 36rpx;
  color: #E1BEE7;
  letter-spacing: 4rpx;
}

.tap-hint {
  position: absolute;
  bottom: 10%;
  left: 0;
  right: 0;
  text-align: center;
  color: #FFFFFF;
  font-size: 28rpx;
  opacity: 0.8;
  animation: pulse 2s infinite;
}

.arrow-down {
  margin-top: 20rpx;
  height: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.arrow {
  width: 20rpx;
  height: 20rpx;
  border-right: 3rpx solid #FFFFFF;
  border-bottom: 3rpx solid #FFFFFF;
  transform: rotate(45deg);
  margin-top: -10rpx;
  opacity: 0.8;
  animation: arrowBlink 2s infinite;
}

.arrow:nth-child(2) {
  animation-delay: 0.5s;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

@keyframes arrowBlink {
  0%, 100% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.8;
  }
}
</style>