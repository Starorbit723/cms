

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
            showDetailPage: false,
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
             //分页器相关
             pagination2: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
             //分页器相关
             pagination3: {
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
            chooseImgObjName:'',
            chooseImgObjIndex:'',
            showContentImgLib: false,
            searchContentImgForm:{
                picTitle:'',
                picType:'1'//0封面图库 1内容图库 2图为图库
            },
            multipleSelection:[],
            contentImgTableData:[],
            
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
       
        // 图片列表页面变化
        // handleCurrentChange3 (val) {
        //     this.pagination2.currPage = val
        //     this.startSearch2(self.diaId)
        // },
         //内容图页面变化
         handleCurrentChange2 (val) {
            this.pagination2.currPage = val
            this.searchContentImg()
        },
        //修改某一张内容图片
        chooseContentImg () {
            this.showContentImgLib = true
            console.log(this.showContentImgLib)
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
        //选择了某一张封面图片
        addThisContentImg (item) {
            var self = this
            console.log(item)
            var data = [{
                diagramId: self.diaId,
                diagramInfoPriority: '-1',
                diagramInfoImg: item.picUrl,
                diagramInfoTitle: item.picTitle,
                diagramInfoCrtTime: item.picCrtTime,
                diagramInfoStatus: "0"
            }]
            self.diagramTableData.push({
                diagramId: self.diaId,
                diagramInfoPriority: '-1',
                diagramInfoImg: item.picUrl,
                diagramInfoTitle: item.picTitle,
                diagramInfoCrtTime: item.picCrtTime,
                diagramInfoStatus: "0"
            })
            console.log(self.diagramTableData)
            console.log(data)
            self.saveTable(data)
            self.startSearch2(self.diaId)
            self.showContentImgLib = false
            self.showDetailPage = true
            console.log(self.showDetailPage)
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
            console.log(val)
            this.multipleSelection = val;
        },
        // // 批量添加图片至列表
        batchAddDia() {
            var self = this
            console.log(self.multipleSelection)
            console.log(self.diaId)
            var len = self.multipleSelection.length
            for(i=0; i < len; i++) {
                this.diagramTableData.push({
                    diagramId: self.diaId,
                    diagramInfoStatu: "0",
                    diagramInfoPriority: '-1',
                    diagramInfoImg: self.multipleSelection[i].picUrl,
                    diagramInfoTitle: self.multipleSelection[i].picTitle,
                    diagramInfoCrtTime: self.multipleSelection[i].picCrtTime,
                })
            }
            
            var data = this.diagramTableData.slice(-len)
            console.log(data)
            self.saveTable(data)
            self.startSearch2(self.diaId)
            self.showContentImgLib = false
            self.showDetailPage = true
            console.log(self.diagramTableData)
        },
        // 关闭高清组图列表页面
        closeDiaTable() {
            this.showDetailPage = false
            this.showDiagramPage = true
        },
        
        

        // 弹出组图列表
        // addDiaPic () {
        //     this.searchDiaList(0)
        //     this.showDiaLibDialog = true
        // },
        // 搜索组图列表图片
        // searchDiaList(type) {
        //     var self = this
        //     console.log(self)
        //     var data = self.searchDiagramForm
        //     // data.diagramId = data.diagramId.trim()
        //     console.log(JSON.stringify(data))
        //     if (type == 0) {
        //         Object.assign(data,{
        //             page: '1',
        //             limit: self.pagination3.pageSize.toString()
        //         })
        //     } else {
        //         Object.assign(data,{
        //             page: self.pagination3.currPage.toString(),
        //             limit: self.pagination3.pageSize.toString()
        //         })
        //     }
        //     $.ajax({
        //         type: "POST",
        //         contentType: "application/json",
        //         url: "/diagramInfo/list",
        //         data: JSON.stringify(data),
        //         dataType: "json",
        //         success: function(res){
        //             console.log(res)
        //             if(res.code == 200) {
        //                 self.searchDiagramForm.diagramId = ''
        //                 self.DiaTableData = res.page.list 
        //                 self.pagination3 = {
        //                     currPage: res.page.currPage,
        //                     totalCount:res.page.totalCount,
        //                     totalPage:res.page.totalPage,
        //                     pageSize:res.page.pageSize
        //                 } 
        //             }else{
        //                 mapErrorStatus(res)
        //                 vm.error = true;
        //                 vm.errorMsg = res.msg;
        //             }
                   
        //         },
        //         error:function(res){
        //             mapErrorStatus(res)
        //         }
        //     });
        // },
        //添加组图图片至本页面
        // addThisDiagram(item) {
        //     console.log('单个选择添加某个图片',item)
        //     this.diagramTableForm.diagramTableData.push({
        //         diagramInfoPriority: item.diagramInfoPriority,
        //         diagramId: item.diagramId,
        //         diagramInfoImg: item.diagramInfoImg,
        //         diagramInfoTitle: item.diagramInfoTitle,
        //         diagramInfoCrtTime: item.diagramInfoCrtTime
        //     })
        //     console.log(this.diagramTableForm.diagramTableData)
        //     this.backToEdit()
        // },
        //返回编辑页
        // backToEdit (){
        //     this.showDiaLibDialog = false
        //     this.multipleSelection = []
        //     this.searchDiagramForm = {
        //         diagramInfoTitle:'',
        //         diagramInfoStatus:'0'
        //     }
        //     this.DiaTableData = []
        //     this.pagination3 = {
        //         currPage: 1,
        //         totalCount:0,
        //         totalPage:0,
        //         pageSize:10
        //     }
        // },
         
        // 保存高清组图列表
        saveTable(data1){
            var self = this
            var data = JSON.parse(JSON.stringify(data1))
            console.log(data)
            console.log(JSON.stringify(data))
            $.ajax({
                type: "POST",
                url: "/diagramInfo/save",
                contentType: "application/json",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res) {
                    console.log(res)
                    if(res.code == 200) {
                        self.$message.success('保存成功')
                        self.startSearch2(self.diaId)
                        // self.closeDiaTable()
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
        
        //修改组图列表
        EditDetailList (item) {
            var self = this
            self.showDiagramPage = false
            self.showDetailPage = true
            self.diaId = item.diagramId
            self.startSearch2(self.diaId)
        },
        // 加载高清组图列表详情
        startSearch2(id) {
            var self = this
            var data1 = {
                diagramId: id.toString().trim(),
                diagramInfoStatus: '0'
            }
            var data = JSON.parse(JSON.stringify(data1))
            console.log(data)
            $.ajax({
                type: "POST",
                url: "/diagramInfo/list",
                contentType: "application/json",
			    data: JSON.stringify(data),
                dataType: "json",
                success: function(res) {
                    console.log(res)
                    if(res.code == 200) {
                        self.diagramTableData = res.page.list
                        self.pagination2 = {
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
                }
            })
        },
     
        // 开始搜索列表
        startSearch(type) {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchForm))
            data.diagramMeetingId = data.diagramMeetingId.toString().trim()
            console.log(data)
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
                        self.searchForm.diagramMeetingId = ''
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
                            url: "/diagram/list",
                            contentType: "application/json",
                            data: JSON.stringify(data),
                            dataType: "json",
                            success: function(res) {
                                console.log(res)
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
        
        //删除高清组图列表单项
        deleteThisDiaDetail(item){
            console.log(item)
            var self = this 
            self.$confirm('确实要删除该图片吗？', '提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = JSON.parse(JSON.stringify(item))
                data.diagramInfoId = data.diagramInfoId.toString()
                data.diagramInfoStatus = "1"
                console.log(data)
                console.log(JSON.stringify(data))
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/diagramInfo/update",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res) {
                        console.log(res)
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
                console.log(data)
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
