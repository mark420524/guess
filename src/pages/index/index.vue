<template>
    <view>
        <image class="bg" :src="appImgs.bg_2" mode="aspectFill"></image>
        <view class="box">
            <view class="h-flex-y h-flex-center">
                <view style="padding-top: 150rpx;" @click="toUserIndex()">
                    <!-- <image src="/static/ico.jpeg" mode="aspectFill" class="ico"></image> -->
                    <image :src="showImage" mode="aspectFill" class="ico" style="border: #FF9900 10rpx solid;">
                    </image>
                    <view style="font-size: 32rpx;text-align: center;font-weight: bold; color: #303133">早晚猜</view>
                </view>
                <view style="margin: 100rpx 0 30rpx 0;width: 100%;text-align: center;">
                    <view v-if="userInfo.id">
                        已闯过<text style="padding: 0 10rpx;color: #ff5722;">{{userInfo.pass}}</text>关
                    </view>
                </view>
                <image :src="appImgs.btn_3" mode="aspectFit" @tap="startGame" class="start transform-scale"></image>
                <view style="margin-top: 60rpx;" class="h-flex-x">
                    <image :src="appImgs.btn_1" mode="aspectFit" @tap="lookTop" class="start transform-scale"></image>
                </view>
            </view>
        </view>



        <view class="global-popup signIn-pop" :style="{ 'display':signIn.show ? 'block':'none' }">
            <view class="shade"></view>
            <view class="content">
                <image :src="appImgs.img_2" mode="aspectFit"></image>
                <view>
                    <view class="h-flex-x h-flex-center" style="margin-bottom: 100rpx;">
                        <view>
                            <image class="gold" :src="appImgs.icon_1" mode="aspectFit"></image>
                        </view>
                        <view style="margin: 0 0 0 10rpx;color: #ff5722;font-size: 48rpx;">+</view>
                        <view style="color: #ff5722;font-size: 64rpx;">{{signIn.gold}}</view>
                    </view>
                    <image class="btn transform-scale" :src="appImgs.btn_8" mode="aspectFit" @tap="onSignIn"></image>
                </view>
            </view>
        </view>
       <!-- 
        <view style="position: fixed;bottom: 20rpx;left:20rpx;z-index: 9;">
            <view @click="toPage('/pages/index/privacy')" class="icon-box tn-color-blue">
                <view><text class='icon tn-icon-safe-fill'></text></view>
                <view class="name">隐私</view>
            </view>
        </view>
        -->
        <OpendateWindow v-model="showdata" @send="getSonValue"></OpendateWindow>
    </view>
</template>

