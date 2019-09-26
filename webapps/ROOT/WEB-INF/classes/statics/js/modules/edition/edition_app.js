var vm = new Vue({
    el: '#edition_app',
    data: {
        //搜索文章列表提交
        timeRange:[], //时间需要特殊处理,并且同步到searchForm
        platformOptions:[{
            label:'安卓',
            value: 0
        },{
            label:'IOS',
            value: 1
        }],
        uplevelWayOptions:[{
            label:'提示升级',
            value: 0
        },{
            label:'强制升级',
            value: 1
        }],
        appChannelOptions:[{
            label:'苹果AppStore',
            value: 0
        },{
            label:'安卓华为应用市场',
            value: 1
        },{
            label:'安卓小米应用市场',
            value: 2
        }],
        //向下兼容版本下拉
        confitableVersion:[],
        searchForm:{
            versionName:'',//标题
            platformType:'',//0安卓，1IOS
            versionStatus: 0//版本状态 0正常1删除
        },
        multipleSelection: [],
        //表格结果
        tableData: [{
            id:'',//主键
            platformType:'',//平台 0安卓 1ios
            upgrade:'',//升级方式 0提示升级 1强制升级
            versionName:'',//版本名称
            versionNumber:'',//版本号
            versionUrl:'',//下载地址
            versionChannel:'',//所属渠道
            versionIds:'',//向下兼容版本
            updateDesc:'',//更新内容
            crtUserId:'',//创建用户编号
            crtTime:'',//创建时间
            modUserId:'',//更新用户编号
            modTime:'',//更新时间
            versionStatus:''//版本状态 0正常1删除
        }],
        //分页器相关
        pagination1: {
            currPage: 1,
            totalCount:0,
            totalPage:0,
            pageSize:10
        },
        //版本表单
        showCreatEdtion:false,
        creatOrEdit:'creat',
        edtionForm:{
            id:'',//主键
            platformType:'',//平台 0安卓 1ios
            upgrade:'',//升级方式 0提示升级 1强制升级
            versionName:'',//版本名称
            versionNumber:'',//版本号
            versionUrl:'',//下载地址
            versionChannel:'',//所属渠道
            versionIds:'',//向下兼容版本
            updateDesc:'',//更新内容
            crtUserId:'',//创建用户编号
            crtTime:'',//创建时间
            modUserId:'',//更新用户编号
            modTime:'',//更新时间
            versionStatus:''//版本状态 0正常1删除
        },
        edtionFormRules:{
            platformType: [
                { required: true, message: '请选择平台类型', trigger: 'change' }
            ],
            upgrade: [
                { required: true, message: '请选择升级方式', trigger: 'change' }
            ],
            versionName:[
                { required: true, message: '请填写版本名称', trigger: 'change' }
            ],
            versionChannel:[
                { required: true, message: '请填写所属渠道', trigger: 'change' }
            ],
            versionNumber: [
                { required: true, message: '请填写版本号', trigger: 'change' }
            ],
            // versionIds: [
            //     { required: true, message: '请填写向下兼容版本', trigger: 'change' }
            // ]
        },
        //更新内容列表中间层变量
        updateDescList:[{
            str:''
        }],
    },
    watch: {
        timeRange (val) {
            console.log(val)
            if (val) {
                this.searchForm.startTime = val[0]
                this.searchForm.endTime = val[1]
            } else {
                this.searchForm.startTime = ''
                this.searchForm.endTime = ''
            }
            console.log(this.searchForm)
        }
    },
    created () {
        this.startSearch(0)
    },
    methods:{
        handleCurrentChange (val) {
            this.pagination1.currPage = val
            this.startSearch() 
        },
        //平台发生变化请求当前平台的所有版本
        changePlatform (val) {
            var self = this
            var data = {
                version_status: '0',
                platform_type: self.edtionForm.platformType.toString()
            }
            $.ajax({
				type: "POST",
                url: "/version/allList",
                contentType: "application/json",
			    data: JSON.stringify(data),
			    dataType: "json",
			    success: function(res){
					if(res.code == 200){
                        self.confitableVersion = res.list
					}else{
						mapErrorStatus(res)
                        vm.error = true;
                        vm.errorMsg = res.msg;
                    }
                },
                error:function(res){
                    mapErrorStatus(res)
                }
			});
        },
        //多选选择器
        handleSelectionChange (val) {
            console.log(val)
        },
        //开始搜索
        startSearch (type) {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchForm))
            data.versionName = data.versionName.toString().trim()
            data.versionStatus = data.versionStatus.toString()
            data.platformType = data.platformType.toString()
            if (type == 0) {
                Object.assign(data,{
                    page: '1',
                    limit: self.pagination1.pageSize.toString()
                })
            } else {
                Object.assign(data,{
                    page: self.pagination1.currPage.toString(),
                    limit: self.pagination1.pageSize.toString()
                })
            }
            $.ajax({
				type: "POST",
                url: "/version/list",
                contentType: "application/json",
			    data: JSON.stringify(data),
			    dataType: "json",
			    success: function(res){
					if(res.code == 200){
                        self.tableData = res.page.list
                        self.pagination1 = {
                            currPage: res.page.currPage,
                            totalCount:res.page.totalCount,
                            totalPage: res.page.totalPage,
                            pageSize: res.page.pageSize
                        }
					}else{
						mapErrorStatus(res)
                        vm.error = true;
                        vm.errorMsg = res.msg;
                    }
                },
                error:function(res){
                    mapErrorStatus(res)
                }
			});
        },
        //新建版本
        creatNewEdition () {
            this.showCreatEdtion = true
            this.creatOrEdit = 'creat'
        },
        //新建修改版本提交
        ensureEdition () {
            var self = this
            //组合更新内容条目
            var updateDescPinStr = ''
            for (let i = 0; i < this.updateDescList.length; i++) {
                if (this.updateDescList[i].str !== '' && (i !== this.updateDescList.length -1)) {
                    updateDescPinStr += this.updateDescList[i].str + '#'
                } else if (this.updateDescList[i].str !== '' && (i == this.updateDescList.length -1)) {
                    updateDescPinStr += this.updateDescList[i].str
                } else {
                    self.$message.error('更新内容条目不能为空')
                    return false
                }
            }
            console.log(updateDescPinStr)
            //如果是安卓平台，地址是必填项
            if (self.edtionForm.platformType == 0 && self.edtionForm.versionUrl == '') {
                self.$message.error('安卓平台下载地址不能为空')
                return false
            }
            var data = JSON.parse(JSON.stringify(self.edtionForm))
            data.updateDesc = updateDescPinStr
            //判断是新建还是修改
            if (self.creatOrEdit == 'creat') {
                var reqUrl = '/version/save'
            } else if (self.creatOrEdit == 'edit') {
                var reqUrl = '/version/update'
            }
            self.$refs['edtionForm'].validate((valid) => {
                if (valid) {
                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        url: reqUrl,
                        data: JSON.stringify(data),
                        dataType: "json",
                        success: function(res){
                            if(res.code == 200){
                                self.$message.success('新建版本成功');
                                self.startSearch() //请求列表回显
                                self.cancelEdition()
                            } else {
                                mapErrorStatus(res)
                                vm.error = true;
                                vm.errorMsg = res.msg;
                            }
                        },
                        error:function(res){
                            mapErrorStatus(res)
                        }
                    })
                    
                }
            })
           
        },
        //取消关闭弹框，清楚数据
        cancelEdition () {
            this.$refs['edtionForm'].resetFields()
            this.showCreatEdtion = false
            this.creatOrEdit = 'creat'
            this.updateDescList = [{
                str:''
            }]
            this.confitableVersion = []
            this.edtionForm = {
                id:'',//主键
                platformType:'',//平台 0安卓 1ios
                upgrade:'',//升级方式 0提示升级 1强制升级
                versionName:'',//版本名称
                versionNumber:'',//版本号
                versionUrl:'',//下载地址
                versionChannel:'',//所属渠道
                versionIds:'',//向下兼容版本
                updateDesc:'',//更新内容
                crtUserId:'',//创建用户编号
                crtTime:'',//创建时间
                modUserId:'',//更新用户编号
                modTime:'',//更新时间
                versionStatus:''//版本状态 0正常1删除
            }
        },
        //编辑这个
        editThisVersiion (item) {
            var self = this
            //赋原始值
            self.edtionForm = JSON.parse(JSON.stringify(item))
            self.edtionForm.versionIds = parseFloat(self.edtionForm.versionIds)
            let tempArr = self.edtionForm.updateDesc.split('#')
            this.updateDescList = []
            for (let i = 0 ; i < tempArr.length; i ++) {
                self.updateDescList.push({
                    str: tempArr[i]
                })
            }
            //获取当前最低兼容版本option
            self.changePlatform()
            this.showCreatEdtion = true
            this.creatOrEdit = 'edit'
            console.log(self.edtionForm,tempArr)
        },
        //删除此渠道
        deleteThisVersiion (item) {
            var self = this
            self.$confirm('确实要删除此渠道吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = {
                    id: item.id.toString(),
                    platformType: item.platformType.toString(),
                    versionStatus: "1"
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/version/update",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            self.$message.success('删除成功');
                            self.startSearch() //请求列表回显
                        } else {
                            mapErrorStatus(res)
                            vm.error = true;
                            vm.errorMsg = res.msg;
                        }
                    },
                    error:function(res){
                        mapErrorStatus(res)
                    }
                })
                
            })
        },
        //添加一个新条目
        addNewItem () {
            if (this.updateDescList[this.updateDescList.length -1].str !== '') {
                this.updateDescList.push({
                    str: ''
                })
            }
        },
        //删除条目
        deleteThisItem (index) {
            console.log(index)
            if (this.updateDescList.length > 1) {
                this.updateDescList.splice(index,1);
            }
            
        }
        
        
    }
})