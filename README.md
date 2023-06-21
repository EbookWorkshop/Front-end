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
│   ├── hooks # 全局hooks
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
ArcoDesignVue已更新到v2.44.7

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
* 发邮件时选章节得一个一个选
* 选后面的章节后，得滚动页面到最开始操作发送邮件
* 书添加校阅规则


## 提交的类型规范
* feat: 新功能、新特性
* fix: 修改 bug
* perf: 更改代码，以提高性能（在不影响代码内部行为的前提下，对程序性能进行优化）
* refactor: 代码重构（重构，在不影响代码内部行为、功能下的代码修改）
* docs: 文档修改
* style: 代码格式修改, 注意不是 css 修改（例如分号修改）
* test: 测试用例新增、修改
* build: 影响项目构建或依赖项修改
* revert: 恢复上一次提交
* ci: 持续集成相关文件修改
* release: 发布新版本
* chore: 其他修改（不在上述类型中的修改）