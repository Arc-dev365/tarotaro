<template>
  <view class="api-test-container">
    <view class="header">
      <text class="title">网页版API测试页面</text>
      <text class="subtitle">测试通义千问API流式解读功能</text>
    </view>
    
    <view class="test-section">
      <button class="test-button" @click="testQianwenAPI">测试通义千问API</button>
      <view class="status" :class="{success: apiStatus === 'success', error: apiStatus === 'error', loading: apiStatus === 'loading'}">
        状态: {{ statusText }}
      </view>
      
      <view class="response-container" v-if="responseContent || apiStatus === 'loading'">
        <text class="response-title">API响应:</text>
        <view class="loading-indicator" v-if="apiStatus === 'loading'">
          <view class="loading-dots">
            <view class="dot"></view>
            <view class="dot"></view>
            <view class="dot"></view>
          </view>
        </view>
        <scroll-view class="response-content" scroll-y>
          <rich-text :nodes="formattedResponse"></rich-text>
        </scroll-view>
      </view>
      
      <view class="metrics" v-if="metrics.totalTime > 0">
        <text class="metrics-title">性能指标:</text>
        <view class="metrics-item">
          <text>首次响应时间: {{ metrics.firstChunkTime }}ms</text>
        </view>
        <view class="metrics-item">
          <text>总响应时间: {{ metrics.totalTime }}ms</text>
        </view>
        <view class="metrics-item">
          <text>内容块数量: {{ metrics.chunkCount }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import aiInsightService from '@/utils/ai-insight-service.js';
import performanceMonitor from '@/utils/performance-monitor.js';

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
      formattedResponse: '',
      metrics: {
        firstChunkTime: 0,
        totalTime: 0,
        chunkCount: 0
      },
      startTime: 0
    };
  },
  methods: {
    async testQianwenAPI() {
      this.apiStatus = 'loading';
      this.statusText = '测试中...';
      this.responseContent = '';
      this.formattedResponse = '';
      this.metrics = {
        firstChunkTime: 0,
        totalTime: 0,
        chunkCount: 0
      };
      
      // 记录开始时间
      this.startTime = Date.now();
      let firstChunkReceived = false;
      let chunkCount = 0;
      
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
            // 记录首个内容块接收时间
            if (!firstChunkReceived) {
              this.metrics.firstChunkTime = Date.now() - this.startTime;
              firstChunkReceived = true;
            }
            
            chunkCount++;
            this.metrics.chunkCount = chunkCount;
            
            this.responseContent = text;
            this.formatResponse(text);
          }
        );
        
        // 记录总响应时间
        this.metrics.totalTime = Date.now() - this.startTime;
        
        this.apiStatus = 'success';
        this.statusText = '测试成功';
      } catch (error) {
        console.error('API测试失败:', error);
        this.apiStatus = 'error';
        this.statusText = `测试失败: ${error.message}`;
        this.responseContent = `错误信息: ${error.message}`;
        this.formatResponse(this.responseContent);
      }
    },
    
    formatResponse(text) {
      try {
        let formatted = text
          // 处理标题 (# 文本)
          .replace(/^#\s+(.+)$/gm, '<h3>$1</h3>')
          // 处理粗体 (**文本**)
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          // 处理斜体 (*文本*)
          .replace(/\*([^\*]+)\*/g, '<em>$1</em>')
          // 处理有序列表项 (1. 文本)
          .replace(/^(\d+\.\s+)(.*?)$/gm, '<li>$2</li>')
          // 处理无序列表项 (- 文本)
          .replace(/^-\s+(.*?)$/gm, '<li>$1</li>')
          // 处理段落 (空行分隔)
          .replace(/\n\n/g, '</p><p>')
          // 处理换行
          .replace(/\n/g, '<br>');
        
        // 确保段落被正确包裹
        if (!formatted.startsWith('<p>') && !formatted.startsWith('<h3>')) {
          formatted = '<p>' + formatted;
        }
        if (!formatted.endsWith('</p>')) {
          formatted = formatted + '</p>';
        }
        
        // 处理列表
        formatted = formatted.replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');
        
        this.formattedResponse = formatted;
      } catch (error) {
        console.error('格式化响应内容出错:', error);
        this.formattedResponse = '<p>' + text.replace(/\n/g, '<br>') + '</p>';
      }
    }
  }
};
</script>

<style>
.api-test-container {
  padding: 30rpx;
  max-width: 800px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.header {
  margin-bottom: 40rpx;
  text-align: center;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #666;
  display: block;
}

.test-section {
  background-color: #f8f8f8;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.test-button {
  background-color: #673AB7;
  color: white;
  margin-bottom: 20rpx;
  border-radius: 8rpx;
  font-weight: bold;
  padding: 20rpx 0;
}

.status {
  padding: 20rpx;
  margin: 20rpx 0;
  border-radius: 8rpx;
  background-color: #eee;
  text-align: center;
  font-weight: bold;
}

.status.success {
  background-color: #e6f7e6;
  color: #2e7d32;
}

.status.error {
  background-color: #ffebee;
  color: #c62828;
}

.status.loading {
  background-color: #e3f2fd;
  color: #1565c0;
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

.metrics {
  margin-top: 30rpx;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  padding: 20rpx;
}

.metrics-title {
  font-weight: bold;
  margin-bottom: 10rpx;
  display: block;
}

.metrics-item {
  margin: 10rpx 0;
}

/* 加载动画 */
.loading-indicator {
  display: flex;
  justify-content: center;
  margin: 20rpx 0;
}

.loading-dots {
  display: flex;
}

.dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background-color: #673AB7;
  margin: 0 6rpx;
  animation: dot-flashing 1s infinite alternate;
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

/* 富文本样式 */
.response-content h3 {
  font-size: 32rpx;
  margin: 20rpx 0 10rpx;
  color: #673AB7;
}

.response-content p {
  margin: 10rpx 0;
  line-height: 1.6;
}

.response-content ul {
  padding-left: 40rpx;
  margin: 10rpx 0;
}

.response-content li {
  margin: 8rpx 0;
}

.response-content strong {
  font-weight: bold;
}

.response-content em {
  font-style: italic;
}
</style>