

var vm = new Vue({
    el: '#meeting_hdpicture',
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
            showDiagramPage: true,
            showHdPage: false,
            diagramListPage: false,
            creatOrEdit:  0, //0新建  1修改
            searchForm: {
                diagramMeetingId: '',
                diagramTitle: '', 
                diagramStatus: '0' //状态 0正常 1删除
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
            diagramForm: {
                diagramId: '',
                diagramTitle: '',
                diagramMeetingId: '',
                diagramCrtUserId:'',
                diagramModUserId:'',
                diagramCrtTime:'',
                diagramModTime:'',
                diagramStatus:'',
            },
            diagramFormRules: {
                diagramMeetingId: [
                    {required: true, message: '所属会议详情编号', trigger: 'change'}
                ],
                diagramTitle: [
                    {required: true, message: '高清组图名称', trigger: 'change'}
                ]
            }

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
        //修改组图列表
        addOrEditList (type, item) {
            this.showDiagramLab = true
            var data = JSON.parse(JSON.stringify(item))
            console.log(data)
            $.ajax({
                type: "POST",
                url: "/diagramInfo/list",
                data: JSON.stringify(data),
                contentType: "application/json",
                dataType: "json",
                success: function(res){
                    console.log(res)
                    // if(res.code == 200){
                    //     let data = res.dict
                    //     self.diagramForm = data
                    //     self.showDiagramPage = false
                    //     self.showHdPage = true
                    // }else{
                    //     mapErrorStatus(res)
                    //     vm.error = true;
                    //     vm.errorMsg = res.msg;
                    // }
                },
                error:function(res){
                    mapErrorStatus(res)
                }
            });

        },
        // 开始搜索列表
        startSearch(type) {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchForm))
            data.diagramMeetingId = data.diagramMeetingId.toString().trim()
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
                url: "/diagram/list",
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
        //切换页码
        handleCurrentChange (val) {
            this.pagination1.currPage = val
            this.startSearch() 
        },
        // 新建或修改高清组图  type:0  新增   type:1修改
        addOrEditPic(type, item) {
            var self = this
            self.creatOrEdit = type
            if(type == 0) {
                self.showDiagramPage = false
                self.showHdPage = true
            } else if(type == 1) {
                $.ajax({
                    type: "POST",
                    url: "/diagram/info/" + item.diagramId.toString(),
                    contentType: "application/json",
                    dataType: "json",
                    success: function(res){
                        console.log(res)
                        if(res.code == 200){
                            let data = res.dict
                            self.diagramForm = data
                            self.showDiagramPage = false
                            self.showHdPage = true
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
         //保存
         testSubmit(formName) {
            var self = this
            self.$refs[formName].validate((valid) => {
                if(valid) {
                    if(self.creatOrEdit == 0) {
                        var data = {
                            diagramMeetingId: self.diagramForm.diagramMeetingId,
                            diagramTitle: self.diagramForm.diagramTitle,
                            diagramStatus: '0',
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
                        self.submitCreatEdit()
                    }
                }
            })
        },
        
        // 提交
        submitCreatEdit() {
            var self = this
            var data = JSON.parse(JSON.stringify(self.diagramForm))
            console.log('准备提交保存的FORM', data)
            if (self.creatOrEdit == 0) {
                var reqUrl = '/diagram/save'
            } else if (self.creatOrEdit == 1) {
                var reqUrl = '/diagram/update'
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
                        self.closeCreatOrEdit('diagramForm')
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
            this. diagramForm = {
                diagramId: '',
                diagramTitle: '',
                diagramMeetingId: '',
                diagramCrtUserId:'',
                diagramModUserId:'',
                diagramCrtTime:'',
                diagramModTime:'',
                diagramStatus:'',
            },
            this.showHdPage = false
            this.showDiagramPage = true
        },
        //删除
        deleteThisDiagram(item) {
            console.log(item)
            var self = this
            self.$confirm('确实要删除该投票数据吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = JSON.parse(JSON.stringify(item))
                data.diagramStatus = "1"
                console.log(JSON.stringify(data))
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/diagram/update",
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
    }
})
