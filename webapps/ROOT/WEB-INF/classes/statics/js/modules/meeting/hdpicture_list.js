var vm = new Vue({
    el: "#hdpicture_list",
    data () {
        var validateDiaId = (rule, value, callback) => {
            var urlReg = /^[0-9]*[1-9][0-9]*$/;
            if (value !== '' && urlReg.test(value)) {
                callback();
            } else {
                callback(new Error('组图所属编号必须为整数'));
            }
        }
        var validatePriority = (rule, value, callback) => {
            var urlReg = /^[0-9]*[1-9][0-9]*$/;
            if (value !== '' && value == '-1') {
                callback();
            } else if (value !== '' && !urlReg.test(value)) {
                callback(new Error('权重需改为正整数或-1,-1代表权重最低'));
            } else {
                callback();
            }
        }
        return {
            showChildPage: false,
            creatOrEdit:0,//0新建  1修改
            //搜索提交
            searchForm:{
                diagramId:'', //所属投票编号
                diagramInfoStatus:'0',//状态 0正常 1删除
            },
            pagination1: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
            //列表查询结果
            tableData: [{
                diagramInfoId: '',
                diagramInfoTitle: '',
                diagramInfoPriority: '',
                diagramInfoImg: '',
                diagramId: '',
                diagramInfoCrtUserId: '',
                diagramInfoModUserId: '',
                diagramInfoCrtTime: '',
                diagramInfoModTime: '',
                diagramInfoStatus: '',
            }],
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
            //分页器相关
            pagination2: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
            // 新建投票选项表单
            hdPicForm: {
                diagramInfoId: '',
                diagramInfoTitle: '',
                diagramInfoPriority: '-1',
                diagramInfoImg: '',
                diagramId: '',
                diagramInfoCrtUserId: '',
                diagramInfoModUserId: '',
                diagramInfoCrtTime: '',
                diagramInfoModTime: '',
                diagramInfoStatus: '',
            },
            hdPicFormRules: {
                diagramInfoTitle: [
                    { required: true, message: '组图标题不能为空', trigger: 'change' }
                ],
                diagramInfoImg: [
                    { required: true, message: '请上传组图图片', trigger: 'change' }
                ],
                diagramId: [
                    { validator: validateDiaId, trigger: 'change' }
                ],
                diagramInfoPriority: [
                    { validator: validatePriority, trigger: 'change' }
                ]

            },
            
        }
    },
    created () {
        this.startSearch(0)
    },
    methods:{
        //切换页码
        handleCurrentChange (val) {
            this.pagination1.currPage = val
            this.startSearch() 
        },
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
                        console.log(self.contentImgTableData)
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
            console.log(item)
            this.hdPicForm.diagramInfoImg = item.picUrl
            this.backToEdit2()
        },
        //返回编辑页
        backToEdit2 (){
            this.showContentImgLib = false
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
        
         //开始搜索选项列表
        startSearch (type) {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchForm))
            data.diagramId = data.diagramId.toString().trim()
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
                contentType: "application/json",
                url: "/diagramInfo/list",
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
        addOrEditHdpic(type, item) {
            var self = this
            self.creatOrEdit = type
            if(type == 0){
                self.showChildPage = true
                console.log('新增投票选项')
            } else {
                $.ajax({
                    type: "POST",
                    url:"/diagramInfo/info/" + item.diagramInfoId.toString(),
                    contentType: "application/json",
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200) {
                            let data = res.dict
                            self.hdPicForm = data
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
        deleteThisHdpic (item) {
            var self = this
            self.$confirm('确定删除该选项吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = JSON.parse(JSON.stringify(item))
                data.diagramInfoStatus = 1 //0 正常  1 删除
                console.log(data)
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/diagramInfo/update",
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
        
        //保存
        testSubmit(formName) {
            var self = this
            self.$refs[formName].validate((valid) => {
                if(valid) {
                    if(self.creatOrEdit == 0) {
                        var data = {
                            diagramId: self.hdPicForm.diagramId,
                            diagramInfoStatus: '0',
                            page: '1',
                            limit: '100'
                        }
                        $.ajax({
                            type: "POST",
                            url: "/diagramInfo/list",
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
        //新建或编辑保存--优先上传图片，再提交保存
        submitCreatEdit(formName) {
            var self = this
            var data = JSON.parse(JSON.stringify(self.hdPicForm))
            data.diagramInfoStatus = "0"
            console.log(JSON.stringify(data))
            console.log('准备提交保存的FORM', data)
            if (self.creatOrEdit == 0) {
                var reqUrl = '/diagramInfo/save'
            } else if (self.creatOrEdit == 1) {
                var reqUrl = '/diagramInfo/update'
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
                        self.closeEditCreatEdit('hdPicForm')
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
        
        //取消编辑返回列表页
        closeEditCreatEdit (formName) {
            this.creatOrEdit = 0
            this.$refs[formName].resetFields();
            this.hdPicForm = {
                diagramInfoId: '',
                diagramInfoTitle: '',
                diagramInfoPriority: '',
                diagramInfoImg: '',
                diagramId: '',
                diagramInfoCrtUserId: '',
                diagramInfoModUserId: '',
                diagramInfoCrtTime: '',
                diagramInfoModTime: '',
                diagramInfoStatus: '',
            }
            this.showChildPage = false
        }

    }

})