var vm = new Vue({
    el: '#meeting_institution',
    data: {
        showChildPage: true,
        creatOrEdit:0,//0新建  1修改
        //搜索提交
        searchForm:{
            meetingCooperationMeetingId:'',
            meetingCooperationStatus:'0',//图片分类查询 0封面 1内容  2图位 3广告 4自媒体头像
        },
        //列表查询结果
        tableData: [{
            meetingCooperationId:'',//主键
            meetingCooperationMeetingId:'',//所属会议编号
            meetingCooperationCrtUserId:'',//
            meetingCooperationModUserId:'',//
            meetingCooperationCrtTime:'',//
            meetingCooperationModTime:'',//
            meetingCooperationStatus:'',//状态 0正常 1删除
            meetingCooperationJson:'',//
        }],
        //分页器相关
        pagination1: {
            currPage: 1,
            totalCount:0,
            totalPage:0,
            pageSize:10
        },
        //会议合作机构表单
        meetingCopForm:{
            meetingCooperationId:'',//主键
            meetingCooperationMeetingId:'',//所属会议编号
            meetingCooperationCrtUserId:'',//
            meetingCooperationModUserId:'',//
            meetingCooperationCrtTime:'',//
            meetingCooperationModTime:'',//
            meetingCooperationStatus:'',//状态 0正常 1删除
            meetingCooperationJson:[{ //JSON数据
                type:'titleLv1',
                labelText:'',
                children:[{
                    type:'titleLv2',
                    labelText:'',
                    children:[{
                        title:'',
                        picUrl:''
                    }]
                }]
            }],
        
        },
        meetingCopFormRules:{
            meetingCooperationMeetingId: [
                { required: true, message: '所属会议编号不能为空', trigger: 'change' }
            ]
            
        },
        //当前打开图库时的索引记录
        chooseIndex:'',
        chooseIndex2:'',
        multipleSelection: [],
        //自媒体图库弹出层相关
        showMeidaLibDialog:false,
        searchSelfmediaimgForm:{
            picTitle:'',
            picType:'4'//0封面图库 1内容图库 2图为图库 3广告  4自媒体
        },
        selfmediaimgTableData:[],
        pagination3: {
            currPage: 1,
            totalCount:0,
            totalPage:0,
            pageSize:10
        },
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
        handleCurrentChange3 (val) {
            this.pagination3.currPage = val
            this.searchSelfmediaImg()
        },
        //开始搜索专题列表
        startSearch (type) {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchForm))
            data.meetingCooperationMeetingId = data.meetingCooperationMeetingId.toString().trim()
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
                url: "/meeting/cooperation/list",
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
        //添加一级标题---1级维度
        addCopLv1 () {
            let Lv1Length = this.meetingCopForm.meetingCooperationJson.length
            if (this.meetingCopForm.meetingCooperationJson[Lv1Length - 1].labelText.trim() !== '') {
                this.meetingCopForm.meetingCooperationJson.push({
                    type:'titleLv1',
                    labelText:'',
                    children:[]
                })
            } else {
                this.$message.error('请完成上一个一级标题的内容')
            }
        },
        //删除一级标题---1级维度
        delCopLv1 (index) {
            if (this.meetingCopForm.meetingCooperationJson.length <= 1) {
                this.$message.error('至少保留一个日程')
            } else {
                this.meetingCopForm.meetingCooperationJson.splice(index, 1); 
            }
        },
        //添加二级标题---2级维度
        addCopLv2 (index) {
            console.log(index)
            let currentLv1 = this.meetingCopForm.meetingCooperationJson[index]
            if (currentLv1.children.length == 0) {
                this.meetingCopForm.meetingCooperationJson[index].children.push({
                    type:'titleLv2',
                    labelText:'',
                    children:[]
                })
            } else {
                if (currentLv1.children[currentLv1.children.length - 1].labelText.trim() !== '' || currentLv1.children[currentLv1.children.length - 1].labelText.trim() == '#') {
                    this.meetingCopForm.meetingCooperationJson[index].children.push({
                        type:'titleLv2',
                        labelText:'',
                        children:[]
                    })
                } else {
                    this.$message.error('请填写上一个二级标题信息，无信息需填写"#"')
                }
            }
        },
        //删除二级标题---2级维度
        delCopLv2 (index,index2) {
            console.log(index,index2)
            this.meetingCopForm.meetingCooperationJson[index].children.splice(index2, 1); 
        },
        //添加机构媒体---2级维度
        addCopLv3(index,index2) {
            this.chooseIndex = index
            this.chooseIndex2 = index2
            this.searchSelfmediaImg(0)
            this.showMeidaLibDialog = true
        },
        //前移
        moveUp(index,index2,index3){
            var moveArr = JSON.parse(JSON.stringify(this.meetingCopForm.meetingCooperationJson[index].children[index2].children))
            let temp = moveArr[index3 - 1]
            let temp2 = moveArr[index3]
            moveArr[index3 - 1] = temp2
            moveArr[index3] = temp
            this.meetingCopForm.meetingCooperationJson[index].children[index2].children = moveArr
        },
        //后移
        moveDown(index,index2,index3){
            var moveArr = JSON.parse(JSON.stringify(this.meetingCopForm.meetingCooperationJson[index].children[index2].children))
            let temp = moveArr[index3]
            let temp2 = moveArr[index3 + 1]
            moveArr[index3 + 1] = temp
            moveArr[index3] = temp2
            this.meetingCopForm.meetingCooperationJson[index].children[index2].children = moveArr
        },
        //搜索图库
        searchSelfmediaImg (type){
            var self = this
            var data = self.searchSelfmediaimgForm
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
                contentType: "application/json",
                url: "/picture/list",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.searchSelfmediaimgForm.picTitle = ''
                        self.selfmediaimgTableData = res.page.list
                        self.pagination3 = {
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
        //添加图片至页面
        addThisImg (item) {
            console.log('单个选择添加某个logo',item)
            this.meetingCopForm.meetingCooperationJson[this.chooseIndex].children[this.chooseIndex2].children.push({
                title: item.picTitle,
                picUrl: item.picUrl
            });
            this.backToEdit()
        },
        //删除所选的logo
        delThisLogo(index,index2,index3){
            this.meetingCopForm.meetingCooperationJson[index].children[index2].children.splice(index3, 1); 
        },
        //批量添加图片至列表
        batchAddLogo () {
            console.log(this.multipleSelection)
            for (let i=0; i < this.multipleSelection.length; i++) {
                this.meetingCopForm.meetingCooperationJson[this.chooseIndex].children[this.chooseIndex2].children.push({
                    title: this.multipleSelection[i].picTitle,
                    picUrl: this.multipleSelection[i].picUrl
                });
            }
            this.backToEdit()
        },
        //多选批量
        handleSelectionChange (val) {
            console.log(val)
            this.multipleSelection = val;
        },
        //返回编辑页
        backToEdit (){
            this.showMeidaLibDialog = false
            this.multipleSelection = []
            this.chooseIndex = ''
            this.chooseIndex2 = ''
            this.searchSelfmediaimgForm = {
                picTitle:'',
                picType:'4'
            }
            this.selfmediaimgTableData = []
            this.pagination3 = {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            }
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
                self.meetingCopForm = JSON.parse(JSON.stringify(item))
                self.originUrl = self.meetingCopForm.picUrl
                console.log('修改嘉宾','原始',self.originUrl,'表单',self.meetingCopForm.picUrl)
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
                                    self.meetingCopForm.guestImg = res.url
                                    console.log('接受到图片改变后的form',self.meetingCopForm)
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
                    } else if (self.creatOrEdit == 1 && (self.meetingCopForm.guestImg !== self.originUrl )) {
                        console.log('当前',self.meetingCopForm.guestImg,'原始：',self.originUrl)
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
                                    self.meetingCopForm.guestImg = res.url
                                    console.log('接受到图片改变后的form',self.meetingCopForm)
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
                        console.log('当前',self.meetingCopForm.guestImg,'原始：',self.originUrl)
                        self.submitForm()
                    }
                }
            })
        },
        //提交表单
        submitForm () {
            var self = this
            self.$refs['meetingCopForm'].validate((valid) => {
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
                        data: JSON.stringify(self.meetingCopForm),
                        dataType: "json",
                        success: function(res){
                            if (res.code == 200) {
                                self.$message.success('保存成功');
                                self.startSearch() //列表回显
                                self.closeEditCreatEdit('meetingCopForm')
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
            this.meetingCopForm = {
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