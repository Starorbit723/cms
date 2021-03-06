var vm = new Vue({
    el: '#position_image',
    data: {
        showChildPage: false,
        creatOrEdit:0,//0新建  1修改
        pickerOptions:{
            disabledDate(time) {
                return time.getTime() > Date.now();
            }
        },  
        picTypeOptions:[{
            label: '封面用图',
            value: 0
        },{
            label: '内容用图',
            value: 1
        },{
            label: '图位用图',
            value: 2
        },{
            label: '广告用图',
            value: 3
        },{
            label: '自媒体用图',
            value: 4
        }],
        picStatusOptions:[{
            label: '下架',
            value: 0
        },{
            label: '上架',
            value: 1
        }],
        picPosOptions:[],
        //搜索提交
        searchForm:{
            picTitle:'',
            picType:'2',//图片分类查询 0封面 1内容  2图位 3广告 4自媒体头像
            starTime:'',
            endTime:'',
            picTypeId:'-1'//所属图位的id
        },
        timeRange:[],
        multipleSelection: [],
        //专题列表查询结果
        tableData: [{
            picId:'',//主键编号
            picTitle:'',//图片标题
            picDesc:'',//图片详情
            picUrl:'',//图片地址
            picType: 2,//图片分类查询 0封面 1内容  2图位 3广告 4自媒体头像
            picStatus:'',//图片状态 0下线 1上线
            picEditor:'',//图片编辑编号
            picCrtTime:'',//图片创建时间
            picModTime:'',//图片更新时间
            picTypeId:'',//所属图位id
            picTypeName:''//所属图位名称
        }],
        //分页器相关
        pagination1: {
            currPage: 1,
            totalCount:0,
            totalPage:0,
            pageSize:10
        },
        //封面图表单
        picPosForm:{
            picId:'',//主键编号
            picTitle:'',//图片标题
            picDesc:'',//图片详情
            picUrl:'',//图片地址
            picType:2,//图片分类查询 0封面 1内容  2图位 3广告 4自媒体头像
            picStatus:'',//图片状态 0下线 1上线
            picEditor:'',//图片编辑编号
            picCrtTime:'',//图片创建时间
            picModTime:'',//图片更新时间
            picTypeId:'',//所属图位id
            picTypeName:''//所属图位名称
        },
        picPosFormRules:{
            picTitle: [
                { required: true, message: '图片标题不能为空', trigger: 'change' }
            ],
            // picTypeId:[
            //     { required: true, message: '请选择所属图位', trigger: 'change' }
            // ],
            picUrl: [
                { required: true, message: '图片地址不能为空', trigger: 'change' }
            ]
        },
        //图片文件临时存储
        imgFormData:{},
        originUrl:''
    },
    watch: {
        timeRange (val) {
            this.searchForm.startTime = val[0]
            this.searchForm.endTime = val[1]
        }
    },
    created () {
        this.getPicTypeOption()
        this.startSearch(0)
    },
    methods:{
        handleCurrentChange (val) {
            this.pagination1.currPage = val
            this.startSearch()
        },
        //初始化获取所有图位种类
        getPicTypeOption () {
            var self = this
            var data = {
                name:'',
                page: '1',
                limit: '500'
            }
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "/pictureType/list",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.picPosOptions = res.page.list
                    }else{
                        vm.error = true;
                        vm.errorMsg = res.msg;
                    }
                }
            })
        },
        //开始搜索专题列表
        startSearch (type) {
            var self = this
            var data = self.searchForm
            data.picTitle = data.picTitle.toString().trim()
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
                url: "/picture/list",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.searchForm = {
                            endTime: "",
                            picTitle: "",
                            picType: "2",
                            starTime: "",
                            picTypeId:''//所属图位的id
                        }
                        self.timeRange = []
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
        //多选批量
        handleSelectionChange (val) {
            this.multipleSelection = val;
        },
        //批量删除
        batchDeletePicPos () {
            var self = this
            self.$confirm('确实要批量删除选中的图片吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = []
                for (let i = 0; i < self.multipleSelection.length; i++) {
                    data.push(self.multipleSelection[i].picId)
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/picture/delete",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            self.startSearch()
                            self.multipleSelection = []
                            self.$message.success('删除成功')
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
            })
        },
        //删除图片
        deleteThisImg (item){
            var self = this
            self.$confirm('确实要删除该图片吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/picture/delete",
                    data: JSON.stringify([item.picId]),
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            self.startSearch()
                            self.$message.success('删除成功')
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
            })
        },
        //新建修改专题页面切换
        addEditImg (item) {
            console.log(item)
            if(item == 0){
                this.showChildPage = true
                this.creatOrEdit = 0
                console.log('新增图片')
            } else {
                this.showChildPage = true
                this.creatOrEdit = 1
                this.picPosForm = JSON.parse(JSON.stringify(item))
                this.originUrl = this.picPosForm.picUrl
                console.log('修改图片')
            }
        },
        //封面图改变时
        coverImgFileChange (file,fileList) {
            console.log(file)
            var self = this
            //开始图片验证
            if (file.size / 1024 / 1024 > 2 ) {
                self.$message.error('上传图片大小不能超过2MB');
                return
            }
            if (file.raw.type !== 'image/jpeg' && file.raw.type !== 'image/png') {
                self.$message.error('上传图片只能是 JPG 或 png 格式');
                return
            }
            //创建临时的路径来展示图片
            var fr = new FileReader()//创建new FileReader()对象
            fr.onload = function() {
                //先临时显示一下本地图片
                self.picPosForm.picUrl = this.result
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
                            success: function(res){
                                if(res.code == 200){
                                    console.log('图片上传返回',res)
                                    self.picPosForm.picUrl = res.url
                                    self.picPosForm.picEditor = getCookie('userId')
                                    console.log('接受到图片改变后的form',self.picPosForm)
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
                    } else if (self.creatOrEdit == 1 && (self.picPosForm.picUrl !== self.originUrl )) {
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
                                    self.picPosForm.picUrl = res.url
                                    console.log('接受到图片改变后的form',self.picPosForm)
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
                        self.submitForm()
                    }
                }
            })
        },
        //提交表单
        submitForm () {
            var self = this
            self.$refs['picPosForm'].validate((valid) => {
                if (valid) {
                    if (self.creatOrEdit == 0) {
                        var reqUrl = '/picture/save'
                        self.picPosForm.picEditor = getCookie('userId')
                    } else if (self.creatOrEdit == 1){
                        var reqUrl = '/picture/update'
                    }
                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        url: reqUrl,
                        data: JSON.stringify(self.picPosForm),
                        dataType: "json",
                        success: function(res){
                            if(res.code == 200){
                                self.$message.success('保存成功');
                                self.startSearch() //列表回显
                                self.closeEditCreatEdit('picPosForm')
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
            })
        },
        //取消编辑返回列表页
        closeEditCreatEdit (formName) {
            this.originUrl = ''
            this.imgFormData = ''
            this.$refs[formName].resetFields();
            this.picPosForm = {
                picId:'',//主键编号
                picTitle:'',//图片标题
                picDesc:'',//图片详情
                picUrl:'',//图片地址
                picType:2,//图片分类查询 0封面 1内容  2图位 3广告 4自媒体头像
                picStatus:'',//图片状态 0下线 1上线
                picEditor:'',//图片编辑编号
                picCrtTime:'',//图片创建时间
                picModTime:'',//图片更新时间
                picTypeId:'',//所属图位id
                picTypeName:''//所属图位名称
            }
            this.showChildPage = false
            this.creatOrEdit = 0
        },
        //下载当前图片
        downLoadThisPic (item) {
            console.log(item.picUrl)
            window.open(item.picUrl)
        }
  
    }
})