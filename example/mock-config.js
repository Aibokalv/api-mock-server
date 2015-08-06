module.exports = {
    // 测试API的端口
    port: '3000',
    // 线上API的地址
    apiHost: '120.24.241.233',
    // 线上API的端口
    apiPort: '6100',
    // API的key
    apiKey: 'mmzybydxwdjcl',
    // mock模板的地址，相对于运行路径
    mockSource: '/mock',
    // 数据类型模板的路径，相对于运行路径
    typesSource: '/types',
    // 数据转换器
    //converter: require('./converter'),
    // 安全域名
    safeDomain: ['*']
}