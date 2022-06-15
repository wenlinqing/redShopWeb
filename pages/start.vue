<template>
<view class="contBox">
	<image src="../static/startbg.jpg" mode="widthFix" style="display: block;width: 100%;"></image>
	<view class="videoBox">
		<text>视频操作：</text>
		<view class="subBox flex">
			<view @click="videoFun(1)">注册</view>
			<view @click="videoFun(2)">下载</view>
			<view @click="videoFun(3)">实名</view>
			<view @click="videoFun(4)">开通转赠</view>
			<view @click="videoFun(5)">免费换大米</view>
		</view>
	</view>
	<view class="text flex flex_ac flexbetween">
		1、不是嗖嗖用户？<!-- <view class="btnBox" @click="goOutSite(1)">注册</view> -->
		<view>
			<button class="btnBox" open-type='contact' session-from='1'>注册</button>
		</view>
	</view>
	<view class="text flex flex_ac flexbetween">
		2、没有下载嗖嗖APP？ <!-- <view class="btnBox" @click="goOutSite(2)">下载App</view> -->
		<view>
			<button class="btnBox" open-type='contact' session-from='2'>下载app</button>
		</view>
	</view>
	<view class="text flex flex_ac flexbetween">
		3、未开通红包转赠功能？ <view class="btnBox" @click="goOutSite(3)">点击开通</view>
	</view>
	<view class="text flex flex_ac flexbetween">
		4、完成以上步骤，即可购物<view class="btnBox"  @click="registFun()">兑换商城</view>
	</view>
	<view style="height: 50px;"></view>
	<!-- <button type="default" class="btnBox"  @click="codeFun()" >生成参数码</button> -->
</view>
</template>

<script>
	export default{
		data(){
			return{
				shopInfo:{},
				vmid:uni.getStorageSync('vmid')||'5821110050'
			}
		},
		onShareTimeline() {},
		onShareAppMessage () {},
		onLoad(option) {
			// console.log("option===",option)
			if(option.vmid){
				uni.setStorageSync('vmid',option.vmid)
				this.vmid=option.vmid
			}else{
				uni.setStorageSync('vmid','5821110050')
			}
		},
		onShow(){
			this.$request({
				url: '/redapi/getShopInfo',
				data:{
					vmid:this.vmid
				},
				method:'POST',
			}).then(ress=>{
				// console.log('ress====',ress);
				uni.setStorageSync('shopInfo', JSON.stringify(ress.data))
				this.shopInfo=ress.data
			}).catch(error=>{
				console.log(error);
			})
		},
		methods:{
			codeFun(){
				this.$request({
					url: '/redapi/getWxewm?vmid=5821110050',
					data:{},
					method:'get'
				}).then(ress=>{
					console.log('jjjjjjjjj=', ress)
					
				}).catch(error=>{
					
				});
			},
			videoFun(type){
				if(type==1){
					uni.navigateTo({
						url:'/pages/videos?src=https://www.hj19800.com/1.mp4'
					})
				}else if(type==2){
					uni.navigateTo({
						url:'/pages/videos?src=https://www.hj19800.com/2.mp4'
					})
				}else if(type==3){
					uni.navigateTo({
						url:'/pages/videos?src=https://www.hj19800.com/3.mp4'
					})
				}else if(type==4){
					uni.navigateTo({
						url:'/pages/videos?src=https://www.hj19800.com/4.mp4'
					})
				}else{
					uni.navigateTo({
						url:'/pages/videos?src=https://www.hj19800.com/5.mp4'
					})
				}
			},
			goOutSite(type){
				if(type==1){
					uni.navigateTo({
						url:'/pages/website?src=https://www.hj19800.com/redirects/' //+encodeURIComponent(this.shopInfo.link)
					})
				}else if(type==2){
					//https://a.app.qq.com/o/simple.jsp?pkgname=com.wjkj.loosrun
					uni.navigateTo({
						url:'/pages/website?src=https://www.hj19800.com/downapp' //+encodeURIComponent('https://a.app.qq.com/o/simple.jsp?pkgname=com.wjkj.loosrun')
					})
				}else{
					uni.navigateTo({
						url:'/pages/website?src='+encodeURIComponent('https://www.hj19800.com/#/login')
					})
				}
				
			},
			registFun(){
				if(!uni.getStorageSync('token')){
					uni.getUserProfile({
						desc:'Wexin',
						success:res=>{
							uni.setStorageSync('userInfo', res.rawData)
							let userInfo =  JSON.parse(res.rawData)
							/* {"nickName":"石城郎","gender":0,"language":"zh_CN","city":"","province":"","country":"",
							"avatarUrl":"https://thirdwx.qlogo.cn/mmopen/vi_32/GQtG5xKiaibqCtx3iavkL38ziczKiarnCp0ru7QY2rX
							hM2lWt2C89Xya4QZz6JVa2lEUvLyGKibIEU7YSsrd3Vg06kJg/132"
							} */
							////////////////////////////////////////////////////////////////
							/* let datas={
								headimg:userInfo.avatarUrl,
								nickname:userInfo.nickName,
								gender:userInfo.gender,
								openid:'oa5QL5jdQ-j227aAjbKrQd2PIj-s'  //  oRfRe5OoYqkRFsIXYNNjoJoFGH4A
							}
							this.loginFun(datas)
							return */
							///////////////////////////////////////////////////////////////////////
							uni.showLoading({mask:true})
							wx.login({
								success: res => {
									let code = res.code;
									this.$request({
										url: `/redapi/wxgetOpenId?js_code=${code}&headimg=${userInfo.avatarUrl}&nickname=${userInfo.nickName}&gender=${userInfo.gender}`,
										data:{},
										method:'POST',
									}).then(ress=>{
										console.log('ress====',ress);
										// return
										let datas={
											headimg:userInfo.avatarUrl,
											nickname:userInfo.nickName,
											gender:userInfo.gender,
											openid:ress.data.openid, // oa5QL5jdQ-j227aAjbKrQd2PIj-s
										}
										this.loginFun(datas)
									}).catch(error=>{
										uni.hideLoading()
										console.log(error);
									});
								}
							});
						},
						fail:err=>{
						   console.log(err)
						}
					})
				}else{
					uni.switchTab({
						url:'/pages/index/index'
					})
				}
			},
			loginFun(datas){
				// console.log('datas======',datas)
				this.$request({
					url: '/redapi/regist',
					data:datas,
					method:'POST'
				}).then(ress=>{
					// console.log('jjjjjjjjj=', ress)
					uni.switchTab({
						url:'/pages/index/index'
					})
					uni.setStorageSync('token', ress.token)
					uni.hideLoading()
				}).catch(error=>{
					uni.hideLoading()
					uni.showToast({
						title: error,
						icon: "none"
					})
				});
			},
		}
	}
</script>

<style lang="scss">
	page{background-color: #5c78ff!important;}
	.text{color: #fff;margin-top: 20px;padding:0 20px}
	.btnBox{width: 200rpx;height: 35px;line-height: 35px;font-size: 15px;display: inline-block;text-align: center;
	background-color: rgba(255,255,255,.6);border-radius: 5px;
		color: #fff;
	}
.videoBox{color: #ffff00;font-size: 32rpx;
	text{padding-left:10px;padding-bottom: 10px;display: block;}
	.subBox view{padding:0 10px;;text-align: center;}
	
}
</style>
