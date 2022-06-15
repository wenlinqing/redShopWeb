<template>
<page-meta>
	<navigation-bar
	  :title="nbTitle"
	  :front-color="nbFrontColor"
	  :background-color="nbBackgroundColor"
	  :color-animation-duration="100"
	  color-animation-timing-func="easeIn"
	/>
</page-meta>
<view class="flex flex_dir_col" style="height: 100%;">
	<view class="contents bgfff flex1">
		<view class="contBox flex">
			<view class="cont_left flexauto">
				<view class="item flex flexcenter flex_ac" :class="actIndex==index?'on':''" 
				v-for="item,index in categoryList" :key="index" @click="cateFun(item,index)">{{item}}</view>
				
				<view style="height: 80px;"></view>
			</view>
			
			<view class="cont_right flex1">
				<view class="list flex" v-for="item,index in dataList" :key="index">
					<view class="flexauto proImg flex flexcenter">
						<image :src="imgHost+item.product_img" mode="aspectFill"></image>
					</view>
					<view class="flex1 proInfo flex flexbetween flex_dir_col">
						<view class="proName">{{item.product_name}}</view>
						<view class="proPirce flex flex_ac flexbetween">
							<view class="price flex flex_ac"><!-- <label>￥</label> -->
							<image src="../../static/red.png" mode="widthFix" style="width: 30rpx;margin-right: 5px;"></image>
							{{item.price}}</view>
							
							<view class="proAction flex flexbetween flexend">
								<!-- <view class="btns" v-if="item.num>0" @click="proClick(item,1)"><image src="../../static/pro_mini.png" mode="aspectFill"></image></view> -->
								<view class="num" v-if="item.num>0">{{item.num}} 包</view>
								<view v-else style="color:red">库存不足</view>
								<!-- <view class="btns" @click="proClick(item,2)"><image src="../../static/pro_add.png" mode="aspectFill"></image></view> -->
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
	
	
	<view class="bgBox fixed" v-show="showDetail" @click="showDFun()"></view>
	<view class="bottomContBox bgfff fixed_bottom" :class="showDetail?'show':''">
		<view class="titles flex flexbetween">
			<view class="nums">已选商品 <label></label></view>
			<!-- <view class="clearBtn flex" @click="clearFun">
				<image src="../../static/clear.png" mode="aspectFill"></image>
				清空购物车
			</view> -->
		</view>
		<view class="conts">
			<view class="items flex" v-for="item,index in productList" :key="index" v-if="item.num>0">
				<view class="name flex1">{{item.product_name}}</view>
				<view class="price flex flex_ac">
					<image src="../../static/red.png" mode="widthFix" style="width: 30rpx;margin-right: 5px;"></image>
				{{item.price}}</view>
				<view class="proAction flex flexbetween flexend">
					<!-- <view class="btns" @click="proClick(item,1)"><image src="../../static/pro_mini.png" mode="aspectFill"></image></view> -->
					<view class="num">{{item.num}} 包</view>
					<!-- <view class="btns" @click="proClick(item,2)"><image src="../../static/pro_add.png" mode="aspectFill"></image></view> -->
				</view>
			</view>
		</view>
	</view>
	
	
	<view class="footers fixed_bottom flex" style="z-index: 999999;">
		<view class="foot_left flex flex1" @click="showDFun()">
			<view class="carIcon flex flexcenter flex_ac">
				<image src="../../static/car.png" mode="aspectFill"></image>
				<view class="allNums" v-if="nums>0">{{nums}}</view>
			</view>
			<view class="allMoney" v-if="totalMoney>0"><!-- <label>￥</label> -->{{totalMoney/100}}</view>
		</view>
		<view class="goPay flexauto" :class="totalMoney==0?'disabled':''" @click="goNext()">去结算</view><!-- disabled -->
	</view>
	
	<view class="divBg" v-if="clickcount<6 && showSignAct"></view>
	<view class="divCont" v-if="clickcount<6 && showSignAct">
		<view class="contBoxer">
			<rich-text :nodes="signCont"></rich-text>
			<button type="primary" @click="IknowFun">知道了</button>
		</view>
	</view>
</view>
</template>

