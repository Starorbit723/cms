var vm = new Vue({
    el: '#special_list',
    data: {
        showChildPage:false,
        creatOrEdit:0,//0新建  1修改
        //搜索提交
        searchForm:{
            subjectTitle:'',
            subjectType:'',
            subjectStatus: ['0','1','2','3','4']
        },
        //专题列表查询结果
        tableData: [{
            subjectId:'',
            subjectTitle:'',//专题标题
            subjectDesc:'',//专题描述
            subjectPic:'',//暂时停用
            subjectHtmlPic:'',//专题图片PC
            subjectAppPic:'',//专题图片PC
            subjectKeyword:'',//专题关键字
            subjectChannel:'',//专题属于频道
            subjectPid:'',//专题属于副专题
            subjectType:'',//专题类型  0：普通模板  1：投等舱模板  2：十问模板
            subjectPriority:'',//专题优先级
            subjectStatus:'',//专题状态0是下线，1是在线
            subjectIndustry:'',//专题属于行业
            subjectEditor:'',//专题编辑
            subjectTag:'',//专题标签
            subjectCrtTime:'',//专题建立时间
            subjectModTime:'',//专题修改时间
        }],
        //分页器相关
        pagination1: {
            currPage: 1,
            totalCount:0,
            totalPage:0,
            pageSize:10
        },
        //频道初始化的基本数据
        channelOptions: [],
        //专题模板类型，写死
        subjectModalType:[{
            label:'标准模板',
            value: 0
        },{
            label:'投等舱模板',
            value: 1
        },{
            label:'投中十问模板',
            value: 2
        }],
        //专题基本信息
        specialInfoForm:{
            subjectId:'',
            subjectTitle:'',
            subjectDesc:'',
            subjectPriority: '',
            subjectChannel: '',
            subjectType:'',//模板类型
            subjectHtmlPic:'',//专题图片PC
            subjectAppPic:'',//专题图片PC
        },
        specialInfoFormRules:{
            subjectTitle: [
                { required: true, message: '请输入专题名称', trigger: 'change' }
            ],
            subjectDesc: [
                { required: true, message: '请输入专题描述', trigger: 'change' }
            ],
            subjectChannel: [
                { required: true, message: '请输入专题所属频道', trigger: 'change' }
            ],
            subjectType:[
                {required: true, message: '请选择模板类型', trigger: 'change'}
            ],
            subjectAppPic:[
                { required: true, message: '请上传封面图', trigger: 'change' }
            ]
        },
        //文章列表查询结果
        articleData:[{
            newsId:'',//新闻id
            newsTitle:'',//新闻标题
            newsDesc:'',//描述
            newsType:'',//新闻类型,普通新闻，组图新闻，高清新闻，视频新闻
            newsPriority:'',//新闻优先级
            newsStatus:'',//新闻状态 0是下线，1是在线，2是未发布
            newsChannel:'',//新闻属于频道
            newsSubject:'',//新闻属于专题
            newsColumn:'',//新闻属于栏目
            newsIndustry:'',//新闻属于行业
            newsEditor:'',//新闻编辑编号
            newsTemplateId:'',//新闻模版编号
            newsTemplateMid:'',//新闻M站模板编号
            newsTemplateAddress:'',//新闻模板目录
            newsTemplateMaddress:'',//新闻M站模板目录
            newsUrl:'',//新闻url地址
            newsContent:'',//新闻内容
            newsMedia:'',//需要单独的媒体表关联
            newsKeywords:'',//新闻关键字逗号分割
            newsAuthorId:'',//新闻作者编号
            newsAuthor:'',//新闻作者
            newsAbstract:'',//新闻摘要
            newsSubhead:'',//新闻头标题
            newsSubtitle:'',//新闻子标题
            newsHeadPic:'',//新闻头图
            newsPictures:'',//新闻图片，每个图片ID用分号隔开
            newsMatchPic:'',//新闻自动配图
            newsVideos:'',//视频新闻链接
            newsOrg :'',
            newsSubtype:'',//新闻子类型
            newsTag:'',//新闻标签
            newsFrom:'',//新闻来源
            newsSourceUrl:'',//新闻来源地址
            newsPara:'',
            newsCompDelay:'',//延时编译，0代表不需要延时编译，1代表需要延时编译
            newsCompTime:'',//新闻预编译时间
            newsCrtUserId:'',//创建人编号
            newsCrtTime:'',//新闻数据建立时间
            newsCrtTimeMillis:'',//新闻数据建立时间(毫秒数)
            newsModTime:'',//新闻数据修改时间
            originalStatus:'',//原创状态 1：原创 2：非原创
            recommendStatus:'',//推荐状态： 1：推荐 2：非推荐
            updatePvAt:'',//更新点击量时间
            channelTitle:'',//渠道名称
            userName:'',//发布人名称
            newsCount:'',//阅读量
            newsReleaseTime:'',//发布时间
            newsFlashStatus:''//是否快讯 0否 1 是
        }],
        //分页器相关
        pagination2: {
            currPage: 1,
            totalCount:0,
            totalPage:0,
            pageSize:20
        },
        //添加文章到指定专题内相关
        showAddArticleDialog:false,
        searchArticleStr:'',
        multipleSelection: [],
        searchArticleTableData:[],
        //封面图库相关
        showCoverimgLib: false,
        //封面图库相关
        searchCoverimgForm:{
            picTitle:'',
            picType:'0'//0封面图库 1内容图库 2图为图库 3自媒体
        },
        coverimgTableData:[],
        pagination3: {
            currPage: 1,
            totalCount:0,
            totalPage:0,
            pageSize:20
        },
        pagination4: {
            currPage: 1,
            totalCount:0,
            totalPage:0,
            pageSize:20
        },
    },
    created () {
        this.getChannelList()
        this.startSearch()
    },
    methods:{
        scaleChange (val) {
            if(val.trim() == '') {
                this.specialInfoForm.subjectPriority = '-1'
            } else {
                var urlReg = /^[0-9]*[1-9][0-9]*$/;
                var urlReg2 = /^-[0-9]*[1-9][0-9]*$/;
                if(!urlReg.test(val) && !urlReg2.test(val) && val !== '0') {
                    this.$message.error('权重只能填写整数或0')
                }
            }
        },
        //当模板类型为投等舱类型，所属频道是其他
        subjectTypeChange(val){
            if (val == 1 || val == 2) {
                this.specialInfoForm.subjectChannel = 64
            }
        },
        handleCurrentChange (val) {
            this.pagination1.currPage = val
            this.startSearch()
        },
        handleCurrentChange2 (val) {
            this.pagination2.currPage = val
            this.requestArticleList()
        },
        handleCurrentChange3 (val) {
            this.pagination3.currPage = val
            this.searchCoverImg()
        },
        handleCurrentChange4 (val) {
            this.pagination4.currPage = val
            this.startSearchArticle()
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
        //开始搜索专题列表
        startSearch (type) {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchForm))
            data.subjectTitle = data.subjectTitle.trim()
            data.subjectType = data.subjectType.toString()
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
                url: "/subject/list",
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
        // 上线该专题
        onlineThisSpecial(item) {
            var self = this
            var data = {
                newsSubject: item.subjectId.toString()
            }
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "/news/newsList",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res) {
                    if(res.code == 200){
                        if(res.page.list.length == 0) {
                            self.$message.error('请添加新闻后才可以发布')
                        } else {
                            self.releaseThisSubject(item.subjectId.toString(),item.subjectType)
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
        releaseThisSubject(id,modelType) {
            var self = this
            self.$confirm('确实要发布此专题吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = {
                    subjectId: id,
                    subjectStatus:'1',
                    subjectReleaseTime: new Date().getTime()
                }
                //根据不同的专题模板，走不同接口  0:普通模板  1：投等舱模板  2:十问模板
                if (modelType == 0) {
                    var reqUrl = '/subject/push'
                } else if (modelType == 1) {
                    var reqUrl = '/subject/firstPush'
                } else if  (modelType == 2) {
                    var reqUrl = '/subject/communityPush'
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: reqUrl,
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            self.startSearch()
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


        // 下线该专题
        offlineThisSpecial(item) {
            var self = this
            self.$confirm('确实要下线此专题吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = {
                    subjectId:item.subjectId.toString(),
                    subjectStatus:'4',
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/subject/offline",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            self.startSearch()
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

        // 删除该专题
        deleteThisSubject(item) {
            var self = this
            self.$confirm('确实要删除此专题吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (item.subjectStatus == 2 ) {
                    var data = {
                        subjectId: item.subjectId.toString(),
                        subjectStatus:'4'
                    }
                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        url: "/subject/update",
                        data: JSON.stringify(data),
                        dataType: "json",
                        success: function(res){
                            if(res.code == 200){
                                self.startSearch()
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
                } else {
                    var data = {
                        subjectId: item.subjectId.toString(),
                        subjectStatus:'5'
                    }
                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        url: "/subject/update",
                        data: JSON.stringify(data),
                        dataType: "json",
                        success: function(res) {
                            if(res.code == 200){
                                self.startSearch(0)
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
                }

            })

        },


        //启用或禁用当前专题
        // togglestatusThisSpecial (item){
        //     var self = this
        //     self.$confirm('确实要调整该专题状态吗?', '提示', {
        //         confirmButtonText: '确定',
        //         cancelButtonText: '取消',
        //         type: 'warning'
        //     }).then(() => {
        //         if (item.subjectStatus == 1) {
        //             var data = {
        //                 subjectId:item.subjectId.toString(),
        //                 subjectStatus:'0'
        //             }
        //         } else if (item.subjectStatus == 0) {
        //             var data = {
        //                 subjectId:item.subjectId.toString(),
        //                 subjectStatus:'1'
        //             }
        //         }
        //         $.ajax({
        //             type: "POST",
        //             contentType: "application/json",
        //             url: "/subject/update",
        //             data: JSON.stringify(data),
        //             dataType: "json",
        //             success: function(res){
        //                 if(res.code == 200){
        //                     self.$message.success('状态修改成功');
        //                     self.startSearch() //请求列表回显
        //                 } else {
        //                     mapErrorStatus(res)
        //                     vm.error = true;
        //                     vm.errorMsg = res.msg;
        //                 }
        //             },
        //             error:function(res){
        //                 mapErrorStatus(res)
        //             }
        //         })
        //     })
        // },
        //新建修改专题页面切换
        addEditSpecial (item) {
            if(item == 0){
                this.showChildPage = true
                this.creatOrEdit = 0
                console.log('新建专题')
            } else {
                this.showChildPage = true
                this.creatOrEdit = 1
                this.specialInfoForm = JSON.parse(JSON.stringify(item))
                this.requestArticleList()
                console.log('修改专题：',this.specialInfoForm.subjectId)
            }
        },
        //打开封面图库弹层type:'pc'或'mob'
        openAddCoverImg () {
            this.showCoverimgLib = true
            this.searchCoverImg(0)
        },
        //搜索封面图库
        searchCoverImg (type){
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchCoverimgForm))
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
                        self.coverimgTableData = res.page.list
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
            this.$refs['specialInfoForm'].clearValidate();
            this.specialInfoForm.subjectAppPic = item.picUrl
            this.backToEdit()
        },
        //返回编辑页
        backToEdit (){
            this.showCoverimgLib = false
            this.searchCoverimgForm = {
                picTitle:'',
                picType:'0'//0封面图库 1内容图库 2图为图库
            }
            this.coverimgTableData = []
            this.pagination3 = {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            }
        },
        //新建或修改后保存专题
        saveThisSpecial (formName){
            var self = this
            self.$refs[formName].validate((valid) => {
                if (valid) {
                    self.specialInfoForm.subjectStatus = ''
                    if(self.specialInfoForm.subjectPriority == '') {
                        self.specialInfoForm.subjectPriority = '-1'
                    } else {
                        var urlReg = /^[0-9]*[1-9][0-9]*$/;
                        var urlReg2 = /^-[0-9]*[1-9][0-9]*$/;
                        if(!urlReg.test(self.specialInfoForm.subjectPriority) && !urlReg2.test(self.specialInfoForm.subjectPriority) && self.specialInfoForm.subjectPriority !== '0') {
                            this.$message.error('权重只能填写整数或0')
                            return
                        }
                    }
                    if (self.creatOrEdit == 0) {
                        var reqUrl = '/subject/save'
                    } else if (self.creatOrEdit == 1){
                        var reqUrl = '/subject/update'
                    }
                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        url: reqUrl,
                        data: JSON.stringify(self.specialInfoForm),
                        dataType: "json",
                        success: function(res){
                            if(res.code == 200){
                                console.log('新增或修改返回：', res)
                                self.$message({
                                    type: 'success',
                                    message: '保存成功!'
                                });
                                self.startSearch(0) //请求列表回显
                                self.clearSpecialInfoForm() //清空表单
                                self.articleData = [] //清空列表
                                self.showChildPage = false //关闭页面
                                self.creatOrEdit = 0 //还原新增修改判断
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
        //清楚还原表单
        clearSpecialInfoForm(){
            this.specialInfoForm = {
                subjectId:'',
                subjectTitle:'',
                subjectDesc:'',
                subjectPriority: '',
                subjectChannel: '',
                subjectHtmlPic:'',//专题图片PC
                subjectAppPic:'',//专题图片PC
            }
            this.$refs['specialInfoForm'].resetFields();
        },
        //取消返回添加专题
        cancelAddSpecial () {
            this.clearSpecialInfoForm() //清空表单
            this.articleData = [] //清空列表
            this.showChildPage = false //关闭页面
            this.creatOrEdit = 0 //还原新增修改判断
        },
        //请求专题下文章列表
        requestArticleList () {
            var self = this
            var data = {
                newsSubject: self.specialInfoForm.subjectId.toString()
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
                        self.articleData = res.page.list
                        for (let i = 0; i < self.articleData.length; i++){
                            self.articleData[i].newsReleaseTime = self.transformTime(self.articleData[i].newsReleaseTime)
                        }
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
        //从专题文章列表中移除此文章
        deleteThisArticle (item) {
            var self = this
            self.$confirm('确实要将该文章从专题中移除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = {
                    type: 3,
                    entityId: self.specialInfoForm.subjectId.toString(),
                    newsEntity:{
                        newsId: item.newsId.toString(),
                        newsSubject : '-1'
                    }
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/news/update",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res) {
                        if(res.code == 200){
                            console.log('文章移除专题',res)
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
        //打开添加文章搜索弹层
        openAddEditArticle () {
            this.startSearchArticle(0)
            this.showAddArticleDialog = true
        },
        //查询文章
        startSearchArticle (type) {
            var self = this
            var data = {
                newsTitle: self.searchArticleStr,
                newsStatus:['2'],
                newsSubject: '-1'
            }
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
                contentType: "application/json",
                url: '/news/newsList',
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        console.log('新增或修改返回：', res)
                        self.searchArticleTableData = res.page.list
                        for (let i = 0; i < self.searchArticleTableData.length; i++){
                            self.searchArticleTableData[i].newsReleaseTime = self.transformTime(self.searchArticleTableData[i].newsReleaseTime)
                        }
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
            var data = {
                type:2,
                entityId: self.specialInfoForm.subjectId.toString(),
                newsEntityList:[]
            }
            for (let i = 0; i < self.multipleSelection.length; i++) {
                data.newsEntityList.push({
                    newsSubject : self.specialInfoForm.subjectId.toString(),
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
                        self.$message({
                            type: 'success',
                            message: '添加文章成功!'
                        });
                        //前一页文章列表回显
                        self.requestArticleList()
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
        //打开此专题
        openThisPage(item) {
            if ((window.location.href.indexOf('chinaventure.com.cn') !== -1|| window.location.href.indexOf('117.78.28.103') !== -1) && item.subjectStatus == 2) {
                if(item.subjectType == 0 || item.subjectType == 2) {
                    window.open('https://www.chinaventure.com.cn/subject/'+ item.subjectId +'.html', "newwindow")
                } else if (item.subjectType == 1) {
                    window.open('https://m.chinaventure.com.cn/subject/'+ item.subjectId +'.html', "newwindow")
                }
            }   
        },
        //跳转至新闻详情
        openUrlArticlePage(item){
            if(item.newsStatus == 2) {
                if (window.location.href.indexOf('chinaventure.com.cn') !== -1|| window.location.href.indexOf('117.78.28.103') !== -1) {
                    window.open('https://www.chinaventure.com.cn'+item.newsUrl, "newwindow") 
                }
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