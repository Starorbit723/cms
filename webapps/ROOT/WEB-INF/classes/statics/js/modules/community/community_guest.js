var vm = new Vue({
    el: '#community_guest',
    data () {
        var validatePriority = (rule, value, callback) => {
            var urlReg = /^[0-9]*[1-9][0-9]*$/;
            var urlReg2 = /^-[0-9]*[1-9][0-9]*$/;
            if (value || value === 0) {
                if (value == 0) {
                    callback();
                } else if (value.toString() == '0') {
                    callback();
                } else if (!urlReg.test(value) && !urlReg2.test(value) ) {
                    callback(new Error('权重只能填写整数或0'));
                } else {
                    callback();
                }
            } else {
                callback(new Error('权重为必填项'));
            }
        }
        return {
            showChildPage:0,
            //搜索提交
            searchForm:{
                subjectGuestTitle:'',
                subjectGuestType:'1',
                subjectGuestStatus:'1'
            },
            //分页器相关
            pagination1: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:1000
            },
            tableData:[
                // {
                //     subjectGuestId:'',
                //     subjectGuestName:'',
                //     subjectGuestPosition:'',
                //     subjectGuestStatus:'',
                //     subjectGuestType:'',
                //     subjectGuestsubjectId:'',
                //     subjectGuestCompany:'',
                //     subjectGuestTotalWeight:'',
                //     subjectGuestWeight:'',
                //     subjectGuestCrtUserId:'',
                //     subjectGuestModUserId:'',
                //     subjectGuestCrtTime:'',
                //     subjectGuestModTime:'',
                // }
            ],
            //单一嘉宾新增修改
            singleGuestForm:{
                subjectGuestId:'',
                subjectGuestName:'',
                subjectGuestPosition:'',
                subjectGuestImg:'',
                subjectGuestStatus:'1',
                subjectGuestType:'1',
                subjectGuestsubjectId:'',
                subjectGuestCompany:'',
                subjectGuestTotalWeight:'-1',
                subjectGuestWeight:'-1',
                subjectGuestCrtUserId:'',
                subjectGuestModUserId:'',
                subjectGuestCrtTime:'',
                subjectGuestModTime:'',
            },
            singleGuestFormRules:{
                subjectGuestWeight: [
                    {required: true, validator: validatePriority, trigger: 'change' }
                ],
                subjectGuestTotalWeight: [
                    { required: true, validator: validatePriority, trigger: 'change'}
                ]
            },
            //嘉宾库弹出层相关
            showGuestLibDialog:false,
            searchGuestForm:{
                guestName:'',
                guestStatus:'0'
            },
            guestTableData:[
                //{
                // guestId:'',//主键编号
                // guestName:'',//嘉宾名称
                // guestPosition:'',//嘉宾职位
                // guestCompany:'',//嘉宾公司
                // guestImg:'',//嘉宾头像
                // guestPriority:'',//嘉宾顺序
                // guestCrtUserId:'',//创建人用户编号
                // guestModUserId:'',//更新人用户编号
                // guestCrtTime:'',//创建时间
                // guestModTime:'',//更新时间
                // guestStatus:'',//嘉宾 状态 0正常 1删除
                // guestCrtUserName:'',//创建人名称
                // guestModUserName:'',//更新人名称
                //}
            ],
            pagination3: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
        }
    },
    watch: {
        
    },
    created () {
        this.startSearch()
    },
    methods:{
        startSearch () {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchForm))
            Object.assign(data,{
                page: self.pagination1.currPage.toString(),
                limit: self.pagination1.pageSize.toString()
            })
            $.ajax({
				type: "POST",
                url: "/subjectGuest/list",
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
        //添加嘉宾
        addGuest () {
            this.searchGuest(0)
            this.showGuestLibDialog = true
        },
        //搜索嘉宾库
        searchGuest (type){
            var self = this
            var data = self.searchGuestForm
            data.guestName = data.guestName.trim()
            if (type == 0) {
                Object.assign(data,{
                    page: '1',
                    limit: self.pagination3.pageSize.toString()
                })
            } else {
                Object.assign(data,{
                    page: self.pagination3.currPage.toString(),
                    limit: self.pagination3.pageSize.toString()
                })
            }
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "/guest/list",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.searchGuestForm.guestName = ''
                        self.guestTableData = res.page.list
                        self.pagination3 = {
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
        //添加嘉宾至页面
        addThisImg (item) {
            this.singleGuestForm.subjectGuestName = item.guestName
            this.singleGuestForm.subjectGuestPosition = item.guestPosition
            this.singleGuestForm.subjectGuestCompany = item.guestCompany
            this.singleGuestForm.subjectGuestImg = item.guestImg
            this.showGuestLibDialog = false
            this.searchGuestForm = {
                guestName:'',
                guestStatus:'0'
            }
            this.guestTableData = []
            this.pagination3 = {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            }
            this.showChildPage = '1'
        },
        handleCurrentChange3 (val) {
            this.pagination3.currPage = val
            this.searchGuest()
        },
        //返回编辑页
        backToEdit (){
            this.showGuestLibDialog = false
            this.searchGuestForm = {
                guestName:'',
                guestStatus:'0'
            }
            this.guestTableData = []
            this.pagination3 = {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            }
            this.singleGuestForm = {
                subjectGuestId:'',
                subjectGuestName:'',
                subjectGuestPosition:'',
                subjectGuestImg:'',
                subjectGuestStatus:'1',
                subjectGuestType:'1',
                subjectGuestsubjectId:'',
                subjectGuestCompany:'',
                subjectGuestTotalWeight:'-1',
                subjectGuestWeight:'-1',
                subjectGuestCrtUserId:'',
                subjectGuestModUserId:'',
                subjectGuestCrtTime:'',
                subjectGuestModTime:'',
            }
            this.showChildPage = '0'
        },
        //提交前检测添加嘉宾
        testSubmit(formName) {
            var self = this
            self.$refs[formName].validate((valid) => {
                if (valid) {
                    //验证是否有重复数据
                    self.submitCreat()
                }
            })
        },
        //新增嘉宾
        submitCreat () {
            var self = this
            var data = JSON.parse(JSON.stringify(self.singleGuestForm))
            $.ajax({
                type: "POST",
                url: '/subjectGuest/save',
                contentType: "application/json",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.$message.success('添加成功')
                        self.startSearch()
                        self.closeCreat('singleGuestForm')
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
        //取消编辑返回列表页
        closeCreat (formName) {
            this.$refs[formName].resetFields();
            this.singleGuestForm = {
                subjectGuestId:'',
                subjectGuestName:'',
                subjectGuestPosition:'',
                subjectGuestImg:'',
                subjectGuestStatus:'1',
                subjectGuestType:'1',
                subjectGuestsubjectId:'',
                subjectGuestCompany:'',
                subjectGuestTotalWeight:'-1',
                subjectGuestWeight:'-1',
                subjectGuestCrtUserId:'',
                subjectGuestModUserId:'',
                subjectGuestCrtTime:'',
                subjectGuestModTime:'',
            }
            this.showChildPage = 0
        },
        //分类权重改变
        weightChange(index){
            let _weight = this.tableData[index].subjectGuestWeight;
            if (this.testWeightVal(_weight)) {
                this.updateItem(index)
            } else {
                this.tableData[index].subjectGuestWeight = '-1'
            }

        },
        //分类权重改变
        allWeightChange(index){
            let _weight = this.tableData[index].subjectGuestTotalWeight;
            if (this.testWeightVal(_weight)) {
                this.updateItem(index)
            } else {
                this.tableData[index].subjectGuestTotalWeight = '-1'
            }
        },
        //更新数据
        updateItem(index){
            var self = this
            var data = JSON.parse(JSON.stringify(this.tableData[index]))
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "/subjectGuest/update",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
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
        },
        //删除数据
        delItem (index) {
            var self = this
            if (self.tableData.length > 1) {
                var data = {
                    subjectGuestId: this.tableData[index].subjectGuestId.toString()
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/subjectGuest/delete",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res){
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
            } else {
                self.$message.error('至少保留一个嘉宾')
            }
            
        },
        //发布
        pushGuest () {
            var self = this
            var data = {}
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "/subjectGuest/push",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.$message.success('发布成功')
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
        //权重值测试
        testWeightVal (val) {
            var self = this
            var urlReg = /^[0-9]*[1-9][0-9]*$/;
            var urlReg2 = /^-[0-9]*[1-9][0-9]*$/;
            if (val || val === 0) {
                if (val == 0) {
                    return true
                } else if (val.toString() == '0') {
                    return true
                } else if (!urlReg.test(val) && !urlReg2.test(val) ) {
                    self.$message.error('权重只能填写整数或0')
                    return false
                } else {
                    return true
                }
            } else {
                self.$message.error('权重为必填项')
                return false
            }
            
        }
    }
})