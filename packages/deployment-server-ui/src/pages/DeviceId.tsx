import { DeployRequest, DeviceType } from "deployment-server";
import { useEffect, useState } from "react";
import defineFunctionalComponent from "../util/defineFunctionalComponent";
import { Card, Col, DatePicker, Row, Steps } from "antd";
import axios from 'axios';

export default defineFunctionalComponent(function DeviceId() {
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
      deviceId: "device 1",
    }, {
      id: "12345",
      status: 'SUCCESS',
      createdAt: new Date,
      updatedAt: new Date,
      artifactUrl: null,
      deviceId: "device 2",
    }, {
      id: "123",
      status: 'RUNNING',
      createdAt: new Date,
      updatedAt: new Date,
      artifactUrl: null,
      deviceId: "device 3",
    }, {
      id: "12",
      status: 'PENDING',
      createdAt: new Date,
      updatedAt: new Date,
      artifactUrl: null,
      deviceId: "device 3",
    }, {
      id: "123456",
      status: 'FAILED',
      createdAt: new Date,
      updatedAt: new Date,
      artifactUrl: null,
      deviceId: "device 3",
    }]
  );
  const pendingCards = deployments.filter((deployment) => deployment.status === 'PENDING').map((deployment: DeployRequest, i: number) => (
    <div key={i}>
      <Card title={deployment.id} bordered={true} style={{ width: 200 }}>
        <p>{deployment.status}</p>
      </Card>
    </div>
  ))

  const otherCards = deployments.filter((deployment) => deployment.status !== 'PENDING').map((deployment: DeployRequest, i: number) => (
    <div key={i}>
      <Row gutter={[0, 16]}>
        <Card title={deployment.id} bordered={true} style={{ width: 200 }}>
          <p>{deployment.status}</p>
        </Card>
      </Row>
    </div>
  ))
    const deviceId = 'e8665d51-4221-4d3c-b892-a672a2af37a2'
  useEffect(() => {
    fetch("/api/device-types").then(async (res) => {
      setDeviceTypes(await res.json());
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
  }, []);
  
  console.log(deployments);
  //deployments.filter(deployment => deployment.deviceId === props.id)
  
  return (
    <main>
      <Row justify="space-between">
        <Col>
          <h2>props.device.name</h2>
          <li>deviceType.name</li>
          <li>deviceType.fqbn</li>
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
