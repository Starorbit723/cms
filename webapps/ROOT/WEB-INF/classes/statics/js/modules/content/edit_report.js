var vm = new Vue({
    el: '#edit_report',
    data: {
        //新建或修改
        typeOfPage:'creat',
        //按钮请求开关
        ajaxController:true,
        //切换展示封面图库
        showCoverimgLib:false,
        //切换内容图库
        showContentimgLib:false,
        //初始化数据
        labelOptions:[],
        channelOptions:[],
        reportTypeOptions:[],
        //文章基本信息
        reportKeywordsArray:[],
        reportForm:{
            reportTitle:'',//标题
            reportSubject:'',//报告属于专题
            reportColumn:'',//报告属于栏目
            reportIndustry:'',//报告属于行业
            reportEditor:'',//报告编辑
            reportTemplateId:'',//报告模版编号
            reportUrl:'',
            reportTemplateMid:'',//报告M站模板编号
            reportDesc:'',//描述
            reportType:'',//报告类型,普通报告，组图报告，高清报告，视频报告
            reportPriority:'',//报告优先级
            reportContent:'',//报告内容
            reportKeywords:'',//报告关键字
            reportAuthor:'',//报告作者
            reportAbstract:'',//报告摘要
            reportSubhead:'',//报告头标题
            reportSubtitle:'',//报告子标题
            reportHeadPic:'',//报告头图
            reportPictures:'',//报告图片，每个图片ID用分号隔开
            reportMatchPic:'',//报告自动配图
            reportVideos:'',//视频报告链接
            reportOrg:'',//
            reportSubtype:'',//报告子类型
            reportTag:'',//报告标签
            reportFrom:'',//报告来源
            reportSourceUrl:'',//报告来源地址
            reportPara:'',//json参数
            reportCompDelay:'',//延时编译，0代表不需要延时编译，1代表需要延时编译
            reportCompTime:'',//报告预编译时间
            reportCrtUserId:'',//创建人编号
            reportCrtTime:'',//报告数据建立时间
            reportCrtTimeMillis:'',//报告数据建立时间(毫秒数)
            reportModTime:'',//报告数据修改时间
            originalStatus:'',//原创状态 1：原创 2：非原创
            updatePvAt:'',//更新点击量时间
            reportStatus:'',//0是下线，1是在线，2是未发布
            reportChannel:'',//报告属于频道
            recommendStatus:'',//'推荐状态： 1：推荐 2：非推荐
            reportOrderCount:'',//手工点击量
            channelParentId:'',//当前研报的一级频道ID
            reportAttachments:'',//研报PDF
            pictureEntity:{},//封面图的item全部信息
            reportContentList:[{//报告内容图片列表
                srcName:'',//图片地址
                title:'',
                alt:''
            }]
        },
        reportFormRules:{
            reportTitle: [
                { required: true, message: '标题不能为空', trigger: 'change' },
                { max: 36, message: '您输入的字数超过36个字', trigger: 'change' }
            ],
            reportAbstract:[
                { required: true, message: '摘要不能为空', trigger: 'change' }
            ],
            reportDesc:[
                { required: true, message: '描述不能为空', trigger: 'change' }
            ],
            reportKeywords:[
                { required: true, message: '关键词不能为空', trigger: 'change' }
            ],
            reportAuthor: [
                { required: true, message: '作者不能为空', trigger: 'change' }
            ],
            reportFrom:[
                { required: true, message: '来源不能为空', trigger: 'change' }
            ],
            reportChannel:[
                { required: true,  message: '频道不能为空',  trigger: 'change' }
            ],
            reportType:[
                { required: true, message: '类型不能为空', trigger: 'change' }
            ],
            reportHeadPic:[
                { required: true,  message: '请选择封面图',  trigger: 'change' }
            ],
            // reportAttachments:[
            //     { required: true,  message: '请上传报告文件',  trigger: 'change' }
            // ]
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
        //PDF文件相关
        ifShowFileList: false,//文件格式不对时，不展示文件名
        fileList:[],
        pdfFormData :{}
    },
    watch:{
    },
    created () {
        //请求频道一级选项
        this.getChannelListLevel1()
    },
    mounted () {
        var type = getCookie('createditreport')
        if (type == '' || type == undefined) {
            this.typeOfPage = 'creat'
        } else {
            this.typeOfPage = 'edit'
            this.ifShowFileList = true
            this.getEditReportOrign(type)
        }
        console.log('type',this.typeOfPage)
    },
    methods:{
        //用户移除报告
        handleRemove(file, fileList) {
            // this.ifShowFileList = false
            // this.reportForm.reportAttachments = ''
            // this.pdfFormData = {}
        },
        //删除报告
        deletReportPdf () {
            console.log('待删除的pdf',this.fileList)
            this.$refs.upload.clearFiles();
            //空的话传一个空格
            this.reportForm.reportAttachments = ' '
            this.pdfFormData = {}
        },
        //上传报告
        handleChange(file) {
            console.log(file)
            var self = this
            if (file.raw.type !== 'application/pdf') {
                self.$message.error('上传文件只能是 PDF 格式!');
                return false
            }
            let temp = new FormData();
            temp.append('files',file.raw);
            console.log('待上传PDF', temp)
            self.pdfFormData = temp
            $.ajax({
                type: "POST",
                contentType: false,
                processData: false,
                mimeType:"multipart/form-data",
                url: '/upload/reportFile',
                data: self.pdfFormData,
                success: function(res){
                    var resJSON = JSON.parse(res)
                    console.log('研报上传返回',JSON.parse(res))
                    if(resJSON.code == 200){
                        self.ifShowFileList = true
                        self.reportForm.reportAttachments = resJSON.url
                        console.log('接受到图片改变后的form',self.reportForm)
                    } else {
                        self.$message.error('研报上传失败,请联系管理员')
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
        handleCurrentChange (val) {
            this.pagination1.currPage = val
            this.searchCoverImg()
        },
        handleCurrentChange2 (val) {
            this.pagination2.currPage = val
            this.searchContentImg()
        },
        //报告关键词改变
        reportKeywordChange (val) {
            console.log('报告关键词',val)
            for (let i = 0; i < this.reportKeywordsArray.length; i++) {
                if (this.reportKeywordsArray[i].length > 20) {
                    let tempArr = JSON.parse(JSON.stringify(this.reportKeywordsArray))
                    tempArr.splice(i,1) 
                    this.reportKeywordsArray = tempArr
                    this.$message.warning('单一标签最多20字')
                }
            }
            if (this.reportKeywordsArray.length > 3) {
                this.$message.warning('标签做多可设置为3个')
                this.reportKeywordsArray = this.reportKeywordsArray.splice(0,3)
            }
            var tempStr = ''
            tempStr = this.reportKeywordsArray.join(',')
            this.reportForm.reportKeywords = tempStr
            console.log('当前reportKeywords',this.reportForm.reportKeywords)
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
                        self.searchCoverimgForm.picTitle = ''
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
            this.reportForm.reportHeadPic = item.picUrl
            this.reportForm.pictureEntity = item
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
                        self.searchContentimgForm.picTitle = ''
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
        //新建或修改报告
        saveReportToDraft (formName,type){
            var self = this 
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
                self.reportForm.reportContentList = [] 
                if (arr) {      
                    for (let i = 0; i < arr.length; i++){
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
                        } else if (arr[i].match(srcReg)[1].indexOf('http://cms.chinaventure.com.cn') !== -1) { 
                            var _src = arr[i].match(srcReg)[1].replace('http://cms.chinaventure.com.cn', "")
                        }  else if (arr[i].match(srcReg)[1].indexOf('https://cms.chinaventure.com.cn') !== -1) { 
                            var _src = arr[i].match(srcReg)[1].replace('https://cms.chinaventure.com.cn', "")
                        } else {
                            var _src = arr[i].match(srcReg)[1]
                        }
                        self.reportForm.reportContentList.push({
                            srcName: _src,
                            title: _title,
                            alt: _alt
                        })
                    }
                }
                $.base64.utf8encode = true;
                var html64 = $.base64.btoa(html)
                //var html = $.base64.atob(html64, true)
                self.reportForm.reportContent = html64
                console.log(self.reportForm.reportContentList)
            } else {
                self.$message.error('报告正文内容不能为空')
                return
            }
            console.log('待上传全部：',self.reportForm)
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
                                self.reqSaveReport(type)
                            } else {
                                self.ajaxController = true
                                self.$confirm('文章包含敏感词"'+ res.sensitiveList.join(',') +'",是否继续?', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    self.reqSaveReport(type)
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
        reqSaveReport (type) {
            var self = this
            if (self.typeOfPage == 'creat') {
                var reqUrl = '/report/insert'
            } else {
                var reqUrl = '/report/modify'
            }
            //把当前用户的id作为发布人添加到提交中
            self.reportForm.reportEditor = getCookie('userId') || ''
            console.log('提交前===>', self.reportForm)
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: reqUrl,
                data: JSON.stringify(self.reportForm),
                dataType: "json",
                success: function(res) {
                    if(res.code == 200){
                        self.reportForm.reportId = res.reportId
                        if (type == 0) { //新建保存--不发布
                            self.ajaxController = true
                            self.$message.success('保存成功')
                            console.log('提交保存草稿返回',res)
                            setCookie ('createditreport', '', 1)
                            window.parent.location.href = '/index.html#modules/content/report_list.html'
                        } else if (type == 1) {//新建保存--并发布
                            self.submitReport()
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
        // 发布报告
        submitReport () {
            var self = this
            var data = {
                reportId: self.reportForm.reportId.toString(),
                reportStatus: 1
            }
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: '/report/push',
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    self.ajaxController = true
                    if(res.code == 200){
                        self.$message.success('发布成功')
                        setCookie ('createditreport', '', 1)
                        window.parent.location.href = '/index.html#modules/content/report_list.html'
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
        //返回取消编辑
        closeAndBack () {
            setCookie ('createditreport', '', 1)
            window.parent.location.href = '/index.html#modules/content/report_list.html'
        },
        //type=编辑 请求原文章所有信息
        getEditReportOrign (type) {
            var self = this
            // var data = {
            //     reportId: type,
            //     page: '1',
            //     limit: self.pagination1.pageSize.toString()
            // }
            $.ajax({
                type: "POST",
                url: "/report/info/" + type.toString(),
                contentType: "application/json",
                //data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        console.log('请求修改的文章返回结果：',res.dict)
                        self.editReportFilter(res.dict)
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
        //报告数据转换反显
        editReportFilter (tempObj) {
            //UE.getEditor('editor').setContent(tempObj.reportContent, true);
            //回显新闻关键词
            if (tempObj.reportKeywords !== null) {
                if (tempObj.reportKeywords !== ''){
                    this.reportKeywordsArray = tempObj.reportKeywords.split(',')
                }
            }
            //回显报告pdf地址--空格符代表没有pdf文件
            if (tempObj.reportAttachments == ' ') {
                tempObj.reportAttachments = ''
            }
            setTimeout(function(){
                //首先获得焦点可以使得初始的空格行前插入正式内容
                UE.getEditor('editor').focus();
                UE.getEditor('editor').execCommand('insertHtml', tempObj.reportContent)
            },1000)
            this.reportForm = tempObj
            console.log('filter之后的',tempObj,this.reportForm)
            this.requestTwoLevelChannel(0)
        },
        //初始化--获取一级频道列表
        getChannelListLevel1 () {
            var self = this
            var data = {
                channelPid: '-1',
                page:'1',
                limit:'1000'
            }
            $.ajax({
                type: "POST",
                contentType: "application/json",
			    url: "/reportChannel/list",
			    data: JSON.stringify(data),
			    dataType: "json",
			    success: function(res){
					if(res.code == 200){
                        self.channelOptions = res.reportReportChannelList
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
        //获取2级频道  type  0初始化加载反显  1用户onchange时  
        requestTwoLevelChannel(type) {
            var self = this
            self.reportTypeOptions = []
            if (type == 1) {
                self.reportForm.reportType = ''
            }
            var data = {
                channelPid: self.reportForm.reportChannel.toString(),
                page:'1',
                limit:'1000'
            }
            $.ajax({
                type: "POST",
                contentType: "application/json",
			    url: "/reportChannel/list",
			    data: JSON.stringify(data),
			    dataType: "json",
			    success: function(res){
					if(res.code == 200){
                        self.reportTypeOptions = res.reportReportChannelList
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
        //替换sention标签
        replaceSectionTag () {
            var html = UE.getEditor('editor').getContent()
            ue.setContent(html.replace(/section/g, 'p'));
        }
    },
    beforeDestroy () {
        setCookie ('createditreport', '', 1)
    }
})


//实例化编辑器
//建议使用工厂方法getEditor创建和引用编辑器实例，如果在某个闭包下引用该编辑器，直接调用UE.getEditor('editor')就能拿到相关的实例
var ue = UE.getEditor('editor');
