<template>
    <view>
        <tn-select v-model="openCategories" :defaultValue="[0]" mode="single" :list="categories" valueName="_id"
            labelName="name"></tn-select>
        <view class="uni-form-item uni-column">
            <view class="title">标题</view>
            <view>
                <input class="uni-input" style="width: 650rpx;" v-model="form.title" name="input" placeholder="请输入标题" />
            </view>
        </view>
        <view class="uni-form-item uni-column">
            <view class="title">图片</view>
            <view>
                <view class="tn-flex">
                    <input class="uni-input" v-model="form.avatar" name="input" placeholder="这是一个输入框" />
                    <text @click="upload">上传</text>
                </view>
                <image class="img" :src="form.avatar" mode="scaleToFill" v-if="form.avatar"></image>
            </view>
        </view>
        <view class="uni-form-item uni-column">
            <view class="title">摘录</view>
            <view>
                <textarea class="uni-input" v-model="form.explain" auto-height />
            </view>
        </view>
        <view class="uni-form-item uni-column">
            <view class="title">内容</view>
            <view>
                <myEditor v-model="form.content" v-if="editorShow"></myEditor>
                <!-- <jinEdit placeholder="请输入内容" @editOk="editOk" uploadFileUrl="/#"></jinEdit> -->
            </view>
        </view>
        <view class="uni-form-item uni-column">
            <view class="title">是否置顶</view>
            <view>
                <radio value="r1" :checked="form.is_sticky==true" @click="form.is_sticky=true" />是
                <radio value="r1" :checked="form.is_sticky==false" @click="form.is_sticky=false" />否
            </view>
        </view>

        <view class="tn-padding">
            <button type="primary" @click="save()">{{form._id?"保存":"添加"}}</button>
        </view>
    </view>
    </view>
</template>

<script>
    import myEditor from '@/components/my-editor/my-editor.vue'
    import jinEdit from '@/components/jin-edit/jin-edit.vue';
    export default {
        components: {
            myEditor,
            jinEdit
        },
        data() {
            return {
                id: "",
                form: {
                    title: "",
                    content: "",
                    excerpt: "",
                    avatar: "",
                    category_id: "6212440af2f4d20001b4822d",
                    is_sticky: "false"
                },
                editorShow: false,
                openCategories: false,
                categories: []
            }
        },
        onLoad(e) {
            // _self = this;
            this.id = e.id || ""
        },
        async onShow() {
            await this.getCategoriesList();
            await this.info();
        },
        methods: {
            editOk(res) {
                console.log(res);
            },
            
            getCategoriesList() {
                console.log("getCategoriesList--")
                this.$request("admin", "newsCategories/list", {}, {}).then(res => {
                    console.log(JSON.stringify(res))
                    if (res.code === 0) {
                        this.categories = res.data.rows;
                    } else {
                        uni.$hl.showToast(res.msg, 'error');
                    }

                }).catch(err => {
                    console.error(err)
                });
            },
            info() {
                if (!this.id) {
                    this.editorShow = true;
                    return;
                }
                let _this = this;
                this.$request("admin", "news/info", {
                    _id: this.id
                }, {}).then(res => {
                    console.log(JSON.stringify(res));

                    if (res.code === 0) {
                        this.form = res.data;
                        this.editorShow = true;
                    } else {
                        uni.$hl.showToast(res.msg, 'error');
                    }
                }).catch(err => {
                    console.error(err)
                });
            },
            save() {
                let _this = this;
                let url = "news/add"
                if (this.form._id) {
                    url = "news/edit"
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
                                cloudPath: 'news.jpg',
                                onUploadProgress: function(progressEvent) {
                                    console.log(progressEvent);
                                    var percentCompleted = Math.round(
                                        (progressEvent.loaded * 100) / progressEvent.total
                                    );
                                },
                                success(e) {
                                    console.log(JSON.stringify(e))
                                    _this.form.avatar = e.fileID;
                                },
                                fail() {},
                                complete() {}
                            });

                        }
                    }
                });
            },
            // onEditorReady() {
            //     // #ifdef MP-BAIDU
            //     _self.editorCtx = requireDynamicLib('editorLib').createEditorContext('editorId');
            //     // #endif

            //     // #ifdef APP-PLUS || H5 ||MP-WEIXIN
            //     uni.createSelectorQuery().select('#editor').context((res) => {
            //         _self.editorCtx = res.context
            //         _self.editorCtx.setContents({
            //             html: _self.form.GoodsData.content
            //         })
            //         console.log(JSON.stringify(res))
            //     }).exec()
            //     // #endif
            // },
            // format(e) {
            //     // this.hideKey();
            //     let {
            //         name,
            //         value
            //     } = e.target.dataset;
            //     if (!name) return;
            //     _self.editorCtx.format(name, value);
            // },
            // saveHtml(e) {
            //     this.form.content = e.detail.html;
            // },


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
