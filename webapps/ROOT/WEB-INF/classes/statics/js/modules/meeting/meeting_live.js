

var vm = new Vue({
    el: '#meeting_live',
    data(){
        return {
            //是否显示子页面
            showListPage: true,
            showCreatListPage: false, 
            showDetailPage: false,
            creatOrEdit:  0, //0新建  1修改
            picCount: '',
            searchForm: {
                reportTopicId: '',
                name: '', 
                delStatus: '0' //状态 0正常 1删除
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
            // 新建高清组图
            meetingLiveListForm: {
                id: '',
                name: '',
                reportTopicId: '',
                delStatus: '0',
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
            //组图列表图库弹出层相关
            showDiaLibDialog: false,
            multipleSelection: [],
            DiaTableData:[],
            searchmeetingLiveListForm:{
                id: '',
                diagramInfoStatus:'0'
            },
            pagination3: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
            //内容图库相关
            showContentImgLib: false,
            searchContentImgForm:{
                picTitle:'',
                picType:'1'//0封面图库 1内容图库 2图为图库
            },
            multipleSelection:[],
            contentImgTableData:[],
            //编辑时获取的id
            diaId: '',
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
        // 高清组图首页相关
        // 开始搜索列表
        startSearch(type) {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchForm))
            data.reportTopicId = data.reportTopicId.toString().trim()
            data.name = data.name.toString().trim()
            console.log(JSON.stringify(data))
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
         // 新建或修改高清组图  type:0  新增   type:1修改
        addOrEditPic(type, item) {
            var self = this
            self.creatOrEdit = type
            if(type == 0) {
                self.showListPage = false
                self.showCreatListPage = true
            } else if(type == 1) {
                $.ajax({
                    type: "POST",
                    url: "/meetingReportList/info/" + item.id.toString(),
                    contentType: "application/json",
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            let data = res.dict
                            self.meetingLiveListForm = data
                            self.showListPage = false
                            self.showCreatListPage = true
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
        //删除某项组图列表
        deleteThisDiagram(item) {
            var self = this
            self.$confirm('确实要删除该会场报道数据吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = JSON.parse(JSON.stringify(item))
                data.delStatus = "1"
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
                    console.log(self.creatOrEdit)
                    if(self.creatOrEdit == 1) {
                        var data = {
                            reportTopicId: self.meetingLiveListForm.reportTopicId,
                            name: self.meetingLiveListForm.name,
                            delStatus: self.meetingLiveListForm.delStatus,
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
            // console.log(self.creatOrEdit)
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
            this.showCreatListPage = false
            this.showListPage = true
        }
        
    }
})
