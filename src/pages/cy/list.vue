<template>
    <view>
        <!-- 顶部自定义导航 -->
        <tn-nav-bar fixed alpha customBack>
            <view slot="back" class='tn-custom-nav-bar__back' @click="goBack">
                <text class='icon tn-icon-left'></text>
                <text class='icon tn-icon-home-capsule-fill'></text>
            </view>
            <view class="tn-text-bold">藏书阁</view>
        </tn-nav-bar>
        <view class="status_bar"></view>
        <view style="padding: 90rpx 0;">
            <tn-list-view unlined="all">
                <block v-for="(item, index) in dataList" :key="index">
                    <tn-list-cell @click="toInfoPage(item._id)">
                        <view class="tn-text-lg">{{item.name}}<text class="tn-padding-left-sm">{{item.spell}}</text></view>
                        <view><text class="tn-text-bold">解释：</text>{{item.content}}</view>
                        <view><text class="tn-text-bold">出处：</text>{{item.derivation}}</view>
                        <view v-if="item.samples"><text class="tn-text-bold">举例：</text>{{item.samples}}</view>
                    </tn-list-cell>
                </block>
            </tn-list-view>
<!--            <view class="tn-padding tn-padding-top">
                <uni-pagination title="标题文字" :total="total" :current="searchOptions.pageNum" @change="pageChange">
                </uni-pagination>
            </view> -->
            <view class="tn-padding tn-flex tn-flex-row-between tn-padding-top">
                <view class="tn-flex">
                    <tn-input type="text" :border="true" class="tn-border-solid tn-border-blue" v-model="temp.pageNum" style="width: 150rpx;margin-right:10rpx;" />
                <tn-button backgroundColor="#01BEFF" fontColor="#ffffff" @click="goPage">GO</tn-button>
                </view>
                <uni-pagination title="标题文字" :total="total" :current="searchOptions.pageNum" @change="pageChange">
                </uni-pagination>
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
                total: 0,
                dataList: [],
                searchOptions: {
                    pageSize: 10,
                    pageNum: 1
                },
                temp: {
                    pageNum: ""
                },
                 shareInfo: {
                     title:"藏书阁",
                     path: "/pages/cy/list",
                 }
            }
        },
        onLoad() {
             this.temp.pageNum = uni.getStorageSync('cyPageNum')||1;
             this.searchOptions.pageNum = uni.getStorageSync('cyPageNum')||1;
        },
        onShow() {
            this.getList();
            this.temp.pageNum = this.searchOptions.pageNum;
        },
        onShareAppMessage: function() {
            return this.shareInfo;
        },
        onShareTimeline: function() {
            return this.shareInfo;
        },
        methods: {
            getList() {
                let _this = this;
                this.$request("app", "cy/list", this.searchOptions, {}).then(res => {
                    console.log(JSON.stringify(res.data.rows));

                    if (res.code === 0) {
                        this.dataList = res.data.rows;
                        this.total = res.data.total;
                        // uni.$hl.showToast(res.msg, 'success');
                    } else {
                        uni.$hl.showToast(res.msg, 'error');
                    }

                }).catch(err => {
                    console.error(err)
                });
            },
            toInfoPage(id) {
                uni.navigateTo({
                    url: 'info?id=' + id
                })
            },
            pageChange(e) {
                this.searchOptions.pageNum = e.current;
                this.temp.pageNum = this.searchOptions.pageNum;
                uni.setStorageSync('cyPageNum', this.searchOptions.pageNum);
                this.getList();
            },
            goPage() {
                if (!this.temp.pageNum) {
                    return;
                }
                this.searchOptions.pageNum = this.temp.pageNum;
                uni.setStorageSync('cyPageNum', this.searchOptions.pageNum);
                this.getList();
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/static/css/templatePage/custom_nav_bar.scss';

    .img {
        width: 160rpx;
        height: 120rpx;
        // background-color: #000000;
    }
</style>
