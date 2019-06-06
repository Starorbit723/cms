//实例化编辑器
//建议使用工厂方法getEditor创建和引用编辑器实例，如果在某个闭包下引用该编辑器，直接调用UE.getEditor('editor')就能拿到相关的实例
var ue = UE.getEditor('editor');

var vm = new Vue({
    el: '#edit_article',
    data: {
        //新建或修改
        typeOfPage:'creat',
        //按钮请求开关
        ajaxController:true,
        //切换展示图库
        showPicLibrary:false,
        //切换展示封面图库
        showCoverimgLib:false,
        //切换内容图库
        showContentimgLib:false,
        //是否展示定时任务的选择器
        showChangeReserveTime: true,
        //提交保存按钮状态
        submitBtnStatus:'0', //0实时发布   1定时发布   2全部隐藏
        //初始化数据
        channelOptions:[],
        columnOptions:[],
        labelOptions:[],
        selfmediaOptions:[],
        //文章基本信息
        baiduWordSuggest:'',
        newsTagArray:[],
        ifOrignCheck: false, //1：原创 2：非原创, 默认为2非原创
        ifReserveTime: false, //是否开启定时发布
        articleForm:{
            newsId:'',
            newsTitle:'',//标题
            newsSubject:'',//新闻属于专题
            newsColumn:'',//新闻属于栏目
            newsIndustry:'',//新闻属于行业
            newsEditor:'',//新闻编辑
            newsTemplateId:'1',//新闻模版编号
            newsUrl:'',//新闻url地址
            newsTemplateMid:'1',//新闻M站模板编号
            newsDesc:'',//描述
            newsEditorName:'',//新闻编辑中文名
            newsType:'',//新闻类型,普通新闻，组图新闻，高清新闻，视频新闻
            newsPriority:'',//新闻优先级
            newsContent:'',//新闻内容
            newsMedia:'',//该字段废弃
            newsMediaId:'',//需要单独的媒体表关联
            newsKeywords:'',//新闻关键字
            newsAuthor:'',//新闻作者
            newsAbstract:'',//新闻摘要
            newsSubhead:'',//新闻头标题
            newsSubtitle:'',//新闻子标题
            newsHeadPic:'',//新闻头图
            newsPictures:'',//新闻图片，每个图片ID用分号隔开
            newsMatchPic:'',//新闻自动配图
            newsVideos:'',//视频新闻链接
            newsOrg:'',//
            newsSubtype:'',//新闻子类型
            newsTag:'',//新闻标签
            newsFrom:'',//新闻来源
            newsSourceUrl:'',//新闻来源地址
            newsPara:'',//json参数
            newsCompDelay:'0',//延时编译，0代表不需要延时编译，1代表需要延时编译
            newsCompTime:'',//新闻预编译时间
            newsCrtUserId:'',//创建人编号
            newsCrtTime:'',//新闻数据建立时间
            newsCrtTimeMillis:'',//新闻数据建立时间(毫秒数)
            newsModTime:'',//新闻数据修改时间
            originalStatus:'2',//原创状态 1：原创 2：非原创
            updatePvAt:'',//更新点击量时间
            newsStatus:'',//0未发布，1是待发布，2是已发布3是发布失败 4是待删除 5 删除
            newsChannel:'',//新闻属于频道
            recommendStatus:'2',//推荐状态： 1：推荐 2：非推荐
            newsFlashStatus:'',//是否快讯 0 否 1 是
            newsOrderCount:'',//手工点击量
            newsContentNumber:'',//正文字数
            newsContentReadTime:'',//阅读时间
            newsReleaseTime:'',
            pictureEntity:{},//封面图的item全部信息
            newsContentList:[{//新闻内容图片列表
                srcName:'',//图片地址
                title:'',
                alt:''
            }]
        },
        articleFormRules:{
            newsTitle: [
                { required: true, message: '文章标题不能为空', trigger: 'change' },
                { max: 36, message: '您输入的字数超过36个字', trigger: 'change' }
            ],
            newsAbstract:[
                { required: true, message: '摘要不能为空', trigger: 'change' }
            ],
            newsDesc:[
                { required: true, message: '描述不能为空', trigger: 'change' }
            ],
            newsEditorName: [
                { required: true, message: '编辑姓名不能为空', trigger: 'change' }
            ],
            newsFrom: [
                { required: true, message: '来源名称不能为空', trigger: 'change' }
            ],
            newsChannel:[
                { required: true, message: '请选择主频道', trigger: 'change' }
            ],
            newsKeywords:[
                { required: true,  message: '标签不能为空',  trigger: 'change' }
            ],
            newsHeadPic:[
                { required: true, message: '请选择封面图', trigger: 'change' }
            ]
        },
        //封面图库相关
        searchCoverimgForm:{
            picTitle:'',
            picType:'0'//0封面图库 1内容图库 2图为图库
        },
        coverimgTableData:[],
        pagination1: {
            currPage: 1,
            totalCount:0,
            totalPage:0,
            pageSize:10
        },
        //内容图库相关
        searchContentimgForm:{
            picTitle:'',
            picType:'1'//0封面图库 1内容图库 2图为图库
        },
        multipleSelection:[],
        contentimgTableData:[],
        pagination2: {
            currPage: 1,
            totalCount:0,
            totalPage:0,
            pageSize:10
        },
    },
    watch:{
        // ifOrignCheck (val) {
        //     //console.log('是否原创切换',val)
        //     //原创状态 1：原创 2：非原创
        //     if (val) {
        //         this.articleForm.originalStatus = 1
        //         this.articleForm.newsFrom = '投中网'
        //     } else {
        //         this.articleForm.originalStatus = 2
        //         this.articleForm.newsFrom = ''
        //     }
        //     //console.log(this.articleForm.originalStatus)
        // },
        // ifReserveTime (val) {
            // console.log('是否定时发布',val)
            // //定时发布状态  0 不定时  1定时
            // if (val) {
            //     this.articleForm.newsCompDelay = 1
            //     this.submitBtnStatus = 1
            // } else {
            //     this.articleForm.newsCompDelay = 0
            //     this.submitBtnStatus = 0
            //     //取消定时发布，发布时间清空
            //     this.articleForm.newsCompTime = ''
            // }
        // }
    },
    created () {
        this.getColumnList()
        this.getselfmediaList()
        this.getChannelList ()
    },
    mounted () {
        var type = getCookie('createdit')
        if (type == '' || type == undefined) {
            this.typeOfPage = 'creat'
        } else {
            this.typeOfPage = 'edit'
            this.getEditArticleOrign(type)
        }
        console.log('type',this.typeOfPage)
    },
    methods:{
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
        //初始化--获取专栏列表
        getColumnList() {
            var self = this
            var data = {
                columnTitle:'',
                page: '1',
                limit: '10000',
                columnStatus: '1'
            }
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "/column/list",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.columnOptions = res.page.list
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
        ///初始化--获取自媒体列表
        getselfmediaList () {
            var self = this
            var data = {
                mediaName:'',
                mediaStatus:'1',
                page: '1',
                limit: '10000'
            }
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: '/media/list',
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        console.log('自媒体下拉列表返回：', res)
                        self.selfmediaOptions = res.page.list

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
        handleCurrentChange (val) {
            this.pagination1.currPage = val
            this.searchCoverImg()
        },
        handleCurrentChange2 (val) {
            this.pagination2.currPage = val
            this.searchContentImg()
        },
        //切换原创状态
        changeIfOrign(val){
            //原创状态 1：原创 2：非原创
            if (val) {
                this.articleForm.originalStatus = 1
                this.articleForm.newsFrom = '投中网'
            } else {
                this.articleForm.originalStatus = 2
                this.articleForm.newsFrom = ''
            }
        },
        //新闻标签改变
        newsTagChange (val) {
            console.log('newsTagChange',val)
            for (let i = 0; i < this.newsTagArray.length; i++) {
                if (this.newsTagArray[i].length > 20) {
                    let tempArr = JSON.parse(JSON.stringify(this.newsTagArray))
                    tempArr.splice(i,1) 
                    this.newsTagArray = tempArr
                    this.$message.warning('单一标签最多20字')
                }
            }
            if (this.newsTagArray.length > 3) {
                this.$message.warning('标签做多可设置为3个')
                this.newsTagArray = this.newsTagArray.splice(0,3)
            }
            var tempStr = ''
            tempStr = this.newsTagArray.join(',')
            this.articleForm.newsKeywords = tempStr
            console.log('当前newsKeywords',this.articleForm.newsKeywords)
        },
        //搜索封面图库
        searchCoverImg (type){
            var self = this
            var data = self.searchCoverimgForm
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
                        self.coverimgTableData = res.page.list
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
        //打开封面图库弹层
        openAddCoverImg () {
            this.showCoverimgLib = true
            this.searchCoverImg(0)
        },
        //选择了某一张封面图片
        addThisCoverImg (item) {
            this.$refs['articleForm'].clearValidate();
            this.articleForm.newsHeadPic = item.picUrl
            this.articleForm.pictureEntity = item
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
            this.pagination1 = {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            }
        },
        //打开内容图库弹层
        openAddContentImg () {
            this.showContentimgLib = true
            this.searchContentImg(0)
        },
        //搜索内容图库
        searchContentImg (type){
            var self = this
            var data = self.searchContentimgForm
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
                        self.contentimgTableData = res.page.list
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
        //多选批量
        handleSelectionChange (val) {
            this.multipleSelection = val;
        },
        //添加选中图片到ueditor
        addChooseImg(){
            console.log(this.multipleSelection)
            var imgStr = ''
            for(let i= 0; i < this.multipleSelection.length; i++){
                imgStr +=  "<img src= '"+ this.multipleSelection[i].picUrl +"' alt= '"+ this.multipleSelection[i].picTitle +"' title='"+ this.multipleSelection[i].picTitle +"' />"
            }
            ue.execCommand('inserthtml', imgStr)
            this.backToEdit2 ()
        },
        //返回编辑页
        backToEdit2 (){
            this.showContentimgLib = false
            this.searchCoverimgForm = {
                picTitle:'',
                picType:'1'//0封面图库 1内容图库 2图为图库
            }
            this.multipleSelection = []
            this.contentimgTableData = []
            this.pagination2 = {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            }
        },
        //切换定时发布勾选状态
        toggleIfReserveTime () {
            //定时发布状态  0 不定时  1定时
            if (this.ifReserveTime) {
                this.articleForm.newsCompDelay = 1
                this.submitBtnStatus = 1
            } else {
                this.articleForm.newsCompDelay = 0
                this.submitBtnStatus = 0
                //取消定时发布，发布时间清空
                this.articleForm.newsCompTime = ''
            }
        },
        /*新建或修改新闻    type 发布流程标识
        
        0： 实时新建保存            敏感词——insert            releaseTime:前端赋值
            实时新建保存并发布      敏感词——insert——push       releaseTime:前端赋值
        1： 实时编辑保存            敏感词——modify             releaseTime:前端赋值
            实时编辑保存并发布       敏感词——modify——push      releaseTime:前端赋值
        2:  定时新建保存            敏感词——insert——delay      releaseTime:用户选择值
            定时编辑保存            敏感词——modify——delay      releaseTime:用户选择值

        */
        combineArticleData (formName,type) {
            var self = this 
            //针对非必填字段验证
            var urlReg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
            if (self.articleForm.newsSourceUrl.toString().trim() !=='' && !urlReg.test(self.articleForm.newsSourceUrl)) {
                self.$message.error('来源网址不合法，非链接格式')
                return
            }
            //如果选择了定时发布，时间就必须选择
            if (self.articleForm.newsCompDelay == 1 && (self.articleForm.newsCompTime == '' || self.articleForm.newsCompTime == 0)) {
                self.$message.error('请选择定时发布时间')
                return
            }
            //获取html文本
            var html = UE.getEditor('editor').getContent()
            console.log('html:',html)
            if (html !== '') { 
                var imgReg = /<img.*?(?:>|\/>)/gi
                var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i
                var altReg = /alt=[\'\"]?([^\'\"]*)[\'\"]?/i
                var titleReg = /title=[\'\"]?([^\'\"]*)[\'\"]?/i
                var arr = html.match(imgReg)
                console.log('图片数组',arr)
                self.articleForm.newsContentList = [] 
                if (arr) {      
                    for (let i = 0; i < arr.length; i++){
                        console.log('match',arr[i].match(srcReg),arr[i].match(titleReg),arr[i].match(altReg))
                        if (arr[i].match(titleReg) == null) {
                            var _title = 'notitle'
                        } else {
                            var _title = arr[i].match(titleReg)[1]
                        }
                        if (arr[i].match(altReg) == null) {
                            var _alt = 'noalt'
                        } else {
                            var _alt = arr[i].match(altReg)[1]
                        }
                        if(arr[i].match(srcReg)[1].indexOf('amp;') !== -1){
                            var _src = arr[i].match(srcReg)[1].replace(/amp;/g, "W3School")
                            console.log('替换前：',arr[i].match(srcReg)[1],'替换后：',_src)
                        } else {
                            var _src = arr[i].match(srcReg)[1]
                        }
                        self.articleForm.newsContentList.push({
                            srcName: _src,
                            title: _title,
                            alt: _alt
                        })
                    }
                }
                $.base64.utf8encode = true;
                var html64 = $.base64.btoa(html)
                //var html = $.base64.atob(html64, true)
                self.articleForm.newsContent = html64
                console.log(self.articleForm.newsContentList)
            } else {
                self.$message.error('新闻正文内容不能为空')
                return
            }
            self.$refs[formName].validate((valid) => {
                if (valid) {
                    //校验敏感词
                    self.sensitiveWord (html64,type)
                }
            })

        },
        //敏感词检查
        sensitiveWord (html64,type){
            var self = this
            var data = {
                userId: getCookie('userId'),
                cvSsoToken: getCookie('esToken'),
                sourceText:html64
            }
            if (self.ajaxController) {
                self.ajaxController = false
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: '/sensitive/verification',
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            console.log('敏感词校验返回',res)
                            if (res.sensitiveList == null || res.sensitiveList.length == 0) {
                                self.reqSaveArticle(type)
                            } else {
                                self.ajaxController = true
                                self.$confirm('文章包含敏感词"'+ res.sensitiveList.join(',') +'",是否继续?', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    self.reqSaveArticle(type)
                                })
                            }
                        } else {
                            self.ajaxController = true
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
        //提交新建或保存
        reqSaveArticle(type){
            var self = this
            if (self.typeOfPage == 'creat') {
                var reqUrl = '/news/insert'
            } else {
                var reqUrl = '/news/modify'
            }
            //字数统计时间算法
            var contentStr = UE.getEditor('editor').getContentTxt().replace(/[\ |\，|\。|\！|\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g,"").replace(/\s/g,"");
            var min =  Math.ceil((contentStr.length)/300)
            console.log('阅读字数统计', contentStr.length, '阅读时间', min)
            self.articleForm.newsContentNumber = contentStr.length.toString();
            self.articleForm.newsContentReadTime = min;
            //编辑前端赋值
            self.articleForm.newsEditor = getCookie('userId') || ''
            //如果是定时任务，发布时间=定时时间
            if (type == 2) {
                self.articleForm.newsReleaseTime = self.articleForm.newsCompTime
            }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: reqUrl,
                    data: JSON.stringify(self.articleForm),
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            self.articleForm.newsId = res.newsId
                            if (type == 0) { //新建保存--不发布
                                self.ajaxController = true
                                self.$message.success('保存成功')
                                console.log('提交保存草稿返回',res)
                                setCookie ('createdit', '', 1) 
                                window.parent.location.href = '/index.html#modules/content/article_list.html'
                            } else if (type == 1) {//新建保存--并发布
                                self.submitArticle(type)
                            } else if (type == 2) {
                                self.submitDelayArticle(type)
                            }
                        } else {
                            self.ajaxController = true
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
        // 保存并实时发布新闻
        submitArticle (type) {
            var self = this
            /*
                发布时间前端赋值   0：保存   1：保存并发布   2：定时
                立即发布时前端将发布时间赋当前直
            */
            var _now = new Date().getTime()
            var data = {
                newsId: self.articleForm.newsId.toString(),
                newsStatus: 1,
                newsReleaseTime: _now,
                newsCompDelay: 0,
                newsCompTime: _now,
            }
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: '/news/push',
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    self.ajaxController = true
                    if(res.code == 200){
                        self.$message.success('发布成功')
                        setCookie ('createdit', '', 1)
                        window.parent.location.href = '/index.html#modules/content/article_list.html'
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
        //定时发布接口
        submitDelayArticle (type) {
            var self = this
            /*
                发布时间前端赋值   0：保存   1：保存并发布   2：定时
                定时发布时前端将定时发布时间赋当前用户手动选择的定时值
            */
            var data = {
                newsId: self.articleForm.newsId.toString(),
                newsCompDelay: self.articleForm.newsCompDelay,
                newsCompTime: self.articleForm.newsCompTime
            }
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: '/news/delay',
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    self.ajaxController = true
                    if(res.code == 200){
                        self.$message.success('定时发布提交成功')
                        setCookie ('createdit', '', 1)
                        window.parent.location.href = '/index.html#modules/content/article_list.html'
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
        //取消定时任务
        cancelReserveTime () {
            var self = this
            var data = {
                newsId: self.articleForm.newsId.toString(),
                newsCompDelay: 0
            }
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: '/news/cancelDelay',
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    self.ajaxController = true
                    if(res.code == 200){
                        self.$message.success('取消定时发布成功')
                        self.articleForm.newsCompDelay = 0
                        self.ifReserveTime = false
                        self.articleForm.newsCompTime = ''
                        self.showChangeReserveTime = true
                        self.submitBtnStatus = 0
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
        //返回取消编辑
        closeAndBack () {
            setCookie ('createdit', '', 1)
            window.parent.location.href = '/index.html#modules/content/article_list.html'
        },
        //type=编辑 请求原文章所有信息
        getEditArticleOrign (type) {
            var self = this
            // var data = {
            //     newsId: type,
            //     page: '1',
            //     limit: self.pagination1.pageSize.toString()
            // }
            $.ajax({
                type: "POST",
                url: "/news/info/"+ type.toString(),
                contentType: "application/json",
                //data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        console.log('请求修改的文章返回结果：',res.dict)
                        self.editArticleFilter(res.dict)
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
        //文章数据转换反显
        editArticleFilter (tempObj) {
            console.log('tempObj',tempObj)
            /*
                回显定时发布时间:
                已上线文章 status = 2, 不能修改定时时间---不显示
                非已上线文章 status !== 2, 如果想修改定时时间---先要取消之前定时发布
                submitBtnStatus: '0', //0实时发布   1定时发布   2全部隐藏
            */
            if (tempObj.newsCompDelay !== 0) { //目前正在定时中
                //显示取消定时按钮
                this.showChangeReserveTime = false
                //隐藏提交按钮
                this.submitBtnStatus = '2'
            } else if (tempObj.newsCompDelay == 0) {
                //显示选择定时按钮
                this.showChangeReserveTime = true
                //后台会回传定newsCompTime = 0，因为表里不能记空，前端转化为空反显
                this.ifReserveTime = false
                tempObj.newsCompTime = ''
            }
            //回显新闻关键词
            if (tempObj.newsKeywords !== '') {
                this.newsTagArray = tempObj.newsKeywords.split(',')
            }
            //回显自媒体和专栏缺省状态
            if (tempObj.newsMediaId == -1) {
                tempObj.newsMediaId = ''
            }
            if (tempObj.newsColumn == -1) {
                tempObj.newsColumn = ''
            }
            //回显原创状态  1.原创   2.非原创
            if (tempObj.originalStatus == '1') {
                this.ifOrignCheck = true
            } else if (tempObj.originalStatus == '2') {
                this.ifOrignCheck = false
            } else {
                this.$message.error('原创状态，后台反显回传不能为0或空')
            }
            
            //UE.getEditor('editor').execCommand('insertHtml', tempObj.newsContent)
            //UE.getEditor('editor').setContent(tempObj.newsContent, true)
            setTimeout(function(){
                //首先获得焦点可以使得初始的空格行前插入正式内容
                UE.getEditor('editor').focus();
                UE.getEditor('editor').execCommand('insertHtml', tempObj.newsContent)
            },1000)
            
            this.articleForm = tempObj
        },
        //获取百度分词
        getBaiduWord () {
            //baiduWordSuggest
            var self = this
            if (this.articleForm.newsTitle !== '') {
                var data = {
                    source: self.articleForm.newsTitle
                }
                $.ajax({
                    type: "POST",
                    url: '/news/abstractContent',
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            if (res.basicWords.length !== 0) {
                                self.baiduWordSuggest = res.basicWords.join(',')
                            } else {
                                self.$message.warning('百度分词无建议分词返回')
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
            }
        },
        //预览文章
        previewArticle (formName) {
            var self = this
            //获取html文本
            var html = UE.getEditor('editor').getContent()
            if (html !== '') {
                $.base64.utf8encode = true;
                var html64 = $.base64.btoa(html)
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        //预览提交接口
                        self.articleForm.newsContent = html64
                        $.ajax({
                            type: "POST",
                            url: '/news/previewSet',
                            contentType: "application/json",
                            data: JSON.stringify(self.articleForm),
                            dataType: "json",
                            success: function(res){
                                if(res.code == 200){
                                    console.log(res.previewId)
                                    window.open("/modules/sys/previewArticle.html?previewId=" + res.previewId);
                                    
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
            } else {
                self.$message.error('新闻正文内容不能为空')
                return
            }
            
        }
    },
    beforeDestroy () {
        setCookie ('createdit', '', 1)
    }
})



