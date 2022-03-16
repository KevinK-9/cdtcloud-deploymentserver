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
import * as React from 'react'
import { TypeSelect } from './cdtcloud-widget/TypeSelect'
import {
  injectable,
  postConstruct,
  inject
} from '@theia/core/shared/inversify'
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget'
import { MessageService } from '@theia/core'
import {
  CompilationService,
  ConfigService,
  Deployment,
  DeviceTypeService
} from '../common/protocol'
import { EditorManager } from '@theia/editor/lib/browser/editor-manager'
import { WorkspaceService } from '@theia/workspace/lib/browser/workspace-service'
import { FileUri } from '@theia/core/lib/node/file-uri'
import { DeploymentManager } from './monitoring/DeploymentManager'

@injectable()
export class CdtcloudWidget extends ReactWidget {
  deviceTypeList: any[] = [];
  options: any[] = [];
  selected: { label: string, value: string, status: string };
  static readonly ID = 'cdtcloud:widget';
  static readonly LABEL = 'Cdtcloud Widget';

  private deploymentIds: string[] = [];
  private deployments: Deployment[] = [];

  private interval: number;

  @inject(MessageService)
  protected readonly messageService!: MessageService;

  constructor (
    @inject(DeviceTypeService)
    private readonly deviceTypeService: DeviceTypeService,
    @inject(CompilationService)
    private readonly compilationService: CompilationService,
    @inject(EditorManager)
    protected readonly editorManager: EditorManager,
    @inject(WorkspaceService)
    protected readonly workspaceService: WorkspaceService,
    @inject(DeploymentManager)
    protected readonly deploymentManager: DeploymentManager,
    @inject(ConfigService)
    protected readonly configService: ConfigService
  ) {
    super()
  }

  @postConstruct()
  protected async init (): Promise<void> {
    this.id = CdtcloudWidget.ID
    this.title.label = CdtcloudWidget.LABEL
    this.title.caption = CdtcloudWidget.LABEL
    this.title.closable = true
    this.title.iconClass = 'fa fa-window-maximize'
    this.update()
    void this.getDeviceList()
    this.startPollingDeployments()
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  render () {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    function getColor (status: string) {
      switch (status) {
        case 'PENDING':
          return { color: '#ffffff', background: '#808080', border: '#707070' }
        case 'RUNNING':
          return { color: '#1890ff', background: '#e6f7ff', border: '#91d5ff' }
        case 'TERMINATED':
          return { color: '#faad14', background: '#fffbe6', border: '#ffe58f' }
        case 'SUCCESS':
          return { color: '#52c41a', background: '#f6ffed', border: '#b7eb8f' }
        case 'FAILED':
          return { color: '#cf1322', background: '#fff1f0', border: '#ffa39e' }
        default:
          return { color: '#ffffff', background: '#ffffff', border: '#ffffff' }
      }
    }

    return (
      <>
        <div id="widget-container">
          <h2> Select a device to deploy your code on from this list</h2>
          <TypeSelect
            options={this.options}
            deployOnBoard={this.deployOnBoard.bind(this)}
          />

          <div id="deployments">
            <h2>Recent Deployments</h2>
            {this.deployments.length > 0
              ? (
              <table>
                <thead>
                  <tr key="head">
                    <th>Status</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                  </tr>
                </thead>
                <tbody>
                  {this.deployments.map((deployment) => {
                    return (
                      <tr key={deployment.id}>
                        <td>
                          <div
                            style={{
                              display: 'flex',
                              width: '95%',
                              height: '100%',
                              color: getColor(deployment.status).color,
                              backgroundColor: getColor(deployment.status)
                                .background,
                              borderRadius: '5px',
                              border: `2px solid ${
                                getColor(deployment.status).border
                              }`,
                              justifyContent: 'center',
                              alignItems: 'center'
                            }}
                          >
                            {deployment.status}
                          </div>
                        </td>
                        <td>{deployment.createdAt}</td>
                        <td>{deployment.updatedAt}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
                )
              : (
              <p>No deployments have been sent so far.</p>
                )}
          </div>
        </div>
      </>
    )
  }

  protected handleChange (option: {
    label: string
    value: string
    status: string
  }): void {
    this.selected = option
  }

  protected async getDeviceList (): Promise<void> {
    try {
      this.deviceTypeList = await this.deviceTypeService.getDeviceList()
      this.options = this.deviceTypeList.map(({ id, name, status }) => ({
        label: name,
        value: id,
        status: status
      }))
      this.update()
    } catch (err) {
      console.log(err)
    }
  }

  protected async deployOnBoard (board: any): Promise<void> {
    const selectedBoard = this.deviceTypeList.find((obj) => {
      return obj.id === board.value
    })
    const sketchUri = this.workspaceService.workspace?.resource
    if (sketchUri === undefined) {
      throw new Error('No Sketch found')
    }
    const sketchPath = FileUri.fsPath(sketchUri)
    const deploymentResponse = await this.compilationService.compile(
      selectedBoard.fqbn,
      board.value,
      sketchPath
    )

    if (deploymentResponse.kind === 'deployment') {
      await this.deploymentManager.postDeploy(deploymentResponse)
      this.deploymentIds = [...this.deploymentIds, deploymentResponse.id]
      this.update()
    } else {
      void this.messageService.error(
        deploymentResponse.data.message ??
          deploymentResponse.statusMessage ??
          'Unknown deployment error'
      )
    }
  }

  private startPollingDeployments (): void {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.interval = setInterval(async () => {
      try {
        const request = await fetch(
          `${await this.configService.getDeploymentServerHost()}/api/deployments`
        )

        const deployments = (await request.json()) as Deployment[]

        this.deployments = deployments.filter((deployment) =>
          this.deploymentIds.includes(deployment.id)
        )

        await this.getDeviceList()
      } catch (err) {
        console.log(err)
      }
    }, 1500) as unknown as number
  }

  dispose (): void {
    clearInterval(this.interval)
    super.dispose()
  }
}
