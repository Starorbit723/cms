var vm = new Vue({
    el: '#vtalk_list',
    data () {
        var validateUrl = (rule, value, callback) => {
            var urlReg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
            if (value =='') {
                callback(new Error('链接不能为空'));
            } else if (!urlReg.test(value)) {
                callback(new Error('链接格式不正确'));
            } else {
                callback();
            }
        }
        var validatePriority = (rule, value, callback) => {
            var urlReg = /^[0-9]*[1-9][0-9]*$/;
            if (value !== '' && value == '-1') {
                callback();
            } else if (value !== '' && !urlReg.test(value)) {
                callback(new Error('权重需改为正整数或-1,-1代表权重最低'));
            } else {
                callback();
            }
        }
        return {
            //展示封面图库
            showCoverimgLib:false,
            //展示新建或修改
            showCreatEditDialog: false,
            showCreatEditDialogTitle:'新建内容',
            //搜索文章列表提交
            timeRange:[], //时间需要特殊处理,并且同步到searchForm
            searchForm:{
                talkTitle:'',//标题
                startTime:'',//开始时间
                endTime:'',//结束时间
                talkStatus: ['0','1']
            },
            //表格结果
            tableData: [{
                talkId:'',//主键
                talkTitle:'',//标题
                talkImg:'',//头图
                talkLabel:'',//标签
                talkCrtUserId:'',//创建人编号
                talkModUserId:'',//更新人编号
                talkCrtTime:'',//创建时间
                talkModTime:'',//更新时间
                talkStatus:'',//0 上线 1下线 2删除
                userName:'',//创建人名称
                talkLink:'',//链接
                talkReleaseTime:'',//发布时间
                talkPriority:'',//权重
                talkMLink:'',//M站链接
                talkDate:''//自定义发布时间
            }],
            //分页器相关
            pagination1: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
            //新建或修改表单项
            creatEditForm:{
                talkId:'',//主键
                talkTitle:'',//标题
                talkImg:'',//头图
                talkLabel:'',//标签
                talkCrtUserId:'',//创建人编号
                talkModUserId:'',//更新人编号
                talkCrtTime:'',//创建时间
                talkModTime:'',//更新时间
                talkStatus:'',//0 上线 1下线 2删除
                userName:'',//创建人名称
                talkLink:'',//链接
                talkReleaseTime:'',//发布时间
                talkPriority:'',//权重
                talkMLink:'',//M站链接
                talkDate:''//自定义发布时间
            },
            creatEditFormRules:{
                talkTitle: [
                    { required: true, message: '标题不能为空', trigger: 'change' },
                    { max: 100, message: '您输入的字数超过100个字', trigger: 'change' }
                ],
                talkImg:[
                    { required: true, message: '请选择封面图', trigger: 'change' },
                ],
                talkLink:[
                    { required: true, validator: validateUrl, trigger: 'change' }
                ],
                talkMLink:[
                    { required: true, validator: validateUrl, trigger: 'change' }
                ],
                talkPriority:[
                    { validator: validatePriority, trigger: 'change' }
                ],
                talkDate:[
                    { required: true, message: '发布时间不能为空', trigger: 'change' }
                ]
            },
            //封面图库相关
            searchCoverimgForm:{
                picTitle:'',
                picType:'0'//0封面图库 1内容图库 2图为图库
            },
            coverimgTableData:[],
            pagination2: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
        }
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
        handleCurrentChange2 (val) {
            this.pagination2.currPage = val
            this.searchCoverImg()
        },
        //开始搜索
        startSearch (type) {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchForm))
            data.talkTitle = data.talkTitle.toString().trim()
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
                url: "/talk/list",
                contentType: "application/json",
			    data: JSON.stringify(data),
			    dataType: "json",
			    success: function(res){
					if(res.code == 200){
                        self.tableData = res.page.list
                        for (let i = 0; i < self.tableData.length; i++){
                            self.tableData[i].talkCrtTime = self.transformTime(parseInt(self.tableData[i].talkCrtTime))
                            self.tableData[i].talkReleaseTime = self.transformTime(parseInt(self.tableData[i].talkReleaseTime))
                        }
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
        //新建或编辑内容
        creatOrEdit (type,item) {
            if (type == 'creat') {
                this.showCreatEditDialogTitle = '新建内容'
                this.showCreatEditDialog = true
            } else if (type == 'edit') {
                //请求item原始数据,相关时间字段已经转换成标准格式不能提交
                this.reqItemOrign(item.talkId)
            }
        },
        //请求单条原始数据
        reqItemOrign(id){
            var self = this
            $.ajax({
                type: "POST",
                url: '/talk/info/' + id.toString(),
                contentType: "application/json",
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.showCreatEditDialogTitle = '编辑内容'
                        self.showCreatEditDialog = true
                        self.creatEditForm = res.dict
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
        //新建/编辑Vtalk列表项   type:0  保存，  type:1 保存并发布
        saveVtalkForm (formName,type){
            var self = this
            self.$refs[formName].validate((valid) =>{
                if (valid) {
                    //如果保存时权重为'',变成'-1'
                    if (self.creatEditForm.talkPriority.trim() == '') {
                        self.creatEditForm.talkPriority = '-1'
                    }
                    //去掉标题头尾空格
                    self.creatEditForm.talkTitle = self.creatEditForm.talkTitle.trim()
                    if (self.showCreatEditDialogTitle == '新建内容') {
                        var reqUrl = '/talk/save'
                    } else if (self.showCreatEditDialogTitle == '编辑内容') {
                        var reqUrl = '/talk/update'
                    }
                    $.ajax({
                        type: "POST",
                        url: reqUrl,
                        contentType: "application/json",
                        data: JSON.stringify(self.creatEditForm),
                        dataType: "json",
                        success: function(res){
                            if(res.code == 200){
                                console.log(res)
                                if (self.showCreatEditDialogTitle == '新建内容') {
                                    if (type == 0 ) {
                                        self.$message.success('保存成功')
                                        self.closeVtalkForm(formName)
                                        self.startSearch()
                                    } else if (type == 1) {
                                        self.creatEditForm.talkId = res.talkId
                                        self.submitVtalk()
                                    }
                                } else if (self.showCreatEditDialogTitle == '编辑内容') {
                                    if (type == 0 ) {
                                        self.$message.success('保存成功')
                                        self.closeVtalkForm(formName)
                                        self.startSearch()
                                    } else if (type == 1) {
                                        self.submitVtalk()
                                    }
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

                }
            })

        },
        //连续提交发布
        submitVtalk () {
            
            var self = this
            console.log(self.creatEditForm.talkId)
            var data = {
                talkId: self.creatEditForm.talkId.toString(),
                talkReleaseTime: new Date().getTime(),
                talkStatus: '0'
            }
            $.ajax({
                type: "POST",
                url: "/talk/update",
                contentType: "application/json",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.$message.success('发布成功')
                        self.startSearch()
                        self.closeVtalkForm('creatEditForm')
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
        //关闭并清除表单
        closeVtalkForm (formName) {
            this.$refs[formName].resetFields()
            this.showCreatEditDialog = false,
            this.showCreatEditDialogTitle = '新建内容',
            this.creatEditForm = {
                talkId:'',//主键
                talkTitle:'',//标题
                talkImg:'',//头图
                talkLabel:'',//标签
                talkCrtUserId:'',//创建人编号
                talkModUserId:'',//更新人编号
                talkCrtTime:'',//创建时间
                talkModTime:'',//更新时间
                talkStatus:'',//0 上线 1下线 2删除
                userName:'',//创建人名称
                talkLink:'',//链接
                talkReleaseTime:'',//发布时间
                talkPriority:''//权重
            }
        },
        //删除
        deleteThisVtalk (item) {
            var self = this
            self.$confirm('确实要删除此Vtalk吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = {
                    talkId: item.talkId.toString(),
                    talkStatus: '2'
                }
                $.ajax({
                    type: "POST",
                    url: "/talk/update",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            self.$message.success('删除成功')
                            self.startSearch()
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
            })
        },
        //发布上线
        onlineThisVtalk (item) {
            var self = this
            self.$confirm('确实要发布此Vtalk吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = {
                    talkId: item.talkId.toString(),
                    talkReleaseTime: new Date().getTime(),
                    talkStatus: '0'
                }
                $.ajax({
                    type: "POST",
                    url: "/talk/update",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            self.$message.success('发布成功')
                            self.startSearch()
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
            })
        },
        //下线
        offlineThisVtalk (item) {
            var self = this
            self.$confirm('确实要下线此Vtalk吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = {
                    talkId: item.talkId.toString(),
                    talkStatus: '1'
                }
                $.ajax({
                    type: "POST",
                    url: "/talk/update",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            self.$message.success('下线成功')
                            self.startSearch()
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
            })
        },
        //打开封面图库弹层
        openAddCoverImg () {
            this.showCoverimgLib = true
            this.searchCoverImg(0)
        },
        //选择了某一张封面图片
        addThisCoverImg (item) {
            this.$refs['creatEditForm'].clearValidate();
            this.creatEditForm.talkImg = item.picUrl
            this.backToEdit()
        },
        //返回编辑页
        backToEdit (){
            this.showCoverimgLib = false
            this.searchCoverimgForm = {
                picTitle:'',
                picType:'0'//0封面图库 1内容图库 2图为图库
            }
            this.coverimgTableData = []
            this.pagination2 = {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            }
        },
        //搜索封面图库
        searchCoverImg (type){
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchCoverimgForm))
            data.picTitle = data.picTitle.trim()
            if (type == 0) {
                Object.assign(data,{
                    page: '1',
                    limit: self.pagination2.pageSize.toString()
                })
            } else {
                Object.assign(data,{
                    page: self.pagination2.currPage.toString(),
                    limit: self.pagination2.pageSize.toString()
                })
            }
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "/picture/list",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.coverimgTableData = res.page.list
                        self.pagination2 = {
                            currPage: res.page.currPage,
                            totalCount:res.page.totalCount,
                            totalPage:res.page.totalPage,
                            pageSize:res.page.pageSize
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
        //跳转至详情
        openUrlvTalkPage(item){
            if(item.talkStatus == 0){
                window.open(item.talkLink, "newwindow")
            }
        },
        //时间格式转换工具
        transformTime (timestamp = +new Date()) {
            if (timestamp) {
                var time = new Date(timestamp);
                var y = time.getFullYear();
                var M = time.getMonth() + 1;
                var d = time.getDate();
                var h = time.getHours();
                var m = time.getMinutes();
                var s = time.getSeconds();
                return y + '-' + this.addZero(M) + '-' + this.addZero(d) + ' ' + this.addZero(h) + ':' + this.addZero(m) + ':' + this.addZero(s);
              } else {
                  return '';
              }
        },
        addZero (m) {
            return m < 10 ? '0' + m : m;
        }
        
    }
})