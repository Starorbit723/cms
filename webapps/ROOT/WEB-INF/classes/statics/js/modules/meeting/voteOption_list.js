var vm = new Vue({
    el: "#voteOption_list",
    data: {
        showChildPage: false,
        creatOrEdit:0,//0新建  1修改
        //搜索提交
        searchForm:{
            VoteId:'', //所属投票编号
            voteOptionStatus:'0',//状态 0正常 1删除
        },
        //列表查询结果
        tableData: [{
            voteOptionId:'',//投票选项编号
            voteId:'',//投票编号
            voteOptionName:'',//投票选项名称
            voteOptionCount:'',//投票选项数量
            voteOptionCrtUserId:'',//创建人用户编号
            voteOptionModUserId:'',//更新人用户编号
            voteOptionCrtTime:'',//创建时间
            voteOptionModTime:'',//更新时间
            voteOptionStatus:'',//嘉宾 状态 0正常 1删除
        }],
        //分页器相关
        pagination1: {
            currPage: 1,
            totalCount:0,
            totalPage:0,
            pageSize:10
        },
        // 新建投票选项表单
        voteOptForm: {
            voteId: '', //投票编号
            voteOptionName: '', //投票选项名称
        },
        voteOptFormRules: {
            voteId: [
                { required: true, message: '投票编号不能为空', trigger: 'change' }
            ],
            voteOptionName: [
                { required: true, message: '投票选项名称不能为空', trigger: 'change' }
            ]
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
         //开始搜索选项列表
         startSearch (type) {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchForm))
            data.VoteId = data.VoteId.toString().trim()
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
                contentType: "application/json",
                url: "/voteOption/list",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.tableData = res.page.list
                        self.pagination1 = {
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
        // 新增或修改投票
        addOrEditVoteOpt(type, item) {
            var self = this
            self.creatOrEdit = type
            if(type == 0){
                self.showChildPage = true
                console.log('新增投票选项')
            } else {
                
                $.ajax({
                    type: "POST",
                    url:"/voteOption/info/" + item.voteOptionId.toString(),
                    contentType: "application/json",
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200) {
                            let data = res.dict
                            self.voteOptForm = data
                            self.showChildPage = true
                        } else{
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
        },
        // 删除投票选项
        deleteThisVoteOpt (item) {
            var self = this
            self.$confirm('确定删除该选项吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = JSON.parse(JSON.stringify(item))
                data.voteOptionStatus = 1 //0 正常  1 删除
                console.log(data)
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/voteOption/update",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res) {
                        if (res.code == 200) {
                            self.startSearch()
                            self.$message.success('删除成功')
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
        // 提交表单
        submitCreatEdit (formName) {
            console.log(formName)
            var self = this
            self.$refs[formName].validate((valid) => {
                if(valid) {
                    if(self.creatOrEdit == 0) {
                        var data = {
                            voteOptionName: self.voteOptForm.voteOptionName,
                            page: '1',
                            limit: '100'
                        }
                        $.ajax({
                            type: "POST",
                            url: "/voteOption/list",
                            contentType: "application/json",
                            data: JSON.stringify(data),
                            dataType: "json",
                            success: function(res){
                                console.log(res)
                                if(res.code == 200){
                                    self.submitForm()
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
                    } else if (self.creatOrEdit == 1) {
                        self.submitForm()
                    }
                }
            })
        },
        // 提交保存
        submitForm() {
            var self = this
            if(self.creatOrEdit == 0) {
                var reqUrl = '/voteOption/save'
            } else if (self.creatOrEdit == 1) {
                var reqUrl = '/voteOption/update'
            }
            var data = JSON.parse(JSON.stringify(self.voteOptForm))
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: reqUrl,
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res) {
                    console.log(res)
                    if(res.code == 200) {
                        self.$message.success('保存成功');
                        self.startSearch() //列表回显
                        self.closeEditCreatEdit('voteOptForm')
                    } else {
                        mapErrorStatus(res)
                        vm.error = true;
                        vm.errorMsg = res.msg;
                    }
                },
                error: function(res) {
                    mapErrorStatus(res)
                }
            })
        },
        //取消编辑返回列表页
        closeEditCreatEdit (formName) {
            this.creatOrEdit = 0
            this.$refs[formName].resetFields();
            this.voteOptForm = {
                voteOptionId: '',
                voteId: '',
                voteOptionName: ''
            }
            this.showChildPage = false
        }

    }

})