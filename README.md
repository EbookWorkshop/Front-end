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
ArcoDesignVue已更新到v2.8.0

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
