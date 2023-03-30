<template>
    <view>
        <tn-nav-bar fixed alpha customBack>
          <view slot="back" class='tn-custom-nav-bar__back'
            @click="goBack">
            <text class='icon tn-icon-left'></text>
            <text class='icon tn-icon-home-capsule-fill'></text>
          </view>
        </tn-nav-bar>
        <view class="login">
          <!-- 顶部背景图片-->
          <view class="login__bg login__bg--top">
            <!-- <image class="bg" src="https://static.cyzy.cnwew.com/app/login_top2.jpg" mode="widthFix"></image> -->
            <image class="bg" :src="appImgs.bg_5" style="height: 100vh;" mode="aspectFill"></image>
          </view>
          <view class="login__bg login__bg--top">
            <!-- <image class="rocket rocket-sussuspension" src="https://tnuiimage.tnkjapp.com/login/1/login_top3.png" mode="widthFix"></image> -->
          </view>
          
          <view class="login__wrapper">
            <!-- 登录/注册切换 -->
            <view class="login-sussuspension login__mode tn-flex tn-flex-direction-row tn-flex-nowrap tn-flex-col-center tn-flex-row-center">
              <view class="login__mode__item tn-flex-1" :class="[{'login__mode__item--active': currentModeIndex === 0}]" @tap.stop="modeSwitch(0)">
                登录
              </view>
              <view class="login__mode__item tn-flex-1" :class="[{'login__mode__item--active': currentModeIndex === 1}]" @tap.stop="modeSwitch(1)">
                注册
              </view>
              
              <!-- 滑块-->
              <view class="login__mode__slider tn-cool-bg-color-15--reverse" :style="[modeSliderStyle]"></view>
            </view>
            
            <!-- 输入框内容-->
            <view class="login__info tn-flex tn-flex-direction-column tn-flex-col-center tn-flex-row-center">
              <!-- 登录 -->
              <block v-if="currentModeIndex === 0">
                <view class="login__info__item__input tn-flex tn-flex-direction-row tn-flex-nowrap tn-flex-col-center tn-flex-row-left">
                  <view class="login__info__item__input__left-icon">
                    <view class="tn-icon-phone"></view>
                  </view>
                  <view class="login__info__item__input__content">
                    <input maxlength="20" v-model="formdata.phone" placeholder-class="input-placeholder" placeholder="请输入登录帐号" />
                  </view>
                </view>
                
                <view class="login__info__item__input tn-flex tn-flex-direction-row tn-flex-nowrap tn-flex-col-center tn-flex-row-left">
                  <view class="login__info__item__input__left-icon">
                    <view class="tn-icon-lock"></view>
                  </view>
                  <view class="login__info__item__input__content">
                    <input v-model="formdata.password" :password="!showPassword" placeholder-class="input-placeholder" placeholder="请输入登录密码" />
                  </view>
                  <view class="login__info__item__input__right-icon" @click="showPassword = !showPassword">
                    <view :class="[showPassword ? 'tn-icon-eye' : 'tn-icon-eye-hide']"></view>
                  </view>
                </view>
              </block>
              <!-- 注册 -->
              <block v-if="currentModeIndex === 1">
                <view class="login__info__item__input tn-flex tn-flex-direction-row tn-flex-nowrap tn-flex-col-center tn-flex-row-left">
                  <view class="login__info__item__input__left-icon">
                    <view class="tn-icon-phone"></view>
                  </view>
                  <view class="login__info__item__input__content">
                    <input maxlength="20" v-model="formdata.phone" placeholder-class="input-placeholder" placeholder="请输入注册帐号" />
                  </view>
                </view>
                
