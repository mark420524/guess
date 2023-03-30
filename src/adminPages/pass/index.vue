<template>
    <view>

        <view class="tn-padding">
            <view class="tn-flex tn-flex-row-between" style="width:100%;">
                <view><button type="primary" size="mini" @click="add()">添加</button></view>
                <view><text>共{{total}}条记录</text></view>
            </view>
            <view class="item" v-for="(item,index) in dataList" @click="edit(item._id)">
                <view>
                    <image class="img" :src="getImg(item.img)" mode="scaleToFill"></image>
                </view>
                <view>
                    <view class="tn-text-bold">第{{item.pass}}关：{{item.answer}}</view>
                    <view>{{item.option}}</view>
                </view>
            </view>
            <view class="tn-flex tn-flex-row-between tn-padding-top">
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
    export default {
        data() {
            return {
                total: 0,
                dataList: [],
                searchOptions: {
                    pageSize: 10,
                    pageNum: 1
                },
                temp:{
                    pageNum:""
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
                this.$request("admin", "pass/list", this.searchOptions, {}).then(res => {
                    //console.log(JSON.stringify(res.data.rows));

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
            getImg(url) {
                return uni.$hl.joinImgUrl(url)
            },
            edit(id) {
                uni.navigateTo({
                    url: 'add?id=' + id
                })
            },
            add() {
                uni.navigateTo({
                    url: 'add'
                })
            },
            pageChange(e) {
                this.searchOptions.pageNum = e.current;
                this.temp.pageNum = this.searchOptions.pageNum;
                this.getList();
            },
            goPage(){
                if(!this.temp.pageNum){
                    return;
                }
                this.searchOptions.pageNum = this.temp.pageNum;
                this.getList();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .item {
        display: flex;
        padding: 10rpx 0;
    }

    .img {
        width: 160rpx;
        height: 100rpx;
        padding-right: 10rpx;
    }
</style>
