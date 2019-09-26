var vm = new Vue({
    el: '#inc_list',
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
        pagination1: {
            currPage: 1,
            totalCount:0,
            totalPage:0,
            pageSize:10
        },
        //新建编辑模板
        creatOrEdit: 'creat',//creat为新增，edit为修改
        incForm:{
            id:'',//主键编号
            name:'',//inc名称
            content:'',//inc内容
            templateId:'',//模板编号
            url:'',//请求接口url
            address:'',//inc模板目录
            type:'',//inc分类
            para:'',//参数
        },
        incFormRules:{
            name: [
                { required: true, message: '标题不能为空', trigger: 'change' }
            ],
            content:[
                { required: true, message: '内容不能为空', trigger: 'change' }
            ]
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
                url: "/inc/list",
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
        //新增模板
        creatNewInc (){
            this.creatOrEdit = 'creat'
            this.showChildPage = 1
        },
        //编辑模板
        editThisInc (item) {
            this.creatOrEdit = 'edit'
            this.showChildPage = 1
            this.incForm = JSON.parse(JSON.stringify(item))
        },
        closeToMainpage () {
            this.$refs['incForm'].resetFields();
            this.creatOrEdit = 'creat'
            this.showChildPage = 0
            this.incForm = {
                id:'',//主键编号
                name:'',//inc名称
                content:'',//inc内容
                templateId:'',//模板编号
                url:'',//请求接口url
                address:'',//inc模板目录
                type:'',//inc分类
                para:'',//参数
            }
        },
        //保存
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
                            var reqUrl = '/inc/save'
                        } else {
                            var reqUrl = '/inc/update'
                        }
                        $.ajax({
                            type: "POST",
                            url: reqUrl,
                            contentType: "application/json",
                            data: JSON.stringify(self.incForm),
                            dataType: "json",
                            success: function(res){
                                if(res.code == 200){
                                    self.$message.success('模板保存成功')
                                    self.closeToMainpage()
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
        deleteThisTemplate (item) {
            var self = this
            var data = [item.id.toString()]
            self.$confirm('确实要删除此模板吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/inc/delete",
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