var vm = new Vue({
    el: '#meeting_institution',
    data () {
        return {
            showChildPage: false,
            creatOrEdit:0,//0新建  1修改
            //搜索提交
            searchForm:{
                meetingCooperationMeetingId:'',
                meetingCooperationTitle:'',
                meetingCooperationStatus:'0',//图片分类查询 0封面 1内容  2图位 3广告 4自媒体头像
            },
            //列表查询结果
            tableData: [{
                meetingCooperationId:'',//主键
                meetingCooperationTitle:'',//会议机构标题
                meetingCooperationMeetingId:'',//所属会议编号
                meetingCooperationCrtUserId:'',//
                meetingCooperationModUserId:'',//
                meetingCooperationCrtTime:'',//
                meetingCooperationModTime:'',//
                meetingCooperationStatus:'',//状态 0正常 1删除
                userName:'',//创建人
                meetingTitle:'',//所属会议标题
                modUserName:'',//更新人
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
                userName:'',//创建人
                meetingTitle:'',//所属会议标题
                modUserName:'',//更新人
                meetingCooperationJson:[{ //JSON数据
                    type:'titleLv1',
                    labelText:'',
                    children:[
                        // {
                        // type:'titleLv2',
                        // labelText:'',
                        // children:[{
                        //     title:'',
                        //     picUrl:''
                        //     scale:'',//权重
                        // }
                    //     ]
                    // }
                    ]
                }],
            
            },
            meetingCopFormRules:{
                meetingCooperationTitle: [
                    { required: true, message: '机构标题不能为空', trigger: 'change' }
                ],         
            },
            //当前打开图库时的索引记录
            chooseIndex:'',
            chooseIndex2:'',
            multipleSelection: [],
            //自媒体图库弹出层相关
            showMeidaLibDialog:false,
            searchCoperForm:{
                cooperationName:'',
                cooperationStatus:'0'
            },
            coperTableData:[],
            pagination3: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
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
        handleCurrentChange3 (val) {
            this.pagination3.currPage = val
            this.searchCoper()
        },
        //开始搜索专题列表
        startSearch (type) {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchForm))
            data.meetingCooperationTitle = data.meetingCooperationTitle.toString().trim()
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
        //权重发生改变时调整顺序
        scaleChange (index,index2,index3) {
            console.log('发生变化',index,index2,this.meetingCopForm.meetingCooperationJson[index].children[index2].children)
            if (this.meetingCopForm.meetingCooperationJson[index].children[index2].children[index3].scale.trim() == '') {
                this.meetingCopForm.meetingCooperationJson[index].children[index2].children[index3].scale = '-1'
                this.$message.error('权重值不能为空')
            }
            let arrSort = JSON.parse(JSON.stringify(this.meetingCopForm.meetingCooperationJson[index].children[index2].children));
            this.meetingCopForm.meetingCooperationJson[index].children[index2].children = arrSort.sort(this.compare('scale'))
        },
        //排序比较函数
        compare (prop) {
            console.log(prop)
            return function (obj1, obj2) {
                var val1 = obj1[prop];
                var val2 = obj2[prop];
                if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                    val1 = Number(val1);
                    val2 = Number(val2);
                }
                if (val1 > val2) {
                    return -1;
                } else if (val1 < val2) {
                    return 1;
                } else {
                    return 0;
                }
            }            
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
            this.searchCoper(0)
            this.showMeidaLibDialog = true
        },
        //搜索图库
        searchCoper (type){
            var self = this
            var data = self.searchCoperForm
            data.cooperationName = data.cooperationName.trim()
            console.log(data)
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
                url: "/cooperation/list",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    console.log(res)
                    if(res.code == 200){
                        self.searchCoperForm.cooperationName = ''
                        self.coperTableData = res.page.list
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
        addThisCoper (item) {
            console.log('单个选择添加某个logo',item)
            this.meetingCopForm.meetingCooperationJson[this.chooseIndex].children[this.chooseIndex2].children.push({
                title: item.cooperationName,
                picUrl: item.cooperationImg,
                scale:'-1'
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
                    title: this.multipleSelection[i].cooperationName,
                    picUrl: this.multipleSelection[i].cooperationImg,
                    scale:'-1'
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
            this.searchCoperForm = {
                cooperationName:'',
                cooperationStatus:'0'
            }
            this.coperTableData = []
            this.pagination3 = {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            }
        },
        //新增或修改嘉宾
        addOrEditCoper(type,item) {
            var self = this
            self.creatOrEdit = type
            if(type == 0){
                self.showChildPage = true
                console.log('新增机构')
            } else {
                $.ajax({
                    type: "POST",
                    url: "/meeting/cooperation/info/" + item.meetingCooperationId.toString(),
                    contentType: "application/json",
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            //json64反解
                            let data = res.dict
                            let map = $.base64.atob(data.meetingCooperationJson, true)
                            data.meetingCooperationJson = JSON.parse(map)
                            console.log(data)
                            self.meetingCopForm = data
                            self.showChildPage = true
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
                console.log('修改机构',self.meetingCopForm.picUrl)
            }
        },
        //删除
        deleteThisCoper (item){
            var self = this
            self.$confirm('确实要删除该合作机构数据吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = JSON.parse(JSON.stringify(item))
                data.meetingCooperationStatus = 1  //0 正常  1 删除
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/meeting/cooperation/update",
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
        testSubmit(formName) {
            var self = this
            self.$refs[formName].validate((valid) => {
                if (valid) {
                    //验证一级表单是否填写完成
                    for (let i = 0; i < self.meetingCopForm.meetingCooperationJson.length; i++) {
                        if (self.meetingCopForm.meetingCooperationJson[i].labelText.trim() == '') {
                            self.$message.error('还有机构未填写完成')
                            return
                        }
                    }
                    self.submitCreatEdit()
                }
            })
        },
        //提交
        submitCreatEdit(){
            var self = this
            if (self.creatOrEdit == 0) {
                var reqUrl = '/meeting/cooperation/save'
            } else if (self.creatOrEdit == 1) {
                var reqUrl = '/meeting/cooperation/update'
            }
            var data = JSON.parse(JSON.stringify(self.meetingCopForm))
            $.base64.utf8encode = true;
            var jsonString = JSON.stringify(data.meetingCooperationJson);
            var json64 = $.base64.btoa(jsonString);
            data.meetingCooperationJson = json64
            console.log('6464',jsonString,json64)
            $.ajax({
                type: "POST",
                url: reqUrl,
                contentType: "application/json",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.$message.success('保存成功')
                        self.startSearch()
                        self.closeCreatOrEdit('meetingCopForm')
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
        //取消编辑返回列表页
        closeCreatOrEdit (formName) {
            this.$refs[formName].resetFields();
            this.meetingCopForm = {
                meetingCooperationId:'',//主键
                meetingCooperationMeetingId:'',//所属会议编号
                meetingCooperationCrtUserId:'',//
                meetingCooperationModUserId:'',//
                meetingCooperationCrtTime:'',//
                meetingCooperationModTime:'',//
                meetingCooperationStatus:'',//状态 0正常 1删除
                userName:'',//创建人
                meetingTitle:'',//所属会议标题
                modUserName:'',//更新人
                meetingCooperationJson:[{ //JSON数据
                    type:'titleLv1',
                    labelText:'',
                    children:[]
                }],
            }
            this.showChildPage = false
            this.creatOrEdit = 0
        },
        handleAvatarSuccess(res, file) {
            //this.articleForm.imageUrl = URL.createObjectURL(file.raw);
        },
        
        
    }
})