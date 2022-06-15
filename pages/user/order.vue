<template>
<view>
	<!-- <view class="tagBox fixed flex">
		<view class="item on">全部订单</view>
		<view class="item">退款</view>
		<view class="item">已完成</view>
		<view class="item">已取消</view>
	</view>
	<view class="tagBox"></view> -->
	
	<view class="listBox">
		<view class="orderBox bgfff" v-for="item1,index1 in list" :key="index1">
			<view class="shopName flex flexbetween">
				订单号：{{item1.order_id}}
				<!-- <label>80秒</label> -->
			</view>
			<view class="orderItem flex" v-for="item2,index2 in item1.detailList" :key="index2"><!--  -->
				<view class="flexauto proImg flex flexcenter">
					<image :src="imgHost+item2.product_img" mode="aspectFill"></image>
				</view>
				<view class="flex1 proInfo flex flexbetween flex_dir_col">
					<view class="proName">{{item2.product_name}}</view>
					<view class="nums">X{{item2.num}}</view>
				</view>
				<view class="proPirce flex flexcenter flex_ac">
					<image src="../../static/red.png" mode="widthFix" style="width: 30rpx;margin-right: 5px;"></image>
				{{item2.price}}</view>
			</view>
			<view class="flex flexbetween other">
				<view class="time">{{$moment(item1.create_time).format('YYYY-MM-DD HH:mm:ss')}}</view>
				<view class="all">红包合计：{{item1.money}}</view>
			</view>
		</view>
		
		<view class="noList flex flex_dir_col flex_ac flexcenter" v-if="nodata">
			<image src="../../static/listNo.png" mode="widthFix" style="width: 150px;">
			暂无数据
		</view>
	</view>
</view>
</template>

<script>
	export default {
		data() {
			return {
				imgHost:this.imgHost,
				list: [],
				nodata:false,
			}
		},
		onShow() {
			uni.hideLoading()
		},
		onLoad() {
			uni.showLoading()
			this.$request({
				url: '/redapi/getOrder',
				data:{
					page:1
				},
				// method:'POST',
			}).then(ress=>{
				uni.hideLoading()
				this.list=ress.list
				if(ress.list.length==0){
					this.nodata=true
				}
			}).catch(error=>{
				uni.hideLoading()
				console.log(error);
			});
		},
		methods: {
			
		}
	}
</script>

<style scoped lang="scss">
	.noList{padding:100rpx 0;color: #AEAEAE;}
.tagBox{height: 40px;background-color: #F7F7F7;
	.item{line-height: 40px;flex: 1;text-align: center;font-size: 15px;}
	.item.on{font-weight: bold;border-bottom: 2px solid #f1af13;color: #f1af13;line-height: 38px;}
}
.listBox{padding:10px;}
.orderBox{border-radius: 5px;padding: 0 10px;margin-bottom: 10px;
	.shopName{height: 40px;line-height: 40px;font-size: 15px;font-weight: bold;
		label{color: #af0319;font-weight: normal;}
	}
	.orderItem{border-bottom: 1px solid #f7f7f7;padding:10px 0;
		.proImg{width: 60px;height: 70px;overflow: hidden;margin-right: 10px;
			image{width: 50px;}
		}
		.proInfo{
			.proName{color: #333;font-size: 15px;font-weight: bold;}
			.nums{font-size: 12px;color: #999;}
		}
	}
	.proPirce{font-size: 15px;font-weight: bold;}
	
	.other{padding:10px;
		.time{font-size: 12px;color: #aaa;}
		.all{font-size: 15px;font-weight: bold;}
	}
}


</style>