<script>
    import login from '../../common/login'
    import OpendateWindow from '../../components/opendate-Window/opendate-Window.vue'
    const audioContext = uni.createInnerAudioContext();
    audioContext.src = "/static/btn.mp3";
    const audioContextBg = uni.createInnerAudioContext();
    audioContextBg.src = "/static/bg.mp3";
    audioContextBg.loop = true;
    
    export default {
        components: {
            OpendateWindow
        },
        data() {
            return {
                userInfo: {},
                signIn: {
                    show: false
                },
                appImgs: {},
                shareInfo: {},
                showdata: false,
                showImage:'',
            }
        },
        onLoad() {
            this.appImgs = uni.$hl.getAppImgs();
            this.showImage = this.appImgs.logo
            
        },
        onShow() {
            // this.userInfo = uni.$hl.getUserInfo();
            // console.log(JSON.stringify(this.userInfo))
            let uid = uni.getStorageSync('uid');
			if (uid&& uid>0) {
				console.log('uid already login');
			}else{
				uni.showLoading({
					title: '正在初始化...'
				})
				login.getAppCode().then(res=>{
					console.log('loginCode' ,res )
                    let type = res.type;
                    let appId = '';
                    let uri = '';
                    if (type=='h5') {
                        uri = 'user/weblogin'  ;
                    }else{ 
					    appId = uni.$hl.appId
					    uri = 'user/login/' + appId;
                    }
					
					//console.log(appId, uri)
					this.$request.post(uri, res).then(loginRes=>{
						uni.hideLoading();
						uni.setStorageSync("uid",loginRes.userId);
						uni.setStorageSync("userToken",loginRes.token);
                        let userInfo = loginRes.guessInfo ;
						uni.$hl.setUserInfo(userInfo );
                        this.userInfo = userInfo;
                        if (userInfo.avatarUrl) {
                            this.showImage = userInfo.avatarUrl;
                        }else{
                            this.showImage =  this.appImgs.logo;
                        }
						//console.log('login res', loginRes)
					}).catch(err=>{
						uni.hideLoading();
						//console.log(err)
					})
				})
			}
            audioContextBg.play();
            if (uni.$hl.isLogin()) { 
                this.updateInfo();
                this.signInFn(); 
            }
            this.getShareInfo();
        },
        onHide() {
            audioContextBg.pause();
        },
        onShareAppMessage: function() {
            return this.shareInfo;
        },
        onShareTimeline: function() {
            return this.shareInfo;
        },
        methods: {
            /**
             * 获取分享字典
             */
            getShareInfo() {
                this.shareInfo = {
                    title: '大哥大姐们啦，帮帮我吧，脑袋不够用了，太难了',
                    path: '/pages/index/index',
                }
                uni.setStorageSync('shareInfo',  this.shareInfo);
            },
            // 开始游戏
            startGame() {
                audioContext.play();
                if (!uni.$hl.isLogin()) {
                    uni.navigateTo({
                        url: '/pages/user/login'
                    })
                    return;
                }
                uni.navigateTo({
                    url: '/pages/index/play'
                })
            },
            // 排行榜
            lookTop() {
                let userInfo =  uni.$hl.getUserInfo() || {};
                
                if (userInfo && userInfo.nickName) {
                    audioContext.play();
                    uni.navigateTo({
                        url: '/pages/index/top'
                    })
                }else{
                    // #ifdef H5 
                    uni.showModal({
                        title: '提示',
                        content: 'web端暂不支持使用排行榜功能',
                        showCancel: false
                    });
                    // #endif
                    // #ifndef H5
                    uni.showModal({
                        title: '提示',
                        content: '使用排行榜功能，需要获取用户昵称、头像信息',
                        showCancel: true, 
                        success: (res) => {
                            if (res.confirm) {
                                this.showdata = true;
                            }else{
                                this.showdata = false;
                            }
                        }
                    })
                    // #endif
                }
                
            },
            updateInfo() {
                let uid = uni.$hl.getUserId()
                this.$request.post('idiom/info',{uid}).then(res=>{
                    //console.log(res)
                    uni.$hl.setUserInfo(res );
                    this.userInfo = res ;
                    if (res.avatarUrl) {
                        this.showImage = res.avatarUrl;
                    }else{
                        this.showImage =  this.appImgs.logo;
                    }
                    
                }).catch((err) => {
                    uni.$hl.showToast('获取用户信息失败，请重试' + JSON.stringify(err) + JSON.stringify(this.userInfo));
                    // uni.$hl.logout();
                });
                
            },
            signInFn( ) {
                let sendData = {
                    uid: uni.$hl.getUserId()
                }
                this.$request.post('idiom/sign/info', sendData).then((res) => {
                    if (!res ) {
                        return;
                    }
                    if (res.alreadySign) {
                        this.signIn.show = false;
                    }else{
                        this.signIn.show = true;
                    }
                    this.signIn.gold=res.gold
                    

                }).catch((err) => {
                    uni.hideLoading();
                    
                });
            },
            onSignIn() {
                let sendData = {
                    uid: uni.$hl.getUserId()
                }
                uni.$hl.showLoading('领取中');
                this.$request.post('idiom/sign', sendData).then((res) => {
                    uni.hideLoading();
                    if (!res ) {
                        return;
                    }
                    this.signIn.show = false;
                    this.userInfo.gold += res.gold;
                    uni.$hl.setUserInfo(this.userInfo);
                    uni.$hl.showToast('领取成功', 'success');
                }).catch((err) => {
                    uni.hideLoading();
                    
                });
            },
            logout() {
                uni.$hl.logout();
            },
            toUserIndex() {
                // #ifndef H5 
                if (!uni.$hl.isLogin()) {
                    toPage('/pages/user/login' )
                    return;
                }
                this.toPage('/pages/user/index')
                // #endif
            },
            toPage(url){
                
                uni.navigateTo({
                    url: url
                })
            },
            getSonValue(res){
                let userInfo =  uni.$hl.getUserInfo() || {};
                userInfo.nickName = res.nickName;
                userInfo.avatarUrl=res.avatarUrl
                this.userInfo = userInfo;
                uni.$hl.setUserInfo(userInfo);
            },
        }
    }
</script>

<style lang="scss">
    .bg {
        position: fixed;
        z-index: 1;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .box {
        position: fixed;
        z-index: 2;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding-top: var(--status-bar-height);

        .ico {
            display: block;
            width: 320rpx;
            height: 320rpx;
            border-radius: 60rpx;
        }

        >view {
            height: 100%;
        }

        .start {
            display: block;
            width: 320rpx;
            height: 90rpx;
            margin: 0 10rpx;
        }
    }

    // 签到
    .signIn-pop {
        .content {
            width: 750rpx;
            height: 900rpx;

            >image {
                width: 100%;
                height: 100%;
            }

            >view {
                position: absolute;
                top: 500rpx;
                left: 20%;
                width: 60%;
                font-size: 32rpx;
                color: #345;
            }

            .gold {
                width: 40rpx;
                height: 40rpx;
            }

            .btn {
                width: 320rpx;
                height: 90rpx;
                margin: 20rpx auto 0 auto;
            }
        }
    }
    .icon-box{
        background-color: rgba($color: #000000, $alpha:0.2);
        padding: 10rpx;
        border-radius: 12rpx;
        text-align: center;
        .icon{
            font-size: 80rpx;
        }
        .name{
            font-size: 24rpx;
        }
    }
</style>
