const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const fxdialogRoot = path.resolve(__dirname, '..');
const demoNodeModules = path.resolve(projectRoot, 'node_modules');

const config = getDefaultConfig(projectRoot);

// 关键配置：确保所有模块都使用 demo 的 node_modules
config.resolver = {
  ...config.resolver,
  // 只使用 demo 的 node_modules
  nodeModulesPaths: [demoNodeModules],
  // 强制所有依赖使用 demo 的版本
  extraNodeModules: {
    ...config.resolver.extraNodeModules,
    'react-native-fxdialog': fxdialogRoot,
    'react-native-fxview': path.resolve(demoNodeModules, 'react-native-fxview'),
    'react': path.resolve(demoNodeModules, 'react'),
    'react-native': path.resolve(demoNodeModules, 'react-native')
  },
  // 禁用符号链接解析
  disableSymlinks: true,
  // 自定义解析逻辑
  resolveRequest: (context, moduleName, platform) => {
    // 特殊处理 react-native-fxview，确保始终使用 demo 的版本
    if (moduleName === 'react-native-fxview') {
      return {
        filePath: path.resolve(demoNodeModules, 'react-native-fxview', 'index.js'),
        type: 'sourceFile',
      };
    }
    // 其他模块使用默认解析
    return context.resolveRequest(context, moduleName, platform);
  }
};

config.watchFolders = [
  ...config.watchFolders,
  fxdialogRoot
];

console.log('Metro config active - Forcing demo dependencies');

module.exports = config;
