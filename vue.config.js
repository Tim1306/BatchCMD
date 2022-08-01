module.exports = {
  assetsDir: 'public',
  productionSourceMap: false,
  pluginOptions: {
      electronBuilder: {
          nodeIntegration: true
      }
  },
  pluginOptions:{
    electronBuilder:{
      builderOptions:{
        productName:'BatchCMD',
        appId: 'com.BatchCMD.app',
        copyright: 'Copyright © 2020',
        win: {
          icon: './src/assets/favicon/favicon.ico',
          target: [
            {
              target: 'nsis',
              arch: [
                'ia32'
                // ,"x64"
              ]
            }
          ]
        },
        // "publish": [
        //   {
        //     "provider": "generic",
        //     "url": "",//更新服务器地址,可为空
        //   }
        // ],
        nsis: {
          oneClick: false, // 是否一键安装
          allowElevation: true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
          allowToChangeInstallationDirectory: true, // 允许修改安装目录
          perMachine: true, // 为每个账户安装
          installerIcon: './src/assets/favicon/install.ico',// 安装图标
          uninstallerIcon: './src/assets/favicon/install.ico',//卸载图标
          installerHeaderIcon: './src/assets/favicon/install.ico', // 安装时头部图标
          uninstallerIcon: './src/assets/favicon/install.ico',//卸载图标
          installerHeaderIcon: './src/assets/favicon/install.ico', // 安装时头部图标
          createDesktopShortcut: 'always', // 创建桌面图标
          createStartMenuShortcut: true,// 创建开始菜单图标
          shortcutName: 'BatchCMD', // 图标名称
          uninstallDisplayName: 'BatchCMD uninstall', // 卸载程序显示的名字
        }
      }
    }
  }
}