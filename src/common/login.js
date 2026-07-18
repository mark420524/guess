import uuid from '../tuniao-ui/libs/function/uuid.js';

const H5_VISITOR_ID_KEY = 'h5_visitor_id';

function getH5VisitorId() {
    let id = uni.getStorageSync(H5_VISITOR_ID_KEY);
    if (!id) {
        id = uuid(32, false);
        uni.setStorageSync(H5_VISITOR_ID_KEY, id);
    }
    return id;
}

function getAppCode() {
    return new Promise((resolve, reject) => {
        // #ifdef MP-WEIXIN
        uni.login({
            provider: 'weixin',
            success(res) {
                let data = {
                    code:res.code,
                    type:'weixin'
                }
                resolve(data)
            },
            fail(err) {
                reject(new Error('微信登录失败'))
            }
        })
        // #endif
        // #ifdef H5
        resolve({type:'h5', deviceId: getH5VisitorId()})
        // #endif
        // #ifdef APP-PLUS
        weixinAuthService.authorize(function(res) {
            let data = {
                code:res.code,
                type:'app'
            }
            resolve(data)
        }, function(err) {
            console.log(err)
            reject(new Error('微信登录失败'))
        });
        // #endif

        // #ifdef MP-QQ
        uni.login({
            provider: 'qq',
            success(res) {
                let data = {
                    code:res.code,
                    type:'qq'
                }
                resolve(data)
            },
            fail(err) {
                reject(new Error('QQ登录失败'))
            }
        })
        // #endif
    })
}

export default {
    getAppCode,
    getH5VisitorId
}