import type { DeviceType } from '@prisma/client'
export type TypeStatus = SimpleTypeStatus | QueueableTypeStatus

export enum DeviceTypeStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  BUSY = 'BUSY',
  QUEUEABLE = 'QUEUEABLE'
}

export interface SimpleTypeStatus {
  status: DeviceTypeStatus.AVAILABLE | DeviceTypeStatus.UNAVAILABLE | DeviceTypeStatus.BUSY
}

export interface QueueableTypeStatus {
  status: DeviceTypeStatus.QUEUEABLE
  queueLength: number
}

export interface DeviceTypeWithCount extends DeviceType {
  numberOfDevices: number
}

export interface DeviceTypeResource extends DeviceTypeWithCount {
  status: DeviceTypeStatus
  queueLength?: number
  history: Record<string, {
    issueCount: number
    deploymentCount: {
      SUCCESS: number
      FAILED: number
      TERMINATED: number
    }
  }>
  estimatedQueueTime: number
}

export type { DeviceType }
