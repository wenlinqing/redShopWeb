<template>
<view>
	<video class="video" :src="src" autoplay controls></video>
</view>
</template>

<script>
	export default{
		data(){
			return{
				src:'',
			}
		},
		onLoad(option) {
			// console.log("option===",decodeURIComponent(option.src))
			this.src = option.src
		},
	}
</script>

<style scoped lang="scss">
.video{width: 100vw;height: 100vh;}
</style>