<!--                <view class="login__info__item__input tn-flex tn-flex-direction-row tn-flex-nowrap tn-flex-col-center tn-flex-row-left">
                  <view class="login__info__item__input__left-icon">
                    <view class="tn-icon-code"></view>
                  </view>
                  <view class="login__info__item__input__content login__info__item__input__content--verify-code">
                    <input placeholder-class="input-placeholder" placeholder="请输入验证码" />
                  </view>
                  <view class="login__info__item__input__right-verify-code" @tap.stop="getCode">
                    <tn-button backgroundColor="#01BEFF" fontColor="#FFFFFF" size="sm" padding="5rpx 10rpx" width="100%" shape="round">{{ tips }}</tn-button>
                  </view>
                </view> -->
                
                <view class="login__info__item__input tn-flex tn-flex-direction-row tn-flex-nowrap tn-flex-col-center tn-flex-row-left">
                  <view class="login__info__item__input__left-icon">
                    <view class="tn-icon-lock"></view>
                  </view>
                  <view class="login__info__item__input__content">
                    <input v-model="formdata.password" :password="!showPassword" placeholder-class="input-placeholder" placeholder="请输入登录密码" />
                  </view>
                  <view class="login__info__item__input__right-icon" @click="showPassword = !showPassword">
                    <view :class="[showPassword ? 'tn-icon-eye' : 'tn-icon-eye-hide']"></view>
                  </view>
                </view>
              </block>
              
              <view class="login__info__item__button tn-cool-bg-color-7--reverse" hover-class="tn-hover" :hover-stay-time="150" @click="formSubmit">{{ currentModeIndex === 0 ? '登录' : '注册'}}</view>
              
              <!-- <view v-if="currentModeIndex === 0" class="login__info__item__tips">忘记密码?</view> -->
            </view>
            <view style="padding: 20rpx;text-align: center;color: #FFFFFF;">其他登录方式</view>
            <!-- 其他登录方式 -->
            <view class="login__way tn-flex tn-flex-col-center tn-flex-row-center">
                 <!-- #ifdef MP-WEIXIN -->
              <view class="tn-padding-sm tn-margin-xs" @click="wxminiLogin()">
                <view class="login__way__item--icon tn-flex tn-flex-row-center tn-flex-col-center tn-shadow-blur tn-bg-green tn-color-white">
                  <view class="tn-icon-wechat-fill"></view>
                </view>
              </view>
               <!-- #endif -->
               <!-- #ifdef MP-QQ -->
              <view class="tn-padding-sm tn-margin-xs">
                  <button type="primary" open-type="getUserInfo" @getuserinfo="qqminiLogin" style="border: 0; padding: 0; margin: 0; width: 78rpx; height: 78rpx;border-radius: 50%;">
                <view class="login__way__item--icon tn-flex tn-flex-row-center tn-flex-col-center tn-shadow-blur tn-bg-blue tn-color-white">
                  <view class="tn-icon-qq"></view>
                </view>
                </button>
              </view>
               <!-- #endif -->
            </view>
          </view>
          
          
          <!-- 底部背景图片-->
          <view class="login__bg login__bg--bottom">
            <!-- <image src="https://static.cyzy.cnwew.com/app/login_bottom_bg.jpg" mode="widthFix"></image> -->
          </view>
        </view>
        <!-- <image class="bg" :src="appImgs.bg_1" mode="aspectFill"></image> -->
        <form class="login" @submit="formSubmit" style="display: none;">
            <view class="item h-flex-x">
                <view>帐号：</view>
                <view class="h-flex-item-grow">
                    <input type="text" v-model="formdata.phone" name="phone" maxlength="11" placeholder="请输入帐号">
                </view>
            </view>
            <view class="item h-flex-x">
                <view>密码：</view>
                <view class="h-flex-item-grow">
                    <input type="text" v-model="formdata.password" name="password" password="true" maxlength="16"
                        placeholder="请输入密码 6~16位(字母/数学/下划线)">
                </view>
            </view>
            <view class="item">
                <button type="primary" form-type="submit">登录（注册）</button>
            </view>
            <!-- #ifdef MP-WEIXIN -->
            <view class="item">
                <button type="primary" @click="wxminiLogin()">微信登录</button>
            </view>
            <!-- #endif -->
            <!-- #ifdef MP-QQ -->
            <view class="item">
                <button type="primary" open-type="getUserInfo" @getuserinfo="qqminiLogin">QQ登录</button>
            </view>
            <!-- #endif -->
        </form>
    </view>
</template>

