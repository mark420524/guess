<script>
	export default {
		onLaunch: function() {
			//console.log('App Launch')
			
		},
		onShow: function() {
		    //console.log('App show')
			
		},
		onHide: function() {
			//console.log('App Hide')
		}
	}
</script>

<style lang="scss">
      @import './tuniao-ui/index.scss';
      @import './tuniao-ui/iconfont.css';
	@import "libs/helang-flex.scss";
	
	/*每个页面公共css */
	image{
		display: block;
	}
	
	page{
		font-size: 28rpx;
		color: #333;
	}
	
	// 动画
	.transform-scale{
		transform:scale(1,1);
		transition: transform 0.1s ease 0s;
	}
	.transform-scale:active{
		transform:scale(0.95,0.95);
	}
	
	// 弹窗
	.global-popup{
		.shade{
			position: fixed;
			z-index: 10;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			background-color: rgba(33,33,33,0.5);
		}
		.content{
			position: fixed;
			z-index: 11;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			margin: auto;
			animation:globalPopup 0.2s ease-in-out 0s 1 normal;
		}
	}
	
	@keyframes globalPopup
	{
		from {transform: scale(0.3);}
		to {transform: scale(1);}
	}
</style>
