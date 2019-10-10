var vm = new Vue({
    el: '#rank_people',
    data: {
        showChildPage: false,
        creatOrEdit:0,//0新建  1修改
        //搜索提交
        searchForm:{
            guestName:'',
            guestStatus:'0',//图片分类查询 0封面 1内容  2图位 3广告 4自媒体头像
        },
        //列表查询结果
        tableData: [{
            guestId:'',//主键编号
            guestName:'',//嘉宾名称
            guestPosition:'',//嘉宾职位
            guestCompany:'',//嘉宾公司
            guestImg:'',//嘉宾头像
            guestPriority:'',//嘉宾顺序
            guestCrtUserId:'',//创建人用户编号
            guestModUserId:'',//更新人用户编号
            guestCrtTime:'',//创建时间
            guestModTime:'',//更新时间
            guestStatus:'',//嘉宾 状态 0正常 1删除
            guestCrtUserName:'',//创建人名称
            guestModUserName:'',//更新人名称
        }],
        //分页器相关
        pagination1: {
            currPage: 1,
            totalCount:0,
            totalPage:0,
            pageSize:10
        },
        //封面图表单
        guestForm:{
            guestId:'',//主键编号
            guestName:'',//嘉宾名称
            guestPosition:'',//嘉宾职位
            guestCompany:'',//嘉宾公司
            guestImg:'',//嘉宾头像
            guestPriority:'',//嘉宾顺序
            guestCrtUserId:'',//创建人用户编号
            guestModUserId:'',//更新人用户编号
            guestCrtTime:'',//创建时间
            guestModTime:'',//更新时间
            guestStatus:'',//嘉宾 状态 0正常 1删除
            guestCrtUserName:'',//创建人名称
            guestModUserName:'',//更新人名称
        },
        guestFormRules:{
            guestName: [
                { required: true, message: '嘉宾姓名不能为空', trigger: 'change' }
            ],
            guestImg:[
                { required: true, message: '请上传嘉宾头像', trigger: 'change' }
            ],
            guestCompany: [
                { required: true, message: '所在公司不能为空', trigger: 'change' }
            ],
            guestPosition:[
                { required: true, message: '嘉宾职位不能为空', trigger: 'change' }
            ]
        },
        //图片文件临时存储
        imgFormData:{},
        originUrl:''
    },
    watch: {
    },
    created () {
        this.startSearch(0)
    },
    methods:{
        handleCurrentChange (val) {
            this.pagination1.currPage = val
            this.startSearch()
        },
        //开始搜索专题列表
        startSearch (type) {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchForm))
            data.guestName = data.guestName.toString().trim()
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
                url: "/guest/list",
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
        //新增或修改嘉宾
        addOrEditGuest(type,item) {
            var self = this
            if(type == 0){
                self.showChildPage = true
                self.creatOrEdit = 0
                console.log('新增嘉宾')
            } else {
                self.showChildPage = true
                self.creatOrEdit = 1
                self.guestForm = JSON.parse(JSON.stringify(item))
                self.originUrl = self.guestForm.guestImg
                console.log('修改嘉宾','原始',self.originUrl,'表单',self.guestForm.guestImg)
            }
        },
        //删除图片
        deleteThisGuest (item){
            var self = this
            self.$confirm('确实要删除该嘉宾吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = JSON.parse(JSON.stringify(item))
                data.guestStatus = 1  //0 正常  1 删除
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/guest/update",
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
        //封面图改变时
        guestImgFileChange (file,fileList) {
            console.log(file)
            var self = this
            //开始图片验证
            if (file.size / 1024 / 1024 > 0.2 ) {
                self.$message.error('上传单张图片大小不能超过200K');
                return
            }
            if (file.raw.type !== 'image/jpeg' && file.raw.type !== 'image/png' && file.raw.type !== 'image/jpg') {
                self.$message.error('上传图片只能是 JPG 或 png 格式');
                return
            }
            //创建临时的路径来展示图片
            var fr = new FileReader()//创建new FileReader()对象
            fr.onload = function() {
                //先临时显示一下本地图片
                self.guestForm.guestImg = this.result
            }
            fr.readAsDataURL(file.raw)
            let temp = new FormData();
            temp.append('files',file.raw);
            //temp.append('filePath','/usr/local/images/');
            console.log('待上传图片', temp)
            self.imgFormData = temp
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
                                    self.guestForm.guestImg = res.url
                                    console.log('接受到图片改变后的form',self.guestForm)
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
                    } else if (self.creatOrEdit == 1 && (self.guestForm.guestImg !== self.originUrl )) {
                        console.log('当前',self.guestForm.guestImg,'原始：',self.originUrl)
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
                                    self.guestForm.guestImg = res.url
                                    console.log('接受到图片改变后的form',self.guestForm)
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
                        console.log('当前',self.guestForm.guestImg,'原始：',self.originUrl)
                        self.submitForm()
                    }
                }
            })
        },
        //提交表单
        submitForm () {
            var self = this
            self.$refs['guestForm'].validate((valid) => {
                if (valid) {
                    if (self.creatOrEdit == 0) {
                        var reqUrl = '/guest/save'
                    } else if (self.creatOrEdit == 1){
                        var reqUrl = '/guest/update'
                    }
                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        url: reqUrl,
                        data: JSON.stringify(self.guestForm),
                        dataType: "json",
                        success: function(res){
                            if (res.code == 200) {
                                self.$message.success('保存成功');
                                self.startSearch() //列表回显
                                self.closeEditCreatEdit('guestForm')
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
                }
            })
        },
        //取消编辑返回列表页
        closeEditCreatEdit (formName) {
            this.originUrl = ''
            this.imgFormData = ''
            this.$refs[formName].resetFields();
            this.guestForm = {
                guestId:'',//主键编号
                guestName:'',//嘉宾名称
                guestPosition:'',//嘉宾职位
                guestCompany:'',//嘉宾公司
                guestImg:'',//嘉宾头像
                guestPriority:'',//嘉宾顺序
                guestCrtUserId:'',//创建人用户编号
                guestModUserId:'',//更新人用户编号
                guestCrtTime:'',//创建时间
                guestModTime:'',//更新时间
                guestStatus:'',//嘉宾 状态 0正常 1删除
                guestCrtUserName:'',//创建人名称
                guestModUserName:'',//更新人名称
            }
            this.showChildPage = false
            this.creatOrEdit = 0
        },
        handleAvatarSuccess(res, file) {
            //this.articleForm.imageUrl = URL.createObjectURL(file.raw);
        },
        
        
    }
})