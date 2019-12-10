

var vm = new Vue({
    el: '#meeting_hdpicture',
    data(){
        return {
            //是否显示子页面
            showDiagramPage: true,
            showHdPage: false, 
            showDetailPage: false,
            creatOrEdit:  0, //0新建  1修改
            picCount: '',
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
             //分页器相关
             pagination2: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
            // 新建高清组图
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
            },
            //组图列表图库弹出层相关
            showDiaLibDialog: false,
            multipleSelection: [],
            DiaTableData:[],
            searchDiagramForm:{
                diagramId: '',
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
            //编辑时获取的diagramId
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
            data.diagramMeetingId = data.diagramMeetingId.toString().trim()
            data.diagramTitle = data.diagramTitle.toString().trim()
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
                        // self.searchForm.diagramMeetingId = ''
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
        //删除某项组图列表
        deleteThisDiagram(item) {
            var self = this
            self.$confirm('确实要删除该组图数据吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = JSON.parse(JSON.stringify(item))
                data.diagramStatus = "1"
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/diagram/update",
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
                            url: "/diagram/list",
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
            // console.log('准备提交保存的FORM', data)
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



        //新建高清组图列表相关
        // 加载高清组图列表详情
        startSearch2(id, type) {
            var self = this
            var data1 = {
                diagramId: id.toString().trim(),
                diagramInfoStatus: '0'
            }
            var data = JSON.parse(JSON.stringify(data1))
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
                url: "/diagramInfo/list",
                contentType: "application/json",
			    data: JSON.stringify(data),
                dataType: "json",
                success: function(res) {
                    if(res.code == 200) {
                        self.diagramTableData = res.page.list
                        self.picCount = res.page.totalCount
                        self.pagination3 = {
                            currPage: res.page.currPage,
                            totalCount: res.page.totalCount,
                            totalPage: res.page.totalPage,
                            pageSize: res.page.pageSize
                        }
                    } else {
                        mapErrorStatus(res)
						vm.error = true;
						vm.errorMsg = res.msg;
                    }
                }
            })
        },
        //修改组图列表
        EditDetailList (item) {
            var self = this
            self.showDiagramPage = false
            self.showDetailPage = true
            self.diaId = item.diagramId
            self.startSearch2(self.diaId, 0)
        },
        //某项列表所包含的图片数量
        handleCurrentChange3 (val) {
            this.pagination3.currPage = val
            this.startSearch2(this.diaId)
        },
        //修改某一张内容图片
        chooseContentImg () {
            this.showContentImgLib = true
            this.searchContentImg(0)
        },
        //搜索内容图库
        searchContentImg(type){
            var self = this
            var data = JSON.parse(JSON.stringify(this.searchContentImgForm))
            data.picTitle = data.picTitle.trim()
            if (type == 0) {
                Object.assign(data,{
                    page: '1',
                    limit: self.pagination2.pageSize.toString()
                })
            } else {
                Object.assign(data,{
                    page: self.pagination2.currPage.toString(),
                    limit: self.pagination2.pageSize.toString()
                })
            }
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "/picture/list",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.contentImgTableData = res.page.list
                        self.pagination2 = {
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
        //内容图页面变化
        handleCurrentChange2 (val) {
            this.pagination2.currPage = val
            this.searchContentImg()
        },
        
         // 保存高清组图列表
         saveTable(data1){
            var self = this
            var data = JSON.parse(JSON.stringify(data1))
            $.ajax({
                type: "POST",
                url: "/diagramInfo/save",
                contentType: "application/json",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res) {
                    if(res.code == 200) {
                        self.$message.success('保存成功')
                        self.startSearch2(self.diaId, 0)
                        self.showContentImgLib = false
                        self.showDetailPage = true
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
        
        //选择了某一张封面图片
        addThisContentImg (item) {
            var self = this
            if(self.picCount >= 20) {
                self.$message.error('每个组图最多只能添加20张图片')
            } else {
                var data = [{
                    diagramId: self.diaId.toString(),
                    diagramInfoPriority: '-1',
                    diagramInfoImg: item.picUrl,
                    diagramInfoTitle: item.picTitle,
                    diagramInfoCrtTime: item.picCrtTime,
                    diagramInfoStatus: "0"
                }]
                self.saveTable(data)
            }
            
        },
        //返回编辑页
        backToEdit2 (){
            this.showContentImgLib = false
            this.showDetailPage = true
            this.searchContentImgForm = {
                picTitle:'',
                picType:'1'//0封面图库 1内容图库 2图为图库
            }
            this.contentImgTableData = [],
            this.pagination2 = {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            }
            
        },
        //多选批量
        handleSelectionChange (val) {
            this.multipleSelection = val;
        },
        // 批量添加图片至列表
        batchAddDia() {
            var self = this
            var len = self.multipleSelection.length
            var proTotal = len + self.picCount
            if(proTotal > 20) {
                self.$message.error('每个组图最多只能添加20张图片')
            } else {
                var data =[]
                for(i=0; i < len; i++) {
                    data.push({
                        diagramId: self.diaId,
                        diagramInfoStatu: "0",
                        diagramInfoPriority: '-1',
                        diagramInfoImg: self.multipleSelection[i].picUrl,
                        diagramInfoTitle: self.multipleSelection[i].picTitle,
                        diagramInfoCrtTime: self.multipleSelection[i].picCrtTime,
                    })
                }
                self.saveTable(data)
                self.startSearch2(self.diaId, 0)
                self.showContentImgLib = false
                self.showDetailPage = true
            }
        },
        // 权重发生改变时调整顺序
        scaleChange (item) {
            var reg = new RegExp("^(?:[0-9]{1,3}|999)$")
            if(!reg.test(item) && item !== "-1") {
                this.$message.error('权重值为-1到999之间的整数')
            }
        },
        // 保存图片
        submitForm(){
            var self = this
            var data = JSON.parse(JSON.stringify(self.diagramTableData))
            var reg = new RegExp("^(?:[0-9]{1,3}|999)$")
            for(var i = 0; i < self.diagramTableData.length; i++) {
                self.diagramTableData[i].diagramInfoId = self.diagramTableData[i].diagramInfoId.toString()
                var Pro = Number(self.diagramTableData[i].diagramInfoPriority)
                if(!reg.test(Pro) && Pro !== -1) {
                    this.$message.error('权重值为-1到999之间的整数')
                    return
                }
            }
            $.ajax({
                type: "POST",
                url: "/diagramInfo/update",
                contentType: "application/json",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.$message.success('保存成功')
                        self.startSearch()
                        self.closeDiaTable()
                    }else{
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
        // 关闭高清组图列表页面
        closeDiaTable() {
            this.showDetailPage = false
            this.showDiagramPage = true
        },
        
        //删除高清组图列表单项
        deleteThisDiaDetail(item){
            var self = this 
            self.$confirm('确实要删除该图片吗？', '提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var arr = []
                arr.push(item)
                var data = JSON.parse(JSON.stringify(arr))
                data[0].diagramInfoId = data[0].diagramInfoId.toString()
                data[0].diagramInfoStatus = "1"
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/diagramInfo/update",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res) {
                        if(res.code == 200) {
                            self.startSearch2(self.diaId)
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
