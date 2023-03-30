<template>
    <view>
        <tn-nav-bar fixed alpha customBack>
            <view slot="back" class='tn-custom-nav-bar__back' @click="goBack">
                <text class='icon tn-icon-left'></text>
                <text class='icon tn-icon-home-capsule-fill'></text>
            </view>
        </tn-nav-bar>
        <view>
            <image class="bg" :src="appImgs.bg_16" style="height: 100vh;" mode="aspectFill"></image>
        </view>
        <view class="box">
            <h3 style="text-align: center;padding: 10rpx;">早晚猜小程序隐私保护指引</h3>
            <div class="group-infos">
                <p>本指引是早晚猜小程序开发者 （以下简称“开发者”）为处理你的个人信息而制定。</p>
            </div>
            <div class="group-infos">
                <div class="group-infos__hd">
                    <h4 class="group-infos__title">1.开发者处理的信息</h4>
                    <p class="group-infos__hd-privacyText">根据法律规定，开发者仅处理实现小程序功能所必要的信息。</p>
                </div>
                <ul class="privacy-config__list">
                    <p>
                        为了注册用户，开发者将在获取你的明示同意后，收集你的微信昵称、头像。
                    </p>
                    <p>
                        为了注册用户，开发者将在获取你的明示同意后，收集你的手机号。
                    </p>
                    <p>
                        开发者 收集你选中的文件，用于上传头像。
                    </p>
                </ul>
            </div>
            <div class="group-infos">
                <div class="group-infos__hd">
                    <h4 class="group-infos__title">2.你的权益</h4>
                    <p class="group-infos__hd-privacyText"></p>
                </div>
                <p class="group-infos_order">2.1关于收集你选中的文件，你可以通过以下路径：小程序主页右上角“...” — “设置” — “小程序已获取的信息” — 点击特定信息 —
                    点击“通知开发者删除”，开发者承诺收到通知后将删除信息。</p>
                <p class="group-infos_order">2.2关于你的个人信息，你可以通过以下方式与开发者联系，行使查阅、复制、更正、删除等法定权利。</p>
                <ul>
                    <p>
                        <span style="margin-right: 10px;">邮箱:</span><span
                            style="overflow: hidden; word-break: break-all;">markjava@foxmail.com</span>
                    </p>
                </ul>
            </div>
            <div class="group-infos">
                <div class="group-infos__hd">
                    <h4 class="group-infos__title">3.开发者对信息的存储</h4>
                    <p class="group-infos__hd-privacyText"></p>
                </div>
                <!---->
                <p>开发者承诺，除法律法规另有规定外，开发者对你的信息的保存期限应当为实现处理目的所必要的最短时间。</p>
            </div>
            <div class="group-infos">
                <div class="group-infos__hd">
                    <h4 class="group-infos__title">4.信息的使用规则</h4>
                    <p class="group-infos__hd-privacyText"></p>
                </div>
                <p class="group-infos_order">开发者将会在本指引所明示的用途内使用收集的信息</p>
                <p><span
                        class="privacyLabel group-infos_order">如开发者使用你的信息超出本指引目的或合理范围，开发者必须在变更使用目的或范围前，再次以</span><span>通知公告</span><span
                        class="privacyLabel">方式告知并征得你的明示同意。</span></p>
            </div>
            <div class="group-infos">
                <div class="group-infos__hd">
                    <h4 class="group-infos__title">5.信息对外提供</h4>
                    <p class="group-infos__hd-privacyText"></p>
                </div>
                <p class="group-infos_order">开发者承诺，不会主动共享或转让你的信息至任何第三方，如存在确需共享或转让时，开发者应当直接征得或确认第三方征得你的单独同意。</p>
                <p class="group-infos_order">开发者承诺，不会对外公开披露你的信息，如必须公开披露时，开发者应当向你告知公开披露的目的、披露信息的类型及可能涉及的信息，并征得你的单独同意。</p>
            </div>
            <div class="group-infos">
                <div class="group-infos__hd">
                    <h4 class="group-infos__title">6.你认为开发者未遵守上述约定，或有其他的投诉建议、或未成年人个人信息保护相关问题，可通过以下方式与开发者联系。
                    </h4>
                    <p class="group-infos__hd-privacyText"></p>
                </div>
                <ul>
                    <p><span style="margin-right: 10px;">邮箱 : </span><span
                            style="overflow: hidden; word-break: break-all;">markjava@foxmail.com</span></p>
                </ul>
            </div>
            <!---->
            <p class="signature">更新日期：2023-02-15</p>
            <p class="signature">生效日期：2023-02-15</p>
            <!---->
            </form>
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
            }
        },
        onLoad() {
            this.appImgs = uni.$hl.getAppImgs();
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/static/css/templatePage/custom_nav_bar.scss';
    .bg {
        position: fixed;
        z-index: -1;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    .box{
        background-color: rgba($color: #ffffff, $alpha: 0.1);
        padding:80rpx 20rpx;
        line-height: 50rpx;
    }
</style>
