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
        <view style="padding: 90rpx 0;">
            <tn-list-view unlined="all">
                <block v-for="(item, index) in dataList" :key="index">
                    <tn-list-cell @click="toInfoPage(item._id)">
                        <view class="tn-flex">
                            <view class="tn-flex-3">
                                <view class="tn-text-lg">{{item.title}}</view>
                                <view class="tn-padding-top-xs tn-color-gray tn-text-sm">
                                    <uni-dateformat :date="item.publish_date"></uni-dateformat>
                                </view>
                            </view>
                            <view class="tn-flex-1" v-if="item.avatar">
                                <image class="img" :src="item.avatar" mode="scaleToFill"></image>
                            </view>
                        </view>
                    </tn-list-cell>
                </block>
            </tn-list-view>
            <view class="tn-padding tn-padding-top">
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
                    category_id: "6212440af2f4d20001b4822d",
                    pageSize: 10,
                    pageNum: 1
                },
                temp: {
                    pageNum: ""
                }
            }
        },
        onShow() {
            this.getList();
            this.temp.pageNum = this.searchOptions.pageNum;
        },
        methods: {
            getList() {
                let _this = this;
                this.$request("app", "news/list", this.searchOptions, {}).then(res => {
                    

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
                this.getList();
            },
            goPage() {
                if (!this.temp.pageNum) {
                    return;
                }
                this.searchOptions.pageNum = this.temp.pageNum;
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
