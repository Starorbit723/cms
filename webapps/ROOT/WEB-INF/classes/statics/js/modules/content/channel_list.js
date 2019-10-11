var vm = new Vue({
    el: '#channel_list',
    data: {
        //主列表页与子页面切换
        showChildPage:false,
        //搜索提交
        searchForm:{
            channelTitle:''
        },
        //表格结果
        tableData: [{
            channelId: '',
            channelTitle: '',
            channelDesc: '',
            channelPic: '',
            channelKeyword: '',
            channelPid: '',
            channelType: '',
            channelPriority: '',
            channelStatus: '', //频道状态0是下线，1是在线
            channelIndustry: '',
            channelEditor: '',
            channelTag: '',
            channelPara: '',
            channelCrtTime: '',
            channelModTime: '',
            unpublished: '',
            undetermined: '',
            release: '',
            channelCount: '',//阅读数量
            channelUrl: '',//频道地址
            editorName: '',//创建人名称
            newsCount: '',//总文章数
        }],
        //分页器相关
        // pagination1: {
        //     currPage: 1,
        //     totalCount:0,
        //     totalPage:0,
        //     pageSize:20
        // },
        //新建频道相关
        showCreatChannel:false,
        creatNewChannelForm:{
            channelTitle:'',
            channelDesc:''
        },
        creatNewChannelFormRules: {
            channelTitle: [
              { required: true, message: '请输入频道名称', trigger: 'blur' }
            ],
            channelDesc: [
              { required: true, message: '请输入备注信息', trigger: 'blur' }
            ]
        },
        //修改频道基本信息相关
        editChannelForm:{
            channelId: '',
            channelTitle: '',
            channelDesc: '',
            channelPic: '',
            channelKeyword: '',
            channelPid: '',
            channelType: '',
            channelPriority: '',
            channelStatus: '', //频道状态0是下线，1是在线
            channelIndustry: '',
            channelEditor: '',
            channelTag: '',
            channelPara: '',
            channelCrtTime: '',
            channelModTime: '',
            unpublished: '',
            undetermined: '',
            release: '',
            channelCount: '',
            channelUrl: '',//频道地址
            editorName: '',//创建人名称
            newsCount: '',//总文章数
        },
        editChannelFormRules: {
            channelTitle: [
              { required: true, message: '请输入频道名称', trigger: 'blur' }
            ],
            channelDesc: [
              { required: true, message: '请输入备注信息', trigger: 'blur' }
            ]
        },
        //频道下的文章列表
        channelInnerData :[{
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
        //频道分页器相关
        pagination2: {
            currPage: 1,
            totalCount:0,
            totalPage:0,
            pageSize:10
        },
        //添加文章弹出层
        showAddArticleDialog: false,
        searchArticleStr:'',
        multipleSelection: [],
        searchArticleTableData:[],
        //搜索文章分页器相关
        // pagination3: {
        //     currPage: 1,
        //     totalCount:0,
        //     totalPage:0,
        //     pageSize:10
        // },
    },
    created() {
        this.searchChannleList()
    },
    methods:{
        handleCurrentChange () {},
        handleCurrentChange2 (val) {
            this.pagination2.currPage = val
            this.reqChannelArticle()
        },
        // handleCurrentChange3 (val) {
        //     this.pagination3.currPage = val
        //     this.startSearchArticle()
        // },
        //请求频道列表
        searchChannleList () { 
            var self = this
            var data = {
                channelTitle: self.searchForm.channelTitle.toString().trim()
            }
            $.ajax({
				type: "POST",
			    url: "/channel/list",
			    data: JSON.stringify(data),
			    dataType: "json",
			    success: function(res){
					if(res.code == 200){
                        console.log('channelList:',res.channelList)
                        self.tableData = res.channelList
                        // self.pagination1 = {
                        //     currPage: res.page.currPage,
                        //     totalCount:res.page.totalCount,
                        //     totalPage: res.page.totalPage,
                        //     pageSize: res.page.pageSize
                        // }
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
        //新建频道相关
        openCreatChannelBox () {
            this.showCreatChannel = true
        },
        //关闭频道相关
        closeCreatChannelBox (){
            this.showCreatChannel = false
        },
        //提交创建新频道
        submitCreatChannel(formName) {
            var self = this
            self.$refs[formName].validate((valid) =>{
                if (valid) {
                    var data = {
                        channelTitle:self.creatNewChannelForm.channelTitle,
                        channelDesc: self.creatNewChannelForm.channelDesc
                    }
                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        url: "/channel/save",
                        data: JSON.stringify(data),
                        dataType: "json",
                        success: function(res){
                            if(res.code == 200){
                                console.log('channelCreat:',res)
                                self.$message({
                                    message: '创建频道成功',
                                    type: 'success'
                                })
                                self.searchChannleList()
                                self.clearCreatChannelBox('creatNewChannelForm')
                                self.closeCreatChannelBox()
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
        //清空新建弹框内容状态
        clearCreatChannelBox(formName){
            this.creatNewChannelForm = {
                channelTitle:'',
                channelDesc:''
            }
            this.$refs[formName].resetFields();
        },
        //上下移动频道顺序并保存
        moveUp(index) {
            var self = this;
            if (index > 0) {
                //先更换序列字段
                var temp = self.tableData[index].channelPriority
                self.tableData[index].channelPriority = self.tableData[index-1].channelPriority
                self.tableData[index-1].channelPriority = temp
                //再替换位置
                let upDate = self.tableData[index - 1];
                self.tableData.splice(index - 1, 1);
                self.tableData.splice(index,0, upDate);
            }
        },
        moveDown(index){
            var self = this;
            if ((index + 1) !== self.tableData.length){
                //先更换序列字段
                var temp = self.tableData[index].channelPriority
                self.tableData[index].channelPriority = self.tableData[index+1].channelPriority
                self.tableData[index+1].channelPriority = temp
                //再替换位置
                let downDate = self.tableData[index + 1];
                self.tableData.splice(index + 1, 1);
                self.tableData.splice(index,0, downDate);
            }
        },
        //频道优先级排序
        saveChannelIndex () {
            var self = this
            self.$confirm('确认要保存当前频道列表及顺序吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = []
                for (let i = 0; i < self.tableData.length; i++) {
                    data.push({
                        channelId: self.tableData[i].channelId,
                        channelPriority: self.tableData[i].channelPriority
                    })
                }
                console.log('channelIndex:', data)
                $.ajax({
                    type: "POST",
                    url: "/channel/updateOrder",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            console.log('channelIndex:',res)
                            self.$message({
                                message: '修改频道优先级成功',
                                type: 'success'
                            });
                            self.searchChannleList()
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
        //删除频道
        // delChannel (item) {
        //     var self = this
        //     self.$confirm('确认删除当前频道吗?', '提示', {
        //         confirmButtonText: '确定',
        //         cancelButtonText: '取消',
        //         type: 'warning'
        //     }).then(() => {
        //         var data = {
        //             channelId : item.channelId,
        //             channelStatus: 0 //0代表下线，1上线
        //         }
        //         $.ajax({
        //             type: "POST",
        //             url: "/channel/update",
        //             contentType: "application/json",
        //             data: JSON.stringify(data),
        //             dataType: "json",
        //             success: function(res){
        //                 if(res.code == 200){
        //                     console.log('channelIndex:',res)
        //                     self.$message({
        //                         message: '删除频道成功',
        //                         type: 'success'
        //                     });
        //                     self.searchChannleList()
        //                 }else{
        //                     mapErrorStatus(res)
                    //         vm.error = true;
                    //         vm.errorMsg = res.msg;
                    //     }
                    // },
                    // error:function(res){
                    //     mapErrorStatus(res)
                    // }
        //         });

        //     })
        // },
        //修改这个频道
        editThisChannel (item){
            this.editChannelForm = JSON.parse(JSON.stringify(item))
            this.reqChannelArticle(0)
            this.showChildPage = true  
        },
        //请求频道下文章列表
        reqChannelArticle(type){
            var self = this
            var data = {
                newsChannel: self.editChannelForm.channelId.toString(),
            }
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
                url: '/news/newsList',
                data: JSON.stringify(data),
                contentType: "application/json",
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        console.log('频道下文章列表:',res)
                        self.channelInnerData = res.page.list
                        self.pagination2 = {
                            currPage: self.pagination2.currPage,
                            totalCount: res.page.totalCount,
                            totalPage: res.page.totalPage,
                            pageSize:10
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
        //编辑频道相关
        closeEditChannelBox (formName){
            this.editChannelForm={}
            this.channelInnerData = []
            this.$refs[formName].resetFields();
            this.showChildPage = false
        },
        //提交频道信息修改
        submitEditChannel(formName) {
            var self = this
            self.$refs[formName].validate((valid) =>{
                if (valid) {
                    var data = {
                        channelId:self.editChannelForm.channelId,
                        channelTitle: self.editChannelForm.channelTitle,
                        channelDesc: self.editChannelForm.channelDesc
                    }
                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        url: "/channel/update",
                        data: JSON.stringify(data),
                        dataType: "json",
                        success: function(res){
                            if(res.code == 200){
                                console.log('channelEdit:',res)
                                self.$message({
                                    message: '频道修改成功',
                                    type: 'success'
                                });
                                self.closeEditChannelBox('editChannelForm')
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
        //启用或禁用当前频道 type:0下线  1上线并显示  2上线不显示
        togglestatusThisChannel (item,type){
            var self = this
            self.$confirm('确实要调整该频道状态吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = {
                    channelId:item.channelId.toString(),
                    channelStatus: type.toString()
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/channel/update",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            self.$message.success('状态修改成功');
                            self.searchChannleList()
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
        //添加文章到此频道
        addArticleToChannel () {
            this.showAddArticleDialog = true
        },
        //select选中文章时触发
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        //开始搜索字段
        startSearchArticle (type) {
            var self = this
            var data = {
                newsTitle: self.searchArticleStr,
                newsStatus:['2']
            }
            // if (type == 0) {
            //     Object.assign(data,{
            //         page: '1',
            //         limit: self.pagination3.pageSize.toString()
            //     })
            // } else {
            //     Object.assign(data,{
            //         page: self.pagination3.currPage.toString(),
            //         limit: self.pagination3.pageSize.toString()
            //     })
            // }
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
                        // self.pagination3 = {
                        //     currPage: res.page.currPage,
                        //     totalCount:res.page.totalCount,
                        //     totalPage:res.page.totalPage,
                        //     pageSize:res.page.pageSize
                        // }
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
        //添加选中项
        addUserSelect (){
            var self = this
            console.log(self.multipleSelection)
            var data = {
                type:0,
                entityId: self.editChannelForm.channelId.toString(),
                newsEntityList:[]
            }
            for (let i = 0; i < self.multipleSelection.length; i++) {
                data.newsEntityList.push({
                    newsId: self.multipleSelection[i].newsId.toString(),
                    newsChannel : self.editChannelForm.channelId.toString()
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
                        self.reqChannelArticle()
                        self.searchArticleStr = ''
                        self.multipleSelection = []
                        self.searchArticleTableData = []
                        self.$message({
                            type: 'success',
                            message: '添加文章成功!'
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
            
        },
        //关闭弹框返回编辑页
        backToEditPage (){
            this.showAddArticleDialog = false
            this.searchArticleStr = ''
            this.multipleSelection = []
            this.searchArticleTableData = []
        },
        //从频道中移除该文章
        removeArticleFromChannel (item) {
            var self = this
            self.$confirm('确实要从该频道移除文章吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = {
                    type: 1,
                    entityId: self.editChannelForm.channelId.toString(),
                    newsEntity:{
                        newsId: item.newsId.toString(),
                        newsChannel : '-1'
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
                            self.reqChannelArticle()
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