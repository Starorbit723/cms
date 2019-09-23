

var vm = new Vue({
    el: '#meeting_hdpicture',
    data(){
        return {
            //是否显示子页面
            showInteractionPage: true,
            showHdPage: false, 
            showDetailPage: false,
            creatOrEdit:  0, //0新建  1修改
            showArticleDetail: false,
            creatOrEditArticle: 0, // 新建 1 修改
            checkOpt: true,
            checkOpt1: false,
            btnControl: true,
            selectedInteractionInfoType: "",
            searchForm: {
                interactionMeetingId: '',
                interactionTitle: '',  //互动标题
                interactionStatus: '0' //状态 0正常 1删除
            },
            tableData:[{}],
            showDiagramLab: false,
            diagramTableData:[],
            selectedOption: {},
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
            options: [{
                value: '0',
                label: '文章'
            }],
            interactionForm: {
                interactionInfoType:'',
                interactionId: '',
                interactionTitle: '',
                interactionMeetingId: '',
                interactionCrtUserId:'',
                interactionModUserId:'',
                interactionCrtTime:'',
                interactionModTime:'',
                interactionStatus:'',
                userName:''
            },
            interactionFormRules: {
                interactionTitle: [
                    {required: true, message: '文章问答名称必填', trigger: 'change'}
                ]
            },
            //文章问答列表详情
            articleDetailForm: {
                interactionInfoType: '',
                interactionInfoId: '',
                interactionInfoAbstract: '',
                interactionInfoLabel: '',
                interactionInfoImg: '',
                interactionInfoTitle: '',
                interactionInfoUrl: '',
                interactionInfoReleaseTime: ''
            },
            articleDetailFormRules: {
                interactionInfoType: [
                    {required: true, message: '问答类型必选', trigger: 'change'}
                ],
                interactionInfoTitle: [
                    {required: true, message: '标题不能为空', trigger: 'change'},
                    { max: 36, message: '您输入的字数超过36个字', trigger: 'change' }
                ],
                interactionInfoAbstract: [
                    {required: true, message: '摘要不能为空', trigger: 'change'}
                ],
                interactionInfoLabel: [
                    {required: true, message: '标签不能为空', trigger: 'change'}
                ],
                interactionInfoImg: [
                    {required: true, message: '图片不能为空', trigger: 'change'}
                ]

            },
            //组图列表图库弹出层相关
            showDiaLibDialog: false,
            multipleSelection: [],
            DiaTableData:[],
            searchInteractionForm:{
                diagramId: '',
                diagramInfoStatus:'0'
            },
            pagination4: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
            //文章库相关
            showContentLib: false,
            searchContentForm:{
                newsTitle:'',
                newsStatus:['2']//0是下线，1是在线，2是未发布
            },
            infoId: '',
            PriorityNum: '',
            multipleSelection:[],
            contentArticleTableData:[],
            diaId: '',
            //内容图库相关
            showCoverimgLib: false,
            searchCoverimgForm:{
                picTitle:'',
                picType:'0'//0封面图库 1内容图库 2图为图库
            },
            contentImgTableData:[],
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

        // 问答列表页面
        // 开始搜索列表
        startSearch(type) {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchForm))
            data.interactionMeetingId = data.interactionMeetingId.toString().trim()
            // console.log(data)
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
                url: "/interaction/list",
                contentType: "application/json",
			    data: JSON.stringify(data),
                dataType: "json",
                success: function(res) {
                    // console.log(res)
                    if(res.code == 200) {
                        self.tableData = res.page.list
                        self.pagination1 = {
                            currPage: res.page.currPage,
                            totalCount:res.page.totalCount,
                            totalPage: res.page.totalPage,
                            pageSize: res.page.pageSize
                        }
                        // self.searchForm.interactionMeetingId = ''
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
                self.showInteractionPage = false
                self.showHdPage = true
            } else if(type == 1) {
                $.ajax({
                    type: "POST",
                    url: "/interaction/info/" + item.interactionId.toString(),
                    contentType: "application/json",
                    dataType: "json",
                    success: function(res){
                        // console.log(res)
                        if(res.code == 200){
                            let data = res.dict
                            self.interactionForm = data
                            self.showInteractionPage = false
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
         //保存新建条目
         testSubmit(formName) {
            var self = this
            self.$refs[formName].validate((valid) => {
                if(valid) {
                    if(self.creatOrEdit == 0) {
                        var data = {
                            interactionMeetingId: self.interactionForm.interactionMeetingId,
                            diagraminteractionTitleTitle: self.interactionForm.interactionTitle,
                            interactionStatus: '0',
                            page: '1',
                            limit: '100'
                        }
                        $.ajax({
                            type: "POST",
                            url: "/interaction/list",
                            contentType: "application/json",
                            data: JSON.stringify(data),
                            dataType: "json",
                            success: function(res) {
                                if(res.code == 200) {
                                   self.submitCreatEdit()
                                   self.showHdPage = false
                                   self.showInteractionPage =true
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
        // 提交新建条目
        submitCreatEdit() {
            var self = this
            var data = JSON.parse(JSON.stringify(self.interactionForm))
            // console.log('准备提交保存的FORM', data)
            if (self.creatOrEdit == 0) {
                var reqUrl = '/interaction/save'
            } else if (self.creatOrEdit == 1) {
                var reqUrl = '/interaction/update'
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
                        self.closeCreatOrEdit('interactionForm')
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
        // 关闭新建条目页面
        closeCreatOrEdit(formName) {
            this.creatOrEdit = 0
            this.$refs[formName].resetFields();
            this. interactionForm = {
                interactionId: '',
                interactionTitle: '',
                interactionMeetingId: '',
                interactionCrtUserId:'',
                interactionModUserId:'',
                interactionCrtTime:'',
                interactionModTime:'',
                interactionStatus:'',
                userName:''
            },
            this.showHdPage = false
            this.showInteractionPage = true
        },
         //删除问答条目
         deleteThisInteraction(item) {
            var self = this
            self.$confirm('确实要删除该投票数据吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = JSON.parse(JSON.stringify(item))
                data.interactionStatus = "1"
                // console.log(JSON.stringify(data))
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/interaction/update",
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
         //修改某一条问答条目
         EditDetailList (item) {
            // console.log(item)
            var self = this
            self.showInteractionPage = false
            self.showDetailPage = true
            self.diaId = item.interactionId
            self.startSearch2(self.diaId, 0)
        },
        //内容图页面变化
        handleCurrentChange4 (val) {
            this.pagination4.currPage = val
            this.startSearch2(this.diaId)
        },
        // 加载问答条目列表
        startSearch2(id, type) {
            var self = this
            var data1 = {
                interactionId: id.toString().trim(),
                interactionInfoStatus: '0'
            }
            var data = JSON.parse(JSON.stringify(data1))
            if (type == 0) {
                Object.assign(data,{
                    page: '1',
                    limit: self.pagination4.pageSize.toString()
                })
            } else {
                Object.assign(data,{
                    page: self.pagination4.currPage.toString(),
                    limit: self.pagination4.pageSize.toString()
                })
            }
            $.ajax({
                type: "POST",
                url: "/interactionInfo/list",
                contentType: "application/json",
			    data: JSON.stringify(data),
                dataType: "json",
                success: function(res) {
                    // console.log(res)
                    if(res.code == 200) {
                        self.diagramTableData = res.page.list
                        self.pagination4 = {
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
        //新建文章具体内容
        createOrEditArticles(type,item){
            console.log(item)
            var self = this
            self.creatOrEditArticle = type
            if(type == 0) {
                self.showDetailPage = false
                self.showArticleDetail = true
            } else if(type == 1) {
                self.selectedInteractionInfoType = item.interactionInfoType.toString()
                self.infoId = item.interactionInfoId
                self.PriorityNum = item.interactionInfoPriority
                $.ajax({
                    type: "POST",
                    url: "/interactionInfo/info/" + item.interactionInfoId.toString(),
                    contentType: "application/json",
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            let data = res.dict
                            self.articleDetailForm = data
                            self.checkOpt1 = true
                            self.checkOpt = false
                            self.btnControl = false
                            self.showDetailPage = false
                            self.showArticleDetail = true
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
        // 保存问答条目列表
        submitForm(){
            var self = this
            var data = JSON.parse(JSON.stringify(self.diagramTableData))
            var reg = new RegExp("^(?:[0-9]{1,3}|1000)$")
            for(var i = 0; i < self.diagramTableData.length; i++) {
                self.diagramTableData[i].interactionInfoId = self.diagramTableData[i].interactionInfoId.toString()
                self.diagramTableData[i].interactionId = self.diagramTableData[i].interactionId.toString()
                var Pro = Number(self.diagramTableData[i].interactionInfoPriority)
                if(!reg.test(Pro) && Pro !== -1) {
                    this.$message.error('权重值为-1到1000之间的整数')
                    return
                }
            }
            $.ajax({
                type: "POST",
                url: "/interactionInfo/update",
                contentType: "application/json",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.$message.success('保存成功')
                        self.startSearch()
                        self.closeInteractionTable()
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
        // 取消问答条目列表
        closeInteractionTable(){
            var self = this
            self.showDetailPage = false
            self.showInteractionPage = true

        },
        // 权重发生改变时调整顺序
        scaleChange (item) {
            var reg = new RegExp("^(?:[0-9]{1,3}|1000)$")
            if(!reg.test(item) && item !== -1) {
                this.$message.error('权重值为-1到1000之间的整数')
            }
        },
         //文章库页码
         handleCurrentChange2 (val) {
            this.pagination2.currPage = val
            this.searchArticles()
        },
        handleCurrentChange3 (val) {
            this.pagination3.currPage = val
            this.searchCoverImg()
        },
        // 加载文章列表库
        chooseArticles(){
            this.showContentLib = true
            this.searchArticles(0)
        },
        searchArticles(type){
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchContentForm))
            data.newsTitle = data.newsTitle.toString().trim()
            if(type == 0) {
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
                url: "/news/newsList",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.contentArticleTableData = res.page.list
                        // for (let i = 0; i < self.tableData.length; i++){
                        //     self.contentArticleTableData[i].newsReleaseTime = self.transformTime(self.contentArticleTableData[i].newsReleaseTime)
                        // }
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
        // 选择框变化
        changeVal(id){
            var self = this
            // console.log(id)
            self.selectedOption = this.options.find((item)=>{
            return item.value === id
            })
            self.btnControl = false
        },
        //选择了某一篇文章
        addThisContentArticles (item) {
            var self = this
            // console.log(item)
            var data = [{
                // interactionInfoType: self.selectedOption.value,
                interactionId: self.diaId.toString(),
                interactionInfoId: '',
                interactionInfoAbstract: item.newsDesc,
                // interactionInfoLabel: item.newsKeywords,
                interactionInfoImg: item.newsHeadPic,
                interactionInfoTitle: item.newsTitle,
                interactionInfoTypeEntity:item.newsId.toString(),
                interactionInfoUrl: item.newsUrl,
                interactionInfoReleaseTime: item.newsReleaseTime.toString(),
                interactionInfoPriority:'-1'
            }]
            self.articleDetailForm = data[0]
            if(self.creatOrEditArticle == 0) {
                self.articleDetailForm.interactionInfoType = self.selectedOption.value
            } else if (self.creatOrEditArticle == 1) {
                self.articleDetailForm.interactionInfoType = self.selectedInteractionInfoType
            }
            // console.log(self.articleDetailForm)
            self.checkOpt1 =true
            self.checkOpt = false
            self.showContentLib = false
            self.showArticleDetail = true
        },
        saveArticles(formName){
            var self = this 
            // console.log(self.creatOrEditArticle)
            self.$refs[formName].validate((valid)=> {
                if(valid) {
                    self.submitCreatEdit2()
                    self.checkOpt1 = false
                    self.checkOpt = true
                    self.btnControl = true
                }
            })
        },
        // 提交
        submitCreatEdit2() {
            var self = this
            // console.log(self.creatOrEditArticle)
            var dataArr = []
            dataArr.push(self.articleDetailForm)
            if(self.creatOrEditArticle == 1) {
                self.articleDetailForm.interactionInfoId = self.infoId.toString()
                self.articleDetailForm.interactionInfoPriority = self.PriorityNum.toString()
            }
            var data = JSON.parse(JSON.stringify(dataArr))
            // console.log('准备提交保存的FORM', data)
            if (self.creatOrEditArticle == 0) {
                var reqUrl = '/interactionInfo/save'
            } else if (self.creatOrEditArticle == 1) {
                var reqUrl = '/interactionInfo/update'
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
                        self.startSearch2(self.diaId, 0)
                        self.closeArticles('articleDetailForm')
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
        //返回编辑页
        backToEdit2 (){
            this.showContentLib = false
            this.showArticleDetail = false
            this.showDetailPage = true
            this.searchContentForm = {
                newsTitle:'',
                newsStatus:['2'] //0封面图库 1内容图库 2图为图库
            } 
        },
        closeArticles(formName){
            this.$refs[formName].resetFields();
            this. articleDetailForm = {
                interactionInfoType: '',
                interactionInfoId: '',
                interactionInfoAbstract: '',
                interactionInfoLabel: '',
                interactionInfoImg: '',
                interactionInfoTitle: '',
            },
            
            this.showArticleDetail = false
            this.showDetailPage = true
            this.checkOpt1 = false
            this.checkOpt = true
            this.btnControl = true

        },
        //删除文章列表单项
        deleteThisDiaDetail(item){
            var self = this 
            self.$confirm('确实要删除该文章吗？', '提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var arr = []
                arr.push(item)
                var data = JSON.parse(JSON.stringify(arr))
                data[0].interactionInfoId = data[0].interactionInfoId.toString()
                data[0].interactionId = data[0].interactionId.toString()
                data[0].interactionInfoStatus = '1'
                // console.log(JSON.stringify(data))
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/interactionInfo/update",
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
         //修改某一张内容图片
         chooseContentImg () {
            this.showCoverimgLib = true
            this.searchCoverImg(0)
        },
         //搜索内容图库
         searchCoverImg(type){
            var self = this
            var data = JSON.parse(JSON.stringify(this.searchCoverimgForm))
            data.picTitle = data.picTitle.trim()
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
                        self.contentImgTableData = res.page.list
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
        //选择了某一张封面图片
        addThisCoverImg (item) {
            this.articleDetailForm.interactionInfoImg = item.picUrl
            this.backToEdit()
        },
         //返回编辑页
         backToEdit (){
            this.showCoverimgLib = false
            this.showArticleDetail = true
            this.searchCoverimgForm = {
                picTitle:'',
                picType:'0'//0封面图库 1内容图库 2图为图库
            }
            this.contentImgTableData = [],
            this.pagination3 = {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            }
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
