var vm = new Vue({
	el: "#app",
	data: {
		yuanshi: 'YUANSHI',
		yuanshidir: [],
		selectyuanshi: [],
		pici: "",
		isAll:"",
		piciPage: {
			page: 1,
			limit: 10,
			filter: {

			}
		},
		piciList: [],
		workInfo: '暂无信息',
		nowWorkId: '',
		result: {

		}
	},
	methods: {
		createIndexPage(){
			this.showLoading();
			dao.createIndexPage({}).done(function(res){
				vm.hideLoading();
				if(res.success){
					alert("生成首页成功！")
				}else{
					alert("生成首页失败！")
				}
			})
		},
		getPiciList: function() {
			dao.piciList({}).done(function(res) {
				if(res.success) {
					vm.piciList = res.items;
				} else {
					alert("失败！")
				}
			})
		},
		getDir: function() {
			this.showLoading();
			dao.getDir({
				dir: this.yuanshi
			}).done(function(res) {
				if(res.success) {
					vm.yuanshidir = res.items;
					vm.hideLoading();
				} else {
					alert("失败！")
				}
			})
		},
		getFull: function() {
			if(this.selectyuanshi.length == 0) {
				alert("至少选择一个批次");
			} else {
				dao.getFull({
					data: JSON.stringify(this.selectyuanshi),
					dir: this.yuanshi
				}).done(function(res) {
					if(res.success) {
						window.open(GLOBAL.URL + "ExcelSql/getFile?del=true&url=" + res.fileName);
					} else {
						alert("出错！")
					}
				})
			}
		},
		cleanBox() {
			this.selectyuanshi = [];
		},
		upPici: function() {

		},
		//一键更新数据
		updatePICI: function(param) {
			this.showLoading();
			dao.updatePICI({pici:param}).done(function(res) {
				vm.hideLoading();
				if(res.success) {
					vm.getPiciList();
				} else {
					alert("出错")
				}
			})
		},
		formatDate: function(oldTime) {
			console.log("oldTime:" + oldTime)
			if(oldTime){
				return oldTime.slice(0, 4) + "-" + oldTime.slice(4, 6) + "-" + oldTime.slice(6, 8) + " " + oldTime.slice(8, 10) + ":" + oldTime.slice(10, 12);

			}else{
				return "加载错误";
			}
		},
		preWork: function(pici, isAll) {
			dao.preWork({
				pici: pici
			}).done(function(res) {
				if(res.success) {
					if(res.canGo) {
						vm.work(pici, isAll);
						vm.getPiciList();
					} else {
						alert("等待加工完成");
					}
				} else {
					alert("失败！")
				}
			})
		},
		work: function(pici, isAll) {
			dao.work({
				pici: pici,
				isAll: isAll
			}).done(function(res) {
				alert("加工完成");
				vm.getPiciList();
			})
		},
		getWorkInfo: function(workId) {
			if(workId) {
				this.nowWorkId = workId;
			}
			dao.getWorkInfo({
				ID: this.nowWorkId
			}).done(function(res) {
				if(res.success) {
					vm.workInfo = res.info;
				} else {
					vm.workInfo = "通信失败";
				}
			})
		},
		getResult: function(result,piciName) {
			this.result = result;
			this.result.NAME = piciName;
		},
		showLoading: function(loadText) {
			if(!loadText) {
				$("#loadText").html(loadText)
			}
			$('#loadingModal').modal({
				backdrop: 'static',
				keyboard: false
			});
		},
		hideLoading:function() {
			$('#loadingModal').modal('hide');
		},
		setPI:function(pici,isAll){
			this.pici=pici;
			this.isAll=isAll;
		},
		getResultClass:function(TIFNUM,TIFNUMJ,STATUS){
			if(STATUS=='加工完毕' && TIFNUM == TIFNUMJ){
				return 'success';
			}else if(STATUS=='加工完毕' && TIFNUM != TIFNUMJ){
				return 'error';
			}else if(STATUS == '加工中'){
				return 'working'
			}else{
				return 'normal'
			}
		}
	},
	computed: {

	},
	mounted() {
		this.getDir();
		this.getPiciList();	
		setInterval(() => {
			this.getPiciList();	
		}, 30000);
	}
})