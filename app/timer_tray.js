const electron = require('electron');
const { Tray, Menu, app } = electron;

class TimeTray extends Tray {

    constructor(iconPath, mainWindow) {
        super(iconPath);

        this.mainWindow = mainWindow;
        this.setToolTip('Timer App');
        this.on('click', this.onClick.bind(this));
        this.on('right-click', this.onRightClick.bind(this));
    }

    onClick(event, bound) {
        const {x,y} = bound;
        const {height, width} = this.mainWindow.getBounds();

        if (this.mainWindow.isVisible()) {
            this.mainWindow.hide();
        } else {
            // mainWindow.setBounds({
            //     x: x - width/2,
            //     y: process.platform === 'darwin' ? y : y - height,
            //     height,
            //     width
            // });
            this.mainWindow.show();
        }
    }

    onRightClick() {
        const menuConfig = Menu.buildFromTemplate([
            {
                label: 'Quit',
                click: () => app.quit()
            }
        ]);

        this.popUpContextMenu(menuConfig);
    }
}

module.exports = TimeTray;