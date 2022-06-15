<template>
<view class="content">
	<view class="topBg"></view>
	<view class="userIn">
		<image :src="userInfo.avatarUrl" mode="aspectFill"></image>
		<view class="nickname">{{userInfo.nickName}}</view>
		<view class="loginbtn" @click="registFun()" v-if="!userInfo.nickName">请登录</view>
	</view>
	<view class="linkBox">
		<view class="item flex flex_ac" @click="goOrder">
			<image class="item_left flexauto" src="../../static/order.png" mode="aspectFill"></image>
			<view class="itemName flex1">我的订单</view>
			<image class="item_right flexauto" src="../../static/right.png" mode="aspectFill"></image>
		</view>
	</view>
	<view class="BtnBox">
		<view style="color: red;margin-bottom: 10px;">{{errorTxt}}</view>
		<button class='bottombtn' type="primary" v-if="userInfo.isOld&&!isSigned" @click="signInFun" :disabled="btnDisable">我要签到</button>
		<button class='bottombtn' type="warn" v-if="userInfo.isOld&&isSigned" @click="getMiFun" :disabled="btnDisable">免费领米</button>
	</view>
	
	<!-- <button @click="cliFun" type="primary" :disabled="btnDisable">立即登录</button> -->
	<!-- <button class='bottom-btn'  @click="getOpenId">立即登录</button> -->
	<!-- <button class='bottom-btn'  @click="pay">微信支付</button> -->
