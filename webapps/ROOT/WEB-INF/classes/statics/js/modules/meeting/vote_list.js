var vm = new Vue({
    el: '#vote_list',
    data(){
        var validateId = (rule, value, callback) => {
            var urlReg = /^[0-9]*[1-9][0-9]*$/;
            if (!value) {
                callback(new Error('所属投票编号为必填项'));
            } else if (value !== '' && !urlReg.test(value)) {
                callback(new Error('所属投票编号只能为正整数'));
            } else {
                callback();
            }
        }
        return {
            //是否显示子页面
            showVoteList: true,
            showChildList: false,
            showDetailPage: false,
            creatOrEdit: 0, //0新建  1修改
            timeRange:[],
            searchForm: {
                voteMeetingId: '',
                voteTitle:'',
                startTime:'',
                endTime:'',
                voteStatus: '0'
            },
            tableData:[{}],
            //分页器相关
            pagination1: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
            timeRange: [],
            voteForm: {
                voteId: '', //投票编号
                voteTitle: '', //投票名称
                voteType: '', //投票类型
                voteDesc:'', //投票摘要
                voteMeetingId: '', //投票所属会议
                voteCrtUserId: '', //创建人用户编号
                voteModUserId: '', //更新人用户编号
                voteCrtTime: '', //创建时间
                voteModTime: '', //更新时间
                userName: '', //创建人
                voteStatus: ''
            },
            voteFormRules: {
                voteType: [
                    {required: true, message: '投票类型为必填项', trigger: 'change'}
                ],
                voteTitle: [
                    {required: true, message: '投票名称为必填项', trigger: 'change'}
                ],
                voteDesc: [
                    {required: true, message: '投票摘要为必填项', trigger: 'change'}
                ]
            }
            
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
    created() {
        this.startSearch(0)
    },
    mounted() {

    },
    methods: {
        // 获取投票类型
        getRadioVal(event){ 
            var radioVal = event.target.value;
            this.voteForm.voteType = radioVal
        },
        // 添加选项
        addOptions() {
            console.log(11111)
            
            
        },
        //保存
        testSubmit(formName) {
            var self = this
            self.$refs[formName].validate((valid) => {
                if(valid) {
                    //验证第一个选项是否填写完成
                    // for(let i = 0; i < self.voteForm.voteOptions.length; i++) {
                    //     if(self.voteForm.voteOptions[i].optionsText.trim() == ''){
                    //         self.$message.error('还有选项未填写完成')
                    //         return
                    //     }
                    // }
                    if(self.creatOrEdit == 0) {
                        var data = {
                            voteMeetingId: self.voteForm.voteMeetingId,
                            voteStatus: '0',
                            page: '1',
                            limit: '100'
                        }
                        $.ajax({
                            type: "POST",
                            url: "/vote/list",
                            contentType: "application/json",
                            data: JSON.stringify(data),
                            dataType: "json",
                            success: function(res) {
                                if(res.code == 200) {
                                    if(res.page.list.length == 0) {
                                        self.submitCreatEdit()
                                    } else {
                                        self.$message.error('该投票数据已存在，不能重复创建')
                                    }
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
                    } else if (self.creatOrEdit == 1) {
                        self.submitCreatEdit()
                    }
                }
            })
        },
        submitCreatEdit() {
            var self = this
            var data = JSON.parse(JSON.stringify(self.voteForm))
            console.log('准备提交保存的FORM', data)
            if (self.creatOrEdit == 0) {
                var reqUrl = '/vote/save'
            } else if (self.creatOrEdit == 1) {
                var reqUrl = '/vote/update'
            }
            $.ajax({
                type: "POST",
                url: reqUrl,
                contentType: "application/json",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res) {
                    console.log(res)
                    if(res.code == 200) {
                        self.$message.success('保存成功')
                        self.startSearch()
                        self.closeCreatOrEdit('voteForm')
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
        },
        // 关闭页面
        closeCreatOrEdit(formName) {
            
            
            this.creatOrEdit = 0
            this.$refs[formName].resetFields();
            this.voteForm = {
                voteId: '', //投票编号
                voteTitle: '', //投票名称
                voteType: '', //投票类型
                voteDesc:'', //投票摘要
                voteMeetingId: '', //投票所属会议
                voteCrtUserId: '', //创建人用户编号
                voteModUserId: '', //更新人用户编号
                voteCrtTime: '', //创建时间
                voteModTime: '', //更新时间
                userName: '', //创建人
                voteStatus: ''
            },
            
            this.showChildList = false
            this.showVoteList = true
        },
        //切换页码
        handleCurrentChange (val) {
            this.pagination1.currPage = val
            this.startSearch() 
        },
        // 开始搜索列表
        startSearch(type) {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchForm))
            // console.log(data)
            data.voteMeetingId = data.voteMeetingId.toString().trim()
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
                url: "/vote/list",
                contentType: "application/json",
			    data: JSON.stringify(data),
                dataType: "json",
                success: function(res) {
                    // console.log(res)
                    if(res.code == 200) {
                        self.tableData = res.page.list
                        // for (let i = 0; i < self.tableData.length; i++){
                        //     self.tableData[i].voteCrtTime = self.transformTime(parseInt(self.tableData[i].voteCrtTime))
                        //     self.tableData[i].voteModTime = self.transformTime(parseInt(self.tableData[i].voteModTime))
                        // }
                        self.pagination1 = {
                            currPage: res.page.currPage,
                            totalCount:res.page.totalCount,
                            totalPage: res.page.totalPage,
                            pageSize: res.page.pageSize
                        }
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
        // 新建或修改投票type:0  新增   type:1修改
        addOrEditVote(type, item) {
            var self = this
            self.creatOrEdit = type
            if(type == 0) {
                self.showVoteList = false
                self.showChildList = true
            } else if(type == 1) {
                $.ajax({
                    type: "POST",
                    url: "/vote/info/"+item.voteId.toString(),
                    contentType: "application/json",
                    dataType: "json",
                    success: function(res) {
                        if(res.code == 200) {
                            let data = res.dict
                            self.voteForm = data
                            self.showVoteList = false
                            self.showChildList = true
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
                
            }
        },
        //删除
        deleteThisVote(item) {
            console.log(item)
            var self = this
            self.$confirm('确实要删除该投票数据吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = JSON.parse(JSON.stringify(item))
                data.voteStatus = "1"
                console.log(JSON.stringify(data))
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/vote/update",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res) {
                        if(res.code == 200) {
                            console.log(res)
                            self.startSearch()
                            self.$message.success('删除成功')
                        } else {
                            mapErrorStatus(res)
                            vm.error = true
                            vm.errorMsg = res.msg
                        }
                    },
                    error: function(res) {
                        mapErrorStatus(res)
                    }
                })
            })
        },
        //详情
        checkVoteDetail(item){
            this.showVoteList = false,
            this.showDetailPage = true;

        }
    }
   
       
    
})
