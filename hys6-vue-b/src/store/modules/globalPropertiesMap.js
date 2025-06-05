export default {
    // 设置全局参数
    state: {
        /**
         * 微服务网关模块服务名(spring.application.name), 
         * 开发时必须保持与根目录下的vue.config.js中的匹配名称一致.
         * 否则无法通过改代理
         */
        gatewayServiceName: 'gatewayServiceName'
    },
    // 数据的更改操作
    mutations: {
        SET_GATEWAY_CONFIG: (state, data) => {
            sessionStorage.setItem('gatewayServiceName', data.gatewayServiceName)
        }
    },
    // 返回数据的方法
    getters: {
        getGatewayServiceName(state) {
            return sessionStorage.getItem('gatewayServiceName');
        }
    },
    // 异步调用定义
    actions: {
        setGatewayServiceName({ commit }, data) {
            commit('SET_GATEWAY_CONFIG', data)
        }
    }
}