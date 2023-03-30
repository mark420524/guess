<template>
    <view>
        <image class="bg" :src="appImgs.bg_1" mode="aspectFill"></image>
        <!-- 顶部自定义导航 -->
        <tn-nav-bar fixed alpha customBack>
            <view slot="back" class='tn-custom-nav-bar__back' @click="goBack">
                <text class='icon tn-icon-left'></text>
                <text class='icon tn-icon-home-capsule-fill'></text>
            </view>
        </tn-nav-bar>
        <view class="login">
            <view class="tn-margin-bottom">
                <tn-list-view title="控制台" :card="true" unlined="all" v-if="isAdmin">
                    <tn-list-cell :arrow="true">
                        <tn-button @click="toAdmin()" size="lg">关卡管理
                        </tn-button>
                    </tn-list-cell>
                    <tn-list-cell :arrow="true" :unlined="true">
                        <tn-button @click="toNews()" size="lg">信息管理
                        </tn-button>
                    </tn-list-cell>
                </tn-list-view>
            </view>
            <tn-list-view :card="true" unlined="all">
                <tn-list-cell :arrow="true">
                    <tn-button open-type="feedback" size="lg">意见反馈
                    </tn-button>
                </tn-list-cell>
                <tn-list-cell :arrow="true" :unlined="true">
                    <tn-button open-type="contact" size="lg">联系客服
                    </tn-button>
                </tn-list-cell>
            </tn-list-view>
            <!-- 
            <view style="margin-top: 20rpx;">
                <tn-list-view :card="true" unlined="all">
                    <tn-list-cell>
                        <button type="primary" form-type="submit" @click="logout()">退出</button>
                    </tn-list-cell>
                </tn-list-view>
            </view>
            -->
        </view>
    </view>
</template>

<script>
    import template_page_mixin from '@/libs/mixin/template_page_mixin.js'
    export default {
        mixins: [template_page_mixin],
        data() {
            return {
                appImgs: {},
                isAdmin: false
            }
        },
        onLoad() {
            this.appImgs = uni.$hl.getAppImgs();
        },
        onShow() {
            this.getUserInfo();
        },
        methods: {
            getUserInfo() {
                if (uni.$hl.isLogin()) {
                    this.userInfo = uni.$hl.getUserInfo();
                    if (this.userInfo && this.userInfo.id) {
                        console.log(JSON.stringify(this.userInfo))
                        if (this.userInfo.role && this.userInfo.role.includes("admin")) {
                            this.isAdmin = true;
                        }
                    }
                }
            },
            logout() {
                uni.$hl.logout();
                uni.reLaunch({
                    url: '/pages/index/index'
                })
            },
            toAdmin() {
                uni.navigateTo({
                    url: '/adminPages/pass/index'
                })
            },
            toNews() {
                uni.navigateTo({
                    url: '/adminPages/news/index'
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/static/css/templatePage/custom_nav_bar.scss';

    page {
        background-color: #f3f3f3;
        font-size: 28rpx;
        color: #333;
    }

    .bg {
        position: fixed;
        z-index: 1;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .login {
        display: block;
        // background-color: rgba(255, 255, 255, 0.6);
        padding: 30rpx;
        position: absolute;
        z-index: 1;
        width: 100%;
        box-sizing: border-box;
        top: 25vh;
        left: 0;

        .item {
            padding: 10rpx 0;

            input {
                height: 90rpx;
                display: block;
                width: 100%;
                font-size: 28rpx;
                letter-spacing: 1px;
            }

            &+.item {
                border-top: #eee solid 1px;
            }
        }
    }
</style>
