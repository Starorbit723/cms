var vm = new Vue({
    el: '#article_list',
    data: {
        pickerOptions:{
            disabledDate(time) {
                return time.getTime() > Date.now();
            }
        },  
        //初始化的基本数据
        channelOptions:[],
        editorOptions:[
        // {
        //     userId:1,
        //     username:'admin'
        // }
        ],
        recommendOptions:[{
            label: '推荐',
            value: 1
        },{
            label: '不推荐',
            value: 2
        }],
        //搜索文章列表提交
        timeRange:[], //时间需要特殊处理,并且同步到searchForm
        ifOrignCheck: false, //1：原创 2：非原创, 默认为2非原创
        searchForm:{
            newsId:'',//新闻编号
            newsTitle:'',//新闻标题
            newsStatus:[],//0未发布，1是待发布，2是已发布 3是发布失败 4是待删除 5 删除
            newsChannel:'',//新闻频道
            newsCrtUserId:'',//创建人
            newsAuthor:'',//新闻作者
            newsFrom:'',//新闻来源
            recommendStatus:'',//推荐状态：0待推荐  1：推荐 2：非推荐
            originalStatus:2,//原创状态 1：原创 2：非原创
            startTime:'',//
            endTime:''//
        },
        //表格结果
        tableData: [{
            newsId:'',//新闻id
            newsTitle:'',//新闻标题
            newsDesc:'',//描述
            newsType:'',//新闻类型,普通新闻，组图新闻，高清新闻，视频新闻
            newsPriority:'',//新闻优先级
            newsStatus:'',//新闻状态 0未发布，1是待发布，2是已发布3是发布失败 4是待删除 5 删除
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
            channelTitle:'',//频道中文名称
            userName:'',//发布人名称
            newsCount:'',//阅读量
            newsReleaseTime:'',//发布时间
            newsFlashStatus:'',//是否快讯 0否 1 是
            newsOrderCount:'',//手工点击量
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
        }
    },
    created () {
        this.getChannelList()
        this.startSearch(0)
        this.getEditorOptionList()
    },
    methods:{
        handleCurrentChange (val) {
            this.pagination1.currPage = val
            this.startSearch() 
        },
        //切换原创状态
        changeIfOrign(val){
            //原创状态 1：原创 2：非原创
            if (val) {
                this.searchForm.originalStatus = 1
            } else {
                this.searchForm.originalStatus = 2
            }
        },
        //开始搜索
        startSearch (type) {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchForm))
            data.newsTitle = data.newsTitle.toString().trim()
            data.newsAuthor = data.newsAuthor.toString().trim()
            data.newsFrom = data.newsFrom.toString().trim()
            data.newsChannel = data.newsChannel.toString()
            data.recommendStatus = data.recommendStatus.toString()
            data.newsCrtUserId = data.newsCrtUserId.toString()
            data.originalStatus = data.originalStatus.toString()
            console.log(data)
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
            console.log(JSON.stringify(data))
            $.ajax({
				type: "POST",
                url: "/news/newsList",
                contentType: "application/json",
			    data: JSON.stringify(data),
			    dataType: "json",
			    success: function(res){
					if(res.code == 200){
                        self.tableData = res.page.list
                        for (let i = 0; i < self.tableData.length; i++){
                            self.tableData[i].newsReleaseTime = self.transformTime(self.tableData[i].newsReleaseTime)
                        }
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
        //下载数据
        downloadData(){
            var self = this
            self.$confirm('确实要下载数据吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = JSON.parse(JSON.stringify(self.searchForm))
                data.page = '1'
                data.limit = '100'
                data.newsTitle = data.newsTitle.toString().trim()
                data.newsAuthor = data.newsAuthor.toString().trim()
                data.newsFrom = data.newsFrom.toString().trim()
                data.newsChannel = data.newsChannel.toString()
                data.recommendStatus = data.recommendStatus.toString()
                data.newsCrtUserId = data.newsCrtUserId.toString()
                data.originalStatus = data.originalStatus.toString()

                var jsonData = JSON.stringify(data)
                console.log('jsondata',jsonData)
                $.base64.utf8encode = true;
                var jsondata64 = $.base64.btoa(jsonData);
                console.log('jsondata64',jsondata64)
                window.open("/news/newsExcel?jsonData="+ jsondata64)

            })
        },
        //新建文章
        creatArticle () {
            setCookie ('createdit', '', 1)
            if (window.parent.location.hash == '#modules/content/edit_article.html') {
                window.parent.location.reload()
            } else {
                window.parent.location.href = '/index.html#modules/content/edit_article.html'
            }
        },
        //编辑这篇文章
        editThisArticle(item) {
            setCookie ('createdit', item.newsId, 1)
            window.parent.location.href = '/index.html#modules/content/edit_article.html'
            //location.href = '/modules/content/edit_article.html'
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
        //删除新闻---将状态改成4：待删除
        deleteThisArticle (item) {
            var self = this
            self.$confirm('确实要删除此新闻吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (item.newsStatus == 2 ) {
                    var data = {
                        newsId: item.newsId,
                        newsStatus:'4'
                    }
                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        url: "/news/deleteStatus",
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
                        newsEntity:{
                            newsId: item.newsId.toString(),
                            newsStatus : '5'
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
        //文章下线---将状态改成4：待删除
        offlineThisArticle (item) {
            var self = this
            self.$confirm('确实要下线此新闻吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = {
                    newsId: item.newsId,
                    newsStatus:'4'
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/news/offline",
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
        //文章上线
        onlineThisArticle(item){
            var self = this
            self.$confirm('确实要发布此新闻吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = {
                    newsId: item.newsId,
                    newsStatus:'1',
                    newsReleaseTime: new Date().getTime()
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/news/push",
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
        //切换文章推荐状态
        togglePushThisArticle(item) {
            var self = this
            self.$confirm('是否要修改文章的推送状态？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //0 待推荐   1推荐    2不推荐
                if (item.recommendStatus == 2) {
                    var data = {
                        newsId: item.newsId.toString(),
                        recommendStatus : '1'
                    }
                } 
                else if (item.recommendStatus == 1 || item.recommendStatus == 0) {
                    var data = {
                        newsId: item.newsId.toString(),
                        recommendStatus : '2'
                    }
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/news/recommend",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res) {
                        if(res.code == 200){
                            self.startSearch()
                            self.$message({
                                type: 'success',
                                message: '修改推荐成功'
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
        //取消定时发布任务
        cancelReserveTask (item) {
            var self = this
            self.$confirm('确认要取消该文章定时发布任务吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = {
                    newsId: item.newsId.toString(),
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
        //跳转至新闻详情
        openUrlArticlePage(item){
            // console.log('url',url)
            if(item.newsStatus == 2) {
                window.open('https://www.chinaventure.com.cn'+item.newsUrl, "newwindow") 
            }
        },
        //获取所有编辑字典表
        getEditorOptionList () {
            var self = this
            $.ajax({
                type: "GET",
                contentType: "application/json",
                url: '/sys/user/allList',
                dataType: "json",
                success: function(res) {
                    if (res.code == 200) {
                        self.editorOptions = res.list
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