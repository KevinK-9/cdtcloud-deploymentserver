import { DeployRequest, DeployStatus, DeviceType } from "deployment-server";
import { useEffect, useState } from "react";
import defineFunctionalComponent from "../util/defineFunctionalComponent";
import { Card, Col, Row, Tag } from "antd";
import axios from 'axios';
import { Device } from ".prisma/client";
import { useInterval } from "react-use";

export default defineFunctionalComponent(function DeviceId() {
  let [device, setDevice] = useState<Device | null> (null)
  let [deviceTypes, setDeviceTypes] = useState<DeviceType[]>(
    Array(15).fill({})
  );
  let [deployments, setDeployments] = useState<DeployRequest[]>(
    [{
      id: "1234",
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
      artifactUrl: null,
      deviceId: 'e6cdc2b2-0558-415d-90c5-3301d016eeae',
    }, {
      id: "12345",
      status: 'SUCCESS',
      createdAt: new Date,
      updatedAt: new Date,
      artifactUrl: null,
      deviceId: 'e6cdc2b2-0558-415d-90c5-3301d016eeae',
    }, {
      id: "123",
      status: 'RUNNING',
      createdAt: new Date,
      updatedAt: new Date,
      artifactUrl: null,
      deviceId: 'e6cdc2b2-0558-415d-90c5-3301d016eeae',
    }, {
      id: "12",
      status: 'PENDING',
      createdAt: new Date,
      updatedAt: new Date,
      artifactUrl: null,
      deviceId: 'e6cdc2b2-0558-415d-90c5-3301d016eeae',
    }, {
      id: "123456",
      status: 'FAILED',
      createdAt: new Date,
      updatedAt: new Date,
      artifactUrl: null,
      deviceId: 'e6cdc2b2-0558-415d-90c5-3301d016eeae',
    }]
  );
  let [refetchFlip, setRefetchFlip] = useState(false);

  useInterval(function () {
    setRefetchFlip(!refetchFlip);
  }, 3000);
  
  const url = window.location.href
  const strs = url.split('/');
  const deviceId = strs.at(-1)

  const status: Record<DeployStatus, { color: string; text: string }> = {
    SUCCESS: {
      color: "green",
      text: "SUCCESS",
    },
    TERMINATED: {
      color: "yellow",
      text: "TERMINATED",
    },
    FAILED: {
      color: "red",
      text: "ERROR",
    },
    PENDING: {
      color: "blue",
      text: "PENDING",
    },
    RUNNING: {
      color: "grey",
      text: "RUNNING",
    },
  };

  const pendingCards = deployments.filter((deployment) => deployment.status === 'PENDING' && deployment.deviceId === deviceId).map((deployment: DeployRequest) => (
    <div key={deployment.id}>
      <Card title={deployment.id} bordered={true} style={{ width: 200 }}>
        <p><Tag color={status[deployment.status].color}> {status[deployment.status].text} </Tag></p>
      </Card>
    </div>
  ))

  const otherCards = deployments.filter((deployment) => deployment.status !== 'PENDING' && deployment.deviceId === deviceId).map((deployment: DeployRequest) => (
    <div key={deployment.id}>
      <Row gutter={[0, 16]}>
        <Card title={deployment.id} bordered={true} style={{ width: 200 }}>
            <p><Tag color={status[deployment.status].color}> {status[deployment.status].text} </Tag></p>
        </Card>
      </Row>
    </div>
  ))
  
  useEffect(() => {
    fetch("/api/device-types").then(async (res) => {
      setDeviceTypes(await res.json());
    });
  }, []);

  useEffect(() => {
    fetch(`/api/devices/${deviceId}`).then(async (res) => {
      setDevice(await res.json());
    });
  }, []);
  // once there are deployments uncomment
  /* useEffect(() => {
    fetch("/api/deployments").then(async (res) => {
      let data = await res.json()
      console.log(data)

      setDeployments(await res.json());
    });
  }, []); */

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get<any[]>(
        "http://localhost:3001/api/deployments",
        { params: { deviceId: deviceId } }
      );
      setDeployments(data)
    }
    fetchData()
  }, [refetchFlip]);
  
  const deviceType = deviceTypes.find((type) => type.id === device?.deviceTypeId)
  
  return (
    <main>
      <Row justify="space-between">
        <Col>
          <h2>Device ID: { device ? device.id : 'No device found'}</h2>
          <li>Device Type: { deviceType ? deviceType.name : '' }</li>
          <li>FQBN: { deviceType ? deviceType.fqbn : '' }</li>
          <Row>
            {pendingCards}
          </Row>
        </Col>
        <Col>
          {otherCards}
        </Col>
      </Row>
    </main>
  );
});
