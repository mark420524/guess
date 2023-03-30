<template>
    <view>
        <image class="page-bg" :src="appImgs.bg_1" mode="aspectFill"></image>
        <view class="box">
            <!-- 顶部自定义导航 -->
            <tn-nav-bar fixed alpha customBack>
                <view slot="back" class='tn-custom-nav-bar__back' @click="goBack">
                    <text class='icon tn-icon-left'></text>
                    <text class='icon tn-icon-home-capsule-fill'></text>
                </view>
            </tn-nav-bar>
            <view style="height: 80rpx;line-height: 80rpx;padding: 0 25rpx;">
                <!-- <text style="border-radius: 30rpx; padding: 10rpx; background-color: rgba(255,255,255,0.7);" @click="goHome">
                    <text class="tn-icon-home-fill tn-color-black" style="padding: 10rpx;font-size: 40rpx;"
                       ></text>
                </text> -->
            </view>
            <view class="h-flex-x box-1 h-flex-space" :style="{marginRight : menuButton.right}">
                <view class="h-flex-x label">
                    <view>
                        <image :src="appImgs.icon_1" mode="scaleToFill"></image>
                    </view>
                    <view>{{gold.value}}</view>
                </view>
                <view class="h-flex-x label">
                    <view>
                        <image :src="appImgs.icon_2" mode="scaleToFill"></image>
                    </view>
                    <view>第 {{pass.default + pass.value + 1}} 关</view>
                </view>
            </view>

            <view class="box-2">
                <image class="bg" :src="appImgs.img_1" mode="aspectFit"></image>
                <image class="img" :src="pass.image" mode="scaleToFill"></image>
            </view>

            <view class="box-3 h-flex-x h-flex-center">
                <!-- <view class="btn transform-scale" @tap="copyShareContent">分享</view> -->
                <button type="default" class="btn transform-scale" open-type="share"
                    style="margin: 0;padding: 0;">求助</button>
                <view v-for="(item,index) in selected.list" :key="index" class="option transform-scale"
                    @tap="cancelPicker(index)">
                    <image :src="appImgs.icon_8" mode="aspectFit"></image>
                    <view class="value">{{item.text || ''}}</view>
                </view>
                <view class="btn transform-scale" @tap="remind">提示</view>
            </view>

            <view class="box-4 h-flex-x h-flex-6 h-flex-wrap">
                <view v-for="(item,index) in select.list" :key="index">
                    <view class="option transform-scale" @tap="picker(index)">
                        <image :src="appImgs.icon_7" mode="aspectFit"></image>
                        <view class="value">{{item.text}}</view>
                    </view>
                </view>
            </view>
        </view>

        <view class="global-popup next-pop" :style="{ 'display':nextPop.show ? 'block':'none' }">
            <view class="shade"></view>
            <view class="content">
                <image :src="appImgs.img_3" mode="aspectFit"></image>
                <view>
                    <view class="answer">{{nextPopData.answer || ''}}</view>
                    <view class="pinyin">{{nextPopData.pinyin || ''}}</view>
                    <scroll-view scroll-y="true" style="height: 500rpx;">
                        <view style="margin-bottom: 20rpx;">解释：{{nextPopData.explanation || ''}}</view>
                        <view v-if="nextPopData.derivation">出处：{{nextPopData.derivation || ''}}</view>
                    </scroll-view>
                    <image class="btn transform-scale" :src="appImgs.btn_7" mode="aspectFit" @tap="nextPass"></image>
                </view>
            </view>
        </view>

        <!--  #ifdef H5 -->
        <textarea :value="shareContent" readonly="value" id="shareContent-input"
            style="position: fixed;top: -100px;left: 0;width: 100%;"></textarea>
        <!--  #endif -->

        <image :src="appImgs.img_4" mode="aspectFit" class="gift" @click="onGiftClick" v-if="showGift"></image>

    </view>
</template>

