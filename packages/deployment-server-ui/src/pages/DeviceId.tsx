import { DeployRequest, DeployStatus, DeviceType } from "deployment-server";
import { useEffect, useState } from "react";
import defineFunctionalComponent from "../util/defineFunctionalComponent";
import { Card, Col, Row, Tag } from "antd";
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
  const url = window.location.href
  const strs = url.split('/');
  const deviceId = strs.at(-1)

  const renderSwitch = (param: DeployStatus) => {
    switch(param) {
      case 'SUCCESS':
        return 'green';
      case 'RUNNING':
        return 'blue';
      default:
        return 'red';
    }
  };
  
  const pendingCards = deployments.filter((deployment) => deployment.status === 'PENDING' && deployment.deviceId === deviceId).map((deployment: DeployRequest, i: number) => (
    <div key={i}>
      <Card title={deployment.id} bordered={true} style={{ width: 200 }}>
        <p><Tag color="orange"> {deployment.status} </Tag></p>
      </Card>
    </div>
  ))

  const otherCards = deployments.filter((deployment) => deployment.status !== 'PENDING' && deployment.deviceId === deviceId).map((deployment: DeployRequest, i: number) => (
    <div key={i}>
      <Row gutter={[0, 16]}>
        <Card title={deployment.id} bordered={true} style={{ width: 200 }}>
            <p><Tag color={renderSwitch(deployment.status)}>{deployment.status} </Tag></p>
        </Card>
      </Row>
    </div>
  ))

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