<script>
    import template_page_mixin from '@/libs/mixin/template_page_mixin.js'
    export default {
         mixins: [template_page_mixin],
        data() {
            return {
                appImgs: {},
                hasWeixinAuth: false,
                formdata:{
                    phone:"",
                    password:""
                },
                // 当前选中的模式
                currentModeIndex: 0,
                // 模式选中滑块
                modeSliderStyle: {
                  left: 0
                },
                // 是否显示密码
                showPassword: false,
                // 倒计时提示文字
                tips: '获取验证码'
            }
        },
        onLoad() {
            this.appImgs = uni.$hl.getAppImgs();
            // #ifdef APP-PLUS
            plus.oauth.getServices((services) => {
                weixinAuthService = services.find((service) => {
                    return service.id === 'weixin'
                })
                if (weixinAuthService) {
                    this.hasWeixinAuth = true
                }
            });
            // #endif
            this.formdata.phone = this.$cache.get("username","")||"";
        },
        watch: {
          currentModeIndex(value) {
            const sliderWidth = uni.upx2px(476 / 2)
            this.modeSliderStyle.left = `${sliderWidth * value}px`
          }
        },
        methods: {
            // 切换模式
            modeSwitch(index) {
              this.currentModeIndex = index
              this.showPassword = false
            },
            formSubmit: function(e) {
                // let formdata = e.detail.value;
                let formdata = this.formdata;

                if (!uni.$hl.regExps.befitName.test(formdata.phone)) {
                    uni.$hl.showToast('请输入合法的帐号');
                    return;
                }

                if (!uni.$hl.regExps.befitPwd.test(formdata.password)) {
                    uni.$hl.showToast('请输入合法的密码');
                    return;
                }

                uni.$hl.showLoading('登录中');
                uniCloud.callFunction({
                    name: 'login',
                    data: formdata
                }).then((res) => {
                    uni.hideLoading();
                    if (res.result.code != 0) {
                        uni.$hl.showToast(res.result.message || '帐号与密码不匹配');
                        return;
                    }
                    this.$cache.put("username",formdata.phone)
                    this.loginSucc(res);
                    // uni.$hl.setUserInfo(res.result.userInfo);
                    // console.log(res.result.userInfo);
                    // uni.$hl.showToast('登录成功', 'success');
                    // this.loginTimeout = setTimeout(() => {
                    //     uni.reLaunch({
                    //         url: '/pages/index/index'
                    //     })
                    // }, 1500);
                }).catch((err) => {
                    uni.hideLoading();
                    uni.$hl.showToast('登录失败，请重试');
                });
            },
            getWeixinCode() {
                return new Promise((resolve, reject) => {
                    // #ifdef MP-WEIXIN
                    uni.login({
                        provider: 'weixin',
                        success(res) {
                            resolve(res.code)
                        },
                        fail(err) {
                            reject(new Error('微信登录失败'))
                        }
                    })
                    // #endif
                    // #ifdef APP-PLUS
                    weixinAuthService.authorize(function(res) {
                        resolve(res.code)
                    }, function(err) {
                        console.log(err)
                        reject(new Error('微信登录失败'))
                    });
                    // #endif
                })
            },
            getWeixinUserInfo() {
                return new Promise((resolve, reject) => {
                    uni.getUserProfile({
                        desc: '获取您的用户昵称、头像信息',
                        success(res) {
                            resolve(res)
                        },
                        fail(err) {
                            console.log(err)
                            reject(new Error('微信登录失败'))
                        }
                    });
                })
            },
            async wxminiLogin() {
                let mpuserinfo = await this.getWeixinUserInfo();
                this.getWeixinCode().then((code) => {
                    console.log(JSON.stringify(mpuserinfo))
                    uniCloud.callFunction({
                        name: 'login',
                        data: {
                            type: "wxmini",
                            code: code,
                            username: mpuserinfo.userInfo.nickName,
                            avatar: mpuserinfo.userInfo.avatarUrl,
                        }
                    }).then((res) => {
                        uni.$hl.showLoading('登录中');
                        uni.hideLoading();
                        if (res.result.code != 0) {
                            uni.$hl.showToast(res.result.message);
                            return;
                        }
                        this.loginSucc(res);
                        // uni.$hl.setUserInfo(res.result.userInfo);
                        // console.log(res.result.userInfo);
                        // uni.$hl.showToast('登录成功', 'success');
                        // this.loginTimeout = setTimeout(() => {
                        //     uni.reLaunch({
                        //         url: '/pages/index/index'
                        //     })
                        // }, 1500);
                    }).catch((err) => {
                        uni.hideLoading();
                        uni.$hl.showToast('登录失败，请重试');
                    });

                }).catch(() => {
                    uni.showModal({
                        showCancel: false,
                        content: '微信登录失败，请稍后再试'
                    })
                })


            },
            getQqCode() {
                return new Promise((resolve, reject) => {
                    uni.login({
                        provider: 'qq',
                        success(res) {
                            // #ifdef APP-PLUS
                            resolve({
                                accessToken: res.authResult.access_token,
                            })
                            // #endif
                            // #ifdef MP-QQ
                            resolve({
                                code: res.code,
                            })
                            // #endif
                        },
                        fail(err) {
                            reject(new Error('QQ登录失败'))
                        }
                    })
                })
            },
            getQqUserInfo() {
                return new Promise((resolve, reject) => {
                    uni.getUserProfile({
                        desc: '获取您的用户昵称、头像信息',
                        success(res) {
                            resolve(res)
                        },
                        fail(err) {
                            console.log(err)
                            reject(new Error('QQ登录失败'))
                        }
                    });
                })
            },
            qqminiLogin(e) {
                // let mpuserinfo = await this.getQqUserInfo();
                let mpuserinfo = e.detail;
                console.log(JSON.stringify(mpuserinfo))

                this.getQqCode().then((code) => {
                    console.log("code:---", code.code)
                    uniCloud.callFunction({
                        name: 'login',
                        data: {
                            type: "qqmini",
                            code: code.code,
                            username: mpuserinfo.userInfo.nickName,
                            avatar: mpuserinfo.userInfo.avatarUrl,
                        }
                    }).then((res) => {
                        console.log("res---", res)
                        uni.$hl.showLoading('登录中');
                        uni.hideLoading();
                        if (res.result.code != 0) {
                            uni.$hl.showToast(res.result.message);
                            return;
                        }
                        this.loginSucc(res);
                        // uni.$hl.setUserInfo(res.result.userInfo);
                        // console.log(res.result.userInfo);
                        // uni.$hl.showToast('登录成功', 'success');
                        // this.loginTimeout = setTimeout(() => {
                        //     uni.reLaunch({
                        //         url: '/pages/index/index'
                        //     })
                        // }, 1500);
                    }).catch((err) => {
                        console.log(err)
                        uni.hideLoading();
                        uni.$hl.showToast('登录失败，请重试');
                    });

                }).catch((err) => {
                    console.log(err)
                    uni.showModal({
                        showCancel: false,
                        content: 'QQ登录失败，请稍后再试'
                    })
                })


            },
            loginSucc(res) {
                let userInfo = {
                    uid: res.result.uid,
                    token: res.result.token,
                    tokenExpired: res.result.tokenExpired,
                }
                this.$store.commit("user/login", userInfo);
                uniCloud.callFunction({
                    name: 'getUserInfo',
                    data: {
                        id: res.result.uid
                    }
                }).then((res2) => {
                    if (!res2.result.code) {
                        return;
                    }
                    uni.$hl.setUserInfo(res2.result.data);
                }).catch((err) => {});
                uni.$hl.showToast('登录成功', 'success');
                this.loginTimeout = setTimeout(() => {
                    uni.reLaunch({
                        url: '/pages/index/index'
                    })
                }, 1500);
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/static/css/templatePage/custom_nav_bar.scss';
    // page {
    //     background-color: #f3f3f3;
    //     font-size: 28rpx;
    //     color: #333;
    // }

    // .login {
    //     display: block;
    //     background-color: rgba(255, 255, 255, 0.6);
    //     padding: 30rpx;
    //     position: absolute;
    //     z-index: 1;
    //     width: 90%;
    //     box-sizing: border-box;
    //     top: 200rpx;
    //     left: 5%;

    //     .item {
    //         padding: 10rpx 0;

    //         input {
    //             height: 90rpx;
    //             display: block;
    //             width: 100%;
    //             font-size: 28rpx;
    //             letter-spacing: 1px;
    //         }

    //         &+.item {
    //             border-top: #eee solid 1px;
    //         }
    //     }
    // }

    // .bg {
    //     position: fixed;
    //     z-index: 1;
    //     top: 0;
    //     left: 0;
    //     width: 100%;
    //     height: 100%;
    // }

    // .box {
    //     position: fixed;
    //     z-index: 2;
    //     top: 0;
    //     left: 0;
    //     width: 100%;
    //     height: 100%;
    //     box-sizing: border-box;
    //     padding-top: var(--status-bar-height);
    // }
    /* 悬浮 */
    .login-sussuspension{
      animation: suspension 3s ease-in-out infinite;
    }
   .rocket-sussuspension{
     animation: suspension 3s ease-in-out infinite;
   }
   
  @keyframes suspension {
    0%, 100% {
      transform: translate(0 , 0);
    }
    50% {
      transform: translate(-0.8rem , 1rem);
    }
  }
  
    
    .login {
      position: relative;
      height: 100%;
      z-index: 1;
      
      /* 背景图片 start */
      &__bg {
        z-index: -1;
        position: fixed;
        
        &--top {
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          
          .bg {
            width: 750rpx;
            will-change: transform;
          }
          .rocket {
            margin: 50rpx 28%;
            width: 400rpx;
            will-change: transform;
          }
        }
        
        &--bottom {
          bottom: -10rpx;
          left: 0;
          right: 0;
          width: 100%;
          // height: 144px;
          margin-bottom: env(safe-area-inset-bottom);
          
          image {
            width: 750rpx;
            will-change: transform;
          }
        }
      }
      /* 背景图片 end */
      
      /* 内容 start */
      &__wrapper {
        margin-top: 403rpx;
        width: 100%;
      }
      
      /* 切换 start */
      &__mode {
        position: relative;
        margin: 0 auto;
        width: 476rpx;
        height: 77rpx;
        background-color: #FFFFFF;
        box-shadow: 0rpx 10rpx 50rpx 0rpx rgba(0, 3, 72, 0.1);
        border-radius: 39rpx;
        
        &__item {
          height: 77rpx;
          width: 100%;
          line-height: 77rpx;
          text-align: center;
          font-size: 31rpx;
          color: #908f8f;
          letter-spacing: 1em;
          text-indent: 1em;
          z-index: 2;
          transition: all 0.4s;
          
          &--active {
            font-weight: bold;
            color: #FFFFFF;
          }
        }
        
        &__slider {
          position: absolute;
          height: inherit;
          width: calc(476rpx / 2);
          border-radius: inherit;
          box-shadow: 0rpx 18rpx 72rpx 18rpx rgba(0, 195, 255, 0.1);
          z-index: 1;
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      }
      /* 切换 end */
      
      /* 登录注册信息 start */
     &__info {
       margin: 0 30rpx;
       margin-top: 105rpx;
       padding: 30rpx 51rpx;
       padding-bottom: 0;
       border-radius: 20rpx;
       background-color: rgba(255,255,255,0.3);
       box-shadow: 0rpx 10rpx 50rpx 0rpx rgba(0, 3, 72, 0.1);
       
       &__item {
         
         &__input {
           margin-top: 59rpx;
           width: 100%;
           height: 77rpx;
           border: 1rpx solid #E6E6E6;
           border-radius: 39rpx;
           
           &__left-icon {
             width: 10%;
             font-size: 44rpx;
             margin-left: 20rpx;
             color: #FFFFFF;
           }
           
           &__content {
             width: 80%;
             padding-left: 10rpx;
             
             &--verify-code {
               width: 56%;
             }
             
             input {
               font-size: 24rpx;
               // letter-spacing: 0.1em;
             }
           }
           
           &__right-icon {
             width: 10%;
             font-size: 44rpx;
             margin-right: 20rpx;
             color: #AAAAAA;
           }
           
           &__right-verify-code {
             width: 34%;
             margin-right: 20rpx;
           }
         }
         
         &__button {
           margin-top: 75rpx;
           margin-bottom: 39rpx;
           width: 100%;
           height: 77rpx;
           text-align: center;
           font-size: 31rpx;
           font-weight: bold;
           line-height: 77rpx;
           letter-spacing: 1em;
           text-indent: 1em;
           border-radius: 39rpx;
           box-shadow: 1rpx 10rpx 24rpx 0rpx rgba(60, 129, 254, 0.35);
         }
         
         &__tips {
           margin: 30rpx 0;
           color: #AAAAAA;
         }
       }
     }
      /* 登录注册信息 end */
      
      /* 登录方式切换 start */
      &__way {
        margin: 0 auto;
        // margin-top: 20rpx;
        
        &__item {
          &--icon {
            width: 77rpx;
            height: 77rpx;
            font-size: 50rpx;
            border-radius: 100rpx;
            margin-bottom: 18rpx;
            position: relative;
            z-index: 1;
            
            &::after {
              content: " ";
              position: absolute;
              z-index: -1;
              width: 100%;
              height: 100%;
              left: 0;
              bottom: 0;
              border-radius: inherit;
              opacity: 1;
              transform: scale(1, 1);
              background-size: 100% 100%;
              background-image: url(https://tnuiimage.tnkjapp.com/cool_bg_image/icon_bg5.png);
            }
          }
        }
      }
      /* 登录方式切换 end */
      /* 内容 end */
      
    }
    
    ::v-deep .input-placeholder {
      font-size: 24rpx;
      color: #E6E6E6;
    }
    
</style>