</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: uni.getStorageSync('userInfo')?JSON.parse(uni.getStorageSync('userInfo')):{},
				isSigned: uni.getStorageSync('isSigned')||false,
				errorTxt:'',
				twoHours:uni.getStorageSync('twoHours')||'',
				btnDisable:false,
			}
		},
		onShow() {
			/* uni.showToast({
				title: '已经有人签到，请稍后再试',
				icon: "none",
				duration:2500
			}) */
			uni.hideLoading()
			this.userInfo=uni.getStorageSync('userInfo')?JSON.parse(uni.getStorageSync('userInfo')):{},
			
			this.twoHours=uni.getStorageSync('twoHours')||''
			if(this.twoHours){
				let curT=new Date().getTime()
				let endT= new Date(this.twoHours).getTime()
				// console.log(curT,endT,'===',curT-endT)
				if(curT>endT){
					this.isSigned=false
					this.errorTxt=''
					uni.removeStorageSync('isSigned')
				}
			}
		},
		onLoad() {
			/* oa5QL5jdQ-j227aAjbKrQd2PIj-s */
			
		},
		methods: {
			timeDown(){
				setTimeout(()=>{
					this.btnDisable=false
				},10000)
			},
			getMiFun(){
				if(this.btnDisable){
					return false
				}
				this.btnDisable=true
				this.timeDown()
				this.$request({
					url: '/redapi/getFreeProduct',
					data:{},
					method:'POST'
				}).then(ress=>{
					uni.setStorageSync('isSigned',false)
					this.isSigned=false
					this.errorTxt= ress.msg
				}).catch(error=>{
					this.errorTxt= error.msg
					uni.showToast({
						title: error.msg,
						icon: "none",
						duration:3000
					})
				});
			},
			signInFun(){
				if(this.btnDisable){
					return false
				}
				this.btnDisable=true
				this.timeDown()
				let shopInfo = JSON.parse(uni.getStorageSync('shopInfo'))
				this.$request({
					url: '/redapi/signIn',
					data:{
						vmid:shopInfo.vmid,
						mobile:shopInfo.mobile,
					},
					method:'POST'
				}).then(ress=>{
					this.twoHours= ress.data
					uni.setStorageSync('twoHours',ress.data)
					uni.setStorageSync('isSigned',true)
					this.isSigned=true
					this.errorTxt= ress.msg
				}).catch(error=>{
					this.errorTxt= error.msg
					uni.showToast({
						title: error.msg,
						icon: "none",
						duration:3000
					})
				});
			},
			goOrder(){
				if(!uni.getStorageSync('token')){
					this.registFun()
				}else{
					uni.navigateTo({
						url:'/pages/user/order'
					})
				}
			},
			registFun(){
				uni.getUserProfile({
					desc:'Wexin',
					success:res=>{
						// uni.setStorageSync('userInfo', res.rawData)
						let userInfo =  JSON.parse(res.rawData)
						uni.showLoading({mask:true})
						wx.login({
							success: res => {
								let code = res.code;
								this.$request({
									url: `/redapi/wxgetOpenId?js_code=${code}&headimg=${userInfo.avatarUrl}&nickname=${userInfo.nickName}&gender=${userInfo.gender}`,
									data:{},
									method:'POST',
								}).then(ress=>{
									let datas={
										headimg:userInfo.avatarUrl,
										nickname:userInfo.nickName,
										gender:userInfo.gender,
										openid:ress.data.openid, // oa5QL5jdQ-j227aAjbKrQd2PIj-s
									}
									userInfo.isOld = ress.data.isOld
									uni.setStorageSync('userInfo', JSON.stringify(userInfo))
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
			},
			loginFun(datas){
				this.$request({
					url: '/redapi/regist',
					data:datas,
					method:'POST'
				}).then(ress=>{
					uni.setStorageSync('token', ress.token)
					this.userInfo=JSON.parse(uni.getStorageSync('userInfo'))
					uni.hideLoading()
				}).catch(error=>{
					uni.hideLoading()
					uni.showToast({
						title: error,
						icon: "none"
					})
				});
			},
			pay(){
			    console.log('发起微信支付')
			    let money = 0.01;
			    wx.login({
			      success(res){
			        if(res.code){
			          wx.request({
			            url: '/data/pay?code='+res.code+'&money='+money,
			            success(res){
			              console.log(res,'统一下单接口返回信息')
			              
			              let appid = 'wx0db58f97bdd793a7';
			              let timeStamp = res.data.timeStamp;
			              let nonceStr = res.data.nonceStr;
			              let packages = 'prepay_id='+res.data.package;
			              let signType = 'MD5';
			              let key = '商户后台设置的key';
			 
			              let str='appId='+appid +'&nonceStr='+nonceStr+'&package='+packages+'&signType='+signType+'&timeStamp='+timeStamp+'&key='+key;
			              let paySign = md5.md5(str)
			 
			              wx.requestPayment({
			                timeStamp: timeStamp+'',  //时间搓
			                nonceStr: nonceStr, //随机字符串
			                package: packages,  //repay_id
			                signType: 'MD5', //签名算法
			                paySign: paySign,  //签名
			                success(res){
			                  console.log(res,'微信支付成功！！！')
			                }
			              })
			 
			            }
			          })
			        }
			      }
			    })
			},
			getInfo(){
				uni.getUserProfile({
				   desc:'Wexin',
				   success:res=>{
						console.log('res.rawData===',res.rawData);
				   },
				   fail:err=>{
					   console.log(err)
				   }
				})
			},
			getOpenId(){
			    wx.login({
					success: res => {
						let code = res.code; //获取登录的临时凭证
						console.log('code===',code);
						let data = {
							"js_code": code,
						}
						this.$request({
							url: '/data/wxgetOpenId?js_code='+code,
							data:{},
							method:'POST',
						}).then(ress=>{
							console.log(ress);
						}).catch(error=>{
							console.log(error);
						});
					}
			    });
			},
		}
	}
</script>

<style scoped lang="scss">
.topBg{width: 120%;height: 100px;position: absolute;left: -10%;top: 0;border-radius: 0 0 50% 50%;background: #393939}
	/* // FF5742 */
.bottombtn{width:40%}
.BtnBox{position: fixed;bottom:20%;z-index: 8;text-align: center;width: 100%;}

.userIn{position: absolute;left: 50%;top: 60px;transform: translateX(-50%);
	image{width: 80px;height: 80px;border-radius: 50%;}
	.nickname{margin-top: 5px;text-align: center;}
	.loginbtn{width: 80px;text-align: center;height: 35px;line-height: 35px;border-radius: 5px;font-size: 17px;font-weight: bold;
	background-color: #FFAA16;color: #fff;position: relative;top: -20px;}
}

.linkBox{padding-top: 200px;
	.item{padding:5px 10px;background-color: #efefef;
		.item_left{width: 35px;height: 35px;}
		.item_right{width: 15px;height: 15px;}
		.itemName{padding-left: 10px;font-size: 15px;}
	}
	
}


</style>