<script>
	// import md5 from 'js-md5';
	export default {
		data() {
			return {
				nbTitle: '',
				nbFrontColor: '#ffffff',
				nbBackgroundColor: '#393939',
				scrollTop:0,
				contentsTop:0,
				showDetail:false,
				actIndex:0,
				categoryList:[],
				dataList:[],
				nums:0,
				totalMoney:0,
				productList:[],
				imgHost:this.imgHost,
				shopInfo:{},
				vmid:uni.getStorageSync('vmid')||'',
				signCont:'',
				clickcount:uni.getStorageSync('clickcount')||0,
				showSignAct:false,
			}
		},
		onLoad(option) {
			// console.log("option===",option)
			if(option.vmid){
				uni.setStorageSync('vmid',option.vmid)
				this.vmid=option.vmid
			}
		},
		onShow(){
			this.$request({
				url: '/redapi/checkToken',
				data:{},
				method:'get',
			}).then(ress=>{
				
			}).catch(error=>{
				// console.log(error);
			})
			
			uni.hideLoading()
			if(this.vmid==''){
				uni.showToast({
					title: '请重新扫码',
					icon: "none"
				})
			}else{
				this.$request({
					url: '/redapi/getShopInfo',
					data:{
						vmid:this.vmid
					},
					method:'POST',
				}).then(ress=>{
					uni.setStorageSync('shopInfo', JSON.stringify(ress.data))
					this.shopInfo=ress.data
					this.nbTitle=ress.data.vmname+'---('+ (ress.data.netstatus==0?'离线':'在线')+')'
				}).catch(error=>{
					console.log(error);
				})
			}
	
			/* if(uni.getStorageSync('shopInfo')){
				this.nbTitle=JSON.parse(uni.getStorageSync('shopInfo')).vmname+'    ('+ (this.shopInfo.netstatus==0?'离线':'在线')+')'
			} */
		    uni.$on("handleFun", res => {
				this.nums=0;
				this.totalMoney=0;
		        this.getProductList()
		        // 清除监听
		        uni.$off('handleFun');
		    })
			
		},
		mounted() {
			// console.log('index mounted')
			this.getProductList()
			
			if(this.clickcount<=4){
				this.$request({
					url: '/redapi/signActive'
				}).then(res=>{
					this.signCont= res.data
					this.showSignAct=true
				})
			}
		},
		methods: {
			IknowFun(){
				if(this.clickcount<=4){
					++this.clickcount
					uni.setStorageSync('clickcount',this.clickcount)
					this.showSignAct=false
					
					if(this.clickcount==1){
						uni.removeStorageSync('userInfo')
					}
				}
			},
			getProductList(){
				uni.showLoading({mask:true})
				this.$request({
					url: '/redapi/productList',
					data:{
						vmid:this.vmid
					},
					method:'POST'
				}).then(datas=>{
					this.productList = datas.list
					// console.log('this.productList',this.productList)
					this.productList.forEach(item=>{
						if(item.maxNum>0){
							item.num=1
						}else{
							item.num=0
						}
						// console.log(item.category_name)
						if(!this.categoryList.includes(item.category_name)){
							this.categoryList.push(item.category_name)
						}
					})
					this.totalFun()
					this.filterData()
					uni.hideLoading()
				}).catch(error=>{
					uni.hideLoading()
					uni.showToast({
						title: error,
						icon: "none"
					})
				});
			},
			clearFun(){
				uni.showModal({
				    title: '温馨提示',
				    content: '确定清空购物车？',
				    success: res=> {
				        if (res.confirm) {
				            this.nums=0;
				            this.totalMoney=0;
				            this.productList.forEach(item=>{
				            	item.num=0
				            })
				            this.showDetail=false
				            this.$forceUpdate()
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			totalFun(){
				this.nums=0;
				this.totalMoney=0;
				this.productList.forEach(item=>{
					if(item.num>0){
						this.nums += item.num
						this.totalMoney += item.num*(100*item.price)
					}
				})
			},
			proClick(obj,type){
				if(type==1){
					obj.num -=1
				}else{
					if(obj.num<obj.maxNum){
						obj.num +=1
					}else{
						uni.showToast({
							title: '库存不足',
							icon: "none"
						})
						return
					}
				}
				this.productList.forEach(item=>{
					if (item.product_id==obj.product_id ){
						item.num=obj.num
						// console.log(item)
					}
				})
				this.totalFun()
				this.$forceUpdate()
			},
			cateFun(obj,index){
				this.actIndex=index
				this.filterData()
			},
			filterData(){
				this.dataList=[]
				this.productList.forEach(item=>{
					if (item.category_name==this.categoryList[this.actIndex]){
						this.dataList.push(item)
					}
				})
			},
			goNext(){
				if(!uni.getStorageSync('token')){
					this.registFun()
				}else{
					if(this.totalMoney==0) return
					uni.navigateTo({
						url:'/pages/index/pay'
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
					this.goNext()
					uni.hideLoading()
				}).catch(error=>{
					uni.hideLoading()
					uni.showToast({
						title: error,
						icon: "none"
					})
				});
			},
			showDFun(){
				if(this.totalMoney==0) return
				this.showDetail = !this.showDetail
			}
		}
	}
	
	
	// uni.createSelectorQuery().select(".sticke").boundingClientRect((res)=>{
	//     uni.pageScrollTo({
	//         duration:0,
	//         scrollTop:800
	//     })
	// }).exec()
</script>

<style scoped lang="scss">
	.divBg{position: fixed;width: 100%;height: 100%;left:0;top:0;z-index: 99999999;background-color: rgba(0,0,0,.6);}
	.divCont{position: fixed;width: 80vw;left:10vw;top:10vh;z-index: 999999999;
	background-color:#fff;padding:15px;border-radius:5px;
		.contBoxer{max-height: 110vw;overflow-y: auto;}
		button{margin-top: 20px;display: block;}
	}
	
	
	.indexTop{background-color: #393939;color: #fff;}
	.adressName{width: 50%;height: 35px;line-height: 35px;text-align: center;margin: 0 auto;font-size: 16px;}
	.shopInfo{padding:15px 10px 20px;
		.shopImg{width: 140rpx;height: 140rpx;margin-right: 15px;
			image{width: 140rpx;height: 140rpx;}
		}
		.infos{overflow: hidden;padding-right: 10px;}
		.name{font-size: 16px;padding:5px 0;}
		.gonggao{font-size: 12px;width: 100%;
			.label{width: 38px;}
			.gonggaoInfo{width: 150%;white-space: nowrap;}
		}
	}
	
	.navBox{height: 40px;
		.item{width: 100px;text-align: center;height: 40px;line-height: 40px;}
		.on{color: #f1af13;border-bottom: 3px solid #f1af13;height: 37px;line-height: 37px;;}
	}
	
	.contents,.contBox{height: 100vh;overflow: hidden;}
	.contentFixed{position: fixed;left:0; top: 0;width: 100%;z-index: 999;}
	
	.cont_left{background-color: #fafafa;height: 100%;width: 80px;overflow-y: auto;
		.item{height: 80px;}
		.item.on{color: #f1af13;background-color: #fff;font-weight: bold;}
	}
	.cont_right{padding: 10px;height: 100%;overflow-y: auto;
		.list{border-radius: 5px;box-shadow:0px 0px 5px 0 #ddd;padding:10px;margin-bottom: 10px;
			.proImg{width: 80px;height: 100px;overflow: hidden;margin-right: 10px;border-radius: 5px;
				image{width: 100%;height:100%}
			}
			.proInfo{
				.proName{color: #333;font-size: 15px;font-weight: bold;}
				.proPirce{
					.price{color: #a1081c;font-size: 18px;
						label{font-size: 14px;}
					}
					
				}
			}
		
		}
	}
	// 
	.proAction{//width: 80px;
		.btns{width: 25px;height: 25px;
			image{width: 25px;height: 25px;}
		}
		.num{height: 25px;line-height: 25px;font-size: 16px;width: 50px;text-align: right;}
	}
	
	.footers{background-color: #525050;height: 50px;color: #fff;
		.foot_left{
			.carIcon{width: 60px;position: relative;
				image{width: 25px;height: 25px;}
				.allNums{position: absolute;width: 15px;height: 15px;line-height: 15px;border-radius: 50%;z-index: 1;background-color: #E24B3E;text-align: center;
					top: 5px;right: 5px;font-size: 12px;
				}
			}
			.allMoney{padding-left: 10px; line-height: 50px;font-size: 18px;
				label{font-size: 14px;}
			}
		}
		.goPay{background-color: #FFAA16;font-size: 16px;font-weight: bold;line-height: 50px;padding:0 20px;}
		.goPay.disabled{background-color: #8d8f8e;}
	}
	
	
	.bgBox{height: 100vh;background: rgba(0,0,0,0.6);z-index: 9;}
	.bottomContBox{bottom: -100vh;z-index: 10;
		.titles{background: #F4F4F4;padding: 10px;color: #aaa;
			.nums{color: #616161;
				label{font-size: 12px;margin-left: 5px;}
			}
			.clearBtn{
				image{width: 18px;margin-right: 5px;}
			}
		}
		.conts{max-height: 260px;overflow-y: auto;}
		.items{padding: 15px 10px;border-bottom: 1px solid #eee;
			.price{width: 80px;font-weight: bold;font-size: 15px;}
		}
	}
	.bottomContBox.show{bottom: 50px;transition: bottom ease .3s;}
	
	
	
	
</style>
