# API测试服务器
[![npm version](https://badge.fury.io/js/api-mock-server.svg)](http://badge.fury.io/js/api-mock-server)

## 如何运行

1. 根据系统安装最新版 nodejs
2. 全局安装api-mock-server `npm install -g api-mock-server`
3. 新建测试服务器目录
4. 新建mock-config.js文件，对服务器进行配置，具体查看example/mock-config.js
5. 新建配置中mockSource参数对应目录，并新建配置中typesSource参数对应目录
6. 命令行运行api-mock-server即可
7. 不要关闭命令行窗口，否则服务会停止
8. config.js 可以配置运行参数
9. 放在数据类型文件夹的可以作为公用数据类型
    1. 比如example.json 就是`@EXAMPLE`的具体内容
    2. 可以在mock模板写
        > `{"a": "@EXAMPLE"}`
    3. 那么实际生产的 a的值，是example.json里边的内容
    4. 数据类型也是mock模板

## MockJS基本语法
* 具体参考 [MockJS官网](http://mockjs.com/)