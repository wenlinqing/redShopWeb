<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	view{box-sizing: border-box;}
	text,image{box-sizing: border-box;}
	image{height: 100%;}
	page{font-size: 14px;color: #333;background-color: #f7f7f7;height: 100vh;}
	.bgfff{background:#fff!important}
	.flex{display: flex;-webkit-display:flex;}
	.flex_ac{align-items: center;}
	.flexcenter{justify-content: center;}
	.flexbetween{justify-content: space-between;}
	.fixed{position: fixed;top: 0;width: 100%;z-index: 999;left: 50%;-webkit-transform: translateX(-50%);}
	.fixed_bottom{position: fixed;bottom: 0;left: 0;width: 100%;z-index: 99;}
	.fixed_center{position: fixed;top: 50%;left: 50%;width: 100%;z-index: 91;-webkit-transform:translate(-50%,-50%);}
	.flex1{flex:1;}
	.txtelli{overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
	.flexauto{flex: 0 0 auto;}
	.flex_dir_col{flex-direction: column;}
	.flexend{justify-content: flex-end;}
	
</style>
