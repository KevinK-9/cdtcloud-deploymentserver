import { notification } from 'antd'
import { ApiOutlined, DeleteOutlined, DisconnectOutlined, InfoOutlined, LinkOutlined } from '@ant-design/icons'
import React from 'react'
import { Connector, Device } from '@prisma/client'
import { ServerMessage } from '../services/WebsocketService'
import { typeIdToName } from '../util/deviceMapping'

export const openNotification = async (title: string, content: JSX.Element, icon: JSX.Element): Promise<void> => {
  notification.info({
    message: title,
    icon,
    description: content,
    placement: 'bottomRight',
  })
}

export const connectorEvent = async (resp: ServerMessage): Promise<void> => {
  const type = resp.type

  if (type === 'connector') {
    const event = resp.data.event
    const connector = resp.data.connector as Connector

    let icon: JSX.Element
    let titleEvent: string

    switch (event) {
      case 'add':
        icon = <ApiOutlined/>
        titleEvent = 'added'
        break
      case 'remove':
        icon = <DeleteOutlined/>
        titleEvent = 'removed'
        break
      case 'connect':
        icon = <LinkOutlined/>
        titleEvent = 'connected'
        break
      case 'disconnect':
        titleEvent = 'disconnected'
        icon = <DisconnectOutlined/>
        break
      default:
        icon = <InfoOutlined/>
        titleEvent = 'Info'
        break
    }

    const connectorMessage = (
      <>
        Id: {connector.id}
      </>
    )
    await openNotification(`Connector ${titleEvent}`, connectorMessage, icon)
  }
}

export const deviceEvent = async (resp: ServerMessage): Promise<void> => {
  const type = resp.type

  if (type === 'device') {
    const event = resp.data.event
    const device = resp.data.device as Device

    let icon: JSX.Element
    let titleEvent: string

    switch (event) {
      case 'add':
        icon = <LinkOutlined/>
        titleEvent = 'added'
        break
      case 'remove':
        icon = <DisconnectOutlined/>
        titleEvent = 'removed'
        break
      default:
        icon = <InfoOutlined/>
        titleEvent = 'Info'
        break
    }

    const deviceTypeName = await typeIdToName(device.deviceTypeId)
    const deviceMessage = (
      <>
        Id: {device.id}
        <br/>
        Connector: {device.connectorId}
        <br/>
        Type: {deviceTypeName}
      </>
    )
    await openNotification(`Device ${titleEvent}`, deviceMessage, icon)
  }
}
