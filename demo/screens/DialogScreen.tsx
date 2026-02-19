import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Switch,
  SectionList,
  Image,
} from "react-native";

import {
  FXDialog,
  FXDialogActionType,
  FXDialogAnimationType,
} from "react-native-fxdialog";
import { userAnimator } from "./UserAnimation";
import { FXView } from "react-native-fxview";
import { GlassmorphismDialog } from "./GlassmorphismDialog";
const backImage = require("./assets/back.jpg");
const containerImage = require("./assets/container.jpg");
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { NeonDialog } from "./NeonDialog";
import { GradientDialog } from "./GradientDialog";
type Props = {
  onBack: () => void;
  dialogType: "alert" | "actionSheet" | "popup";
};

type ListItem = {
  key: string;
  title: string;
  description?: string;
  onPress: () => void;
  icon?: string;
  category?: string;
};

type DialogClass = typeof FXDialog;

function getDialog(
  type: "alert" | "actionSheet" | "popup",
  dialogClass: DialogClass = FXDialog,
): FXDialog {
  const dialogMap: Record<string, FXDialog> = {
    alert: dialogClass.alert(), // ✅ 现在可以调用了
    actionSheet: dialogClass.actionSheet(),
    popup: dialogClass.popup(),
  };
  return dialogMap[type];
}

