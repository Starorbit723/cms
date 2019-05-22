var vm = new Vue({
    el: '#special_column',
    data: {
        //主页子页切换
        showChildPage:false,
        creatOrEdit:0,//0新建  1修改
        //搜索提交
        searchForm:{
            columnTitle:'',
            columnStatus:'1'
        },
        //专栏表格结果
        specialColumnTableData: [
        // {
        //     columnId:'',
        //     columnTitle:'',//栏目标题
        //     columnDesc:'',//栏目描述
        //     columnPic:'',//栏目图片
        //     columnKeyword:'',//
        //     columnChannel:'',//栏目属于频道
        //     columnPid:'',//栏目所属父ID
        //     columnDir:'',//栏目所属目录
        //     columnType:'',//栏目类型
        //     columnPriority:'',//栏目优先级
        //     columnStatus:'',//栏目状态0是下线，1是在线
        //     columnIndustry:'',//栏目属于行业
        //     columnEditor:'',//栏目编辑 作者编号逗号分割
        //     columnTag:'',//栏目标签
        //     columnCrtTime:'',//专题建立时间
        //     columnModTime:'',//专题修改时间
        //     columnCount:'',//专栏阅读量
        //     newsCount:'',//已发布文章数
        //     arrays:'',//array[object]  栏目编辑集合
        //     columnModTimeMill:'',//栏目修改时间(毫秒值)
        //     columnUrl:'',//栏目地址
        // }
        ],
        //分页器相关
        pagination1: {
            currPage: 1,
            totalCount:0,
            totalPage:0,
            pageSize:20
        },
        //频道列表
        channelOptions:[],
        //专栏作者列表
        editorOptions:[
            // {
            //     userId:1,
            //     username:'admin'
            // }
        ],
        // //展示新建专栏弹框
        // showAddColumnDialog:false,
        // columnEditorChange:[],
        // creatColumnForm:{
        //     columnTitle:'',
        //     columnChannel:'',
        //     columnEditor:''
        // },
        // creatColumnFormRules:{
        //     columnTitle: [
        //         { required: true, message: '专栏名称不能为空', trigger: 'change' }
        //     ],
        //     columnChannel: [
        //         { required: true, message: '所属频道为必选', trigger: 'change' }
        //     ],
        //     columnEditor:[]
        // },
        //修改专栏基本信息
        columnEditorChange:[],
        editColumnForm:{
            columnId:'',
            columnTitle:'',//栏目标题
            columnDesc:'',//栏目描述
            columnPic:'',//栏目图片
            columnKeyword:'',//
            columnChannel:'',//栏目属于频道
            columnPid:'',//栏目所属父ID
            columnDir:'',//栏目所属目录
            columnType:'',//栏目类型
            columnPriority:'',//栏目优先级
            columnStatus:'1',//栏目状态0是下线，1是在线
            columnIndustry:'',//栏目属于行业
            columnEditor:'',//栏目编辑 作者编号逗号分割
            columnTag:'',//栏目标签
            columnCrtTime:'',//专题建立时间
            columnModTime:'',//专题修改时间
            columnCount:'',//专栏阅读量
            newsCount:'',//已发布文章数
            arrays:'',//array[object]  栏目编辑集合
            columnModTimeMill:'',//栏目修改时间(毫秒值)
            columnUrl:'',//栏目地址
        },
        editColumnFormRules: {
            columnTitle: [
                { required: true, message: '专栏名称不能为空', trigger: 'change' }
            ],
            columnChannel: [
                { required: true, message: '所属频道为必选', trigger: 'change' }
            ],
            columnEditor: [
                { required: true, message: '专栏作者不能为空', trigger: 'change' }
            ]
        },
        //专栏所属文章列表
        belongArticleTableData:[
        //     {
        //     newsId:'',//新闻id
        //     newsTitle:'',//新闻标题
        //     newsDesc:'',//描述
        //     newsType:'',//新闻类型,普通新闻，组图新闻，高清新闻，视频新闻
        //     newsPriority:'',//新闻优先级
        //     newsStatus:'',//新闻状态 0是下线，1是在线，2是未发布
        //     newsChannel:'',//新闻属于频道
        //     newsSubject:'',//新闻属于专题
        //     newsColumn:'',//新闻属于栏目
        //     newsIndustry:'',//新闻属于行业
        //     newsEditor:'',//新闻编辑编号
        //     newsTemplateId:'',//新闻模版编号
        //     newsTemplateMid:'',//新闻M站模板编号
        //     newsTemplateAddress:'',//新闻模板目录
        //     newsTemplateMaddress:'',//新闻M站模板目录
        //     newsUrl:'',//新闻url地址
        //     newsContent:'',//新闻内容
        //     newsMedia:'',//需要单独的媒体表关联
        //     newsKeywords:'',//新闻关键字逗号分割
        //     newsAuthorId:'',//新闻作者编号
        //     newsAuthor:'',//新闻作者
        //     newsAbstract:'',//新闻摘要
        //     newsSubhead:'',//新闻头标题
        //     newsSubtitle:'',//新闻子标题
        //     newsHeadPic:'',//新闻头图
        //     newsPictures:'',//新闻图片，每个图片ID用分号隔开
        //     newsMatchPic:'',//新闻自动配图
        //     newsVideos:'',//视频新闻链接
        //     newsOrg :'',
        //     newsSubtype:'',//新闻子类型
        //     newsTag:'',//新闻标签
        //     newsFrom:'',//新闻来源
        //     newsSourceUrl:'',//新闻来源地址
        //     newsPara:'',
        //     newsCompDelay:'',//延时编译，0代表不需要延时编译，1代表需要延时编译
        //     newsCompTime:'',//新闻预编译时间
        //     newsCrtUserId:'',//创建人编号
        //     newsCrtTime:'',//新闻数据建立时间
        //     newsCrtTimeMillis:'',//新闻数据建立时间(毫秒数)
        //     newsModTime:'',//新闻数据修改时间
        //     originalStatus:'',//原创状态 1：原创 2：非原创
        //     recommendStatus:'',//推荐状态： 1：推荐 2：非推荐
        //     updatePvAt:'',//更新点击量时间
        //     channelTitle:'',//渠道名称
        //     userName:'',//发布人名称
        //     newsCount:'',//阅读量
        //     newsReleaseTime:'',//发布时间
        //     newsFlashStatus:'',//是否快讯 0否 1 是
        //     newsOrderCount:''//手工点击量
        // }
    ],
        //分页器相关
        pagination2: {
            currPage: 1,
            totalCount:0,
            totalPage:0,
            pageSize:20
        },
        //搜索添加文章弹出层
        showAddArticleDialog:false,
        searchArticleStr:'',
        multipleSelection: [],
        searchArticleTableData:[]
    },
    created() {
        this.startSearch()
        this.getChannelList()
        this.getEditorOptionList()
    },
    methods:{
        handleCurrentChange (val) {
            this.pagination1.currPage = val
            this.startSearch()
        },
        handleCurrentChange2 (val) {
            this.pagination2.currPage = val
            this.requestArticleList()    
        },
        //开始搜索专栏列表
        startSearch (type) {
            var self = this
            var data = self.searchForm
            data.columnTitle = data.columnTitle.toString().trim()
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
                url: "/column/list",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.specialColumnTableData = res.page.list
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
        //新建专栏打开弹框
        addOrEditColumn (item) {
            this.showChildPage = true
            if (item == 0) {
                this.creatOrEdit = 0
            } else {
                this.creatOrEdit = 1
                this.editColumnForm = JSON.parse(JSON.stringify(item))
                this.editColumnForm.columnChannel = parseInt(this.editColumnForm.columnChannel)
                this.requestArticleList()
                console.log('修改专栏：',this.editColumnForm)
                //作者字符串回显
                if (this.editColumnForm.columnEditor !== '' && this.editColumnForm.columnEditor !== '-1') {
                    var tempArr = this.editColumnForm.columnEditor.split(',')
                    console.log('tempArr',tempArr)
                    for (let i = 0; i < tempArr.length ; i++) {
                        tempArr[i] = parseInt(tempArr[i])
                    }
                    this.columnEditorChange = tempArr
                } else {
                    this.columnEditorChange = []
                }
                console.log(this.columnEditorChange)
            }
        },
        //删除专栏
        delThisColumn(item){
            var self = this
            self.$confirm('确实要删除该专栏状态吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                
            })
        },
        //启用或禁用当前专栏
        togglestatusThisColumn (item){
            var self = this
            self.$confirm('确实要调整该专栏状态吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (item.columnStatus == 1) {
                    var data = {
                        columnId:item.columnId.toString(),
                        columnStatus:'0'
                    }
                } else if (item.columnStatus == 0) {
                    var data = {
                        columnId:item.columnId.toString(),
                        columnStatus:'1'
                    }
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/column/update",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            self.$message.success('状态修改成功');
                            self.startSearch() //请求列表回显
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
            })
        },
        //添加文章到此专栏
        addArticleToColumn () {
            this.startSearchArticle()
            this.showAddArticleDialog = true
        },
        //去编辑文章
        editThisArticle(item) {
            setCookie ('createdit', item.newsId, 1)
            window.location.href = '/modules/content/edit_article.html'
        },
        //专栏作者发生变化时--作者id分开传，用','隔开
        authorChange (val) {
            console.log('作者发生变化',this.columnEditorChange)
            this.editColumnForm.columnEditor = ''
            if (val.length !== 0) {
                for (let i = 0; i < this.columnEditorChange.length; i++) {
                    for (let k=0; k < this.editorOptions.length; k++) {
                        if (val[i] == this.editorOptions[k].value && (i !== (this.columnEditorChange.length - 1))) {
                            this.editColumnForm.columnEditor += this.editorOptions[k].userId.toString() + ','
                        } else {
                            this.editColumnForm.columnEditor += this.editorOptions[k].userId.toString()
                        }
                    }
                }
            }
        },
        //请求专栏下的文章列表
        requestArticleList () {
            var self = this
            var data = {
                newsColumn: self.editColumnForm.columnId.toString()
            }
            Object.assign(data,{
                page: self.pagination2.currPage.toString(),
                limit: self.pagination2.pageSize.toString(),
            })
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "/news/newsList",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res) {
                    if(res.code == 200){
                        self.belongArticleTableData = res.page.list
                        self.pagination2 = {
                            currPage: res.page.currPage,
                            totalCount:res.page.totalCount,
                            totalPage:res.page.totalPage,
                            pageSize:res.page.pageSize
                        }
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
        },
        //从该专栏下移除此篇文章
        removeThisArticle (item) {
            var self = this
            self.$confirm('确实要将该文章从栏目中移除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = {
                    newsId: item.newsId,
                    newsColumn: '-1'
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/news/update",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res) {
                        if(res.code == 200){
                            console.log('文章移除专栏',res)
                            self.requestArticleList()
                            self.$message({
                                type: 'success',
                                message: '移除成功!'
                            });
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
        //提交保存专栏信息
        submitEditSpecialColumn (formName){
            var self = this
            this.$refs[formName].validate((valid) =>{
                if (valid) {
                    var reqUrl = ''
                    if (self.creatOrEdit == 0) {
                        reqUrl = '/column/save'
                    } else {
                        reqUrl = '/column/update'
                    }
                    var data = JSON.parse(JSON.stringify(self.editColumnForm))
                    data.arrays = null
                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        url: reqUrl,
                        data: JSON.stringify(data),
                        dataType: "json",
                        success: function(res) {
                            if(res.code == 200){
                                self.$message({
                                    type: 'success',
                                    message: '保存专栏成功!'
                                });
                                self.closeEditSpecialColumn('editColumnForm')
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
            });
        },
        //返回清空专栏信息
        closeEditSpecialColumn (formName){
            this.startSearch()
            this.columnEditorChange = []
            this.showChildPage = false
            this.$refs[formName].resetFields();
            this.belongArticleTableData = []
            this.editColumnForm = {
                columnId:'',
                columnTitle:'',//栏目标题
                columnDesc:'',//栏目描述
                columnPic:'',//栏目图片
                columnKeyword:'',//栏目关键字
                columnChannel:'',//栏目属于频道
                columnPid:'',//栏目所属父ID
                columnDir:'',//栏目所属目录
                columnType:'',//栏目类型
                columnPriority:'',//栏目优先级
                columnStatus:'1',//栏目状态0是下线，1是在线
                columnIndustry:'',//栏目属于行业
                columnTag:'',//栏目标签
                columnCrtTime:'',//专题建立时间
                columnModTime:'',//专题修改时间
                columnCount:'',//专栏阅读量
                newsCount:'',//已发布文章数
                columnEditor:'',//栏目编辑 作者编号逗号分割
                columnEditorName:'',//栏目编辑名称
                columnModTimeMill:''//专题修改时间(毫秒值)
            }
        },
        //开始搜索字段
        startSearchArticle () {
            var self = this
            var data = {
                newsTitle: self.searchArticleStr,
                newsStatus:['2']
            }
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: '/news/newsList',
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        console.log('新增或修改返回：', res)
                        this.multipleSelection = []
                        self.searchArticleTableData = res.page.list
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
        },
        //select选中文章时触发
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        //添加选中项
        addUserSelect (){
            var self = this
            console.log(self.multipleSelection)
            var data = []
            for (let i = 0; i < self.multipleSelection.length; i++) {
                data.push({
                    newsColumn : self.editColumnForm.columnId.toString(),
                    newsId: self.multipleSelection[i].newsId.toString()
                })
            }
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "/news/updateByList",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res) {
                    if(res.code == 200){
                        self.requestArticleList()
                        self.$message({
                            type: 'success',
                            message: '添加文章成功!'
                        });
                        //前一页的文章列表回显
                        self.backToEditPage()
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
        //关闭弹框返回编辑页
        backToEditPage (){
            this.showAddArticleDialog = false
            this.searchArticleStr = ''
            this.multipleSelection = []
            this.searchArticleTableData = []
        },
        //获取所有编辑字典表
        getEditorOptionList () {
            var self = this
            $.ajax({
                type: "GET",
                contentType: "application/json",
                url: baseURL + 'sys/user/list',
                dataType: "json",
                success: function(res) {
                    if (res.code == 200) {
                        self.editorOptions = res.page.list
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
        },
        //初始化--获取频道列表
        getChannelList () {
            var self = this
            var data = {
                channel_status: ['1','2']
            }
            $.ajax({
                type: "POST",
                contentType: "application/json",
			    url: "/channel/selectList",
			    data: JSON.stringify(data),
			    dataType: "json",
			    success: function(res){
					if(res.code == 200){
                        self.channelOptions = res.channelList
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
        },
        
    }
})
