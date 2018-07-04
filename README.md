# WidgetsPlayground

[![compatibility](https://img.shields.io/badge/compatibility-MicrosoftEdge%2B-orange.svg)]() [![GitHub release](https://img.shields.io/github/release/tower1229/WidgetsPlayground.svg)]() [![license](https://img.shields.io/github/license/tower1229/WidgetsPlayground.svg)]()

## 介绍

前端组件管理系统，前端基于Vue2/Vue-router/Vuex实现，界面基于[Flow-UI](http://flow-ui.refined-x.com/)实现，后端基于野狗云实现。

除了组件管理以外，本项目同时演示了一种不依赖构建工具开发Vue项目的思路，详细介绍参见[如何不用构建工具开发Vue全家桶项目](https://refined-x.com/2017/10/28/%E5%A6%82%E4%BD%95%E4%B8%8D%E7%94%A8%E6%9E%84%E5%BB%BA%E5%B7%A5%E5%85%B7%E5%BC%80%E5%8F%91Vue%E5%85%A8%E5%AE%B6%E6%A1%B6%E9%A1%B9%E7%9B%AE/)

## 功能

### 组件管理
- 二级分类
- 标签筛选
- 时间/名称排序
- 关键词搜索

### 组件演示
- 实时编辑
- 多组件组合
- 所见即所得

### 组件应用
- HTML/CSS/JS代码一键复制
- 还可以将编辑结果生成配置代码，实现编辑结果一键再现

### 用户管理
- 接入野狗云后端，实现用户管理
- 用户使用痕迹数据统计

## 演示 
http://refined-x.com/WidgetsPlayground/

## 运行配置
- 将项目置于服务器环境，修改`index.html`底部脚本中的`seajs.root`为``（以项目所在的服务器路径为准）
- `seajs.widgetRootPath`变量是演示组件库（`/widgets`）的位置，通常不需要修改
- `seajs.config.base`是Flow-UI模块库的地址，通常不需要修改
