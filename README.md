# React Native FXDialog

一个功能强大且可自定义的 React Native 弹窗组件，支持多种类型和动画效果。基于 react-native-fxview 构建，提供动态UI管理能力。

## 📹 演示效果

### alert功能演示

![alert功能演示](https://github.com/chinesefirstkeng/files/blob/main/Simulator%20Screen%20Recording%20-%20iPhone%2016%20Pro%20-%202026-02-18%20at%2010.03.34.gif?raw=true)

### actionSheet效果演示

![actionSheet效果演示](https://github.com/ChineseFirstKeng/files/blob/main/Simulator%20Screen%20Recording%20-%20iPhone%2016%20Pro%20-%202026-02-18%20at%2010.04.28.gif?raw=true)

### popup效果演示

![popup效果演示](https://github.com/ChineseFirstKeng/files/blob/main/Simulator%20Screen%20Recording%20-%20iPhone%2016%20Pro%20-%202026-02-18%20at%2010.05.01.gif?raw=true)

## ✨ 功能特性

- 🎨 **多种弹窗类型**: 警告框、操作表、底部弹窗
- 🎬 **丰富动画效果**: 淡入淡出、缩放、上下滑动
- 🎯 **完全可自定义**: 样式、内容、动画效果
- 📱 **React Native 优化**: 流畅性能体验
- 🔧 **TypeScript 支持**: 完整的类型定义
- ⚡ **动态内容更新**: 运行时更新弹窗内容
- 🎪 **队列管理**: 基于优先级的弹窗显示
- 📏 **灵活布局**: 自动滚动、高度约束

## 📦 安装

```bash
npm install react-native-fxdialog react-native-fxview
```

### 对等依赖

确保已安装以下依赖：

```bash
npm install react react-native
```

## 🚀 快速开始

### 前提条件

FXDialog 基于 `react-native-fxview` 构建，需要在应用中至少有一个 FXView 视图。

**方法 1：使用默认 FXView**
如果不指定 `fxViewId`，FXDialog 会使用应用中最后一个展示的 FXView。

**方法 2：指定 FXView**
在特定的 FXView 上显示弹窗：

```typescript
import { FXView } from 'react-native-fxview';

// 在应用根组件中添加 FXView
function App() {
  return (
    <FXView id="myMainView">
      {/* 应用内容 */}
    </FXView>
  );
}
```

### 基本用法

```typescript
import { FXDialog, FXDialogActionType } from 'react-native-fxdialog';

// 简单警告框
FXDialog.alert()
  .addTitle({ title: "你好" })
  .addMessage({ message: "这是一个简单的警告框" })
  .addAction({ action: "确定", type: FXDialogActionType.Highlight })
  .show();

// 操作表
FXDialog.actionSheet()
  .addTitle({ title: "选择操作" })
  .addAction({ action: "相机", onPress: () => console.log("选择了相机") })
  .addAction({ action: "相册", onPress: () => console.log("选择了相册") })
  .addAction({ action: "取消", type: FXDialogActionType.Cancel })
  .show();
```

## 📖 使用示例

### 基础警告框

```typescript
import { FXDialog, FXDialogActionType } from 'react-native-fxdialog';

const showAlert = () => {
  FXDialog.alert()
    .addTitle({ 
      title: "删除项目？",
      style: { fontSize: 18, fontWeight: 'bold' }
    })
    .addMessage({ 
      message: "此操作无法撤销",
      style: { color: '#666' }
    })
    .addAction({ 
      action: "删除", 
      type: FXDialogActionType.Highlight,
      onPress: () => handleDelete()
    })
    .addAction({ 
      action: "取消", 
      type: FXDialogActionType.Cancel
    })
    .clickBackgroundClose(false)
    .show();
};
```

### 自定义样式的操作表

```typescript
import { FXDialog, FXDialogType } from 'react-native-fxdialog';

const showActionSheet = () => {
  FXDialog.actionSheet()
    .addTitle({ title: "选择图片来源" })
    .containerStyle({ 
      backgroundColor: '#f5f5f5',
      borderRadius: 20 
    })
    .addAction({ 
      action: "拍照",
      containerStyle: { backgroundColor: 'white' },
      onPress: () => openCamera()
    })
    .addAction({ 
      action: "从相册选择", 
      containerStyle: { backgroundColor: 'white' },
      onPress: () => openGallery()
    })
    .addAction({ 
      action: "取消",
      type: FXDialogActionType.Cancel,
      containerStyle: { backgroundColor: 'white', marginTop: 8 }
    })
    .animationType(FXDialogAnimationType.SlideUp)
    .showAnimationDuration(300)
    .show();
};
```

### 自定义内容的底部弹窗

```typescript
import { FXDialog } from 'react-native-fxdialog';
import { View, Text, Button } from 'react-native';

const showCustomPopup = () => {
  FXDialog.popup()
    .addCustom({
      content: (
        <View style={{ padding: 20 }}>
          <Text>自定义内容</Text>
          <Button title="点击我" onPress={() => console.log("被点击了")} />
        </View>
      )
    })
    .containerStyle({ 
      marginHorizontal: 20,
      borderRadius: 12 
    })
    .show();
};
```

### 带控制器的弹窗

```typescript
import { FXDialog } from 'react-native-fxdialog';

const showControlledDialog = () => {
  const controller = FXDialog.alert()
    .addTitle({ id: "statusTitle", title: "处理中..." })
    .addMessage({ id: "statusMessage", message: "请稍候" })
    .show();

  // 2秒后更新弹窗内容
  setTimeout(() => {
    controller.update({
      contents: [
        { id: "statusTitle", title: "完成！" },
        { id: "statusMessage", message: "操作成功完成" }
      ]
    });
  }, 2000);

  // 4秒后关闭弹窗
  setTimeout(() => {
    controller.close();
  }, 4000);
};
```

## ⚠️ 重要更新说明

### 关于动态更新内容的重要提示：

**更新弹窗内容时，必须满足以下条件：**

1. **元素必须有ID** - 要更新的元素必须设置`id`属性
2. **使用正确的API格式** - 使用`contents`数组更新内容，`actions`数组更新按钮
3. **直接传递对象** - 不需要`type`和`item`包装，直接传递内容对象

```typescript
// ✅ 正确的做法：元素有ID，使用contents
const controller = FXDialog.alert()
  .addTitle({ 
    id: "myTitle",  // 必须有ID
    title: "初始标题" 
  })
  .addMessage({ 
    id: "myMessage",  // 必须有ID
    message: "初始消息" 
  })
  .show();

// 更新内容
controller.update({
  contents: [
    { 
      id: "myTitle",  // ID必须匹配
      title: "新标题" 
    },
    { 
      id: "myMessage",  // ID必须匹配
      message: "新消息" 
    }
  ]
});

// ❌ 错误的做法：元素没有ID
controller.update({
  contents: [
    { 
      title: "新标题"  // 缺少ID，更新会失败
    }
  ]
});
```

## 🎨 API 参考

### FXDialog 静态方法

#### `FXDialog.alert()`
创建一个居中显示的警告框。

#### `FXDialog.actionSheet()`
创建一个底部操作表。

#### `FXDialog.popup()`
创建一个底部弹窗。

#### `FXDialog.close(fxViewId?, closeType?)`
关闭最近的弹窗或通过fxViewId关闭特定弹窗。

#### `FXDialog.clearAll(fxViewId)`
关闭指定视图上的所有弹窗。

#### `FXDialog.clearAll(fxViewId)`
关闭指定视图上的所有弹窗。

### 弹窗构建器方法

#### 配置方法

| 方法 | 类型 | 描述 |
|--------|------|-------------|
| `addTitle(title)` | `FXDialogTitle` | 添加标题元素 |
| `addMessage(message)` | `FXDialogMessage` | 添加消息元素 |
| `addAction(action)` | `FXDialogAction` | 添加操作按钮 |
| `addCustom(view)` | `FXDialogCustomContent` | 添加自定义内容 |
| `addSuspension(suspension)` | `React.ReactNode` | 添加自定义挂起视图（绝对定位） |
| `appendBackground(view)` | `React.ReactNode` | 添加背景组件（默认铺满，绝对定位） |
| `appendContainer(view)` | `React.ReactNode` | 添加容器背景组件（默认铺满，绝对定位） |
| `containerStyle(style)` | `ViewStyle` | 设置容器样式 |
| `backgroundStyle(style)` | `ViewStyle` | 设置背景样式 |
| `contentsContainerStyle(style)` | `ViewStyle` | 设置内容区域容器样式（除按钮外的区域） |
| `actionsContainerStyle(style)` | `ViewStyle` | 设置按钮区样式 |
| `clickBackgroundClose(enable)` | `boolean` | 启用/禁用点击背景关闭 |
| `animationType(type)` | `FXDialogAnimationType` | 设置动画类型 |
| `showAnimationDuration(duration)` | `number` | 显示动画时长（毫秒） |
| `closeAnimationDuration(duration)` | `number` | 关闭动画时长（毫秒） |
| `containerScrollMaxHeight(height)` | `number` | 容器最大高度 |
| `actionsScrollMinHeight(height)` | `number` | 按钮区最小高度 |
| `actionsScrollMaxHeight(height)` | `number` | 按钮区最大高度 |
| `animator(animator)` | `FXDialogAnimationImpl` | 自定义动画控制器 |
| `enqueue(enable)` | `boolean` | 启用队列管理 |
| `priority(priority)` | `number` | 设置显示优先级（数值越大优先级越高） |
| `didShow(callback)` | `() => void` | 显示回调 |
| `didClose(callback)` | `(type?) => void` | 关闭回调 |

#### 显示方法

| 方法 | 返回类型 | 描述 |
|--------|-------------|-------------|
| `show(fxViewId?)` | `FXDialogController` | 显示弹窗并返回控制器 |

### 类型定义

#### FXDialogType
```typescript
enum FXDialogType {
  Alert = "alert",
  ActionSheet = "actionSheet", 
  Popup = "popup"
}
```

#### FXDialogAnimationType
```typescript
enum FXDialogAnimationType {
  None = "none",
  Fade = "fade",
  Scale = "scale",
  SlideUp = "slideUp",
  SlideDown = "slideDown"
}
```

#### FXDialogActionType
```typescript
enum FXDialogActionType {
  Default = "default",
  Cancel = "cancel",
  Highlight = "highlight"
}
```

#### FXDialogTitle
```typescript
interface FXDialogTitle {
  id?: string;                    // 可选ID，更新时必须
  title: string;                  // 标题文本
  style?: TextStyle;              // 文本样式
  numberOfLines?: number;         // 最大显示行数，默认为 1
  ellipsizeMode?: "head" | "middle" | "tail" | "clip"; // 文本溢出时的省略模式
  containerStyle?: ViewStyle;     // 标题容器样式
}
```

#### FXDialogMessage
```typescript
interface FXDialogMessage {
  id?: string;                    // 可选ID，更新时必须
  message: string;                // 消息文本
  style?: TextStyle;              // 文本样式
  numberOfLines?: number;         // 最大显示行数
  ellipsizeMode?: "head" | "middle" | "tail" | "clip"; // 文本溢出时的省略模式
  containerStyle?: ViewStyle;     // 消息容器样式
}
```

#### FXDialogAction
```typescript
// 文本按钮
type FXDialogDefaultAction = {
  id?: string;                    // 可选ID，更新时必须
  action: string;                 // 按钮文本
  type?: FXDialogActionType;      // 按钮类型
  style?: TextStyle;              // 文本样式
  numberOfLines?: number;         // 最大显示行数
  ellipsizeMode?: "head" | "middle" | "tail" | "clip"; // 省略模式
  containerStyle?: ViewStyle;     // 容器样式
  closeOnClick?: boolean;         // 点击后是否自动关闭
  closeType?: FXDialogCloseType;  // 关闭类型
  onPress?: () => void;           // 点击回调
}

// 自定义组件按钮
type FXDialogCustomAction = {
  id?: string;                    // 可选ID，更新时必须
  action: React.ReactNode;        // 自定义组件
  type?: FXDialogActionType;      // 按钮类型
  containerStyle?: ViewStyle;     // 容器样式
  closeOnClick?: boolean;         // 点击后是否自动关闭
  closeType?: FXDialogCloseType;  // 关闭类型
  onPress?: () => void;           // 点击回调
}

type FXDialogAction = FXDialogDefaultAction | FXDialogCustomAction;
```

#### FXDialogController
```typescript
interface FXDialogController {
  /**
   * 关闭弹窗
   * @param closeType - 可选，关闭类型，用于区分不同的关闭触发方式
   */
  close: (closeType?: FXDialogCloseType) => void;
  
  /**
   * 更新弹窗内容
   * @param updates - 要更新的内容配置
   */
  update: (updates: FXDialogUpdateConfig) => void;
  
  /**
   * 更新单个内容元素
   * @param update - 要更新的内容元素（必须有ID）
   */
  updateContent: (update: FXDialogContent) => void;
  
  /**
   * 更新单个操作按钮
   * @param update - 要更新的操作按钮（必须有ID）
   */
  updateAction: (update: FXDialogAction) => void;
  
  /**
   * 更新背景样式
   * @param update - 要更新的背景样式
   */
  updateBackgroundStyle: (update: ViewStyle) => void;
  
  /**
   * 更新容器样式
   * @param update - 要更新的容器样式
   */
  updateContainerStyle: (update: ViewStyle) => void;
  
  /**
   * 更新内容容器样式
   * @param update - 要更新的内容容器样式
   */
  updateContentContainerStyle: (update: ViewStyle) => void;
  
  /**
   * 更新按钮容器样式
   * @param update - 要更新的按钮容器样式
   */
  updateActionsContainerStyle: (update: ViewStyle) => void;
  
  /**
   * 获取弹窗所在的FXView ID
   * @returns FXView ID 或 undefined
   */
  fxViewId: () => string | undefined;
}

#### FXDialogUpdateConfig
```typescript
interface FXDialogUpdateConfig {
  /** 更新容器样式 */
  containerStyle?: ViewStyle;
  /** 更新背景样式 */
  backgroundStyle?: ViewStyle;
  /** 更新内容容器样式 */
  contentsContainerStyle?: ViewStyle;
  /** 更新按钮容器样式 */
  actionsContainerStyle?: ViewStyle;
  /** 更新内容元素（必须有ID） */
  contents?: FXDialogContent[];
  /** 更新操作按钮（必须有ID） */
  actions?: FXDialogAction[];
}
```

## 🎭 动画示例

### 自定义动画
```typescript
import { FXDialogAnimationImpl, FXDialogAnimationType } from 'react-native-fxdialog';

const customAnimator: FXDialogAnimationImpl = {
  showDuration: 500,
  closeDuration: 300,
  backgroundStyle: () => ({
    opacity: 0.5,  // 背景半透明
  }),
  containerStyle: () => ({
    transform: [{ scale: 0.8 }],  // 容器缩放
    opacity: 0.9,
  })
};

FXDialog.alert()
  .addTitle({ title: "自定义动画" })
  .animator(customAnimator)
  .show();
```

### 带动画回调的弹窗
```typescript
FXDialog.alert()
  .addTitle({ title: "动画弹窗" })
  .animationType(FXDialogAnimationType.Scale)
  .showAnimationDuration(400)
  .closeAnimationDuration(250)
  .didShow(() => console.log("弹窗已显示"))
  .didClose((closeType) => console.log("弹窗已关闭:", closeType))
  .show();
```

## 📱 平台支持

- ✅ iOS
- ✅ Android
- ⚠️ Web (有限支持)

## 🔗 与 FXView 集成

### 为什么需要 FXView？

FXDialog 依赖 `react-native-fxview` 提供的动态 UI 管理能力，包括：
- 弹窗的层级管理
- 动画效果支持
- 队列管理
- 跨组件通信

### 基本集成

```typescript
import { FXView } from 'react-native-fxview';
import { FXDialog } from 'react-native-fxdialog';

// 1. 在应用中添加 FXView
function App() {
  return (
    <FXView id="appRoot">
      <Button title="显示弹窗" onPress={showDialog} />
    </FXView>
  );
}

// 2. 在特定 FXView 上显示弹窗
function showDialog() {
  FXDialog.alert()
    .addTitle({ title: "Hello FXView" })
    .addAction({ action: "确定" })
    .show("appRoot"); // 指定 FXView ID
}
```

### 多 FXView 场景

如果应用中有多个 FXView，可以为不同场景指定不同的 FXView：

```typescript
// 在登录界面的 FXView 上显示登录相关弹窗
FXDialog.alert()
  .addTitle({ title: "登录失败" })
  .addMessage({ message: "请检查用户名和密码" })
  .show("loginView");

// 在主界面的 FXView 上显示通知
FXDialog.alert()
  .addTitle({ title: "新消息" })
  .addMessage({ message: "您有一条新消息" })
  .show("mainView");
```

## ⚠️ 重要注意事项

### 1. **样式优先级规则**

**外部传入样式 > 拦截器设置的样式 > 默认样式**

- **外部样式**：通过API直接设置的样式（最高优先级）
- **拦截器样式**：由样式拦截器自动添加的样式
- **默认样式**：组件内部的默认样式（最低优先级）

### 2. **特殊组件的布局说明**

以下组件具有特殊的布局处理，**position属性会被强制设置为absolute**：

| 方法 | 说明 | 布局特性 |
|------|------|----------|
| `appendBackground()` | 添加背景组件 | 铺满整个背景区域，position: "absolute" |
| `appendContainer()` | 添加容器背景组件 | 铺满弹窗容器，position: "absolute" |
| `addSuspension()` | 添加挂起视图 | 绝对定位，可自由设置位置 |

**注意**：即使传入了 `position: "relative"` 等其他值，也会被忽略，这是为了确保这些组件能正确显示在预期位置。

### 3. **队列管理**
- 对重要弹窗使用 `enqueue(true)`，确保一定会显示
- 优先级高的弹窗会先显示（`priority()` 数值越大优先级越高）

### 4. **其他注意事项**
- **内存管理**: 不需要时及时关闭弹窗
- **性能优化**: 避免在低端设备上使用复杂动画
- **无障碍访问**: 使用屏幕阅读器测试无障碍兼容性
- **更新操作**: 更新元素时必须设置 `id` 属性以确保正确匹配

## 🎨 样式拦截器

### 什么是样式拦截器？

样式拦截器是FXDialog的一个核心特性，用于**自动处理复杂的布局逻辑**。它在弹窗显示前自动运行，根据弹窗类型和内容自动调整布局和样式。

### 拦截器接口

所有拦截器必须实现 `FXDialogStyleInterceptor` 接口：

```typescript
interface FXDialogStyleInterceptor {
  intercept: (props: FXDialogViewProps) => FXDialogViewProps;
}
```

### 内置拦截器

| 拦截器 | 作用 | 适用类型 |
|--------|------|----------|
| `AlertStyleInterceptor` | 处理Alert的按钮布局（横向/纵向）和边框 | Alert |
| `ActionSheetStyleInterceptor` | 处理ActionSheet的按钮布局和间距 | ActionSheet |
| `PopupStyleInterceptor` | 处理Popup的特殊布局需求 | Popup |
| `FXDialogStyleInterceptorSystem` | 默认拦截器系统，根据弹窗类型自动选择合适的拦截器 | 所有类型 |

### 拦截器工作原理

#### 默认拦截器系统 (`FXDialogStyleInterceptorSystem`)

`FXDialogStyleInterceptorSystem` 是FXDialog的默认拦截器，它会：

1. **自动识别弹窗类型**：根据 `props.type` 确定弹窗类型
2. **选择合适的拦截器**：为不同类型的弹窗选择对应的专用拦截器
3. **执行拦截逻辑**：调用相应的拦截器处理布局和样式

#### 拦截器执行流程

1. **自动布局**：根据按钮数量自动选择横向或纵向布局
2. **边框处理**：自动添加分割线和边框
3. **样式增强**：为不同类型的弹窗添加合适的默认样式
4. **样式优先级**：确保外部传入的样式优先级高于拦截器设置的样式

#### 拦截器执行时机

拦截器在调用 `show()` 方法时执行，在动画开始前完成布局和样式的调整。

### 示例：Alert的自动布局

```typescript
// 1-2个按钮：横向布局
FXDialog.alert()
  .addAction({ action: "确定" })
  .addAction({ action: "取消" })
  .show(); // 自动使用横向布局

// 3个以上按钮：纵向布局
FXDialog.alert()
  .addAction({ action: "选项1" })
  .addAction({ action: "选项2" })
  .addAction({ action: "选项3" })
  .addAction({ action: "取消" })
  .show(); // 自动使用纵向布局并添加分割线
```

### 自定义拦截器

```typescript
import { FXDialogStyleInterceptor, FXDialogViewProps } from 'react-native-fxdialog';

const MyCustomInterceptor: FXDialogStyleInterceptor = {
  intercept(props: FXDialogViewProps): FXDialogViewProps {
    // 自定义布局逻辑
    return {
      ...props,
      // 添加自定义样式
      containerStyle: {
        ...props.containerStyle,
        borderWidth: 2,
        borderColor: '#FF6B6B'
      }
    };
  }
};

// 使用自定义拦截器（需要通过子类或扩展实现）
```

## 🐛 故障排除

### 弹窗不显示
- 检查是否正确安装 `react-native-fxview`
- 验证使用特定视图时的 fxViewId
- 确保队列管理设置正确
- 确保应用中至少有一个 FXView 视图
- 检查 FXView 的 ID 是否正确
- 如果使用默认 FXView，确保应用中已存在展示的 FXView（默认使用最后一个展示的 FXView）

### 构建错误
- 检查 TypeScript 配置
- 验证对等依赖是否已安装
- 清理并重新构建项目

### 更新失败
- 确保要更新的元素设置了 `id` 属性
- 检查元素类型是否正确
- 验证更新参数格式是否符合 `FXDialogUpdateConfig` 接口

## 📄 许可证

MIT 许可证 - 详见 LICENSE 文件

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m '添加一些令人惊叹的功能'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 🆘 支持

- 📧 邮箱: your.email@example.com
- 🐛 问题反馈: [GitHub Issues](https://github.com/yourusername/react-native-fxdialog/issues)
- 📖 完整文档: [项目主页](https://github.com/yourusername/react-native-fxdialog#readme)

---

**编码愉快!** 🎉