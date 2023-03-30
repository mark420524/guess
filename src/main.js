import Vue from 'vue'
import App from './App'
import helangGlobal from './libs/helang-global.js'	//引入 helang-global.js
import request from './common/request'
import cache from './common/cache'
import store from './store'
// 全局配置
request.setConfig({
    baseUrl: 'http://127.0.0.1:8000/api/wx', // 此为测试地址，需加入到域名白名单，或者更改为您自己的线上地址即可
    dataType: 'json', // 可删除，默认为json
    
    // 设置请求头，支持所有请求头设置，也可不设置，去掉header就行
    header: {
      'X-token-api': 'wqer234asdfwer123asfawre4',
      "Content-Type": "application/x-www-form-urlencoded",
    }
})
// 设置请求拦截器
request.interceptors.request(config => {
    // 配置参数和全局配置相同，此优先级最高，会覆盖在其他地方的相同配置参数

    // 追加请求头，推荐
    // config.header['content-type'] = 'application/json';
    config.header['X-token-user'] = uni.getStorageSync('userToken');

    // 覆盖请求头
    // config.header = {
    // 'content-type': 'application/json',
    // 'token': 'token from interceptors'
    // }

    // return false; // 终止请求
    // return Promise.reject('error from request interceptors'); // 向外层抛出错误，用catch捕获
    return config; // 返回修改后的配置，如未修改也需添加这行
})

request.interceptors.response(res => {
    // 接收请求，执行响应操作
    // 您的逻辑......

    // return false;    // 阻止返回,页面不会接收返回值
    // return {message: '自定义值，来自拦截器'};   // 返回您自定义的值，将覆盖原始返回值
    // return Promise.reject('error from response interceptors') // 向外层抛出错误，用catch捕获
    
    if (res.statusCode==200) {
        res = res.data;
        //console.log('interceptors', res)
        if (typeof(res)=='string') {
            //console.log('res is a string , do json parse');
            res = JSON.parse(res);
        }
        if (res.code===0) {
            return res.data;
        }else{
            //console.log('interceptor error', res)
            uni.showToast({
                title: res.message,
                duration: 2000,
                icon: 'none'
            });
        }
    }else{
        uni.showToast({
            title: '请求失败，系统异常',
            duration: 2000,
            icon: 'none'
        });
        return false;
    }
    
    
})
Vue.config.productionTip = false
Vue.prototype.$request = request
Vue.prototype.$cache = cache
Vue.prototype.$store = store
App.mpType = 'app'

Vue.use(helangGlobal)	// 使用 helang-global.js

import TuniaoUI from 'tuniao-ui'
Vue.use(TuniaoUI)
let vuexStore = require('@/store/$t.mixin.js')
Vue.mixin(vuexStore)


const app = new Vue({
    ...App
})
app.$mount()
