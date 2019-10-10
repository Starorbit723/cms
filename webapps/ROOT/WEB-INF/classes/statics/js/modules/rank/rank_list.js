var vm = new Vue({
    el: '#rank_list',
    data: {
        //当前显示页面
        showChildPage:0,
        //搜索文章列表提交
        timeRange:[], //时间需要特殊处理,并且同步到searchForm
        searchForm:{
            name:'',
            startTime:'',
            endTime:''
        },
        //表格结果
        tableData: [{
            id:'',//编号
            name:'',//名称
            content:'',//内容
            type:'',//分类
            crtTime:'',//创建时间
            modTime:'',//修稿时间
            parentId:'',//父级编号
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
        templateForm:{
            id:'',//编号
            name:'',//名称
            content:'',//内容
            type:'',//分类
            crtTime:'',//创建时间
            modTime:'',//修稿时间
            parentId:'',//父级编号
        },
        templateFormRules:{
            name: [
                { required: true, message: '标题不能为空', trigger: 'change' }
            ],
            content:[
                { required: true, message: '内容不能为空', trigger: 'change' }
            ]
        },
        //关联的INC列表
        incTableData:[{
            id:'',//主键编号
            name:'',//inc名称
            content:'',//inc内容
            templateId:'',//模板编号
            url:'',//请求接口url
            address:'',//inc模板目录
            type:'',//inc分类
            para:'',//参数
        }],
        //搜索INC的列表
        incsearchForm:{
            name:''
        },
        multipleSelection: [],
        incSearchTableData:[{
            id:'',//主键编号
            name:'',//inc名称
            content:'',//inc内容
            templateId:'',//模板编号
            url:'',//请求接口url
            address:'',//inc模板目录
            type:'',//inc分类
            para:'',//参数
        }],
        //分页器相关
        pagination2: {
            currPage: 1,
            totalCount:0,
            totalPage:0,
            pageSize:10
        },
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
                url: "/template/list",
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
        //新增总榜单
        creatNewRank () {
            this.creatOrEdit = 'creat'
            this.showChildPage = 1
        },
        //编辑总榜单
        editThisRank (item) {
            var self = this
            self.creatOrEdit = 'edit'
            var data = {
                templateId:templateId.toString(),
                page:'1',
                limit:'1000'
            }
            $.ajax({
				type: "POST",
                url: "/inc/list",
                contentType: "application/json",
			    data: JSON.stringify(data),
			    dataType: "json",
			    success: function(res){
					if(res.code == 200){
                        self.incTableData = res.page.list
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
            setCookie ('createditrank', 123111, 1)
            window.parent.location.href = '/index.html#modules/rank/edit_rank.html'
        },
        //发布上线
        uplineThisRank(item) {
            var self = this
            self.$confirm('确实要发布上线此榜单吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                
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
                
            })
        },
        //打开添加INC页面
        addIncToTemplate () {
            this.showChildPage = 2
            this.startSearchInc()
        },
        //开始搜索
        startSearchInc (type) {
            var self = this
            var data = self.incsearchForm
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
                url: "/inc/list",
                contentType: "application/json",
			    data: JSON.stringify(data),
			    dataType: "json",
			    success: function(res){
					if(res.code == 200){
                        self.incSearchTableData = res.page.list
                        self.pagination2 = {
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
        //操作多选批量添加
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //添加多选至模板下
        addIncToRelative () {
            var self = this
            var data = []
            for (let i = 0; i< this.multipleSelection.length; i++){
                data.push({
                    id: this.multipleSelection[i].id,
                    templateId : self.templateForm.id
                })
            }
            $.ajax({
				type: "POST",
                url: "/inc/updateByList",
                contentType: "application/json",
			    data: JSON.stringify(data),
			    dataType: "json",
			    success: function(res){
					if(res.code == 200){
                        self.reqRelativeInc(self.templateForm.id)
                        self.backToPage2()
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
        //从当前模板中移除INC
        removeThisInc(item){
            var self = this
            self.$confirm('确实要移除此INC吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = {
                    id:item.id.toString(),
                    templateId:'-1'
                }
                $.ajax({
                    type: "POST",
                    url: '/inc/update',
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            self.$message.success('移除成功')
                            self.reqRelativeInc(self.templateForm.id)
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
        //返回新建编辑页面
        backToPage2(){
            this.showChildPage = 1
            this.incsearchForm = {
                name:''
            }
            this.multipleSelection = []
            this.incSearchTableData = []
            //分页器相关
            this.pagination2 = {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            }
        },
        closeToMainpage () {
            this.creatOrEdit = 'creat'
            this.showChildPage = 0
            this.incTableData = []
            this.templateForm = {
                id:'',//编号
                name:'',//名称
                content:'',//内容
                type:'',//分类
                crtTime:'',//创建时间
                modTime:'',//修稿时间
                parentId:'',//父级编号
            }
        },
        //发布保存模板
        creatOrEditTemplate (formName) {
            var self = this
            self.$refs[formName].validate((valid) => {
                if (valid) {
                    self.$confirm('确实要保存此模板吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        if (self.creatOrEdit == 'creat') {
                            var reqUrl = '/template/save'
                        } else {
                            var reqUrl = '/template/update'
                        }
                        $.ajax({
                            type: "POST",
                            url: reqUrl,
                            contentType: "application/json",
                            data: JSON.stringify(self.templateForm),
                            dataType: "json",
                            success: function(res){
                                if(res.code == 200){
                                    self.$message.success('模板保存成功')
                                    self.creatOrEdit = 'creat'
                                    self.showChildPage = 0
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
                }
            })
        },
        //删除模板
        deleteThisRank (item) {
            var self = this
            var data = {
                id:item.id,
                status: '2'
            }
            self.$confirm('确实要删除此榜单吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/template/update",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            self.startSearch()
                            self.$message.success('删除成功')
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
        }
        
        
    }
})