const DialogScreen: React.FC<Props> = ({ onBack, dialogType }) => {
  const inputRef = useRef<{
    on: boolean;
    text: string;
  }>({
    on: false,
    text: "",
  });
  const customViewRef = useRef<CustomViewRef>(null);
  // ✨ 基础功能展示
  const showBasicAlert = () => {
    getDialog(dialogType)
      .addTitle({ title: "基础提示" })
      .addMessage({ message: "这是一个基础的弹窗提示，展示最简单的使用方式" })
      .addAction({
        action: "知道了",
        type: FXDialogActionType.Highlight,
        onPress: () => console.log("用户点击了知道了"),
      })
      .show();
  };

  const showConfirmDialog = () => {
    getDialog(dialogType)
      .addTitle({ title: "确认操作" })
      .addMessage({ message: "确定要删除这个项目吗？此操作无法撤销" })
      .addAction({
        action: "取消",
        type: FXDialogActionType.Cancel,
        onPress: () => console.log("用户取消了操作"),
      })
      .addAction({
        action: "删除",
        type: FXDialogActionType.Highlight,
        onPress: () => console.log("用户确认删除"),
      })
      .show();
  };

  const showRichContent = () => {
    getDialog(dialogType)
      .addTitle({
        title: "富文本标题",
        style: { fontSize: 20, fontWeight: "bold", color: "#FF6B6B" },
      })
      .addMessage({
        message:
          "这是支持样式的消息内容，可以自定义字体、颜色、对齐方式等各种属性",
        style: { fontSize: 16, lineHeight: 24, color: "#333" },
      })
      .addAction({ action: "查看详情" })
      .addAction({ action: "关闭", type: FXDialogActionType.Cancel })
      .show();
  };

  const showCustomActions = () => {
    getDialog(dialogType)
      .addTitle({ title: "选择操作" })
      .addMessage({ message: "请选择您要执行的操作" })
      .addAction({
        action: "编辑",
        onPress: () => console.log("编辑操作"),
      })
      .addAction({
        action: "分享",
        onPress: () => console.log("分享操作"),
      })
      .addAction({
        action: "删除",
        type: FXDialogActionType.Highlight,
        onPress: () => console.log("删除操作"),
      })
      .show();
  };

  const showPhotoDialog = () => {
    getDialog(dialogType)
      .addAction({
        action: "相机",
        onPress: () => console.log("相机操作"),
      })
      .addAction({
        action: "相册",
        onPress: () => console.log("相册操作"),
      })
      .addAction({
        action: "取消",
        type: FXDialogActionType.Cancel,
        onPress: () => console.log("取消操作"),
      })
      .show();
  };

  const showLongMessage = () => {
    const ctrl = getDialog(dialogType)
      .addTitle({ title: "长消息提示" })
      .addMessage({
        id: "longMessage-1",
        message: `北京为孩子（学生儿童）办理社保，新生儿建议在出生90天内完成，京籍需持户口簿到街道社保所，非京籍持工作居住证等材料办理。线上可通过“京通”小程序、北京医保公共服务平台等申领第三代社保卡或绑定医保亲情账户，也可通过居委会、学校申报，主要涵盖城乡居民医疗保险。 
办理时间与条件
新生儿： 出生90日内（含）办理，可享受从出生之日起的医保待遇；超过90天办理，次月生效；超过一年办理，次年生效。
非新生儿： 需在每年9-11月集中参保期办理次年医保。
条件： 京籍儿童；非京籍且持有《北京市工作居住证》的随往子女；在京接受义务教育的华侨子女等。 
办理材料（基本要求）
户口簿（主页、户主页、本人页）复印件。
出生医学证明。
电子版照片（一寸白底免冠彩色证件照）。
非京籍需提供北京市工作居住证及相关信息页。 
办理渠道
线上（推荐）： 登录“京通”小程序、北京市人力资源和社会保障局官网或APP、微信公众号（北京人社、北京本地宝），选择“18周岁以下代办”或“城乡居民参保登记”办理。
线下： 街道/乡镇社保所、街道服务中心。
学校： 在校在园学生通过学校集中办理。 
费用与流程
申报登记： 提交上述材料完成登记。
办理社保卡： 申请领取第三代社保卡。
缴费： 通过“京通”小程序、北京税务APP或银行窗口进行扣款/缴费（每人每年数百元，具体以當年政策为准）。 
贴心提示
医保亲情账户： 2010年1月1日后出生的儿童，可直接在支付宝搜索“医保亲情账户”绑定，无需实体卡即可就医结算。
急诊： 在未领到社保卡前发生的费用，可先垫付，拿到卡后通过社区居委会手工报销。
银行代扣： 建议预存一定金额，保证每9月顺利自动扣费。 `,
      })
      .addAction({
        action: "更新消息",
        closeOnClick: false,
        type: FXDialogActionType.Cancel,
        onPress: () => {
          ctrl?.updateContent({
            id: "longMessage-1",
            message: "这是更新后的长消息内容",
          });
        },
      })
      .addAction({
        id: "updateAction-1",
        action: "更新按钮",
        closeOnClick: false,
        onPress: () => {
          ctrl?.updateAction({
            id: "updateAction-1",
            action: "点击可关闭",
          });
        },
      })
      .show();
  };

  // 定义 ref 接口
  interface CustomViewRef {
    getSwitchValue: () => boolean;
    getInputValue: () => string;
  }

  // 使用 forwardRef 包装组件
  const CustomView = forwardRef<
    CustomViewRef,
    {
      initSwitchValue: boolean;
      initInputValue: string;
    }
  >(({ initSwitchValue, initInputValue }, ref) => {
    const [switchValue, setSwitchValue] = useState(initSwitchValue);
    const [inputValue, setInputValue] = useState(initInputValue);

    // 使用 useImperativeHandle 暴露方法
    useImperativeHandle(ref, () => ({
      getSwitchValue: () => switchValue,
      getInputValue: () => inputValue,
    }));

    return (
      <View style={styles.customContent}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
        </View>
        <Text style={styles.customTitle}>用户设置</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>启用通知</Text>
          <Switch
            value={switchValue}
            onValueChange={setSwitchValue}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={switchValue ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>用户名</Text>
          <TextInput
            style={styles.input}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="请输入用户名"
            placeholderTextColor="#999"
          />
        </View>
      </View>
    );
  });
  // 🎨 自定义内容展示
  const showCustomView = () => {
    const customView = (
      <CustomView
        initInputValue={inputRef.current.text}
        initSwitchValue={inputRef.current.on}
        ref={customViewRef}
      />
    );
    const ctrl = getDialog(dialogType)
      .addTitle({ title: "自定义视图" })
      .addCustom({
        content: customView,
      })
      .addAction({
        action: "保存",
        type: FXDialogActionType.Highlight,
        onPress: () => {
          inputRef.current.text = customViewRef.current?.getInputValue() || "";
          inputRef.current.on =
            customViewRef.current?.getSwitchValue() || false;
          ctrl?.close();
        },
      })
      .addAction({ action: "取消", type: FXDialogActionType.Cancel })
      .show();
  };

  const showImageGallery = () => {
    getDialog(dialogType)
      .addTitle({ title: "图片展示" })
      .addCustom({
        content: (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.imageContainer}>
              {[1, 2, 3, 4, 5].map((item) => (
                <View key={item} style={styles.imageItem}>
                  <View style={styles.placeholderImage}>
                    <Text style={styles.imageText}>🖼️</Text>
                  </View>
                  <Text style={styles.imageCaption}>图片 {item}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        ),
      })
      .addAction({ action: "关闭", type: FXDialogActionType.Cancel })
      .show();
  };

  // ⚡ 动画效果展示
  const showAnimationDemo = () => {
    const animations = [
      FXDialogAnimationType.Fade,
      FXDialogAnimationType.Scale,
      FXDialogAnimationType.SlideUp,
      FXDialogAnimationType.SlideDown,
    ];

    animations.forEach((anim, index) => {
      setTimeout(() => {
        getDialog(dialogType)
          .addTitle({ title: `动画效果: ${anim}` })
          .addMessage({ message: `这是${anim}动画的展示效果` })
          .animationType(anim)
          .addAction({ action: "关闭", type: FXDialogActionType.Cancel })
          .show();
      }, index * 800);
    });
  };

  const showCustomAnimation = () => {
    getDialog(dialogType)
      .addTitle({ title: "✨ 自定义动画" })
      .addMessage({ message: "这是用户自定义的炫酷动画效果" })
      .animator(userAnimator())
      .addAction({ action: "关闭", type: FXDialogActionType.Cancel })
      .show();
  };

  // 🔄 动态更新展示
  const showDynamicUpdate = () => {
    const ctrl = getDialog(dialogType)
      .addTitle({
        id: "title_1",
        title: "⏳ 处理中...",
      })
      .addMessage({
        id: "message_1",
        message: "正在执行操作，请稍候",
      })
      .addAction({
        id: "action_1",
        action: "取消",
        type: FXDialogActionType.Cancel,
      })
      .show();

    // 模拟异步操作
    setTimeout(() => {
      ctrl?.update({
        contents: [
          {
            id: "title_1",
            title: "✅ 操作完成",
          },
          {
            id: "message_1",
            message: "操作已成功完成！点击查看详情",
          },
        ],
        actions: [
          {
            id: "action_1",
            action: "查看详情",
            type: FXDialogActionType.Highlight,
            closeOnClick: true,
          },
        ],
      });
    }, 2000);
  };

  const showProgressDialog = () => {
    const ctrl = getDialog(dialogType)
      .addTitle({
        id: "progress_title",
        title: "📊 下载进度",
      })
      .addCustom({
        id: "progress_content",
        content: (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: "0%" }]} />
            </View>
            <Text style={styles.progressText}>0%</Text>
          </View>
        ),
      })
      .addAction({
        id: "progress_action",
        action: "取消下载",
        type: FXDialogActionType.Cancel,
        onPress: () => {
          clearInterval(interval);
        },
      })
      .show();

    // 模拟进度更新
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => ctrl?.close(), 1000);
      }

      ctrl?.updateContent({
        id: "progress_content",
        content: (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
          </View>
        ),
      });
    }, 300);
  };

  // 💎 炫酷自定义样式
  const showBackImageDialog = () => {
    getDialog(dialogType)
      .appendBackground(
        <Image
          source={backImage}
          style={{
            resizeMode: "cover",
          }}
        />,
      )
      .backgroundStyle({
        backgroundColor: "transparent",
      })
      .appendContainer(
        <Image
          source={containerImage}
          style={{
            resizeMode: "cover",
          }}
        />,
      )
      .containerStyle({
        backgroundColor: "transparent",
      })
      .addTitle({
        title: "背景图效果",
      })
      .addMessage({
        message: "背景图效果背景图效果背景图效果背景图效果",
      })
      .addAction({
        action: "看见了",
        onPress: () => {},
      })
      .addAction({
        action: "关闭",
        type: FXDialogActionType.Cancel,
        onPress: () => {},
      })
      .show();
  };
  // 整个业务线都需要毛玻璃效果 自定义一个建议这么写
  const showGlassmorphismDialog = () => {
    const suspensionView = (
      <TouchableOpacity
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: 40,
          height: 40,
          justifyContent: "center",
          alignItems: "center",
        }}
        // eslint-disable-next-line react-hooks/immutability
        onPress={() => ctrl?.close()}
      >
        <Image
          resizeMode="contain"
          source={containerImage}
          style={{ width: 20, height: 20 }}
        />
      </TouchableOpacity>
    );
    // 将 ctrl 初始化和赋值逻辑提前到 JSX 渲染之前
    const ctrl = getDialog(dialogType, GlassmorphismDialog)
      .addTitle({
        title: "🌟 毛玻璃效果",
        onPress: () => console.log("点击标题"),
      })
      .addMessage({
        message: "这是采用毛玻璃效果的现代弹窗设计，具有半透明和模糊背景效果",
        onPress: () => console.log("点击消息"),
      })
      .addAction({
        action: "体验效果",
        type: FXDialogActionType.Highlight,
        background: <View style={{ backgroundColor: "yellow" }} />, // 添加按钮背景
        onPress: () => console.log("体验毛玻璃效果"),
      })
      .addAction({
        action: "关闭",
        type: FXDialogActionType.Cancel,
        onPress: () => console.log("关闭毛玻璃弹窗"),
      })
      .addSuspension(suspensionView)
      .show();
    return ctrl;
  };

  // 只有某个弹窗需要效果 建议这么写
  // const showGlassmorphismDialog2 = () => {
  //   getDialog(dialogType, FXDialog)
  //     .addTitle({
  //       title: "🌟 毛玻璃效果",
  //     })
  //     .addMessage({
  //       message: "这是采用毛玻璃效果的现代弹窗设计，具有半透明和模糊背景效果",
  //     })
  //     .addAction({
  //       action: "体验效果",
  //       type: FXDialogActionType.Highlight,
  //       onPress: () => console.log("体验毛玻璃效果"),
  //     })
  //     .addAction({
  //       action: "关闭",
  //       type: FXDialogActionType.Cancel,
  //       onPress: () => console.log("关闭毛玻璃弹窗"),
  //     })
  //     .addAction({
  //       action: "默认",
  //       type: FXDialogActionType.Default,
  //       onPress: () => console.log("default"),
  //     })
  //     .appendBackground(<BlurView intensity={25} />)
  //     .appendContainer(<BlurView intensity={25} />)
  //     .show();
  // };

  const showNeonDialog = () => {
    getDialog(dialogType, NeonDialog)
      .addTitle({
        title: "⚡ 霓虹灯效果",
      })
      .addMessage({
        message: "充满未来科技感的霓虹灯效果，带有发光文字和阴影",
      })
      .addAction({
        action: "启动",
        type: FXDialogActionType.Highlight,
        onPress: () => console.log("启动霓虹灯效果"),
      })
      .addAction({
        action: "默认",
        type: FXDialogActionType.Default,
        onPress: () => console.log("default"),
      })
      .addAction({
        action: "默认",
        type: FXDialogActionType.Default,
        onPress: () => console.log("default"),
      })
      .show();
  };

  const showGradientDialog = () => {
    getDialog(dialogType, GradientDialog)
      .addTitle({
        title: "🌈 渐变效果",
        style: {
          color: "#FFFFFF",
          fontSize: 20,
          lineHeight: 28,
          fontWeight: "bold",
        },
      })
      .addMessage({
        message: "美丽的渐变背景效果，从蓝色到紫色的梦幻过渡",
        style: { color: "rgba(255, 255, 255, 0.9)", fontSize: 16 },
      })
      .addAction({
        action: "应用主题",
        type: FXDialogActionType.Highlight,
        onPress: () => console.log("应用渐变主题"),
      })
      .addAction({ action: "取消", type: FXDialogActionType.Cancel })
      .containerStyle({
        backgroundColor: "#667eea",
        borderRadius: 20,
        paddingVertical: 8,
      })
      .actionsContainerStyle({
        borderTopWidth: 0,
        paddingHorizontal: 8,
        gap: 5,
        backgroundColor: undefined,
      })
      .appendContainer(
        <LinearGradient
          colors={["blue", "purple"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 20,
          }}
        />,
      )
      .show();
  };

  // 📱 实际应用场景
  const showRatingDialog = () => {
    const ctrl = getDialog(dialogType)
      .addTitle({ title: "⭐ 评价体验" })
      .addMessage({ message: "您对我们的应用体验满意吗？" })
      .addCustom({
        content: (
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => {
                  console.log(`评分: ${star}星`);
                  ctrl?.close();
                }}
                style={styles.starButton}
              >
                <Text style={styles.star}>⭐</Text>
              </TouchableOpacity>
            ))}
          </View>
        ),
      })
      .addAction({
        action: "稍后再说",
        type: FXDialogActionType.Cancel,
      })
      .show();
  };

  const showWelcomeDialog = () => {
    getDialog(dialogType)
      .addTitle({
        title: "🎉 欢迎使用",
        style: {
          fontSize: 24,
          lineHeight: undefined,
          fontWeight: "bold",
          color: "#FF6B6B",
        },
      })
      .addMessage({
        message: "欢迎来到我们的应用！这里有各种精彩功能等您探索",
        style: { fontSize: 16, lineHeight: 24 },
      })
      .addCustom({
        content: (
          <View style={styles.featureContainer}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🚀</Text>
              <Text style={styles.featureText}>快速体验</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>💡</Text>
              <Text style={styles.featureText}>智能推荐</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🔒</Text>
              <Text style={styles.featureText}>安全可靠</Text>
            </View>
          </View>
        ),
      })
      .addAction({
        action: "开始体验",
        type: FXDialogActionType.Highlight,
        onPress: () => console.log("用户开始体验应用"),
      })
      .show();
  };

  const showOnboardingDialog = () => {
    const steps = [
      { title: "第一步", message: "创建您的个人资料", icon: "👤" },
      { title: "第二步", message: "设置您的偏好", icon: "⚙️" },
      { title: "第三步", message: "开始探索功能", icon: "🚀" },
    ];

    const showStep = (stepIndex: number) => {
      if (stepIndex >= steps.length) {
        ctrl?.close();
        return;
      }

      const step = steps[stepIndex];
      ctrl?.update({
        contents: [
          {
            id: "onboarding_title",
            title: `${step.icon} ${step.title}`,
            style: { fontSize: 20, fontWeight: "bold", color: "#4ECDC4" },
          },
          {
            id: "onboarding_message",
            message: step.message,
            style: { fontSize: 16, lineHeight: 22 },
          },
        ],
        actions: [
          {
            id: "onboarding_action",
            action: stepIndex === steps.length - 1 ? "完成" : "下一步",
            type: FXDialogActionType.Highlight,
            onPress: () => showStep(stepIndex + 1),
          },
        ],
      });
    };

    const ctrl = getDialog(dialogType)
      .addTitle({
        id: "onboarding_title",
        title: "🎯 新手指引",
      })
      .addMessage({
        id: "onboarding_message",
        message: "让我们带您快速了解应用的核心功能",
      })
      .addAction({
        id: "onboarding_action",
        action: "开始",
        type: FXDialogActionType.Highlight,
        onPress: () => showStep(0),
      })
      .show();
  };

  // 生成示例列表
  const generateExamples = (): ListItem[] => {
    const baseExamples: ListItem[] = [
      // 基础功能
      {
        key: "basic",
        title: "基础提示",
        description: "最简单的弹窗使用",
        icon: "💬",
        category: "基础功能",
        onPress: showBasicAlert,
      },
      {
        key: "confirm",
        title: "确认对话框",
        description: "带确认/取消按钮的弹窗",
        icon: "❓",
        category: "基础功能",
        onPress: showConfirmDialog,
      },
      {
        key: "rich",
        title: "富文本内容",
        description: "自定义样式的文本内容",
        icon: "📝",
        category: "基础功能",
        onPress: showRichContent,
      },
      {
        key: "actions",
        title: "多操作按钮",
        description: "展示多个操作选项",
        icon: "🔘",
        category: "基础功能",
        onPress: showCustomActions,
      },
      {
        key: "photos",
        title: "照片选择",
        description: "选择照片或拍照",
        icon: "📷",
        category: "基础功能",
        onPress: showPhotoDialog,
      },
      {
        key: "long_message",
        title: "长消息",
        description: "展示长消息",
        icon: "🔘",
        category: "基础功能",
        onPress: showLongMessage,
      },

      // 自定义内容
      {
        key: "custom",
        title: "自定义视图",
        description: "包含输入框和开关的复杂界面",
        icon: "🎨",
        category: "自定义内容",
        onPress: showCustomView,
      },
      {
        key: "gallery",
        title: "图片画廊",
        description: "横向滚动的图片展示",
        icon: "🖼️",
        category: "自定义内容",
        onPress: showImageGallery,
      },

      // 动画效果
      {
        key: "animations",
        title: "动画展示",
        description: "各种内置动画效果演示",
        icon: "✨",
        category: "动画效果",
        onPress: showAnimationDemo,
      },
      {
        key: "custom_anim",
        title: "自定义动画",
        description: "用户自定义的炫酷动画",
        icon: "🎭",
        category: "动画效果",
        onPress: showCustomAnimation,
      },

      // 动态更新
      {
        key: "dynamic",
        title: "动态更新",
        description: "运行时更新弹窗内容",
        icon: "🔄",
        category: "动态更新",
        onPress: showDynamicUpdate,
      },
      {
        key: "progress",
        title: "进度条",
        description: "实时更新的进度展示",
        icon: "📊",
        category: "动态更新",
        onPress: showProgressDialog,
      },

      // 炫酷样式
      {
        key: "backImage",
        title: "背景图片",
        description: "自定义背景图片",
        icon: "🎨",
        category: "炫酷样式",
        onPress: showBackImageDialog,
      },
      {
        key: "glass",
        title: "毛玻璃效果",
        description: "现代毛玻璃设计风格",
        icon: "🌟",
        category: "炫酷样式",
        onPress: showGlassmorphismDialog,
      },
      {
        key: "neon",
        title: "霓虹灯效果",
        description: "赛博朋克风格的发光效果",
        icon: "⚡",
        category: "炫酷样式",
        onPress: showNeonDialog,
      },
      {
        key: "gradient",
        title: "渐变效果",
        description: "美丽的渐变背景设计",
        icon: "🌈",
        category: "炫酷样式",
        onPress: showGradientDialog,
      },

      // 实际应用
      {
        key: "rating",
        title: "评分弹窗",
        description: "五星评价界面",
        icon: "⭐",
        category: "实际应用",
        onPress: showRatingDialog,
      },
      {
        key: "welcome",
        title: "欢迎界面",
        description: "新用户欢迎引导",
        icon: "🎉",
        category: "实际应用",
        onPress: showWelcomeDialog,
      },
      {
        key: "onboarding",
        title: "新手引导",
        description: "分步骤的功能介绍",
        icon: "🎯",
        category: "实际应用",
        onPress: showOnboardingDialog,
      },
    ];

    return baseExamples;
  };

  const examples = generateExamples();

  const renderCategoryHeader = ({
    section,
  }: {
    section: { title: string; data: ListItem[] };
  }) => (
    <View style={styles.categoryHeader}>
      <Text style={styles.categoryTitle}>{section.title}</Text>
    </View>
  );

  const renderItem = ({ item }: { item: ListItem }) => (
    <TouchableOpacity style={styles.item} onPress={item.onPress}>
      <View style={styles.itemLeft}>
        <Text style={styles.itemIcon}>{item.icon}</Text>
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          {item.description && (
            <Text style={styles.itemDescription}>{item.description}</Text>
          )}
        </View>
      </View>
      <Text style={styles.itemArrow}>›</Text>
    </TouchableOpacity>
  );

  // 按类别分组数据
  const groupedData = examples.reduce(
    (acc, item) => {
      const category = item.category || "其他";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, ListItem[]>,
  );

  const sections = Object.entries(groupedData).map(([title, data]) => ({
    title,
    data,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <FXView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {dialogType === "alert"
              ? "警告框"
              : dialogType === "actionSheet"
                ? "操作表"
                : "底部弹窗"}{" "}
            示例
          </Text>
          <View style={styles.placeholder} />
        </View>

        <SectionList
          sections={sections}
          keyExtractor={(item) => item.key}
          renderSectionHeader={renderCategoryHeader}
          renderItem={renderItem}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          SectionSeparatorComponent={() => (
            <View style={styles.sectionSeparator} />
          )}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>💡 点击上方示例体验各种弹窗效果</Text>
        </View>
      </FXView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 24,
    color: "#495057",
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
  },
  placeholder: {
    width: 40,
  },
  list: {
    flex: 1,
  },
  categoryHeader: {
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6C757D",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  itemIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: "#6C757D",
    lineHeight: 18,
  },
  itemArrow: {
    fontSize: 24,
    color: "#ADB5BD",
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: "#E9ECEF",
    marginHorizontal: 16,
  },
  sectionSeparator: {
    height: 16,
  },
  footer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#E9ECEF",
  },
  footerText: {
    fontSize: 14,
    color: "#6C757D",
    textAlign: "center",
  },
  // 自定义内容样式
  customContent: {
    padding: 20,
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4ECDC4",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 24,
  },
  customTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
    paddingVertical: 8,
  },
  settingLabel: {
    fontSize: 16,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 120,
    fontSize: 14,
  },
  imageContainer: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  imageItem: {
    marginRight: 15,
    alignItems: "center",
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  imageText: {
    fontSize: 24,
  },
  imageCaption: {
    fontSize: 12,
    color: "#666",
  },
  progressContainer: {
    padding: 20,
    alignItems: "center",
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4ECDC4",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4ECDC4",
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 20,
  },
  starButton: {
    padding: 8,
  },
  star: {
    fontSize: 32,
  },
  featureContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
  },
  featureItem: {
    alignItems: "center",
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: "#666",
  },
});

export default DialogScreen;
