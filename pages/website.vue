<template>
<web-view :src="src"></web-view>
</template>

<script>
	export default{
		data(){
			return{
				src:'',
			}
		},
		onLoad(option) {
			console.log("option===",decodeURIComponent(option.src))
			this.src = decodeURIComponent(option.src)
		},
	}
</script>

<style scoped lang="scss">
.contBox{}
</style>
