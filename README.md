# dsh-codex-ui

DeepSeek Harness 的 Codex 风格三栏界面皮肤。

参考 Codex 桌面端的布局，把 DSH Web 界面整理成：

- 左侧 52px 图标栏
- 中间会话与项目列表
- 右侧对话内容

## 功能

- 左侧图标栏复用 DSH 的 `sidebar.panellist`，插件、自动化、dsh-market 以及之后新增的面板按钮会自动出现。
- 所有图标支持悬停/键盘聚焦提示，侧栏收起或展开时都能显示。
- 进入全局面板时自动收起会话列表，返回对话时展开；手动收起不会被强制覆盖。
- 会话列表与对话之间、全屏右侧栏顶部都有 1px 分隔线。
- 内容区使用圆角描边，全屏右侧栏在侧栏收起时恢复同样的 16px 圆角。
- 标题栏窗口按钮区域透明，避免原生灰底。
- 图标栏和标题栏使用壁纸取色后的低饱和渐变；DSH 未开启系统 Mica，因此这是 Mica 风格近似效果。
- 修复全屏右侧栏遮挡会话列表、按钮滑动动画、侧栏图标动画等问题。

## 目录

```text
.
├── README.md
├── .gitignore
└── plugin/
    ├── package.json
    ├── index.js
    ├── client.js
    ├── cordis.patch.yml
    ├── icon.svg
    ├── locale/
    └── README.md
```

`plugin/` 是实际的 DSH bundle，插件细节和实现说明见 [plugin/README.md](plugin/README.md)。

## 安装

在 DSH profile 环境中把 `plugin/` 目录安装为桌面 profile 的 bundle：

```powershell
dsh plugin --profile desktop add <repo>/plugin
```

安装后重启 DeepSeek Harness。当前适配 DSH `0.2.1-rc.2` 的 Windows Web 客户端。

## 已知限制

- 部分样式依赖 DSH 当前版本的生成类名和选择器，升级后可能需要同步调整。
- 不是 Windows DWM 原生 Mica；原生效果需要修改 DSH 桌面主进程以开启 `backgroundMaterial: 'mica'`。
- 主要针对 Windows 桌面版验证，Web/其他平台行为可能不同。

## License

未附带开源许可证，默认保留所有权利。需要公开发布时请先补充 LICENSE。
