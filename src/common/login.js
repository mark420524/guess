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
        resolve({type:'h5'})
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
    getAppCode
}