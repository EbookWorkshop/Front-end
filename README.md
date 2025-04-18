# EBook WorkShop Front End
基于 Arco Design Vue 搭建的个人图书管理平台前端。



## 目录结构
```
├── README.md
├── package.json
├── index.html
├── src
│   ├── api  # 请求接口
│   ├── assets  # 静态资源
│          └── style 全局样式
│   ├── components  # 通用业务组件
│   ├── config  # 全局配置(包含echarts主题)
│          └── settings.json  # 配置文件
│   ├── directives # 指令集（如需，可自行补充）
│   ├── filters # 过滤器（如需，可自行补充）
│   ├── hooks # 全局hooks       useXXXXX
│   ├── layout  # 布局
│   ├── locale  # 国际化语言包
│   ├── mock  # 模拟数据
│   ├── views  # 页面模板
│   ├── router # 路由配置
│   ├── store  # 状态管理中心
│   ├── types  # Typescript 类型
│   └── utils  # 工具库
│   └── App.vue  # 视图入口
│   └── main.ts  # 入口文件
└── tsconfig.json
```

## Arco Design Vue 搭建(已完成)
使用arco-cli搭建：
```
npm i -g arco-cli --registry=https://registry.npmmirror.com
arco init EbookWorkshop-FrontEnd
```
ArcoDesignVue已更新到v2.56.3

## 初始化安装
```
npm install --registry=https://registry.npmmirror.com
```

## 启动
```bat
npm run dev
```
前后端一起启动（需要在公共的父级目录执行）
```
wt --maximized -d %cd%\\EBWFrontEnd PowerShell -c npm run dev;split-pane -d %cd%\\EbookWorkshop node --inspect app
```
>  --inspect 参数用于远程附加


## TODO List
* [x] 完成Txt文档导入库存功能
    * [x] 导入向导——分步表单的开发
    * [x] API接口开发接入
* [x] 重复执行导致错误数量累积的问题修复——进度条不准的问题
* [x] 字体生成PDF预览
* [x] 阅读页面优化（上一页、下一页）
* [x] 优化从网文到发邮件的全流程，以及其中的交互
* [x] 完善库存图书的规则校阅功能——目前好像不能很好的去除想要的段落
* [x] 完成章节目录修改名字、重新排序的功能
* [x] 加入网站延时的规则配置
* [x] 加入作者、简介规则采集功能
* [ ] 切换源的问题修复
* [ ] ~~在章节目录最底页面回到顶端需要反复滚动操作 —— [返回顶部 BackTop]控件加不上~~
* [x] 校阅结果对照比较
* [x] 解决三级路由页面会有`[Vue Router warn]`的问题

## 提交的类型规范
* build: 影响项目构建或依赖项修改
* chore: 其他修改（不在上述类型中的修改）
* ci: 持续集成相关文件修改
* docs: 文档修改
* feat: 新功能、新特性
* fix: 修改 bug
* perf: 更改代码，以提高性能（在不影响代码内部行为的前提下，对程序性能进行优化）
* refactor: 代码重构（重构，在不影响代码内部行为、功能下的代码修改）
* revert: 恢复上一次提交
* style: 代码格式修改, 注意不是 css 修改（例如分号修改）
* test: 测试用例新增、修改






## 关闭某些ESlint规则
在文件`.eslintrc.js`找到rules节点，加入配置如：`{"no-irregular-whitespace":"off"}`。

## 绕过校验
```bash
git commit --no-verify -m "提交说明"
```

## 执行校验
>在git终端bash中才能正确显示颜色和符号
```bash
npx lint-staged
```

## GitHub超时解决方案
GitHub 推送不了时
* 在这里找到最新的github.com解释ip地址：https://www.ipaddress.com/website/github.com/
* 修改本地host文件，在`C:\Windows\System32\drivers\etc`
* 运行 `ipconfig /flushdns` 刷新DNS
