var vm = new Vue({
    el: '#rank_people',
    data: {
        showChildPage: false,
        creatOrEdit:0,//0新建  1修改
        //搜索提交
        searchForm:{
            name:'',
            delStatus:'1',
        },
        //列表查询结果
        tableData: [{
            id:'',//
            cvId:'',//投In关联id
            rankId:'',//榜单id
            rankCatalogId:'',//榜单目录Id
            name:'',//名称
            alive:'1',//是否已故，0已故，1在世
            logoUrl:'',//logo图片
            institutionId:'',//机构管理ID
            institutionName:'',//机构名称
            weight:'',//排序
            sortOrder:'',//排序方式，1，显示排序，2，不显示排序
            type:'',//1：机构；2：企业；3：人物；4：其他
            createUserId:'',//
            updateUserId:'',//
            updateAt:'',//
            createAt:'',//
            delStatus:'',//0已删除1未删除
        }],
        //分页器相关
        pagination1: {
            currPage: 1,
            totalCount:0,
            totalPage:0,
            pageSize:10
        },
        //封面图表单
        peopleForm:{
            id:'',//
            cvId:'',//投In关联id
            rankId:'',//榜单id
            rankCatalogId:'-1',//榜单目录Id
            name:'',//名称
            alive:'1',//是否已故，0已故，1在世
            logoUrl:'',//图片
            institutionId:'',//机构管理ID
            institutionName:'',//机构名称
            weight:'',//排序
            sortOrder:'',//排序方式，1，显示排序，2，不显示排序
            type:'',//1：机构；2：企业；3：人物；4：其他
            createUserId:'',//
            updateUserId:'',//
            updateAt:'',//
            createAt:'',//
            delStatus:'1',//0已删除1未删除
        },
        peopleFormRules:{
            name: [
                { required: true, message: '姓名不能为空', trigger: 'change' }
            ],
            logoUrl:[
                { required: true, message: '请上传头像', trigger: 'change' }
            ],
            institutionName: [
                { required: true, message: '机构不能为空', trigger: 'change' }
            ],
            alive:[
                { required: true, message: '该项目为必选项', trigger: 'change' }
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
            data.name = data.name.toString().trim()
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
                url: "/rankPerson/list",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.tableData = res.page.list
                        for (let i = 0; i < self.tableData.length; i++){
                            self.tableData[i].createAt = self.transformTime(parseFloat(self.tableData[i].createAt))
                            self.tableData[i].updateAt = self.transformTime(parseFloat(self.tableData[i].updateAt))
                        }
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
        addOrEditPeople(type,item) {
            var self = this
            if(type == 0){
                self.showChildPage = true
                self.creatOrEdit = 0
                console.log('新增嘉宾')
            } else {
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/rankPerson/info/" + item.id.toString(),
                    dataType: "json",
                    success: function(res) {
                        if (res.code == 200) {
                            self.showChildPage = true
                            self.creatOrEdit = 1
                            self.peopleForm = res.dict
                            self.peopleForm.alive = self.peopleForm.alive.toString()
                            self.originUrl = self.peopleForm.logoUrl
                            console.log('修改嘉宾','原始',self.originUrl,'表单',self.peopleForm.logoUrl)
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
        },
        //删除图片
        deleteThisPeople (item){
            var self = this
            self.$confirm('确实要删除该人物吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = {
                    id: item.id.toString(),
                    delStatus: '0' //0已删除1未删除
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/rankPerson/update",
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
                self.peopleForm.logoUrl = this.result
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
                                    self.peopleForm.logoUrl = res.url
                                    console.log('接受到图片改变后的form',self.peopleForm)
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
                    } else if (self.creatOrEdit == 1 && (self.peopleForm.logoUrl !== self.originUrl )) {
                        console.log('当前',self.peopleForm.logoUrl,'原始：',self.originUrl)
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
                                    self.peopleForm.logoUrl = res.url
                                    console.log('接受到图片改变后的form',self.peopleForm)
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
                        console.log('当前',self.peopleForm.logoUrl,'原始：',self.originUrl)
                        self.submitForm()
                    }
                }
            })
        },
        //提交表单
        submitForm () {
            var self = this
            self.$refs['peopleForm'].validate((valid) => {
                if (valid) {
                    if (self.creatOrEdit == 0) {
                        var reqUrl = '/rankPerson/save'
                    } else if (self.creatOrEdit == 1){
                        var reqUrl = '/rankPerson/update'
                    }
                    var data = JSON.parse(JSON.stringify(self.peopleForm))
                    data.alive = parseFloat(data.alive)
                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        url: reqUrl,
                        data: JSON.stringify(data),
                        dataType: "json",
                        success: function(res){
                            if (res.code == 200) {
                                self.$message.success('保存成功');
                                self.startSearch() //列表回显
                                self.closeEditCreatEdit('peopleForm')
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
            this.peopleForm = {
                id:'',//
                cvId:'',//投In关联id
                rankId:'',//榜单id
                rankCatalogId:'-1',//榜单目录Id
                name:'',//名称
                alive:'1',//是否已故，0已故，1在世
                logoUrl:'',//图片
                institutionId:'',//机构管理ID
                institutionName:'',//机构名称
                weight:'',//排序
                sortOrder:'',//排序方式，1，显示排序，2，不显示排序
                type:'',//1：机构；2：企业；3：人物；4：其他
                createUserId:'',//
                updateUserId:'',//
                updateAt:'',//
                createAt:'',//
                delStatus:'1',//0已删除1未删除
            }
            this.showChildPage = false
            this.creatOrEdit = 0
        },
        handleAvatarSuccess(res, file) {
            //this.articleForm.imageUrl = URL.createObjectURL(file.raw);
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