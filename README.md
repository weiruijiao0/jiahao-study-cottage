# 加号的教资闯关小屋

专门为加号制作的手机网页小游戏：30关、200条文化素养资料、五类游戏玩法、八状态陪伴角色、自动存档、间隔复习、错题重练。进入关卡直接做题，不提前展示答案。无账户、无广告、无付费、无外部字体或CDN依赖。

- [打开游戏（HTTPS，游玩免登录）](https://weiruijiao0.github.io/jiahao-study-cottage/)
- [GitHub 开源仓库](https://github.com/weiruijiao0/jiahao-study-cottage)

## GitHub Pages

代码采用MIT许可证，教学资料的适用范围见`NOTICE.md`。公开仓库可通过GitHub Pages发布HTTPS网页，加号游玩不需要GitHub账号。

仓库设置中的Pages发布来源选择GitHub Actions。推送到`main`会自动检查、构建并发布；也可在Actions页面手动运行`Publish Jiahao Cottage`。部署流程只使用GitHub官方Actions，不需要另行设置云服务密钥。

构建资源使用相对路径，适用于项目子目录网址。大陆实际访问需以最终域名和网络验证结果为准。

## iPhone 使用

用Safari打开发布网址即可游玩。可通过分享菜单选择“添加到主屏幕”；系统提供“作为网页App打开”选项时保持开启。首次完整加载后，网页资源会在浏览器允许时缓存，之后可断网继续。

存档保存在当前浏览器环境。添加到主屏幕、换浏览器或换网址前，建议从设置导出进度，再在新环境导入；不同环境不保证自动共享本地存档。

## 开发

需要Node.js 22或更新版本及系统tar工具（Windows、macOS和常见Linux通常已提供）。

```sh
npm ci
npm run dev
```

```sh
npm test
npm run build
```

构建生成`dist/`静态网站、`public/source.tgz`源码下载包，以及上层目录可双击的单文件HTML。源码包排除依赖、构建输出、Git及托管身份信息，包含重新构建所需程序、资源、数据、许可证和本文档。

## 部署

把`dist/`的全部文件上传到支持HTTPS的静态托管服务。使用相对路径，可部署到子目录，不需要后端、数据库或任何密钥。源代码、角色、题目、音效均不需要调用境外API。

`npm run build`不依赖任何托管插件，也不需要托管账号凭据。

中国大陆能否直接访问取决于最终托管域名、网络路由和运营商，代码无境外运行资源依赖不等于托管域名已在大陆实测。对长期稳定访问有要求时，可把同一`dist/`迁移到可用的静态空间。无需改程序。

## 结构

- `src/main.tsx`：小屋、地图、五类玩法、复习、收藏、设置与主屏幕使用说明。
- `src/engine.ts`：答题记录、五级掌握状态、1/3/7/14天复习、首次错误和存档恢复。
- `src/audio.ts`：本地Web Audio点击、滑动、配对、答对、答错和庆祝音效。
- `src/data/`：200条独立知识记录与30关计划。
- `content/source-records.txt`、`scripts/build-content.mjs`：来源记录和数据生成工具。
- `public/`：本地场景、八状态人物、PNG主屏幕图标和网页App清单。
- `scripts/standalone.mjs`：离线缓存和单文件版本。
- `scripts/verify.mjs`：11组内容、复习和存档检查。

原资料的22处疑问单独保留；第25、48、161条为原文核对，不将可疑断言计入掌握率。197条答题记录加3条核对记录覆盖全部200条。

## 许可

自行编写的代码以MIT许可证开源。教学资料来源及其许可范围见`NOTICE.md`；第三方运行库许可见`licenses/`。
