/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TabId = 'overview' | 'monitoring' | 'client-view' | 'pets';

export interface BunnyGuest {
  id: string;
  name: string;
  breed: string; // 品種
  gender: '公' | '母'; // 性別
  checkInDate: string; // 入住時間
  checkOutDate: string; // 退房時間
  currentBehavior: string; // 當前行為
  humidity: number; // 濕度 %
  temperature: number; // 溫度 °C
  notes: string; // 注意事項
  extraServices: string; // 附加服務
  avatarUrl?: string; // 頭像
  age?: number; // 年齒 / 歲數
  weight?: number; // 體重 (kg)
  vaccinated?: boolean; // 是否已接種疫苗
  color?: string; // 顏色
  birthday?: string; // 出生日期
  status?: string; // 狀態 (例如 "健康", "監測中", "觀察中")
  photosCount?: number; // 照片數量
  videosCount?: number; // 影片數量
  longNotes?: string; // 詳細備註/性格說明
  healthRecords?: string[]; // 健康紀錄清單
}

export interface CameraFeed {
  id: string;
  name: string; // 特大籠房間1號, etc.
  isOnline: boolean;
  currentBehavior: string; // 休息, 進食, etc.
  bunnyId?: string; // Current bunny in camera view
  bunnyName?: string;
  isLive: boolean;
  vibeText?: string;
}

export interface BehaviorStats {
  date: string; // Year-Month-Day
  activityCount: number; // 活動次數
  restingCount: number; // 休息次數
  eatingCount: number; // 進食次數
  drinkingCount: number; // 飲水次數
  averageOver3Days: number; // 3天平均
}

export interface ActivityClip {
  id: string;
  timestamp: string; // e.g. 2026年4月16日 12:44 下午
  bunnyName: string;
  action: string; // e.g., 在放風區喝水30s
  thumbnailUrl: string; // Simulated video thumbnail
  isUrgent: boolean; // 緊急異常
}

export interface LogTemplateConfig {
  date: string;
  bunnyId: string;
  summaryText: string;
  showClips: boolean;
  selectedClips: string[]; // Clip ids
}
