<template>
    <view>
        <!-- 顶部自定义导航 -->
        <tn-nav-bar fixed alpha customBack>
            <view slot="back" class='tn-custom-nav-bar__back' @click="goBack">
                <text class='icon tn-icon-left'></text>
                <text class='icon tn-icon-home-capsule-fill'></text>
            </view>
            <view class="tn-text-bold">状元茶馆</view>
        </tn-nav-bar>
        <view class="status_bar"></view>
        <view style="padding-top: 90rpx;">
        </view>
        <view class="">
            <view class="tn-border-solid-bottom tn-padding tn-text-xl">
                <view>{{dataInfo.title}}</view>
                <view class="tn-padding-top-xs tn-color-gray tn-text-sm">
                    <uni-dateformat :date="dataInfo.publish_date"></uni-dateformat>
                </view>
            </view>

            <view class="tn-padding">
                <rich-text :nodes="dataInfo.content"></rich-text>
            </view>
        </view>
    </view>
</template>

<script>
    import template_page_mixin from '@/libs/mixin/template_page_mixin.js'
    export default {
        components: {

        },
        mixins: [template_page_mixin],
        data() {
            return {
                id: "",
                dataInfo: {},
                shareInfo: {}
            }
        },
        onLoad(e) {
            this.id = e.id || ""
        },
        onShow() {
            this.info();
        },
        onShareAppMessage: function() {
            return this.shareInfo;
        },
        onShareTimeline: function() {
            return this.shareInfo;
        },
        methods: {
            info() {
                if (!this.id) {
                    return;
                }
                let _this = this;
                this.$request("app", "news/info", {
                    _id: this.id
                }, {}).then(res => {
                    

                    if (res.code === 0) {
                        this.dataInfo = res.data;
                        _this.shareInfo = {
                            type:1,
                            title: this.dataInfo.title,
                            path: "/pages/news/info?id="+this.dataInfo._id,
                        };
                    } else {
                        uni.$hl.showToast(res.msg, 'error');
                    }
                }).catch(err => {
                    console.error(err)
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/static/css/templatePage/custom_nav_bar.scss';
</style>
