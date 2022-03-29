/********************************************************************************
    Copyright (c) 2022 EclipseSource and others.

    This program and the accompanying materials are made available under the
    terms of the Eclipse Public License v. 2.0 which is available at
    http://www.eclipse.org/legal/epl-2.0.

    This Source Code may also be made available under the following Secondary
    Licenses when the conditions for such availability set forth in the Eclipse
    Public License v. 2.0 are satisfied: GNU General Public License, version 2
    with the GNU Classpath Exception which is available at
    https://www.gnu.org/software/classpath/license.html.

    SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
********************************************************************************/

import { DeployRequest, Device, DeviceTypeResource } from 'deployment-server'
import { useEffect, useState } from 'react'
import defineFunctionalComponent from '../util/defineFunctionalComponent'
import { Card, Col, Row, Spin, Statistic } from 'antd'
import { useInterval } from 'react-use'
import { useParams } from 'react-router-dom'
import { StatusTag } from '../components/StatusTag'
import DeploymentsStatusGraph from '../components/Graphs/DeploymentsStatusGraph'
import IssueCountGraph from '../components/Graphs/IssueCountGraph'
import { DeviceStatus } from './Devices'

const { Meta } = Card

export default defineFunctionalComponent(function TypeId () {
  const [loading, setLoading] = useState<boolean>(true)
  const [devices, setDevices] = useState<Device[]>([])
  const [deviceType, setDeviceType] = useState<DeviceTypeResource>()
  const [deployments, setDeployments] = useState<DeployRequest[]>([])
  const [deviceCount, setDeviceCount] = useState<number>(0)
  const [refetchFlip, setRefetchFlip] = useState<boolean>(false)

  const { id } = useParams()

  function findDeviceById (id: string): Device | undefined {
    return devices.find((device) => id === device.id)
  }

  useInterval(function () {
    setRefetchFlip(!refetchFlip)
  }, 1000)

  useEffect(() => {
    const fetchAsync = async (): Promise<void> => {
      const typesRes = await fetch(`/api/device-types/${id !== undefined ? id : ''}`)
      const types = await typesRes.json()
      setDeviceType(types)

      const devRes = await fetch('/api/devices')
      const devs = await devRes.json()
      setDevices(devs.filter((dev: Device) => dev.deviceTypeId === id))

      const deployRes = await fetch('/api/deployments')
      const deploys = await deployRes.json()
      setDeployments(deploys.filter((deployment: DeployRequest) => deployment.deviceId === findDeviceById(deployment.deviceId)?.id))

      const amount = devices.filter((dev: Device) => dev.status !== DeviceStatus.UNAVAILABLE).length
      setDeviceCount(amount)
    }

    fetchAsync().catch((e) => console.log(e))
  }, [refetchFlip])

  useEffect(() => {
    if (
      devices != null &&
      deviceType != null &&
      deployments != null &&
      loading
    ) {
      setLoading(false)
    }
  }, [devices, deviceType, deployments])

  useEffect(() => {
    const fetchAsync = async (): Promise<void> => {
      const typesRes = await fetch(`/api/device-types/${id !== undefined ? id : ''}`)
      const types = await typesRes.json()
      setDeviceType(types)

      const deployRes = await fetch('/api/deployments')
      const deploys = await deployRes.json()
      setDeployments(
        deploys.filter(
          (deployment: DeployRequest) =>
            deployment.deviceId === findDeviceById(deployment.deviceId)?.id
        )
      )
    }

    fetchAsync().catch((e) => console.log(e))
  }, [refetchFlip])

  const pendingCards = deployments
    .filter(
      (deployment) =>
        deployment.status === 'PENDING' && findDeviceById(deployment.deviceId)
    )
    .map((deployment: DeployRequest) => (
      <div key={deployment.id}>
        <Row gutter={[0, 16]}>
          <Card
            bordered
            style={{ width: 260 }}
            cover={<StatusTag status={deployment.status} addIcon/>}
          >
            <Meta description={deployment.id}/>
          </Card>
        </Row>
      </div>
    ))

  const currentCards = deployments
    .filter(
      (deployment) =>
        deployment.status === 'RUNNING' && findDeviceById(deployment.deviceId)
    )
    .map((deployment: DeployRequest) => (
      <div key={deployment.id}>
        <Card
          bordered
          style={{ width: 260 }}
          cover={<StatusTag status={deployment.status} addIcon/>}
        >
          <Meta description={deployment.id}/>
        </Card>
      </div>
    ))

  const otherCards = deployments
    .filter(
      (deployment) =>
        deployment.status !== 'PENDING' &&
        deployment.status !== 'RUNNING' &&
        findDeviceById(deployment.deviceId)
    )
    .map((deployment: DeployRequest) => (
      <div key={deployment.id}>
        <Card
          bordered
          style={{ width: 260 }}
          cover={<StatusTag status={deployment.status} addIcon/>}
        >
          <Meta description={deployment.id}/>
        </Card>
      </div>
    ))

  return (
    <main>
      {loading
        ? (
        <Spin tip={'Loading...'}/>
          )
        : (
        <div>
          <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 16 }, 20]} align={'middle'}>
            <Col span={9}>
              <Card
                title={(deviceType != null) ? deviceType.name : ''}
                style={{ height: '400px', overflow: 'auto' }}
              >
                <Row>
                  <Col span={12}>
                    <Statistic
                      title={'Number of devices'}
                      value={deviceCount}
                      valueStyle={{ color: 'black' }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title={'Current Queue Length'}
                      value={(deviceType != null) ? deviceType.queueLength : '-'}
                      valueStyle={{ color: 'black' }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Statistic
                      title={'FQBN'}
                      value={(deviceType != null) ? deviceType.fqbn : '0'}
                      valueStyle={{ color: 'black' }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Statistic
                      title={'Status'}
                      value={(deviceType != null) ? deviceType.status : ''}
                      valueStyle={{ color: 'black' }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title={'Device Type ID'}
                      value={(deviceType != null) ? deviceType.id : '0'}
                      valueStyle={{ color: 'black' }}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={5}>
              <Card
                title={'Pending Deployments'}
                style={{ height: '400px', overflow: 'auto' }}
              >
                <Row>{pendingCards}</Row>
              </Card>
            </Col>
            <Col span={5}>
              <Card
                title={'Current Deployments'}
                style={{ height: '400px', overflow: 'auto' }}
              >
                <Row>{currentCards}</Row>
              </Card>
            </Col>
            <Col span={5}>
              <Card
                title={'Finished Deployments'}
                style={{ height: '400px', overflow: 'auto' }}
              >
                <Row>{otherCards}</Row>
              </Card>
            </Col>
          </Row>
          <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 16 }, 20]}>
            <Col span={12}>
              <Card title={'Deployments Status'}>
                <DeploymentsStatusGraph data={ deviceType != null ? deviceType.history : { 'Unknown Device Type': { issueCount: -1, deploymentCount: { SUCCESS: -1, FAILED: -1, TERMINATED: -1 } } } }/>
              </Card>
            </Col>
            <Col span={12}>
              <Card title={'Issues Over Time'}>
                <IssueCountGraph data={ deviceType != null ? deviceType.history : { 'Unknown Device Type': { issueCount: -1, deploymentCount: { SUCCESS: -1, FAILED: -1, TERMINATED: -1 } } } }/>
              </Card>
            </Col>
          </Row>
        </div>
          )}
    </main>
  )
})
