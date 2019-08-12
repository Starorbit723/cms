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
        VoteOptForm: {
            voteId: '', //投票编号
            voteOptionName: '', //投票选项名称
        },
        VoteOptFormRules: {
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
        addOrEditGuest(type, item) {
            var self = this
            if(type == 0){
                self.showChildPage = true
                self.creatOrEdit = 0
                console.log('新增投票选项')
            } else {
                self.showChildPage = true
                self.creatOrEdit = 1
                self.VoteOptForm = JSON.parse(JSON.stringify(item))
                console.log('修改投票选项',self.VoteOptForm)
            }
        },
        // 提交表单
        submitCreatEdit (formName) {
            console.log(formName)
            var self = this
            self.$refs[formName].validate((valid) => {
                if(valid) {
                    if(self.creatOrEdit == 0) {
                        var data = {
                            voteOptionName: self.VoteOptForm.voteOptionName,
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
                                    if (res.page.list.length == 0) {
                                        self.submitCreatEdit()
                                    } else {
                                        self.$message.error('该投票数据已存在，不能重复创建')
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
                    } else if (self.creatOrEdit == 1) {
                        self.submitCreatEdit()
                    }
                }
            })
        },
        // 提交保存
        submitCreatEdit() {
            var self = this
            if(self.creatOrEdit == 0) {
                var reqUrl = '/voteOption/save'
            } else if (self.creatOrEdit == 1) {
                var reqUrl = '/voteOption/update'
            }
            var data = JSON.parse(JSON.stringify(self.VoteOptForm))
            console.log(data)
        }

    }

})