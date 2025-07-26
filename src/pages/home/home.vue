<template>
  <view class="home-container">
    <!-- 日期和天气显示 -->
    <view class="date-weather-box">
      <view class="date">{{ currentDate }}</view>
      <view class="weather">
        <image class="weather-icon" :src="isNightTime ? '/static/tarot/major/RWS_Tarot_18_Moon.jpg' : '/static/tarot/major/RWS_Tarot_19_Sun.jpg'" mode="aspectFit"></image>
      </view>
    </view>
    
    <!-- 主图显示区域 -->
    <view class="main-image-box">
      <image class="main-image" src="/static/tarot/main.png" mode="widthFix"></image>
    </view>
    
    <view class="features-container">
      <view class="section-title">选择占卜方式</view>
      
      <view class="feature-cards">
        <!-- 今日塔罗 (左侧) -->
        <view class="feature-card daily-card" @click="navigateTo('/pages/daily/daily')">
          <view class="card-content">
            <view class="card-title">今日塔罗</view>
          </view>
        </view>
        
        <view class="right-cards">
          <!-- 快速塔罗 (右上) -->
          <view class="feature-card quick-card" @click="navigateTo('/pages/quick/quick')">
            <view class="card-content">
              <view class="card-title">快速塔罗</view>
            </view>
          </view>
          
          <!-- 定向塔罗 (右下) -->
          <view class="feature-card custom-card" @click="navigateTo('/pages/custom/custom')">
            <view class="card-content">
              <view class="card-title">定向塔罗</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <view class="recent-readings-container">
      <view class="section-title">最近解读</view>
      
      <scroll-view class="recent-readings" scroll-x="true" v-if="recentReadings.length > 0">
        <view 
          class="reading-card" 
          v-for="(reading, index) in recentReadings" 
          :key="index"
          @click="viewReading(reading)"
        >
          <view class="reading-type">{{ reading.type }}</view>
          <view class="reading-date">{{ reading.date }}</view>
          
          <view class="reading-cards-preview">
            <image 
              v-for="(card, cardIndex) in reading.cards" 
              :key="cardIndex" 
              :src="card.img || '/static/tarot/major/0-愚者.jpg'" 
              mode="aspectFit"
              class="preview-card-image"
            ></image>
          </view>
          
          <view class="reading-question">
            {{ reading.question ? truncateText(reading.question, 15) : '塔罗牌阵解读' }}
          </view>
        </view>
      </scroll-view>
      
      <!-- 没有解读记录时显示提示 -->
      <view class="no-readings" v-if="recentReadings.length === 0">
        <text>您还没有解读记录，开始您的第一次塔罗占卜吧！</text>
      </view>
    </view>
    
    <view class="app-download">
      <view class="section-title">APP下载</view>
      <view class="download-content">
        敬请期待...
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentDate: '',
      isNightTime: false,
      recentReadings: []
    }
  },
  onLoad() {
    this.setCurrentDate();
    this.checkNightTime();
  },
  onShow() {
    // 每次页面显示时重新加载最近的解读
    this.loadRecentReadings();
  },
  methods: {
    setCurrentDate() {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      this.currentDate = `${year}年${month}月${day}日`;
    },
    checkNightTime() {
      const hour = new Date().getHours();
      // 晚6点到早6点显示月亮图标
      this.isNightTime = (hour >= 18 || hour < 6);
    },
    navigateTo(url) {
      // 对于tabBar页面，使用switchTab进行页面跳转
      uni.switchTab({
        url: url
      });
    },
    loadRecentReadings() {
      // 从本地存储加载最近的解读记录
      const readings = uni.getStorageSync('recent_readings') || [];
      this.recentReadings = readings.slice(0, 3); // 只显示最近3条
    },
    viewReading(reading) {
      // 导航到解读详情页
      uni.navigateTo({
        url: '/pages/reading/reading?id=' + reading.id
      });
    },
    truncateText(text, length) {
      if (!text) return '无具体问题';
      return text.length > length ? text.substring(0, length) + '...' : text;
    }
  }
}
</script>

<style>
.no-readings {
  padding: 30rpx;
  text-align: center;
  background-color: #FFFFFF;
  border-radius: 10rpx;
  margin: 20rpx 0;
  color: #666;
  font-size: 28rpx;
}
.home-container {
  min-height: 100vh;
  background-color: #F8F8F8;
  display: flex;
  flex-direction: column;
  padding: 20rpx;
}

.date-weather-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
}

.date {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.weather {
  display: flex;
  align-items: center;
}

.weather-icon {
  width: 60rpx;
  height: 60rpx;
}

.main-image-box {
  width: 100%;
  overflow: hidden;
  margin-bottom: 20rpx;
  display: flex;
  justify-content: center;
  padding: 10rpx 0;
}

.main-image {
  width: 100%;
  height: auto;
  border: 1rpx solid #E5E5EA;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
}

.features-container {
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 30rpx;
}

.feature-cards {
  display: flex;
  gap: 20rpx;
}

.feature-card {
  border-radius: 16rpx;
  overflow: hidden;
  position: relative;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
}

.daily-card {
  flex: 1;
  height: 300rpx;
  background-color: #F0F0F0;
}

.right-cards {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.quick-card, .custom-card {
  height: 140rpx;
  background-color: #F0F0F0;
}

.card-content {
  position: relative;
  z-index: 2;
  padding: 20rpx;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.card-title {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
}

.recent-readings-container {
  margin-bottom: 20rpx;
  padding: 20rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
}

.recent-readings {
  white-space: nowrap;
  width: 100%;
}

.reading-card {
  display: inline-block;
  width: 300rpx;
  height: 240rpx; /* 固定高度 */
  margin-right: 20rpx;
  padding: 20rpx;
  background-color: #F5F5F5;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.reading-type {
  font-size: 28rpx;
  font-weight: bold;
  color: #673AB7;
  margin-bottom: 10rpx;
}

.reading-date {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 10rpx;
}

.reading-cards-preview {
  display: flex;
  margin-bottom: 10rpx;
}

.preview-card-image {
  width: 80rpx;
  height: 120rpx;
  margin-right: 10rpx;
}

.reading-question {
  font-size: 24rpx;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  -webkit-line-clamp: 1;
}

.app-download {
  padding: 20rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
  margin-bottom: 20rpx;
}

.download-content {
  padding: 30rpx;
  text-align: center;
  color: #666;
  font-size: 28rpx;
  background-color: #F5F5F5;
  border-radius: 12rpx;
}
</style>