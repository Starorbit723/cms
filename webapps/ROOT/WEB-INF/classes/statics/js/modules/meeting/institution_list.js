var vm = new Vue({
    el: '#institution_list',
    data () {
        var validateUrl = (rule, value, callback) => {
            var urlReg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
            if (value == '' || value == null) {
                callback(new Error('链接不能为空'));
            } else if (value !== null) {
                if (value.trim() == '#') {
                    callback();
                } else if (!urlReg.test(value)) {
                    callback(new Error('链接格式不正确，暂无链接可填写"#"'));
                }
            } else {
                callback();
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
        return{
            showChildPage: false,
            creatOrEdit:0,//0新建  1修改
            //搜索提交
            searchForm:{
                cooperationName:'',
                cooperationStatus:'0',
            },
            //列表查询结果
            tableData: [{
                cooperationId:'',//主键编号
                cooperationName:'',//合作机构名称
                cooperationImg:'',//合作机构头像
                cooperationUrl:'',//
                cooperationPriority:'',//合作机构顺序
                cooperationCrtUserId:'',//创建人用户编号
                cooperationModUserId:'',//更新人用户编号
                cooperationCrtTime:'',//创建时间
                cooperationModTime:'',//更新时间
                cooperationStatus:'',//合作机构 状态 0正常 1删除
                cooperationCrtUserName:'',//创建人名称
                cooperationModUserName:'',//更新人名称
            }],
            //分页器相关
            pagination1: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
            //封面图表单
            coperForm:{
                cooperationId:'',//主键编号
                cooperationName:'',//合作机构名称
                cooperationImg:'',//合作机构头像
                cooperationUrl:'',//
                cooperationPriority:'',//合作机构顺序
                cooperationCrtUserId:'',//创建人用户编号
                cooperationModUserId:'',//更新人用户编号
                cooperationCrtTime:'',//创建时间
                cooperationModTime:'',//更新时间
                cooperationStatus:'',//合作机构 状态 0正常 1删除
                cooperationCrtUserName:'',//创建人名称
                cooperationModUserName:'',//更新人名称
            },
            coperFormRules:{
                cooperationName: [
                    { required: true, message: '机构姓名不能为空', trigger: 'change' }
                ],
                cooperationImg:[
                    { required: true, message: '请上传机构头像', trigger: 'change' }
                ],
                cooperationPriority: [
                    { validator: validatePriority, trigger: 'change' }
                ],
                cooperationUrl:[
                    { required: true, validator: validateUrl, trigger: 'change' }
                ]
            },
            //图片文件临时存储
            imgFormData:{},
            originUrl:''
        }
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
            data.cooperationName = data.cooperationName.toString().trim()
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
                url: "/cooperation/list",
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
        //新增或修改机构
        addOrEditCoper(type,item) {
            var self = this
            if(type == 0){
                self.showChildPage = true
                self.creatOrEdit = 0
                console.log('新增机构')
            } else {
                self.showChildPage = true
                self.creatOrEdit = 1
                self.coperForm = JSON.parse(JSON.stringify(item))
                self.originUrl = self.coperForm.cooperationImg
                console.log('修改机构','原始',self.originUrl,'表单',self.coperForm.cooperationImg)
            }
        },
        //删除
        deleteThisCoper (item){
            var self = this
            self.$confirm('确实要删除该机构吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = JSON.parse(JSON.stringify(item))
                data.cooperationStatus = 1  //0 正常  1 删除
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/cooperation/update",
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
        coperImgFileChange (file,fileList) {
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
                self.coperForm.cooperationImg = this.result
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
                                    self.coperForm.cooperationImg = res.url
                                    console.log('接受到图片改变后的form',self.coperForm)
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
                    } else if (self.creatOrEdit == 1 && (self.coperForm.cooperationImg !== self.originUrl )) {
                        console.log('当前',self.coperForm.cooperationImg,'原始：',self.originUrl)
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
                                    self.coperForm.cooperationImg = res.url
                                    console.log('接受到图片改变后的form',self.coperForm)
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
                        console.log('当前',self.coperForm.cooperationImg,'原始：',self.originUrl)
                        self.submitForm()
                    }
                }
            })
        },
        //提交表单
        submitForm () {
            var self = this
            self.$refs['coperForm'].validate((valid) => {
                if (valid) {
                    if (self.creatOrEdit == 0) {
                        var reqUrl = '/cooperation/save'
                    } else if (self.creatOrEdit == 1){
                        var reqUrl = '/cooperation/update'
                    }
                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        url: reqUrl,
                        data: JSON.stringify(self.coperForm),
                        dataType: "json",
                        success: function(res){
                            if (res.code == 200) {
                                self.$message.success('保存成功');
                                self.startSearch() //列表回显
                                self.closeEditCreatEdit('coperForm')
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
            this.coperForm = {
                cooperationId:'',//主键编号
                cooperationName:'',//合作机构名称
                cooperationImg:'',//合作机构头像
                cooperationUrl:'',//
                cooperationPriority:'',//合作机构顺序
                cooperationCrtUserId:'',//创建人用户编号
                cooperationModUserId:'',//更新人用户编号
                cooperationCrtTime:'',//创建时间
                cooperationModTime:'',//更新时间
                cooperationStatus:'',//合作机构 状态 0正常 1删除
                cooperationCrtUserName:'',//创建人名称
                cooperationModUserName:'',//更新人名称
            }
            this.showChildPage = false
            this.creatOrEdit = 0
        },
        handleAvatarSuccess(res, file) {
            //this.articleForm.imageUrl = URL.createObjectURL(file.raw);
        },
        
        
    }
})