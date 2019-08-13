var vm = new Vue({
    el: "#hdpicture_list",
    data () {
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
            showContentImgLib: false,
            searchContentimgForm:{
                picTitle:'',
                picType:'1'//0封面图库 1内容图库 2图为图库
            },
            multipleSelection:[],
            contentimgTableData:[],
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
                diagramInfoPriority: '',
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
            var data = JSON.parse(JSON.stringify(this.searchContentimgForm))
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
            if (this.chooseImgObjName == 'signUp' && this.chooseImgObjIndex == 0) {
                this.meetingForm.meetingJson.signUpCodeImg = item.picUrl
            } else {
                this.meetingForm.meetingJson[this.chooseImgObjName][this.chooseImgObjIndex].imgUrl = item.picUrl
            }
            this.backToEdit2()
        },
        //返回编辑页
        backToEdit2 (){
            this.showContentImgLib = false
            this.chooseImgObjName = ''
            this.chooseImgObjIndex = ''
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
         //开始搜索选项列表
        startSearch (type) {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchForm))
            data.diagramId = data.diagramId.toString().trim()
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
        
        //新建或编辑保存--优先上传图片，再提交保存
        submitCreatEdit(formName) {
            var self = this
            self.$refs[formName].validate((valid) => {
                if (valid) {
                    //新建,图片新上传
                    if (self.creatOrEdit == 0) {
                        $.ajax({
                            type: "POST",
                            contentType: false,
                            processData: false,
                            mimeType:"multipart/form-data",
                            url: "/upload/headPicture",
                            data: self.imgFormData,
                            success: function(res) {
                                if(res.code == 200){
                                    console.log('图片上传返回',res)
                                    self.hdPicForm.diagramInfoImg = res.url
                                    console.log('接受到图片改变后的form',self.hdPicForm)
                                    self.submitForm()
                                }else{
                                    self.$message.error('图片上传失败,请联系管理员')
                                    mapErrorStatus(res)
                                    vm.error = true;
                                    vm.errorMsg = res.msg;
                                }
                            },
                            error:function(res){
                                mapErrorStatus(res)
                            }
                        });
                    //修改，图片发生了改变
                    } else if (self.creatOrEdit == 1 && (self.hdPicForm.diagramInfoImg !== self.originUrl )) {
                        console.log('当前',self.hdPicForm.diagramInfoImg,'原始：',self.originUrl)
                        $.ajax({
                            type: "POST",
                            contentType: false,
                            processData: false,
                            mimeType:"multipart/form-data",
                            url: "/upload/headPicture",
                            data: self.imgFormData,
                            success: function(res){
                                if(res.code == 200){
                                    console.log('图片上传返回',res)
                                    self.hdPicForm.diagramInfoImg = res.url
                                    console.log('接受到图片改变后的form',self.hdPicForm)
                                    self.submitForm()
                                }else{
                                    self.$message.error('图片上传失败,请联系管理员')
                                    mapErrorStatus(res)
                                    vm.error = true;
                                    vm.errorMsg = res.msg;
                                }
                            },
                            error:function(res){
                                mapErrorStatus(res)
                            }
                        });
                    //修改，图片未改变
                    } else {
                        console.log('当前',self.hdPicForm.diagramInfoImg,'原始：',self.originUrl)
                        self.submitForm()
                    }
                }
            })
        },
        // 提交保存
        submitForm() {
            var self = this
            if(self.creatOrEdit == 0) {
                var reqUrl = '/diagramInfo/save'
            } else if (self.creatOrEdit == 1) {
                var reqUrl = '/diagramInfo/update'
            }
            var data = JSON.parse(JSON.stringify(self.hdPicForm))
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: reqUrl,
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res) {
                    console.log(res)
                    if(res.code == 200) {
                        self.$message.success('保存成功');
                        self.startSearch() //列表回显
                        self.closeEditCreatEdit('hdPicForm')
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
            this.creatOrEdit = 0
        }

    }

})