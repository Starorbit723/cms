var vm = new Vue({
    el: '#commont_list',
    data: {
        //搜索文章列表提交
        timeRange:[], //时间需要特殊处理,并且同步到searchForm
        pickerOptions:{
            disabledDate(time) {
                return time.getTime() > Date.now();
            }
        },  
        showMutiPass:true,
        showMutiDel:true,
        recommendOptions:[{
            label:'已发布',
            value: 0
        },{
            label:'待审核',
            value: 2
        }],
        searchForm:{
            content:'',//评论内容
            deleted: 2,//发布状态 0已发布 1已删除 2待审核
            startTime:'',//开始时间
            endTime:'',//结束时间
        },
        multipleSelection: [],
        //表格结果
        tableData: [{
            id:'',//主键
            uuid:'',//
            userId:'',//用户编号
            targetId:'',//目标编号
            content:'',//内容
            createDate:'',//创建时间
            createTime:'',//创建时间戳
            targetUserId:'',//
            targetType:'',//
            deleted:'',//删除状态 0已发布 1已删除 2待审核
            memo:'',//备注
            sourceContent:'',
            sensitiveList:'',
            deviceId:'',
            newsTitle:'',//新闻标题:''
            userName:''
        }],
        //分页器相关
        pagination1: {
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
        //多选选择器
        handleSelectionChange (val) {
            console.log(val)
            this.multipleSelection = val
        },
        //开始搜索
        startSearch (type) {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchForm))
            data.content = data.content.toString().trim()
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
            data.deleted = data.deleted.toString()
            $.ajax({
				type: "POST",
                url: "/userComment/list",
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
        //前往新闻页
        toArticlePage (item) {
            setCookie ('createdit', item.targetId, 1)
            window.parent.location.href = '/index.html#modules/content/edit_article.html'
        },
        //批量通过上线
        mutiUpline () {
            var self = this
            self.$confirm('确实要批量通过上线吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var tempArr = []
                for (let i = 0; i < this.multipleSelection.length; i++){
                    tempArr.push({
                        id: this.multipleSelection[i].id.toString(),
                        targetId: this.multipleSelection[i].targetId.toString(),
                        deleted: 0
                    })
                }
                console.log('批量上线',tempArr)
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: '/userComment/update',
                    data: JSON.stringify(tempArr),
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            self.$message.success('批量上线成功');
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
        //批量删除
        mutiDelete () {
            var self = this
            self.$confirm('确实要批量删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var tempArr = []
                for (let i = 0; i < this.multipleSelection.length; i++){
                    tempArr.push({
                        id: this.multipleSelection[i].id.toString(),
                        targetId: this.multipleSelection[i].targetId.toString(),
                        deleted: 1
                    })
                }
                console.log('批量删除',tempArr) 
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: '/userComment/update',
                    data: JSON.stringify(tempArr),
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            self.$message.success('批量删除成功');
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
        //评论上线
        uplineThisComment (item){
            var self = this
            var data = [{
                id: item.id.toString(),
                targetId: item.targetId.toString(),
                deleted: 0
            }]
            self.$confirm('确实要上线此条评论吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: '/userComment/update',
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            self.$message.success('上线成功');
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
        //评论下线
        offlineThisComment (item){
            var self = this
            var data = [{
                id: item.id.toString(),
                targetId: item.targetId.toString(),
                deleted: 0
            }]
            self.$confirm('确实要下线此条评论吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: '/userComment/update',
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            self.$message.success('下线成功');
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
        //删除评论
        deleteThisComment (item) {
            var self = this
            var data = [{
                id: item.id.toString(),
                targetId: item.targetId.toString(),
                deleted: 1
            }]
            self.$confirm('确实要删除此条评论吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: '/userComment/update',
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
        //切换按钮显示状态
        toggleBtnStatus () {
            if (this.searchForm.deleted == 1) {
                this.showMutiPass = false
                this.showMutiDel = false
            } else {
                this.showMutiPass = true
                this.showMutiDel = true
            }
        }
        
        
    }
})