<script>
    import template_page_mixin from '@/libs/mixin/template_page_mixin.js'
    const audioContext = uni.createInnerAudioContext();
    export default {
        components: {

        },
        mixins: [template_page_mixin],
        data() {
            return {
                appImgs: {},
                userInfo: {},
                gold: {
                    value: 0,
                },
                pass: {
                    image: '',
                    // 默认关数
                    default: 0,
                    // 当前关数
                    value: 0
                },
                selected: {
                    list: [{}, {}, {}, {}]
                },
                select: {
                    list: []
                },
                resourceList: [],
                nextPop: {
                    show: false

                },
                showGift: false,
                shareInfo: {},
                nextPopData:{}
            }
        },
        computed: {
            // 分享内容
            shareContent() {
                let count = (this.pass.default || 0) + (this.pass.value || 0);
                return `我在【早晚猜】中已闯过 ${count} 关啦，\n搜索小程序【早晚猜】一起来玩吧！`;
            },
            // 小程序胶囊
            menuButton() {
                // #ifdef MP-WEIXIN || MP-BAIDU	|| MP-TOUTIAO || MP-QQ
                let info = uni.getMenuButtonBoundingClientRect();
                return {
                    right: `${info.width+8}px`
                };
                // #endif
                return {};
            }
        },
        onLoad() {
            if (!uni.$hl.isLogin()) {
                uni.reLaunch({
                    url: '/pages/index/index'
                })
                return;
            }
            this.appImgs = uni.$hl.getAppImgs();

            this.userInfo = uni.$hl.getUserInfo();
            
            // 初始化默认关卡
            this.setDefaultPage();
            this.initPage();
            this.initPass();
            this.getResource(this.getPage());


            //this.startGift();
        },
        // 页面卸载
        onUnload() {
            // 删除延时器
            clearTimeout(this.startGiftTimeout);
            clearTimeout(this.endGiftTimeout);
        },
        onShareAppMessage(res) {
            audioContext.src = "/static/btn.mp3";
            audioContext.play()
            if (res.from === 'button') {
                return {
                    title: '大哥大姐们啦，帮帮我吧，脑袋不够用了，太难了',
                    path: '/pages/index/index',
                    // imageUrl: this.pass.image
                }
            }
        },
        onShareTimeline(res) {
            audioContext.src = "/static/btn.mp3";
            audioContext.play()
            if (res.from === 'button') {
                return {
                    title: '大哥大姐们啦，帮帮我吧，脑袋不够用了，太难了',
                    path: '/pages/index/index',
                    // imageUrl: this.pass.image
                }
            }
        },
        methods: {
            goHome() {
                uni.reLaunch({
                    url: '/pages/index/index'
                })
            },
            // 设置默认页码
            setDefaultPage() {
                let pass = this.userInfo.pass || 0;
                this.pass.default = parseInt(pass / 10, 10) * 10;
                this.pass.value = pass % 10;
            },
            // 获取页码
            getPage() {
                let page = Math.floor((this.pass.default+this.pass.value) / 10) ;
                return page;
            },
            // 初始化页面
            initPage() {

            },
            // 初始化关卡
            initPass() {
                // 初始金币
                this.gold.value = this.userInfo.gold || 100;
            },
            // 获取资源
            getResource(page = 0) {
               this.$request.post('idiom/page',{
                        size: 10,
                        page
                    }).then( res  => {
                        this.resourceList=this.resourceList.concat(res)
                        this.setPlayInfo();
                    })
                
            },
            // 设置游戏信息
            setPlayInfo() {
                let item = this.resourceList[this.pass.value];
                if (!item) {
                    uni.showModal({
                        title: '提示',
                        content: `恭喜您通过了全部关卡`,
                        showCancel: false,
                        confirmText: '我知道了',
                        success: () => {
                            //console.log('success')
                        }
                        
                    })
                    return false;
                }
                let select = `${item.options}`;
                /* 随机排序待选项 */
                let info = select.split("").sort(() => {
                    return Math.random() > 0.5 ? -1 : 1;
                });

                let itemArr = info.map((v, k) => {
                    return {
                        text: v,
                        index: k
                    }
                })

                this.selected.list = [{}, {}, {}, {}];
                this.select.list = itemArr;
                this.id = item.id;
                // 关卡图片
                this.pass.image = uni.$hl.joinImgUrl(item.img);

                if (this.pass.value + 3 >= this.resourceList.length) {
                    
                    let page = this.getPage() + 1;
                    this.getResource(page);
                }
            },
            // 选择
            picker(index, errorIndex) {
                let item = this.select.list[index];
                if (!item.text) {
                    return;
                }
                let findIndex = this.selected.list.findIndex((v, k) => {
                    return !v.text;
                });
                if (errorIndex >= 0) {
                    findIndex = errorIndex;
                }


                if (findIndex >= 0) {
                    this.$set(this.selected.list, findIndex, item);
                    this.$nextTick(() => {
                        this.$set(this.select.list, index, {});
                        this.verify();
                    })
                }
            },
            // 答案校验
            verify() {
                let item = this.resourceList[this.pass.value];
                let pickerAnswer = '';
                let selectedNum = 0;
                this.selected.list.forEach((v, k) => {
                    if (v.text) {
                        pickerAnswer += v.text;
                        selectedNum++;
                    }
                });
                if (selectedNum < item.answerLength) {
                    return;
                }
                //console.log(pickerAnswer)
                let uid = uni.getStorageSync('uid');
                
                 this.$request.post('idiom/guess',{
                        id: this.id,
                        answer: pickerAnswer,
                        uid:uid
                    }).then( res  => {
                        //console.log(res)
                        if (res.right) {
                             this.nextPopData = res;
                            this.nextPop.show = true;
                            this.gold.value += res.gold;
                            audioContext.src = "/static/success.mp3";
                        }else{
                            audioContext.src = "/static/fail.mp3";
                        }
                        audioContext.play()
                    });
                
            },
            // 取消选择
            cancelPicker(index) {
                let item = this.selected.list[index];
                if (!item.text) {
                    return;
                }

                this.$set(this.select.list, item.index, item);

                this.$nextTick(() => {
                    this.$set(this.selected.list, index, {});
                })
            },
            // 下一关
            nextPass() {
                this.nextPop.show = false;
                this.pass.value++;
                
                this.setPlayInfo();
            },
            // 提示
            remind() {
                if (this.gold.value < 10) {
                    uni.$hl.showToast('金币不足');
                    return;
                }
                let uid = uni.getStorageSync('uid');
                let pickerAnswer = ''; 
                this.selected.list.forEach((v, k) => {
                    if (v.text) {
                        pickerAnswer += v.text; 
                    }
                });
                this.$request.post('idiom/tips',
                        {
                            id: this.id,
                            answer: pickerAnswer,
                            uid:uid,
                            type:2
                        }
                    ).then(res=>{
                        //console.log('answer tips ', res)
                        let errorIndex = res.errorIndex;
                        let successText = res.successText;
                        let gold = res.reduceGold;

                         let selectedIndex = -1;
                        for (let i = errorIndex; i < this.selected.list.length; i++) {
                            if (this.selected.list[i].text && this.selected.list[i].text == successText) {
                                selectedIndex = i;
                                break;
                            }
                        }
                        if (selectedIndex >= 0) {
                            this.cancelPicker(selectedIndex);
                        }

                        // 正常选项的位置
                        let successIndex = this.select.list.findIndex((item, index) => {
                            return item.text == successText;
                        });
                        this.gold.value -= gold;
                        this.picker(successIndex, errorIndex);
                })
                // 查找错误位置
                /*
                let errorIndex = this.selected.list.findIndex((item, index) => {
                    return item.text != this.resourceList[this.pass.value].answer.charAt(index);
                });
                // 正确的文字
                let successText = this.resourceList[this.pass.value].answer.charAt(errorIndex);
                */
                // 当前已选项中是否已存在答案
               
            },
            // 看广告增加金币的接口 p通关数 g加金币数
            reported(p = 1, g = 5) {
                let pass = this.pass.default+this.pass.value + p;
                let gold = this.gold.value + g;
                //TODO 请求后台接口，此处不做实现
                
            },
            copyShareContent() {
                // #ifdef H5
                var input = document.querySelector("#shareContent-input textarea");
                input.setAttribute("readonly", "true");
                input.select();
                document.execCommand("Copy");
                uni.$hl.showToast('分享口令已复制', 'success');
                // #endif

                // #ifndef H5
                uni.setClipboardData({
                    data: this.shareContent,
                    success: function() {
                        uni.$hl.showToast('分享口令复制成功', 'success');
                    }
                });
                // #endif
            },
            // 礼物点击
            onGiftClick() {
                clearTimeout(this.endGiftTimeout);
                this.showGift = false;

                // #ifdef APP-PLUS
                this.createAd();
                // #endif

                // #ifndef APP-PLUS
                uni.showModal({
                    title: '送福利',
                    content: `活动还未开始`,
                    showCancel: false,
                    confirmText: '我知道了',
                    success: () => {
                        this.startGift();
                    }
                })
                // #endif
            },
            // 开启礼物动画,30秒分钟一次
            startGift() {
                this.startGiftTimeout = setTimeout(() => {
                    this.showGift = true;

                    this.endGiftTimeout = setTimeout(() => {
                        this.showGift = false;
                        this.startGift();
                    }, (8 * 1000 + 100));
                }, (0.5 * 60 * 1000));
            },
            // 创建 激励视频 广告
            createAd() {
                if (this._isLoaded) {
                    this._rewardedVideoAd.show();
                    return;
                }
                this._isLoaded = false;
                // 仅用于HBuilder基座调试 adpid: '1507000689'
                let adpid = ''
                let rewardedVideoAd = this._rewardedVideoAd = uni.createRewardedVideoAd({
                    adpid
                });

                // 当激励视频被关闭时，默认预载下一条数据，加载完成时仍然触发 `onLoad` 事件
                rewardedVideoAd.onLoad(() => {
                    
                    if (!this._isLoaded) {
                        this._rewardedVideoAd.show();
                    }
                    this._isLoaded = true;
                })
                rewardedVideoAd.onError((err) => {
                    //console.log('广告加载失败', err);
                    this.startGift();
                    uni.showToast({
                        icon: 'none',
                        title: '测试广告id无法使用'
                    })
                })
                rewardedVideoAd.onClose((res) => {
                    //console.log('广告被关闭', res)
                    let fn = () => {
                        if (res.isEnded) {
                            uni.showToast({
                                icon: 'success',
                                title: '获得视频奖励',
                                success: () => {
                                    // 增加30金币
                                    this.reported(0, 30);
                                    this.gold.value += 30;
                                }
                            })
                        } else {
                            uni.showToast({
                                icon: 'none',
                                title: '未获得视频奖励'
                            })
                        }

                        this.startGift();
                    }
                    setTimeout(fn, 500);
                })
            },
            
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/static/css/templatePage/custom_nav_bar.scss';

    .page-bg {
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
    }

    .box-1 {
        padding: 20rpx;
        color: #fff;

        .label {
            padding: 10rpx 20rpx;
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: 40rpx;

        }

        image {
            width: 40rpx;
            height: 40rpx;
            margin-right: 10rpx;
            display: block;
        }
    }

    .box-2 {
        position: relative;
        width: 720rpx;
        margin: 0 auto;

        .bg {
            width: 100%;
            height: 515rpx;
            display: block;
        }

        .img {
            position: absolute;
            top: 104rpx;
            left: 94rpx;
            width: 538rpx;
            height: 340rpx;
        }
    }

    .box-3 {
        margin: 40rpx 0;

        .btn {
            box-sizing: border-box;
            width: 124rpx;
            margin: 0 10rpx;
            border-radius: 16rpx;
            height: 80rpx;
            line-height: 76rpx;
            text-align: center;
            background-color: rgba(255, 193, 7, 0.5);
            border: #fff solid 1px;
            color: #fff;
            font-size: 32rpx;
        }

        .option {
            width: 83rpx;
            height: 83rpx;
            margin: 0 10rpx;
            position: relative;
            color: #937738;
            font-size: 38rpx;

            >image {
                height: 100%;
                width: 100%;
            }

            .value {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 83rpx;
                line-height: 78rpx;
                text-align: center;
                z-index: 1;
            }
        }
    }

    .box-4 {
        margin: 0 50rpx;

        .option {
            width: 83rpx;
            height: 83rpx;
            margin: 0 auto 10rpx auto;
            position: relative;
            color: #fff;
            font-size: 38rpx;

            >image {
                height: 100%;
                width: 100%;
            }

            .value {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 83rpx;
                line-height: 78rpx;
                text-align: center;
                z-index: 1;
            }
        }
    }

    .next-pop {
        .content {
            width: 534rpx;
            height: 883rpx;

            >image {
                display: block;
                width: 100%;
                height: 100%;
            }

            >view {
                position: absolute;
                top: 160rpx;
                left: 10%;
                width: 80%;
                font-size: 32rpx;
                color: #345;
            }

            .btn {
                width: 216rpx;
                height: 68rpx;
                display: block;
                margin: 20rpx auto 0 auto;
            }

            .answer {
                text-align: center;
                font-size: 36rpx;
                margin-bottom: 20rpx;
                letter-spacing: 2px;
                color: #000;
            }
            .pinyin {
                text-align: center;
                font-size: 28rpx;
                margin-bottom: 20rpx;
                letter-spacing: 2px;
                color: #000;
            }
        }
    }

    .gift {
        position: fixed;
        z-index: 9;
        width: 200rpx;
        height: 150rpx;
        top: 40%;
        right: -200rpx;
        animation: giftMove 8s linear 0s normal;
    }

    @keyframes giftMove {
        0% {
            transform: translate(0, 0);
        }

        25% {
            transform: translate(-287rpx, -50rpx);
        }

        50% {
            transform: translate(-575rpx, 50rpx);
        }

        75% {
            transform: translate(-862rpx, -50rpx);
        }

        100% {
            transform: translate(-1150rpx, 50rpx);
        }
    }
</style>
