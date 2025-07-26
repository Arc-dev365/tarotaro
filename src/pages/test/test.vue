<template>
  <view class="test-container">
    <view class="header">
      <text class="title">API测试页面</text>
    </view>
    
    <view class="test-section">
      <button class="test-button" @click="testQianwenAPI">测试通义千问API</button>
      <view class="status" :class="{success: apiStatus === 'success', error: apiStatus === 'error'}">
        状态: {{ statusText }}
      </view>
      
      <view class="response-container" v-if="responseContent">
        <text class="response-title">API响应:</text>
        <scroll-view class="response-content" scroll-y>
          <text>{{ responseContent }}</text>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
import aiInsightService from '@/utils/ai-insight-service.js';

export default {
  onLoad() {
    // 自动重定向到登录页面
    uni.redirectTo({
      url: '/pages/login/login',
      fail: (err) => {
        console.error('重定向到登录页面失败:', err);
        // 备选方案：使用reLaunch
        uni.reLaunch({
          url: '/pages/login/login'
        });
      }
    });
  },
  data() {
    return {
      apiStatus: 'idle', // idle, loading, success, error
      statusText: '未测试',
      responseContent: '',
      streamContent: ''
    };
  },
  methods: {
    async testQianwenAPI() {
      this.apiStatus = 'loading';
      this.statusText = '测试中...';
      this.responseContent = '';
      this.streamContent = '';
      
      try {
        // 模拟卡牌数据
        const mockCards = [
          {
            name: '愚者',
            isUpright: true,
            uprightMeaning: '新的开始，冒险，无忧无虑',
            reversedMeaning: '鲁莽，冒险，愚蠢的决定',
            position: '过去/问题根源'
          },
          {
            name: '魔术师',
            isUpright: true,
            uprightMeaning: '创造力，技能，专注',
            reversedMeaning: '操纵，欺骗，才能浪费',
            position: '现在/当前情况'
          },
          {
            name: '高priestess',
            isUpright: false,
            uprightMeaning: '直觉，潜意识，神圣女性',
            reversedMeaning: '秘密，断开连接，表面知识',
            position: '未来/可能结果'
          }
        ];
        
        // 调用AI解读服务
        await aiInsightService.generateAIInsight(
          mockCards,
          'general',
          '今日运势如何？',
          'daily',
          '基础解读内容：今天的牌面显示你正处于一个新的开始阶段，充满创造力，但需要注意直觉的指引。',
          (text) => {
            this.streamContent = text;
            this.responseContent = text;
          }
        );
        
        this.apiStatus = 'success';
        this.statusText = '测试成功';
      } catch (error) {
        console.error('API测试失败:', error);
        this.apiStatus = 'error';
        this.statusText = `测试失败: ${error.message}`;
        this.responseContent = `错误信息: ${error.message}`;
      }
    }
  }
};
</script>

<style>
.test-container {
  padding: 30rpx;
}

.header {
  margin-bottom: 40rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.test-section {
  background-color: #f8f8f8;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.test-button {
  background-color: #673AB7;
  color: white;
  margin-bottom: 20rpx;
}

.status {
  padding: 20rpx;
  margin: 20rpx 0;
  border-radius: 8rpx;
  background-color: #eee;
}

.status.success {
  background-color: #e6f7e6;
  color: #2e7d32;
}

.status.error {
  background-color: #ffebee;
  color: #c62828;
}

.response-container {
  margin-top: 30rpx;
}

.response-title {
  font-weight: bold;
  margin-bottom: 10rpx;
  display: block;
}

.response-content {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8rpx;
  padding: 20rpx;
  height: 600rpx;
  word-break: break-all;
  white-space: pre-wrap;
}
</style>