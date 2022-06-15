
// var baseUrl = 'http://localhost:4000' // 测试环境 http://weitingshop.cngo.com:9999/  https://mjgb.mojivip.com
var baseUrl = 'https://www.hj19800.com'


function request(options){

	// var userInfo=uni.getStorageSync('userInfo')?JSON.parse(uni.getStorageSync('userInfo')):{}
	let headers={
		"Content-Type" : "application/x-www-form-urlencoded"
	}
	headers['Authorization'] = uni.getStorageSync('token');

	return new Promise((res,rej)=>{
		uni.request({
			url:baseUrl + options.url,
			// url:options.url,
			method:options.method || 'GET',
			data:options.data,
			// sslVerify: false,
			header:headers,
			success(data) {
				// console.log('data.data=====', data.data)
				if(data.data.code==200){
					res(data.data)
				}else if(data.data.code==401){
					uni.removeStorageSync('token')
					rej(data.data)
				}else{
					rej(data.data)
				}
			},
			fail(err) {
				rej(err)
			}
		})
	})
}
export default request;