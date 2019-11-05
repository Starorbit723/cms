var vm = new Vue({
    el: '#rank_list',
    data () {
        var validateUrl = (rule, value, callback) => {
            var urlReg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
            if (value) {
                if (value.trim() == '#') {
                    callback();
                } else if (!urlReg.test(value)) {
                    callback(new Error('链接格式不正确'));
                } else {
                    callback();
                }
            } else {
                callback(new Error('链接为必填项'));
            }
        }
        return {
            //当前显示页面
            showChildPage:0,
            //图片基础地址
            picBaseUrl:'',
            //搜索文章列表提交
            timeRange:[], //时间需要特殊处理,并且同步到searchForm
            searchForm:{
                name:'',
                startTime:'',
                endTime:'',
                delStatus:'1',
            },
            //表格结果
            tableData: [{
                id:'',//主键
                name:'',//榜单名称
                meetId:'',//相关会议（内部ID）
                meetUrl:'',//会议链接地址
                coverImg:'',//封面图
                year:'',//年份
                province:'',//省
                city:'',//市
                publishAt:'',//发布时间
                description:'',//描述
                remark:'',//备注
                createUserId:'',//创建者
                updateUserId:'',//操作者
                updateAt:'',//修改时间
                createAt:'',//创建时间
                publishStatus:'0',//发布状态 0未发布，1是待发布，2是已发布 3是发布失败 4是待删除 5 删除
                delStatus:'1',//已删除1未删除,后端控制前端不做操作
            }],
            //分页器相关
            pagination1: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
            //新建编辑模板
            creatOrEdit: 'creat',//creat为新增，edit为修改
            rankForm:{
                id:'',//主键
                name:'',//榜单名称
                meetId:'',//相关会议（内部ID）
                meetUrl:'',//会议链接地址
                coverImg:'',//封面图
                year:'',//年份
                province:'',//省
                city:'',//市
                publishAt:'',//发布时间
                description:'',//描述
                remark:'',//备注
                createUserId:'',//创建者
                updateUserId:'',//操作者
                updateAt:'',//修改时间
                createAt:'',//创建时间
                publishStatus:'0',//发布状态 0未发布，1是待发布，2是已发布 3是发布失败 4是待删除 5 删除
                delStatus:'1',//已删除1未删除,后端控制前端不做操作
            },
            rankFormRules:{
                name: [
                    { required: true, message: '标题不能为空', trigger: 'change' }
                ],
                description:[
                    { required: true, message: '描述不能为空', trigger: 'change' }
                ],
                coverImg:[
                    { required: true, message: '榜单封面图为必选项', trigger: 'change' }
                ],
                meetUrl:[
                    { required: true, validator: validateUrl, trigger: 'change' }
                ],
                publishAt:[
                    { required: true, message: '发布时间为必填项', trigger: 'change' }
                ]
            },
            //封面图库相关
            showCoverimgLib:false,
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
        console.log('location',window.location.href)
        if (window.location.href.indexOf('chinaventure.com.cn') !== -1 || window.location.href.indexOf('117.78.28.103') !== -1) {
            console.log('正式环境')
            this.picBaseUrl = 'https://chinaventure-static.obs.cn-north-1.myhuaweicloud.com'
        } else {
            console.log('开发测试环境')
            this.picBaseUrl = 'https://cvinfo-test.obs.cn-north-1.myhuaweicloud.com'
        }
        this.startSearch(0)
    },
    methods:{
        openUrlRankPage(item) {
            if(item.publishStatus == 2) {
                window.open('https://www.chinaventure.com.cn' + item.rankUrl, "newwindow")
            }
        },
        handleCurrentChange (val) {
            this.pagination1.currPage = val
            this.startSearch() 
        },
        //开始搜索
        startSearch (type) {
            var self = this
            var data = self.searchForm
            data.name = data.name.toString().trim()
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
                url: "/rank/list",
                contentType: "application/json",
			    data: JSON.stringify(data),
			    dataType: "json",
			    success: function(res){
					if(res.code == 200){
                        self.tableData = res.page.list
                        for (let i = 0; i < self.tableData.length; i++){
                            self.tableData[i].updateAt = self.transformTime(parseFloat(self.tableData[i].updateAt))
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
        //新增总榜单
        creatNewRank () {
            this.creatOrEdit = 'creat'
            this.showChildPage = 1
        },
        //打开封面图库弹层
        openAddCoverImg () {
            this.showCoverimgLib = true
            this.searchCoverImg(0)
        },
        //搜索封面图库
        searchCoverImg (type){
            var self = this
            var data = self.searchCoverimgForm
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
                    console.log(res)
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
        //选择了某一张封面图片
        addThisCoverImg (item) {
            this.rankForm.coverImg = item.picUrl
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
        handleCurrentChange2 (val) {
            this.pagination2.currPage = val
            this.searchCoverImg()
        },
        //提交新建或保存
        creatOrEditSave(formName){
            var self = this
            self.$refs[formName].validate((valid) => {
                if (valid) {
                    var data = self.rankForm
                    data.publishAt = data.publishAt.toString()
                    data.year = new Date(parseInt(data.publishAt)).getFullYear()
                    console.log('year',data)
                    //新建
                    if (self.creatOrEdit == 'creat') {
                        $.ajax({
                            type: "POST",
                            contentType: "application/json",
                            url: "/rank/save",
                            data: JSON.stringify(data),
                            dataType: "json",
                            success: function(res){
                                console.log(res)
                                if(res.code == 200){
                                    self.$message.success('保存成功')
                                    self.startSearch()
                                    self.closeToMainpage('rankForm')
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
                    //修改
                    } else if (self.creatOrEdit == 'edit') {
                        $.ajax({
                            type: "POST",
                            contentType: "application/json",
                            url: "/rank/update",
                            data: JSON.stringify(data),
                            dataType: "json",
                            success: function(res){
                                console.log(res)
                                if(res.code == 200){
                                    self.$message.success('保存成功')
                                    self.startSearch()
                                    self.closeToMainpage('rankForm')
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
                    
                }
            })
        },
        closeToMainpage (formName) {
            this.startSearch()
            this.creatOrEdit = 'creat'
            this.$refs[formName].resetFields();
            this.showChildPage = 0
            this.rankForm = {
                id:'',//主键
                name:'',//榜单名称
                meetId:'',//相关会议（内部ID）
                meetUrl:'',//会议链接地址
                coverImg:'',//封面图
                year:'',//年份
                province:'',//省
                city:'',//市
                publishAt:'',//发布时间
                description:'',//描述
                remark:'',//备注
                createUserId:'',//创建者
                updateUserId:'',//操作者
                updateAt:'',//修改时间
                createAt:'',//创建时间
                publishStatus:'0',//发布状态 0未发布，1是待发布，2是已发布 3是发布失败 4是待删除 5 删除
                delStatus:'1',//已删除1未删除,后端控制前端不做操作
            }
        },
        //编辑总榜单
        editThisRank (item) {
            var self = this
            self.creatOrEdit = 'edit'
            $.ajax({
				type: "POST",
                url: "/rank/info/" + item.id.toString(),
                contentType: "application/json",
			    dataType: "json",
			    success: function(res){
					if(res.code == 200){
                        self.rankForm = res.dict
                        self.rankForm.coverImg = self.picBaseUrl + self.rankForm.coverImg
                        self.showChildPage = 1
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
        //跳转至榜单编辑页面
        linkToEditPage (item) {
            setCookie ('createditrank', item.id.toString(), 1)
            window.parent.location.href = '/index.html#modules/rank/edit_rank.html'
        },
        //发布上线
        onlineThisRank(item) {
            var self = this
            self.$confirm('确实要发布上线此榜单吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = {
                    id: item.id.toString(),
                    publishStatus: '1', //待发布
                    publishAt:item.publishAt,
                    year:item.year
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/rank/push",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res){
                        console.log(res)
                        if(res.code == 200){
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
        offlineThisRank(item) {
            var self = this
            self.$confirm('确实要下线此榜单吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = {
                    id: item.id.toString(),
                    publishStatus: '4' //未发布
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/rank/offline",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res){
                        console.log(res)
                        if(res.code == 200){
                            self.startSearch()
                        } else {
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
        deleteThisRank (item) {
            var self = this
            self.$confirm('确实要删除此榜单吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = {
                    id: item.id.toString(),
                    type: 0 //删除的类型 0榜单 1目录 2 案例榜单 3 案例榜单关系 4 机构榜单 5任务榜单 6 服务机构榜单
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/rank/updateStatus",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res){
                        console.log(res)
                        if(res.code == 200){
                            self.startSearch()
                        } else {
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