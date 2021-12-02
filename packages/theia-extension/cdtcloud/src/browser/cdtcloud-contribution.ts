import { inject, injectable } from '@theia/core/shared/inversify';
import { MenuModelRegistry } from '@theia/core';
import { CdtcloudWidget } from './cdtcloud-widget';
import { AbstractViewContribution } from '@theia/core/lib/browser';
import { Command, CommandRegistry } from '@theia/core/lib/common/command';
import { DeviceTrackerService } from '../common/protocol';


export const CdtcloudCommand: Command = { id: 'cdtcloud:command' };
export const DeployToBoardCommand: Command = { id: 'deployToBoard:command', label: 'Deploy to the selected board' };
const DeviceTrackerCommand: Command = {
    id: 'deviceTracker.command',
    label: 'Get available Devices',
};


@injectable()
export class CdtcloudContribution extends AbstractViewContribution<CdtcloudWidget> {

    /**
     * `AbstractViewContribution` handles the creation and registering
     *  of the widget including commands, menus, and keybindings.
     * 
     * We can pass `defaultWidgetOptions` which define widget properties such as 
     * its location `area` (`main`, `left`, `right`, `bottom`), `mode`, and `ref`.
     * 
     */
    constructor() {
        super({
            widgetId: CdtcloudWidget.ID,
            widgetName: CdtcloudWidget.LABEL,
            defaultWidgetOptions: { area: 'left' },
            toggleCommandId: CdtcloudCommand.id
        });
    }

    /**
     * Example command registration to open the widget from the menu, and quick-open.
     * For a simpler use case, it is possible to simply call:
     ```ts
        super.registerCommands(commands)
     ```
     *
     * For more flexibility, we can pass `OpenViewArguments` which define 
     * options on how to handle opening the widget:
     * 
     ```ts
        toggle?: boolean
        activate?: boolean;
        reveal?: boolean;
     ```
     *
     * @param commands
     */
    
     @inject(DeviceTrackerService) private readonly deviceTrackerService: DeviceTrackerService;
     
    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(CdtcloudCommand, {
            execute: () => super.openView({ activate: false, reveal: true })
        });

        commands.registerCommand(DeviceTrackerCommand, {
            execute: () => this.deviceTrackerService.updateDevices().then(r => console.log(r))
        });
    }

    /**
     * Example menu registration to contribute a menu item used to open the widget.
     * Default location when extending the `AbstractViewContribution` is the `View` main-menu item.
     * 
     * We can however define new menu path locations in the following way:
     ```ts
        menus.registerMenuAction(CommonMenus.HELP, {
            commandId: 'id',
            label: 'label'
        });
     ```
     * 
     * @param menus
     */
    registerMenus(menus: MenuModelRegistry): void {
        super.registerMenus(menus);
    }
    
}
