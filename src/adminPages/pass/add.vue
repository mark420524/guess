<template>
    <view>
        <view class="uni-form-item uni-column">
            <view class="title">图片</view>
            <view>
                <view class="tn-flex">
                    <input class="uni-input" v-model="form.img" name="input" placeholder="这是一个输入框" />
                    <text @click="upload">上传</text>
                </view>
                <image class="img" :src="form.img" mode="scaleToFill" v-if="form.img"></image>
            </view>
        </view>
        <view class="uni-form-item uni-column">
            <view class="title">成语</view>
            <view class="tn-flex">
                <input class="uni-input" v-model="form.answer" name="input" placeholder="这是一个输入框" @confirm="cyInfo" /><view @click="cyInfo()">查询</view>
            </view>
        </view>
        <view class="uni-form-item uni-column">
            <view class="title">选项</view>
            <view>
                <input class="uni-input" style="width: 650rpx;" v-model="form.option" name="input" placeholder="这是一个输入框" />
            </view>
        </view>
        <view class="uni-form-item uni-column">
            <view class="title">解释</view>
            <view>
                <textarea class="uni-input" v-model="form.explain" auto-height />
            </view>
        </view>
        <view class="uni-form-item uni-column">
            <view class="title">出处</view>
            <view>
                <textarea class="uni-input" v-model="form.provenance" auto-height />
            </view>
        </view>
        <view class="uni-form-item uni-column">
            <view class="title">关卡数</view>
            <view>
                <input class="uni-input" v-model="form.pass" name="input" placeholder="请输入关卡数" />
            </view>
        </view>
        <view>{{cy}}</view>
        <view class="tn-padding">
            <button type="primary" @click="save()">{{form._id?"保存":"添加"}}</button>
        </view>
    </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                id: "",
                form: {
                    answer: "",
                    explain: "",
                    img: "/resource/",
                    option: "",
                    provenance: "",
                    pass:""
                },
                cy:null
            }
        },
        onLoad(e) {
            this.id = e.id || ""
        },
        onShow() {
            this.info();
        },
        methods: {
            info() {
                if (!this.id) {
                    return;
                }
                let _this = this;
                this.$request("admin", "pass/info", {
                    _id: this.id
                }, {}).then(res => {
                    console.log(JSON.stringify(res));

                    if (res.code === 0) {
                        this.form = res.data;
                    } else {
                        uni.$hl.showToast(res.msg, 'error');
                    }
                }).catch(err => {
                    console.error(err)
                });
            },
            save() {
                let _this = this;
                let url = "pass/add"
                if (this.form._id) {
                    url = "pass/edit"
                }
                this.$request("admin", url, this.form, {}).then(res => {
                    console.log(JSON.stringify(res));

                    if (res.code === 0) {
                        uni.$hl.showToast(res.msg, 'success');
                        setTimeout(function() {
                            // uni.navigateTo({
                            //     url: 'index'
                            // })
                            uni.navigateBack({
                                delta: 1
                            });
                        }, 1000)
                    } else {
                        uni.$hl.showToast(res.msg, 'error');
                    }
                }).catch(err => {
                    console.error(err)
                });
            },
            upload() {
                let _this = this;
                //前端代码
                uni.chooseImage({
                    count: 1,
                    success(res) {
                        console.log(res);
                        if (res.tempFilePaths.length > 0) {
                            let filePath = res.tempFilePaths[0]
                            //进行上传操作
            
                            uniCloud.uploadFile({
                                filePath: filePath,
                                cloudPath: 'pass.jpg',
                                onUploadProgress: function(progressEvent) {
                                    console.log(progressEvent);
                                    var percentCompleted = Math.round(
                                        (progressEvent.loaded * 100) / progressEvent.total
                                    );
                                },
                                success(e) {
                                    console.log(JSON.stringify(e))
                                    _this.form.img = e.fileID;
                                },
                                fail() {},
                                complete() {}
                            });
            
                        }
                    }
                });
            },
            cyInfo() {
                if (!this.form.answer) {
                    return;
                }
                let _this = this;
                this.$request("app", "cy/infoByName", {
                    name: this.form.answer
                }, {}).then(res => {
                    console.log(JSON.stringify(res));
            
                    if (res.code === 0) {
                        this.cy = res.data;
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

<style lang="scss">
    .uni-form-item {
        display: flex;
        border-bottom: 2rpx solid #666666;
        padding: 10rpx;
        line-height: 60rpx;
    }

    .uni-input {
        border: 2rpx solid #cccccc;
        padding: 10rpx;
        line-height: 40rpx;
        min-height: 60rpx;
    }
    .img {
        width: 160rpx;
        height: 160rpx;
    }
</style>
