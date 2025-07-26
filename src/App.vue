<script>
export default {
	onLaunch: function() {
		console.log('App Launch - 应用启动')
		// 初始化应用数据
		this.initAppData()
		// 打印当前路由信息
		console.log('当前路由:', getCurrentPages())
	},
	onShow: function() {
		console.log('App Show')
	},
	onHide: function() {
		console.log('App Hide')
	},
	methods: {
		initAppData() {
			// 检查是否是首次启动应用
			const isFirstLaunch = !uni.getStorageSync('app_launched')
			if (isFirstLaunch) {
				// 标记应用已启动
				uni.setStorageSync('app_launched', true)
			}
			
			// 每次启动都检查并初始化最近解读列表
			const currentReadings = uni.getStorageSync('recent_readings')
			if (!currentReadings || currentReadings.length === 0) {
				const mockReadings = [
					{
						id: '1',
						type: '今日塔罗',
						date: '2023-10-15',
						cards: [
							{ img: '/static/tarot/major/RWS_Tarot_01_Magician.jpg' },
							{ img: '/static/tarot/major/RWS_Tarot_02_High_Priestess.jpg' }
						],
						question: '今日运势如何？'
					},
					{
						id: '2',
						type: '快速塔罗',
						date: '2023-10-14',
						cards: [
							{ img: '/static/tarot/major/RWS_Tarot_19_Sun.jpg' }
						],
						question: '事业发展方向'
					},
					{
						id: '3',
						type: '定向塔罗',
						date: '2023-10-13',
						cards: [
							{ img: '/static/tarot/major/RWS_Tarot_06_Lovers.jpg' },
							{ img: '/static/tarot/major/RWS_Tarot_10_Wheel_of_Fortune.jpg' },
							{ img: '/static/tarot/major/RWS_Tarot_14_Temperance.jpg' }
						],
						question: '感情问题咨询'
					}
				];
				uni.setStorageSync('recent_readings', mockReadings);
				console.log('初始化近日解读数据');
			}
			
			// 登录状态检查在welcome页面处理
			// 不再自动设置模拟用户
		}
	}
}
</script>

<style>
/* 全局CSS样式 */
/* 重置样式 */
page {
	min-height: 100%;
	background-color: #F8F8F8;
	font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
}

/* 通用样式 */
.container {
	padding: 30rpx;
}

.header {
	background-color: #673AB7;
	padding: 40rpx 30rpx;
	color: #FFFFFF;
}

.title {
	font-size: 36rpx;
	font-weight: bold;
	margin-bottom: 10rpx;
}

.subtitle {
	font-size: 28rpx;
	opacity: 0.9;
}

.card {
	background-color: #FFFFFF;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.primary-btn {
	background-color: #673AB7;
	color: #FFFFFF;
	height: 90rpx;
	line-height: 90rpx;
	font-size: 32rpx;
	border-radius: 45rpx;
}

.secondary-btn {
	background-color: #FFFFFF;
	color: #673AB7;
	height: 90rpx;
	line-height: 90rpx;
	font-size: 32rpx;
	border-radius: 45rpx;
	border: 1rpx solid #673AB7;
}

/* 动画效果 */
@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@keyframes slideUp {
	from {
		transform: translateY(50rpx);
		opacity: 0;
	}
	to {
		transform: translateY(0);
		opacity: 1;
	}
}

.fade-in {
	animation: fadeIn 0.5s ease-in-out;
}

.slide-up {
	animation: slideUp 0.5s ease-in-out;
}
</style>
