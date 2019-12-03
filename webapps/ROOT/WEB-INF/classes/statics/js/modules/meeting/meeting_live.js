

var vm = new Vue({
    el: '#meeting_live',
    data () {
        var validateWeight = (rule, value, callback) => {
            var urlReg = /^[0-9]*[1-9][0-9]*$/;
            var urlReg2 = /^-[0-9]*[1-9][0-9]*$/;
            if (value || value == 0) {
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
            //是否显示子页面
            showChildPage: '0',
            currentSearchMeetingliveId: '',
            showDetailPage: false,
            creatOrEdit:  0, //0新建  1修改
            picCount: '',
            searchForm: {
                reportTopicId: '',
                name: '', 
                delStatus: '1' //状态 0正常 1删除
            },
            tableData:[{}],
            showDiagramLab: false,
            diagramTableData:[],
            //分页器相关
            pagination1: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
             //分页器相关
             pagination2: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
            // 新建会场报道
            meetingLiveListForm: {
                id: '',
                name: '',
                reportTopicId: '',
                delStatus: '1',
                createUserId: '',
                updateUserId: '',
                updateAt: '',
                createAt: '',
                modUserName: '',
            },
            meetingLiveListFormRules: {
                name: [
                    {required: true, message: '名称必填', trigger: 'change'}
                ]
            },
            meetingliveDataTemp: [
                // {
                //     id: '',
                //     meetingPlaceTitle: '', //会议标题
                //     meetingNavTitle: '', //导航标题
                //     weight: '', //会议权重
                //     delStatus: '1', //删除状态 0已删除1未删除
                //     createUserId: '',
                //     updateUserId: '',
                //     updateAt: '',
                //     createAt: '',
                //     meetingReportListId: '', // 所属报道id
                //     children: {
                //         themTitle: '', //主题标题
                //         children: {
                //             modelTitle: '', //模块标题
                //             type: '', //类型
                //             priority: '', //权重
                //         }
                //     }
                // }
            ],
            meetingliveData: {
                id: '',
                meetingPlaceTitle: '', //会议标题
                meetingNavTitle: '', //导航标题
                weight: '', //会议权重
                themTitle: '', //主题标题
                modelTitle: '', //模块标题
                type: '', //类型
                priority: '', //权重
                delStatus: '1', //删除状态 0已删除1未删除
                createUserId: '',
                updateUserId: '',
                updateAt: '',
                createAt: '',
                meetingReportListId: '', // 所属报道id
            },

            // 创建会场

            ifCreatOrEditPlace: 'creat',
            ifCreatOrEditModel: 'creat',
            meetinglivePlaceForm: {
                id: '',
                meetingPlaceTitle: '', //会议标题
                meetingNavTitle: '', //导航标题
                weight: '-1', //会议权重
                themTitle: '', //主题标题
                modelTitle: '', //模块标题
                type: '0', //类型
                priority: '-1', //权重
                delStatus: '1', //删除状态 0已删除1未删除
                createUserId: '',
                updateUserId: '',
                updateAt: '',
                createAt: '',
                meetingReportListId: '', // 所属报道id
            },
            meetinglivePlaceFormRules: {
                weight:[
                    { required: true, validator: validateWeight, trigger: 'change' }
                ],
                priority:[
                    { required: true, validator: validateWeight, trigger: 'change' }
                ],
            },
            //初始化数据
            options: [{
                value: '0',
                label: '嘉宾演讲'
            }, {
                value: '1',
                label: '圆桌论坛'
            }],
            tempObj: {},




        }
    },
    watch: {
       
    },
    created() {
      this.startSearch(0)
    },
    mounted() {

    },
    methods: {
        // 开始搜索列表
        startSearch(type) {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchForm))
            data.reportTopicId = data.reportTopicId.toString().trim()
            data.name = data.name.toString().trim()
            // console.log(JSON.stringify(data))
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
                url: "/meetingReportList/list",
                contentType: "application/json",
			    data: JSON.stringify(data),
                dataType: "json",
                success: function(res) {
                    console.log(res)
                    if(res.code == 200) {
                        self.tableData = res.page.list
                        self.pagination1 = {
                            currPage: res.page.currPage,
                            totalCount:res.page.totalCount,
                            totalPage: res.page.totalPage,
                            pageSize: res.page.pageSize
                        }
                        // self.searchForm.reportTopicId = ''
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
        //切换页码
        handleCurrentChange (val) {
            this.pagination1.currPage = val
            this.startSearch() 
        },
         // 新建或修改会场报道  type:0 新增   type:1修改
        addOrEditMeetinglive(type, item) {
            var self = this
            self.creatOrEdit = type
            if(type == 0) {
                self.showChildPage = '1'
            } else if(type == 1) {
                // console.log(item)
                $.ajax({
                    type: "POST",
                    url: "/meetingReportList/info/" + item.id,
                    contentType: "application/json",
                    dataType: "json",
                    success: function(res){
                        console.log(res)
                        if(res.code == 200){
                            let data = res.dict
                            self.meetingLiveListForm = data
                            self.showChildPage = '1'
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
        },
        //删除某项会场报道
        deleteThisMeetinglive(item) {
            var self = this
            self.$confirm('确实要删除该会场报道数据吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = JSON.parse(JSON.stringify(item))
                data.delStatus = '0'
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/meetingReportList/update",
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
         //保存
        testSubmit(formName) {
            var self = this
            self.$refs[formName].validate((valid) => {
                if(valid) {
                    if(self.creatOrEdit == 1) {
                        var data = {
                            reportTopicId: self.meetingLiveListForm.reportTopicId,
                            name: self.meetingLiveListForm.name,
                            delStatus: '1',
                            page: '1',
                            limit: '100'
                        }
                        $.ajax({
                            type: "POST",
                            url: "/meetingReportList/list",
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
                    } else if (self.creatOrEdit == 0) {
                        self.submitCreatEdit()
                    }
                }
            })
        },
        // 提交
        submitCreatEdit() {
            var self = this
            var data = JSON.parse(JSON.stringify(self.meetingLiveListForm))
            console.log('准备提交保存的FORM', data)
            if (self.creatOrEdit == 0) {
                var reqUrl = '/meetingReportList/save'
            } else if (self.creatOrEdit == 1) {
                var reqUrl = '/meetingReportList/update'
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
                        self.closeCreatOrEdit('meetingLiveListForm')
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
            this. meetingLiveListForm = {
                id: '',
                name: '',
                reportTopicId: '',
                createUserId:'',
                updateUserId:'',
                createAt:'',
                updateAt:'',
                delStatus:'0',
            },
            this.showChildPage = '0'
        },




        //------------------------------------------编辑页面------------------------------------------------
        editMeetingliveDetail (item) {
            console.log(item)
            this.currentSearchMeetingliveId = item.id.toString().trim()
            this.startSearch2(this.currentSearchMeetingliveId, 0)
            this.showChildPage = '2'
        },
        startSearch2(id, type) {
            var self = this
            var data1 = {
                meetingReportListId: id,
                delStatus: '1'
            }
            var data = JSON.parse(JSON.stringify(data1))
            console.log(JSON.stringify(data))
            $.ajax({
                type: "POST",
                url: "/meetingReport/list",
                contentType: "application/json",
			    data: JSON.stringify(data),
                dataType: "json",
                success: function(res) {
                    if(res.code == 200) {
                        console.log(res)
                        self.meetingliveData = res.page.list
                        var arr = res.page.list
                        for(let i = 0; i < arr.length; i++) {
                            for(let k = i+1; k < arr.length; k++) {
                                let element_i = arr[i]
                                let element_k = arr[k]
                                if(element_i.weight == element_k.weight) {
                                    if(element_i.priority < element_k.priority) {
                                        arr[i] = element_k
                                        arr[k] = element_i
                                    }
                                } else if(element_i.weight < element_k.weight) {
                                    arr[i] = element_k
                                    arr[k] = element_i
                                }
                            }
                        }
                        var result = [],
                        obj = {},
                        index = 0;
                        arr.forEach(item => {
                            var list = {
                                weight: '',
                                meetingPlaceTitle: '',
                                meetingNavTitle: '',
                                weight: '',
                                children: []
                            }
                            if(obj.hasOwnProperty(item.weight)) {

                            } else {
                                obj[item.weight] = index++;
                                
                                list.weight = item.weight
                                list.meetingPlaceTitle = item.meetingPlaceTitle
                                list.meetingNavTitle = item.meetingNavTitle
                                list.weight = item.weight
                                list.children.push(item)
                                result.push(list)

                            }
                            if(obj.hasOwnProperty(item.meetingPlaceTitle)) {
                                result[obj[item.meetingPlaceTitle]].children.push(item)
                            } else {
                                obj[item.meetingPlaceTitle] = index++;
                                var list = {
                                    meetingPlaceTitle: '',
                                    meetingNavTitle: '',
                                    weight: '',
                                    children: []
                                }
                                list.meetingPlaceTitle = item.meetingPlaceTitle
                                list.meetingNavTitle = item.meetingNavTitle
                                list.weight = item.weight
                                list.children.push(item)
                                result.push(list)
                            }
                        })

                        // console.log(result)
                        // self.meetingliveDataTemp = result
                        // console.log(arr)
                        // var result = []
                        // if(arr.length == 0) {
                        //     self.meetingliveDataTemp = []
                        // } else {
                            
                        //     arr.forEach(item => {
                        //         var list = {
                        //             id: '',
                        //             meetingPlaceTitle: '',
                        //             meetingNavTitle: '',
                        //             weight: '',
                        //             children: []
                        //         }
                        //         list.id = item.id
                        //         list.meetingPlaceTitle = item.meetingPlaceTitle
                        //         list.meetingNavTitle = item.meetingNavTitle
                        //         list.weight = item.weight
                        //         list.children.push(item)
                        //         result.push(list)
                        //     })
                            
                        // }
                        self.meetingliveDataTemp = result
                        console.log(self.meetingliveDataTemp)
                        

                        
                        

                        // self.diagramTableData = res.page.list
                        // self.picCount = res.page.totalCount
                        // self.pagination3 = {
                        //     currPage: res.page.currPage,
                        //     totalCount: res.page.totalCount,
                        //     totalPage: res.page.totalPage,
                        //     pageSize: res.page.pageSize
                        // }
                    } else {
                        mapErrorStatus(res)
						vm.error = true;
						vm.errorMsg = res.msg;
                    }
                }
            })
        },
        
    

        

        // -------------------------------新建会场-----------------------------------
        addOrEditNewPlace (type) {
            var self = this
            if (type == '0') {
                this.ifCreatOrEditPlace = 'creat'
                this.showChildPage = '3'
            } else {
                console.log(type)
                this.ifCreatOrEditPlace = 'edit'
                self. meetinglivePlaceForm.meetingPlaceTitle = type.meetingPlaceTitle
                self. meetinglivePlaceForm.meetingNavTitle = type.meetingNavTitle
                self. meetinglivePlaceForm.weight = type.weight
                this.showChildPage = '3'

                





                // this.meetinglivePlaceForm.id = this.currentSearchMeetingliveId
                // $.ajax({
                //     type: "POST",
                //     contentType: "application/json",
                //     url: '/meetingReport/info/' + type.id,
                //     dataType: "json",
                //     success: function(res){
                //         console.log(res)
                //         if (res.code == 200) {
                            
                //             // console.log('编辑某一条案例',res.dict)
                //             // self.singleCaseForm = res.dict
                //             // self.showAddOrEditCase = true
                //         } else {
                //             mapErrorStatus(res)
                //             vm.error = true;
                //             vm.errorMsg = res.msg;
                //         }
                //     },
                //     error:function(res){
                //         mapErrorStatus(res)
                //     }
                // });
            }

        },
        backToMeetingliveList() {
            this.showChildPage = '0'
        },
        testSubmit2 (formName) {
            var self = this
            self.$refs[formName].validate((valid) => {
                if(valid) {
                  self.submitCreatEdit2()
                }
            })

        },
        // 提交
        submitCreatEdit2 () {
            var self = this
            var data = JSON.parse(JSON.stringify(self.meetinglivePlaceForm))
            data.meetingReportListId = self.currentSearchMeetingliveId
            console.log('准备提交保存的FORM', data)
            console.log(self.ifCreatOrEditPlace)
            if (self.ifCreatOrEditPlace == 'creat') {
                var reqUrl = '/meetingReport/save'
            } else if (self.ifCreatOrEditPlace == 'edit') {
                var reqUrl = '/meetingReport/update'
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
                        self.startSearch2(self.currentSearchMeetingliveId, 0)
                        self.closeCreatOrEditMeetinglivePlace('meetinglivePlaceForm')
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
        closeCreatOrEditMeetinglivePlace (formName) {
            this.ifCreatOrEditPlace = 'creat'
            this.$refs[formName].resetFields();
            this. meetinglivePlaceForm = {
                id: '',
                meetingPlaceTitle: '', //会议标题
                meetingNavTitle: '', //导航标题
                weight: '-1', //会议权重
                themTitle: '', //主题标题
                modelTitle: '', //模块标题
                type: '', //类型
                priority: '-1', //权重
                delStatus: '1', //删除状态 0已删除1未删除
                createUserId: '',
                updateUserId: '',
                updateAt: '',
                createAt: '',
                meetingReportListId: '', // 所属报道id
            },
            this.showChildPage = '2'

        },


        // -------------------------------新建模块------------------------------------

        addOrEditMeetingModel(type, item) {
            var self = this
            console.log(item)
            self.tempObj = JSON.parse(JSON.stringify(item))
            if(type == '0') {
                self.ifCreatOrEditModel = 'creat'
                self.showChildPage = '4'
            } else {
                console.log(123)
            }
            
        },
        testSubmit3 (formName) {
            var self = this
            self.$refs[formName].validate((valid) => {
                if(valid) {
                  self.submitCreatEdit3()
                }
            })

        },
        submitCreatEdit3 () {
            var self = this
            console.log(self.tempObj)
            var data = JSON.parse(JSON.stringify(self.meetinglivePlaceForm))
            data.meetingReportListId = self.currentSearchMeetingliveId
            data.meetingPlaceTitle = self.tempObj.meetingPlaceTitle
            data.meetingNavTitle = self.tempObj.meetingNavTitle
            data.weight = self.tempObj.weight
            console.log('准备提交保存的FORM', data)
            if (self.ifCreatOrEditPlace == 'creat') {
                var reqUrl = '/meetingReport/save'
            } else if (self.ifCreatOrEditPlace == 'edit') {
                var reqUrl = '/meetingReport/update'
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
                        self.startSearch2(self.currentSearchMeetingliveId, 0)
                        self.closeCreatOrEditMeetingliveModel('meetinglivePlaceForm')
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
        closeCreatOrEditMeetingliveModel (formName) {
            this.ifCreatOrEditModel = 'creat'
            this.$refs[formName].resetFields();
            this. meetinglivePlaceForm = {
                id: '',
                meetingPlaceTitle: '', //会议标题
                meetingNavTitle: '', //导航标题
                weight: '-1', //会议权重
                themTitle: '', //主题标题
                modelTitle: '', //模块标题
                type: '', //类型
                priority: '-1', //权重
                delStatus: '1', //删除状态 0已删除1未删除
                createUserId: '',
                updateUserId: '',
                updateAt: '',
                createAt: '',
                meetingReportListId: '', // 所属报道id
            },
            this.showChildPage = '2'

        },
        
        
        
    }
})
