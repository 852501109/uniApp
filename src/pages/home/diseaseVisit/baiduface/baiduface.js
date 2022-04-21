export default {
	methods: {
		//启动人脸识别流程
		startProcess() {
			this.checkRequestPermissions().then((res) => {
				return this.initFace()
			}).then(res => {
				return this.setFaceConfig()
			}).then(res => {
				return this.recycler()
			}).then(res => {
				return this.makeFaceCheck()
			}).catch(err => {
				console.log(err)
				this.$showToast(error.msg)
			})
		},
		//检查权限
		checkRequestPermissions() {
			const that = this
			const PPFace = uni.requireNativePlugin('PP-BaiduFaceV2');
			return new Promise((resolve, reject) => {
				PPFace.checkRequestPermissions(res => {
					that.msg = JSON.stringify(res)
					if (res.code === 200) {
						resolve(res)
					} else {
						reject(res)
					}
				})
			})
		},
		//初始化插件
		initFace() {
			const that = this
			const PPFace = uni.requireNativePlugin('PP-BaiduFaceV2');
			return new Promise((resolve, reject) => {
				PPFace.init({
					androidLicenseFileName: 'idl-license.face-android',
					androidLicenseId: 'kunyu-jymb-new-face-android',
					iosLicenseFileName: 'idl-license.face-ios',
					iosLicenseId: 'kunyu-jymb-new-face-ios',
				}, res => {
					that.msg = JSON.stringify(res)
					if (res.code === 200) {
						resolve(res)
					} else {
						reject(res)
					}
				})
			})
		},
		setFaceConfig() {
			const that = this
			const PPFace = uni.requireNativePlugin('PP-BaiduFaceV2');
			return new Promise((resolve, reject) => {
				PPFace.setFaceConfig({
					'VALUE_MIN_FACE_SIZE': 200, //设置可检测的最小人脸阈值 VALUE_MIN_FACE_SIZE 默认 200
					'VALUE_NOT_FACE_THRESHOLD': 0.6, // 设置可检测到人脸的阈值 VALUE_NOT_FACE_THRESHOLD 默认 0.6
					'VALUE_BLURNESS': 0.3, // 设置模糊度阈值 VALUE_BLURNESS 默认 0.3
					'VALUE_BRIGHTNESS': 82, // 设置光照阈值（范围0-255）VALUE_BRIGHTNESS 默认 82 
					'VALUE_OCCLUSION': 0.5, // 设置遮挡阈值 VALUE_OCCLUSION 默认 0.5
					'VALUE_HEAD_PITCH': 8, // 设置人脸姿态角阈值 VALUE_HEAD_PITCH 默认 8
					'VALUE_HEAD_YAW': 8, // 设置人脸姿态角阈值 VALUE_HEAD_YAW 默认 8
					'VALUE_CLOSE_EYES': 0.7, // 设置闭眼阈值 VALUE_CLOSE_EYES 默认 0.7 ios无效
					'VALUE_CACHE_IMAGE_NUM': 3, // 设置图片缓存数量 VALUE_CACHE_IMAGE_NUM 默认3
					'VALUE_OPEN_MASK': true, // 设置口罩判断开关 VALUE_OPEN_MASK 默认 true
					'VALUE_MASK_THRESHOLD': 0.7, // 设置口罩口罩阈值 VALUE_MASK_THRESHOLD 默认 0.7
					'VALUE_SCALE': 1.0, // 原图缩放系数 VALUE_SCALE 默认 1.0
					'VALUE_CROP_HEIGHT': 640, // 抠图高的设定，为了保证好的抠图效果，我们要求高宽比是4：3，所以会在内部进行计算，只需要传入高即可 VALUE_CROP_HEIGHT 默认640
					'VALUE_CROP_ENLARGERATIO': 1.5, // 抠图人脸框与背景比例 VALUE_CROP_ENLARGERATIO 默认1.5
					'livenessList': ['Eye', 'Mouth', 'HeadUp', 'HeadDown', 'HeadLeft', 'HeadRight',
						'HeadLeftOrRight'
					], //动作集合 livenessList 默认全部动作
					'isLivenessRandom': false, // 设置动作活体是否随机 isLivenessRandom 默认 false
					'isEnableSound': true, // 设置开启提示音 isEnableSound 默认 true
					'hasBottomText': true, // 设置是否显示底部文字 默认 true
					'bottomText': '— 这里文字可以修改也可以隐藏 —', // 设置底部文字内容 默认 "— 百度大脑技术支持 —"
					'COLOR_BG': '#8CD790', // 背景颜色 默认 #FFFFFF
					'COLOR_CIRCLE_LINE': '#77AF9C', //活体检测周围小竖线的颜色 默认 #CCCCCC
					'COLOR_CIRCLE_SELECT_LINE': '#285943', //活体检测周围小竖线完成后的颜色 默认 #00BAF2
					'topTextColor': '#383A3F', //顶部提示文字颜色 默认 #000000
					'topSecondTextColor': '#566270', // //顶部第二行小字提示颜色 默认 #666666
					'hasBottomImg': true, //是否显示底部图片 默认true（可通过替换res跟换图片）
				}, res => {
					that.msg = JSON.stringify(res)
					if (res.code === 200) {
						resolve(res)
					} else {
						reject(res)
					}
				})
			})
		},
		faceliveness() {
			const that = this
			const PPFace = uni.requireNativePlugin('PP-BaiduFaceV2');
			return new Promise((resolve, reject) => {
				PPFace.faceliveness({
					livenessList: ["Eye", "HeadLeft", "HeadLeftOrRight"], //活体要求动作集合
					isLivenessRandom: true, //是否开启动作随机
					isEnableSound: false //是否开启语音播报
				}, res => {
					if (res.code == 200) {
						if (res.base64Image) {
							that.img = 'data:image/jpg;base64,' + res.base64Image
						}
						if (res.base64ImageCrop) {
							that.img1 = 'data:image/jpg;base64,' + res.base64ImageCrop
						}
					}
					that.msg = JSON.stringify(res)
				})
			})
		},
		recycler() {
			const that = this
			const PPFace = uni.requireNativePlugin('PP-BaiduFaceV2');
			return new Promise((resolve, reject) => {
				PPFace.recycler({
					isEnableSound: false //是否开启语音播报
				}, res => {
					if (res.code == 200) {
						if (res.base64Image) {
							that.img = 'data:image/jpg;base64,' + res.base64Image
						}

						if (res.base64ImageCrop) {
							that.img1 = 'data:image/jpg;base64,' + res.base64ImageCrop
						}
					}
					that.msg = JSON.stringify(res)
					if (res.code === 200) {
						resolve(res)
					} else {
						reject(res)
					}
				})
			})
		},
		makeFaceCheck() {
			return new Promise((resolve, reject) => {
				getFaceRecognition({
					url: this.avaterURL.replace("/", "\/"),
					image2: (this.img1 || this.img).slice(22)
				}).then(res => {
					console.log(res)
					if (res.ret) {
						resolve(res)
					} else {
						reject(res)
					}
				}).catch(err => {
					reject(err)
				})
			})
		}
	}
}
