<template>
    <view>
        <image class="bg" :src="appImgs.bg_1" mode="aspectFill"></image>
        <view class="box">
            <scroll-view scroll-y="true">
                <view style="padding: 30rpx 10rpx;">
                    <view v-for="(item,index) in topList" :key="index" class="item-box h-flex-x"
                        :class="{ 'self':userInfo.id == item.id }">
                        <view class="number">
                            <image :src="topIcons[index]" mode="aspectFit" v-if="index<3"></image>
                            <view class="h-flex-x h-flex-center" v-else>{{index+1}}</view>
                        </view>
                        <view style="margin: 0 10rpx 0 0; ">
                            <image :src="item.avatarUrl" style="width: 100rpx;height: 100rpx;" mode="aspectFit"></image>
                        </view>
                        <view class="h-flex-item-grow">
                            <text>{{item.nickName}}</text>
                            <view class="me" v-if="userInfo.id == item.id">我自己</view>
                        </view>
                        <view style="margin: 0 0 0 20rpx; font-size: 24rpx;width: 120rpx;">
                            <text>第{{item.pass}}关</text>
                        </view>
                        
                    </view>
                </view>
            </scroll-view>
        </view>
    </view>
</template>

<script>
    const audioContextBg2 = uni.createInnerAudioContext();
    audioContextBg2.src = "/static/bg.mp3";
    audioContextBg2.loop = true;
    export default {
        components: {

        },
        data() {
            return {
                userInfo: {},
                topIcons: [],
                topList: [],
                appImgs: {},
                shareInfo: {}
            }
        },
        onLoad() {
            this.appImgs = uni.$hl.getAppImgs();

            this.userInfo = uni.$hl.getUserInfo();

            // 排行图标
            for (let i = 4; i <= 6; i++) {
                this.topIcons.push(this.appImgs[`icon_${i}`]);
            }

            this.topListOut = setTimeout(() => {
                this.getTopList();
            }, 500);
        },
        onUnload() {
            audioContextBg2.pause();
            clearTimeout(this.topListOut);
        },
        onShareAppMessage: function() {
            return this.shareInfo;
        },
        onShareTimeline: function() {
            return this.shareInfo;
        },
        onShow() {
            audioContextBg2.play();
        },
        onHide() {
            audioContextBg2.pause();
        },
        methods: {
            getTopList() {
                uni.$hl.showLoading('加载中');
                this.$request.get('idiom/rank').then(res=>{
                    uni.hideLoading();
                    this.topList = res;
                }).catch(err=>{
                    uni.hideLoading();
                })
            }
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
        position: absolute;
        z-index: 2;
        top: 0;
        left: 5%;
        width: 90%;
        height: 100%;
        box-sizing: border-box;

        >scroll-view {
            height: 100%;
        }

        .item-box {
            padding: 20rpx;
            border-radius: 8rpx;
            background-color: rgba(255, 255, 255, 0.7);
            position: relative;

            &+.item-box {
                margin-top: 20rpx;
            }

            &.self {
                background-color: rgba(255, 255, 255, 0.8);
                box-shadow: 0 0 5px #ff9800;
            }

            .number {
                margin-right: 30rpx;

                >image {
                    width: 60rpx;
                    height: 60rpx;
                }

                >view {
                    width: 60rpx;
                    height: 60rpx;
                    text-align: center;
                    font-size: 32rpx;
                    background-color: #ff9800;
                    border-radius: 50%;
                    color: rgba(255, 255, 255, 0.8);
                }
            }

            .me {
                color: #DD524D;
                font-size: 48rpx;
                position: absolute;
                top: 17rpx;
                left: 370rpx;
                opacity: 0.75;
                transform: rotate(345deg) skewX(8deg);
            }
        }
    }
</style>
