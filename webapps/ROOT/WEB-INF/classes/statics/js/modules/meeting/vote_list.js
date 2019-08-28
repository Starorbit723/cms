var vm = new Vue({
    el: '#vote_list',
    data(){
        
        return {
            //是否显示子页面
            showVoteList: true,
            showChildList: false,
            showDetailPage: false,
            saveBtn: false, // 新建/编辑投票选项
            creatOrEdit: 0, //0新建  1修改
            checkOption: false,
            searchForm: {
                voteMeetingId: '',
                voteTitle:'',
                // startTime:'',
                // endTime:'',
                voteStatus: '0'
            },
            tableData:[{}],
            Vid: '',
            radioVal: '',
            //分页器相关
            pagination1: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
            num: '0',
            // timeRange: [],
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
                voteStatus: '',
                totalVoteCount: '',
                voteOptionArray: [
                    {
                        voteOptionId: '',//选项编号
                        voteId: '', //vote编号
                        voteOptionName: '', //选项名称
                        voteOptionCount: '', //选项数量
                        voteOptionStatus: '0', //选项状态 0正常 1删除
                        voteOptionCrtTime: '', //创建时间
                        voteOptionCrtUserId: '',//当前登录人
                    }
                ]
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
            },
        }
    },
    created() {
        this.startSearch(0)
    },
    mounted() {

    },
    methods: {
        
        // 添加选项
        addOptions() {
            var self = this
            let len = self.voteForm.voteOptionArray.length
            // console.log(this.voteForm)
            // console.log(self.creatOrEdit)
            if(self.voteForm.voteOptionArray[len-1].voteOptionName.trim() !== '') {
                if(self.creatOrEdit == 0) {
                    self.voteForm.voteOptionArray.push({
                        voteOptionId: '',//选项编号
                        voteId: '', //vote编号
                        voteOptionName: '', //选项名称
                        voteOptionCount: '', //选项数量
                        voteOptionStatus: '0', //选项状态 0正常 1删除
                    })
                } else if(self.creatOrEdit == 1) {
                    self.voteForm.voteOptionArray.push({
                        voteOptionId: '',//选项编号
                        voteId: '', //vote编号
                        voteOptionName: '', //选项名称
                        voteOptionCount: '', //选项数量
                        voteOptionStatus: '0', //选项状态 0正常 1删除
                        voteOptionCrtTime: self.transformTime(new Date().getTime()), //创建时间
                        voteOptionCrtUserId: getCookie('userId'),//当前登录人
                    })
                }
                
            } else {
                self.$message.error('请完成上一个选项')
            }
            if(self.voteForm.voteType == "pk" && len == 2) {
                self.voteForm.voteOptionArray.length = 2
                self.voteForm.voteOptionArray.slice(0,2)
                self.$message.error('观点PK只能设置两个选项')
            }
        },
        // 删除选项
        delOptions(index) {
            var self = this
            if(self.voteForm.voteOptionArray.length <= 1) {
                self.$message.error('至少保留一个选项')
            } else{
                if(self.creatOrEdit == 1) {
                    var self = this
                    var data = JSON.parse(JSON.stringify(self.voteForm))
                    data.voteStatus = '0'
                    data.voteId = data.voteId.toString()
                    for(let i = 0; i < data.voteOptionArray.length; i++) {
                        data.voteOptionArray[i].voteOptionId = data.voteOptionArray[i].voteOptionId.toString()
                    }
                    data.voteOptionArray[index].voteOptionStatus = "1"
                    $.ajax({
                        type: "POST",
                        url: '/vote/update',
                        contentType: "application/json",
                        data: JSON.stringify(data),
                        dataType: "json",
                        success: function(res) {
                            if(res.code == 200) {
                                self.voteForm.voteOptionArray.splice(index, 1)
                                // self.$message.success('保存成功')
                                // self.startSearch()
                                // self.closeCreatOrEdit('voteForm')
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
                } else {
                    self.voteForm.voteOptionArray.splice(index, 1)
                }
            }
        },
        testSubmit2(formName) {
            var self = this
            // var numReg = /^[0-9]*[1-9][0-9]*$/;
            var numReg = /^([1-9]\d*|[0]{1,1})$/;
            for(let i = 0; i < self.voteForm.voteOptionArray.length; i++) {
                var num1 = self.voteForm.voteOptionArray[i].voteOptionCount
                if(num1 == null || num1.trim() == "") {
                    self.$message.error("人数不能为空")
                    return
                } else if (Number(num1) == NaN || (!numReg.test(Number(num1)) && num1.trim !=="")) {
                    self.$message.error("人数必须为正整数")
                    return
                }
            }
            var data = JSON.parse(JSON.stringify(self.voteForm))
            data.voteStatus = '0'
            data.voteId = data.voteId.toString()
            for(let i = 0; i < data.voteOptionArray.length; i++) {
                data.voteOptionArray[i].voteOptionId = data.voteOptionArray[i].voteOptionId.toString()
            }
            $.ajax({
                type: "POST",
                url: "/vote/update",
                contentType: "application/json",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res) {
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
        //保存
        testSubmit(formName) {
            var self = this
            //验证第一个选项是否填写完成
            for(let i = 0; i < self.voteForm.voteOptionArray.length; i++) {
                if(self.voteForm.voteOptionArray[i].voteOptionName.trim() == ''){
                    self.$message.error('还有选项未填写完成')
                    return
                } 
            }
            if(self.voteForm.voteOptionArray.length == 1){
                self.$message.error('至少填两个选项')
                return
            }
            self.$refs[formName].validate((valid) => {
                if(valid) {
                    self.saveBtn = true
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
                                    
                                    self.submitCreatEdit()
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
                        // self.saveBtn = true
                        self.submitCreatEdit()
                        self.checkOption = false
                    } 
                }
            })
        },
        submitCreatEdit() {
            var self = this
            var data = JSON.parse(JSON.stringify(self.voteForm))
            data.voteStatus = '0'
            data.voteId = data.voteId.toString()
            // console.log(JSON.stringify(data))
            // console.log(data)
            for(let i = 0; i < data.voteOptionArray.length; i++) {
                data.voteOptionArray[i].voteOptionId = data.voteOptionArray[i].voteOptionId.toString()
            }
            // console.log('准备提交保存的FORM', JSON.stringify(data))
            // console.log(self.creatOrEdit)
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
                    if(res.code == 200) {
                        self.$message.success('保存成功')
                        self.startSearch()
                        self.closeCreatOrEdit('voteForm')
                        self.saveBtn = false
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
                voteStatus: '',
                totalVoteCount: '',
                voteOptionArray: [
                    {
                        voteOptionId: '',//选项编号
                        voteId: '', //vote编号
                        voteOptionName: '', //选项名称
                        voteOptionCount: '', //选项数量
                        voteOptionStatus: '', //选项状态 0正常 1删除
                    }
                ]
            },
            // this.startSearch()
            this.showDetailPage = false
            this.showChildList = false
            this.checkOption = false
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
                    if(res.code == 200) {
                        self.tableData = res.page.list
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
                // console.log(item)
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
                            self.checkOption = true
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
            }else if(type == 2) {
                $.ajax({
                    type: "POST",
                    url: "/vote/info/"+item.voteId.toString(),
                    contentType: "application/json",
                    dataType: "json",
                    success: function(res) {
                        if(res.code == 200) {
                            let data = res.dict
                            var sum = 0
                            var numReg = /^[0-9]*[1-9][0-9]*$/;
                            for(let i = 0; i < data.voteOptionArray.length; i++) {
                                var str = data.voteOptionArray[i].voteOptionCount
                                sum = sum + Number(str)
                            }
                            self.voteForm = data
                            self.voteForm.totalVoteCount = sum
                            self.showVoteList = false
                            self.showDetailPage = true
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
            var self = this
            self.$confirm('确实要删除该投票数据吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = JSON.parse(JSON.stringify(item))
                data.voteStatus = "1"
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/vote/update",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res) {
                        if(res.code == 200) {
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
            data = {
                voteId: data.voteId.toString(),
            }
            $.ajax({
                type: "POST",
                url: "/voteOption/list",
                contentType: "application/json",
                dataType: "json",
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
