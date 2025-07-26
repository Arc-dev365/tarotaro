import { createPinia } from 'pinia';

// 导出pinia实例
export const pinia = createPinia();

// 导出所有store
export * from './tarotStore';