<template>
<view class="content">
	<view class="orderBox bgfff">
		<view class="shopName flex flexbetween">
			{{shopInfo.vmname||''}}
			<!-- <label>80秒</label> -->
		</view>
		<view class="orderItem flex" v-for="item,index in productList" :key="index" v-if="item.num>0">
			<view class="flexauto proImg flex flexcenter">
				<image :src="imgHost+item.product_img" mode="aspectFill"></image>
			</view>
			<view class="flex1 proInfo flex flexbetween flex_dir_col">
				<view class="proName">{{item.product_name}}</view>
				<view class="nums">X{{item.num}}</view>
			</view>
			<view class="proPirce flex flexcenter flex_ac">
			<image src="../../static/red.png" mode="widthFix" style="width: 30rpx;margin-right: 5px;"></image>
			{{item.price}}</view>
		</view>
		<!-- <view class="orderItem flex">
			<view class="flexauto proImg flex flexcenter">
				<image src="../../static/pic.jpg" mode="aspectFill"></image>
			</view>
			<view class="flex1 proInfo flex flexbetween flex_dir_col">
				<view class="proName">康师傅方便面</view>
				<view class="nums">X1</view>
			</view>
			<view class="proPirce flex flexcenter flex_ac">￥3.5</view>
		</view> -->
	</view>
	
	<view class="totalMoney">红包小计：<label>{{totalMoney/100}}</label></view>
	<view class="notice" @click="copyFun">
		需向 {{mobile}}(复制)&nbsp; 红包转账 {{totalMoney/100}}
	</view>
	
	<view class="payBtn fixed_bottom">
		<view class="btn" @click="payFun()">红包支付 {{totalMoney/100}}</view>
	</view>
</view>
</template>

<script>
	import md5 from 'js-md5';
	export default {
		data() {
			return {
				productList:[],
				totalMoney: 0,
				imgHost:this.imgHost,
				mobile:JSON.parse(uni.getStorageSync('shopInfo')).mobile,
				shopInfo:JSON.parse(uni.getStorageSync('shopInfo')),
			}
		},
		mounted() {
			let pages = getCurrentPages();
			let prePage = pages[pages.length - 2];
			// console.log("pages:",pages);
			// console.log("prePage:",prePage);
			
			// #ifdef H5
			this.productList = prePage.productList
			this.totalMoney = prePage.totalMoney
			// #endif
			// #ifdef MP-WEIXIN
			this.productList = prePage.data.productList
			this.totalMoney = prePage.data.totalMoney
			// #endif
			
		},
		methods: {
			copyFun(){
				uni.setClipboardData({
					data:this.mobile,
					success:()=>{
					  uni.showToast({
						title:'复制成功'
					  })
					}
				});
			},
			objKeySort(obj, type='asc'){
				if(type == 'asc'){
					var newkey = Object.keys(obj).sort()
				}else{
					var newkey = Object.keys(obj).sort().reverse()
				}
				let newObj={}
				for(let k of newkey){
					newObj[k] = obj[k]
				}
				return newObj;
			},
			signFun(data){
				let secret = 'SNlb3Ifj3efHKHf0Mil2NHyKBYotI6KO';
				let newObj = this.objKeySort(data);
				
				let connects = '';
				for (let item in newObj) {
				    connects += item+'='+ newObj[item]+'&';
				}
				connects += "secret="+secret;
				// console.log('拼接格式后', connects);
				return md5(connects).toUpperCase();
			},
			payFun(){
				let netstatus = JSON.parse(uni.getStorageSync('shopInfo')).netstatus
				if (netstatus==0){
					uni.showToast({
						title: '机器离线，稍后重试',
						icon: "none",
					})
					return
				}
				
				let productIds=[]
				let productNums=[]
				this.productList.forEach(item=>{
					if(item.num>0){
						productIds.push(item.product_id)
						productNums.push(item.num)
					}
				})
				let vmid=JSON.parse(uni.getStorageSync('shopInfo')).vmid
				let data = {
					productIds:productIds.join(','),
					productNums:productNums.join(','),
					money:this.totalMoney/100,
					account:this.mobile,
					vmid
				}
				// console.log('data==',data)
				uni.showLoading({mask:true})
				setTimeout(()=>{
					uni.hideLoading()
				},5000)
				// return
				this.$request({
					url: '/redapi/createOrder',
					data,
					method:'POST'
				}).then(datas=>{
					/* uni.showToast({
						title: '',
						icon: "none",
						duration:1500
					}) */
					uni.hideLoading()
					let ddd={
						'r':this.totalMoney/100,
						'm':this.mobile,
						'e': vmid,
						'n': datas.orderNo,
						't': new Date().getTime().toString().substring(0,10)
					}
					ddd['s']=this.signFun(ddd)
					// console.log('dddddddd=', ddd)
					let key=encodeURIComponent(JSON.stringify(ddd))
					let paths='/redPacket/pages/give/index?key='+key
					console.log('paths==',paths)
					uni.showModal({
						title:'温馨提示',
						content:'下单成功，必须通过跳转去红包转账，才能正常出货',
						confirmText:'去转账',
						showCancel:false,
						success:(res)=> {
							if(res.confirm){
								uni.navigateToMiniProgram({
									appId: 'wxd1ce5dd69be200e8',
									path: paths,
									success: res => {
										uni.navigateBack({
											delta: 1,
											success: function() {
												uni.$emit("handleFun",{title: 'Hello World'});
											}
										});
									},
									fail: err => {
										console.log('jjj')
										uni.navigateBack({
											delta: 1,
											success: function() {
												uni.$emit("handleFun",{title: 'Hello World'});
											}
										});
									}
								});
								
							}
						}
					})
				}).catch(error=>{
					uni.hideLoading()
					uni.showToast({
						title: error,
						icon: "none"
					})
				});
				
				
			}
		}
	}
</script>

<style scoped lang="scss">
	.content{padding:10px;}
	
	.orderBox{border-radius: 5px;padding: 0 10px;
		.shopName{height: 40px;line-height: 40px;font-size: 15px;font-weight: bold;
			label{color: #af0319;font-weight: normal;}
		}
		.orderItem{border-top: 1px solid #f7f7f7;padding:10px;
			.proImg{width: 60px;height: 70px;overflow: hidden;
				image{width: 50px;}
			}
			.proInfo{
				.proName{color: #333;font-size: 15px;font-weight: bold;}
				.nums{font-size: 12px;color: #999;}
			}
		}
		.proPirce{font-size: 15px;font-weight: bold;}
	}
	
	.totalMoney{color: #f1af13;text-align: right;padding:15px 10px;
		label{font-size: 16px;font-weight: bold;}
	}
	.payBtn{padding: 20px;background-color: #F7f7f7;width: 100%;}
	.btn{background-color: #f1af13;height: 35px;line-height: 35px;text-align: center;color: #fff;font-size: 16px;border-radius: 20px;}
	
	.notice{text-align: center;font-weight: bold;padding: 20px 0;color: #f00;}
	
	
</style>
