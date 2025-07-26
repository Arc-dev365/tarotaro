<template>
  <view class="reading-container">
    <!-- 牌面显示区域 -->
    <view class="cards-display">
      <view class="card-item" v-for="(card, index) in reading.cards" :key="index">
        <image class="card-image" :src="card.img || '/static/tarot/major/0-愚者.jpg'" mode="aspectFit" :class="{'reversed-image': !card.isUpright}"></image>
        <view class="card-info">
          <view class="card-name">{{ card.name }}</view>
          <view class="card-orientation" :class="{'reversed': !card.isUpright}">
            {{ card.isUpright ? '正位' : '逆位' }}
          </view>
        </view>
      </view>
    </view>
    
    <!-- 解读内容区域 -->
    <view class="reading-content">
      <view v-if="!formattedReading" class="loading-indicator">
        <view class="loading-text">正在解读中...</view>
        <view class="loading-dots">
          <view class="dot"></view>
          <view class="dot"></view>
          <view class="dot"></view>
        </view>
      </view>
      <rich-text v-else :nodes="formattedReading"></rich-text>
    </view>
    
    <view class="action-buttons">
      <button class="share-btn" @click="shareReading">分享解读</button>
      <button class="save-btn" @click="saveReading">保存解读</button>
    </view>
    
    <view class="navigation-buttons">
      <button class="back-btn" @click="goBack">返回</button>
      <button class="home-btn" @click="goHome">回到首页</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      reading: {
        id: '',
        date: '',
        type: '',
        question: '',
        cards: [],
        reading: ''
      },
      formattedReading: '',
      currentDate: ''
    }
  },
  onLoad(options) {
    this.setCurrentDate();
    
    // 如果有传入的阅读ID，从存储中获取
    if (options.id) {
      this.loadReadingById(options.id);
    } else if (options.type) {
      // 如果是从其他页面直接传入的阅读数据
      // 这种情况通常是从临时存储中获取
      this.loadTempReading();
    }
  },
  methods: {
    setCurrentDate() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      this.currentDate = `${year}年${month}月${day}日`;
    },
    loadReadingById(id) {
      // 从存储中获取所有阅读
      const recentReadings = uni.getStorageSync('recent_readings') || [];
      const reading = recentReadings.find(r => r.id === id);
      
      if (reading) {
        this.reading = reading;
        this.formatReading();
      } else {
        uni.showToast({
          title: '未找到该解读',
          icon: 'none'
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      }
    },
    loadTempReading() {
      // 从临时存储中获取
      const tempReading = uni.getStorageSync('temp_reading');
      if (tempReading) {
        this.reading = tempReading;
        this.formatReading();
        // 使用后清除临时存储
        uni.removeStorageSync('temp_reading');
      } else {
        uni.showToast({
          title: '未找到解读数据',
          icon: 'none'
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      }
    },
    formatReading() {
      // 将纯文本转换为富文本格式
      if (this.reading.reading) {
        let formatted = this.reading.reading
          .replace(/\n\n/g, '<br><br>')
          .replace(/\n/g, '<br>')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        this.formattedReading = formatted;
      }
    },
    getPositionName(index, type) {
      // 根据不同的塔罗类型返回不同的位置名称
      if (type === '今日塔罗') {
        const positions = ['过去', '现在', '未来'];
        return positions[index] || `位置${index + 1}`;
      } else if (type === '快速塔罗' || type === '定向塔罗') {
        const positions = ['过去/根源', '现在/情况', '未来/结果'];
        return positions[index] || `位置${index + 1}`;
      } else {
        // 默认的三张牌位置
        const positions = ['过去', '现在', '未来'];
        return positions[index] || `位置${index + 1}`;
      }
    },
    shareReading() {
      // 分享功能实现
      uni.showModal({
        title: '分享',
        content: '分享功能开发中，敬请期待',
        showCancel: false
      });
    },
    saveReading() {
      // 保存功能 - 由于已经在存储中，这里只是提示
      uni.showToast({
        title: '解读已保存',
        icon: 'success'
      });
    },
    goBack() {
      uni.navigateBack();
    },
    goHome() {
      uni.switchTab({
        url: '/pages/home/home'
      });
    }
  }
}
</script>

<style>
.reading-container {
  min-height: 100vh;
  background-color: #F8F8F8;
  padding-bottom: 50rpx;
}

.cards-display {
  padding: 30rpx;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  background-color: #FFFFFF;
  margin-bottom: 20rpx;
}

.card-item {
  width: 200rpx;
  margin: 10rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-image {
  width: 180rpx;
  height: 300rpx;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
}

.reversed-image {
  transform: rotate(180deg);
}

.card-info {
  margin-top: 10rpx;
  text-align: center;
}

.card-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.card-orientation {
  font-size: 24rpx;
  color: #666;
  margin-top: 5rpx;
}

.card-orientation.reversed {
  color: #E53935;
}

.question-container {
  background-color: #FFFFFF;
  margin: 30rpx;
  padding: 20rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
}

.question-label {
  font-size: 28rpx;
  color: #999;
  margin-bottom: 10rpx;
}

.question-text {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
}

.cards-display {
  display: flex;
  justify-content: space-around;
  padding: 30rpx;
  background-color: #FFFFFF;
  margin: 0 30rpx 30rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
}

.card-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 180rpx;
}

.card-image {
  width: 180rpx;
  height: 300rpx;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.2);
  transition: transform 0.5s ease;
  object-fit: contain;
  background-color: #f5f5f5;
}

.reversed-image {
  transform: rotate(180deg);
}

.card-name {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  margin-top: 15rpx;
  text-align: center;
}

.card-position {
  font-size: 24rpx;
  color: #666;
  margin-top: 5rpx;
  text-align: center;
}

.reading-content {
  background-color: #FFFFFF;
  margin: 0 30rpx 30rpx;
  padding: 30rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
  line-height: 1.6;
  font-size: 28rpx;
  color: #333;
  min-height: 400rpx;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50rpx 0;
}

.loading-text {
  font-size: 32rpx;
  color: #666;
  margin-bottom: 30rpx;
}

.loading-dots {
  display: flex;
}

.dot {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  background-color: #673AB7;
  margin: 0 10rpx;
  animation: dot-flashing 1.4s infinite linear alternate;
  animation-delay: 0s;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dot-flashing {
  0% {
    opacity: 0.2;
  }
  100% {
    opacity: 1;
  }
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  padding: 0 30rpx;
  margin-bottom: 30rpx;
}

.share-btn, .save-btn {
  width: 48%;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  border-radius: 40rpx;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.share-btn {
  background-color: #673AB7;
  color: #FFFFFF;
}

.save-btn {
  background-color: #FFFFFF;
  color: #673AB7;
  border: 1rpx solid #673AB7;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  padding: 0 30rpx;
}

.back-btn, .home-btn {
  width: 48%;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  border-radius: 40rpx;
  font-size: 28rpx;
  background-color: #F5F5F5;
  color: #333;
  border: 1rpx solid #E0E0E0;
}
</style>