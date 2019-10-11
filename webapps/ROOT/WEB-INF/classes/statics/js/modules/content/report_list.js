var vm = new Vue({
    el: '#report_list',
    data: {
        //研报1级频道
        reportChannelHook:'',//用于筛选二级频道，不上传
        channelOptions:[],
        editorOptions:[{
            value:1,
            label:'admin'
        }],
        pickerOptions:{
            disabledDate(time) {
                return time.getTime() > Date.now();
            }
        },  
        //研报1级频道下2级子频道
        reportTypeOptions:[],
        recommendOptions:[{
            label: '推荐',
            value: 1
        },{
            label: '不推荐',
            value: 2
        }],
        //搜索文章列表提交
        timeRange:[], //时间需要特殊处理,并且同步到searchForm
        searchForm:{
            reportId:'',//报告编号
            reportTitle:'',//报告标题
            reportStatus:[],//0是下线，1是在线，2是未发布
            reportChannel:'',//报告频道
            reportType:'',//2级频道
            reportCrtUserId:'',//创建人
            reportAuthor:'',//报告作者
            reportFrom:'',//报告来源
            recommendStatus:'',//推荐状态： 1：推荐 2：非推荐
            startTime:'',
            endTime:'',
            reportCloumn:'',//报告专栏编号
        },
        //表格结果
        tableData: [{
            reportId:'',//报告id
            reportTitle:'',//报告标题
            reportDesc:'',//描述
            reportType:'',//报告类型,普通报告，组图报告，高清报告，视频报告
            reportPriority:'',//报告优先级
            reportStatus:'',//报告状态 0未发布，1是待发布，2是已发布3是发布失败 4是待删除 5 删除
            reportChannel:'',//报告属于频道
            reportSubject:'',//报告属于专题
            reportColumn:'',//报告属于栏目
            reportIndustry:'',//报告属于行业
            reportEditor:'',//报告编辑编号
            reportTemplateId:'',//报告模版编号
            reportTemplateMid:'',//报告M站模板编号
            reportTemplateAddress:'',//报告模板目录
            reportTemplateMaddress:'',//报告M站模板目录
            reportUrl:'',//报告url地址
            reportConten:'',//报告内容
            reportMedia:'',//需要单独的媒体表关联
            reportKeywords:'',//报告关键字 逗号分割
            reportAuthorId:'',//报告作者编号
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
            recommendStatus:'',//推荐状态： 1：推荐 2：非推荐
            updatePvAt:'',//更新点击量时间
            channelTitle:'',//渠道名称
            userName:'',//发布人名称
            reportReleaseTime:'',//发布时间
            channelParentId:''//当前研报的一级频道ID
        }],
        //分页器相关
        pagination1: {
            currPage: 1,
            totalCount:0,
            totalPage:0,
            pageSize:10
        },
    },
    watch: {
        timeRange (val) {
            console.log(val)
            if (val) {
                this.searchForm.startTime = val[0]
                this.searchForm.endTime = val[1]
            } else {
                this.searchForm.startTime = ''
                this.searchForm.endTime = ''
            }
            console.log(this.searchForm)
        },
        // reportChannelHook (val) {
        //     console.log('1级频道：',val)
        //     this.reportType = []
        //     this.searchForm.reportChannel = ''
        //     this.getChannelListLevel2(val)
        // },
    },
    created () {
        //请求频道一级二级选项
        this.getChannelListLevel1()
        this.startSearch(0)
        this.getEditorOptionList()
    },
    methods:{
        handleCurrentChange (val) {
            this.pagination1.currPage = val
            this.startSearch() 
        },
        //开始搜索
        startSearch (type) {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchForm))
            data.reportTitle = data.reportTitle.toString().trim()
            data.reportChannel = self.searchForm.reportChannel.toString()
            data.reportType = self.searchForm.reportType.toString()
            data.reportCrtUserId = data.reportCrtUserId.toString()
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
                url: "/report/list",
                contentType: "application/json",
			    data: JSON.stringify(data),
			    dataType: "json",
			    success: function(res){
					if(res.code == 200){
                        self.doSomethingForReqData(res)
                        self.pagination1 = {
                            currPage: res.page.currPage,
                            totalCount:res.page.totalCount,
                            totalPage: res.page.totalPage,
                            pageSize: res.page.pageSize
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
        //处理后台的数据用于显示
        doSomethingForReqData (res) {
            var self = this
            var typeList = res.channelPage
            var orignDataList = res.page.list
            for (let i = 0; i < orignDataList.length; i++){
                orignDataList[i].reportReleaseTime = self.transformTime(orignDataList[i].reportReleaseTime)
                for (let k = 0; k < typeList.length; k++) {
                    if (orignDataList[i].reportType == typeList[k].channelId) {
                        orignDataList[i].chineseType = typeList[k].channelTitle
                    }
                }
            }
            self.tableData = orignDataList
            self.pagination1 = {
                currPage: res.page.currPage,
                totalCount:res.page.totalCount,
                totalPage: res.page.totalPage,
                pageSize: res.page.pageSize
            }
        },
        //新建报告
        creatReport () {
            setCookie ('createditreport', '', 1)
            if (window.parent.location.hash == '#modules/content/edit_report.html') {
                window.parent.location.reload()
            } else {
                window.parent.location.href = '/index.html#modules/content/edit_report.html'
            }
        },
        //编辑这篇报告
        editThisReport(item) {
            setCookie ('createditreport', item.reportId, 1)
            window.parent.location.href = '/index.html#modules/content/edit_report.html'
            //location.href = '/modules/content/edit_article.html'
        },
        //删除报告
        deleteThisReport (item) {
            var self = this
            self.$confirm('确实要删除此报告吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (item.reportStatus == 2 ) {
                    var data = {
                        reportId: item.reportId,
                        reportStatus:'4'
                    }
                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        url: "/report/deleteStatus",
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
                        reportId: item.reportId.toString(),
                        reportStatus : '5'
                    }
                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        url: "/report/update",
                        data: JSON.stringify(data),
                        dataType: "json",
                        success: function(res) {
                            if(res.code == 200){
                                self.startSearch()
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
        //报告下线
        offlineThisReport (item) {
            var self = this
            self.$confirm('确实要下线此报告吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = {
                    reportId: item.reportId,
                    reportStatus:'4'
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/report/offline",
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
        //报告发布上线--改状态为待发布
        onlineThisReport (item) {
            var self = this
            self.$confirm('确实要批量发布此新闻吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = {
                    reportId: item.reportId,
                    reportStatus:'1'
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/report/push",
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
        //获取2级频道
        getChannelListLevel2(id) {
            var self = this
            self.reportTypeOptions = []
            self.searchForm.reportType = ''
            if (id !== '') {
                var data = {
                    channelPid: id.toString(),
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
            }
            
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