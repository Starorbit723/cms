var vm = new Vue({
    el: '#meetinglivepage_list',
    data: {
        //搜索文章列表提交
        timeRange:[], //时间需要特殊处理,并且同步到searchForm
        searchForm:{
            name:'',//标题
            startTime:'',//开始时间
            endTime:'',//结束时间
            publishStatus: ['0','1','2','3','4']
        },
        //表格结果
        tableData: [{
            id:'',//主键
            name:'',//标题
            desc:'',//简介
            publishStatus:'',//报道专题状态  1：发布(上线) 2：不发布(下线) 3：待发布(草稿) 4删除
            keywords:'', //关键词
            pcImg: '', //pc头图
            pcLink: '', //pc链接
            mImg: '',//m头图
            mLink: '',//m链接
            meetingReportListId: '',//会议报道id
            meetingAgendaId:'',//日程ID
            meetingCooperationId:'',//合作机构ID
            createUserId: '',
            updateUserId: '',
            updateAt: '',
            createAt: '',
            templateId: '',
            templateMid: '',
            templateAddress: '',
            templateMaddress: '',
            reportTopicUrl: '', //专题报道链接
            modUserName: '', // 更新人
            jsonData:[]
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
            if (val) {
                this.searchForm.startTime = val[0]
                this.searchForm.endTime = val[1]
            } else {
                this.searchForm.startTime = ''
                this.searchForm.endTime = ''
            }
        }
    },
    created () {
        //this.getMeetingType()
        this.startSearch(0)
    },
    methods:{
        openUrlMeetingDetailPage(item) {
            if(item.publishStatus == '2') {
                window.open('https://www.chinaventure.com.cn'+item.meetingUrl, "newwindow")
            }
        },
        handleCurrentChange (val) {
            this.pagination1.currPage = val
            this.startSearch() 
        },
        //开始搜索
        startSearch (type) {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchForm))
            data.name = data.name.toString().trim()
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
                url: "/reportTopic/list",
                contentType: "application/json",
			    data: JSON.stringify(data),
			    dataType: "json",
			    success: function(res){
					if(res.code == 200){
                        self.tableData = res.page.list
                        for (let i = 0; i < self.tableData.length; i++){
                            self.tableData[i].meetingStarTime = self.transformTime(parseInt(self.tableData[i].meetingStarTime))
                            self.tableData[i].meetingEndTime = self.transformTime(parseInt(self.tableData[i].meetingEndTime))
                            self.tableData[i].meetingModTime = self.transformTime(parseInt(self.tableData[i].meetingModTime))
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
        //新建报道专题--跳转至详情页
        creatMeeting () {
            setCookie ('createditmeetinglive', '', 1)
            if (window.parent.location.hash == '#modules/meeting/edit_meetinglive.html') {
                window.parent.location.reload()
            } else {
                window.parent.location.href = '/index.html#modules/meeting/edit_meetinglive.html'
            }
        },
        //编辑报道专题
        editThisMeeting(item) {
            setCookie ('createditmeetinglive', item.id, 1)
            window.parent.location.href = '/index.html#modules/meeting/edit_meetinglive.html'
        },
        //删除报道专题
        deleteThisMeetingLive (item) {
            var self = this
            self.$confirm('确实要删除此报道专题吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = JSON.parse(JSON.stringify(item))
                data. meetingReportListId = '-1'
                data. meetingAgendaId = '-1'
                data. meetingCooperationId = '-1'
                data.publishStatus= '5'
                
                $.ajax({
                    type: "POST",
                    url: "/reportTopic/update",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            self.$message.success('删除成功')
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
        
        //发布报道专题
        onlineThisMeetingLive (item) {
            var self = this
            self.$confirm('确实要发布此报道专题吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = {
                    id: item.id.toString(),
                    publishStatus: '1'
                }
                $.ajax({
                    type: "POST",
                    url: "/reportTopic/push",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            self.$message.success('发布成功')
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
        //下线报道专题
        offlineThisMeetingLive (item) {
            var self = this
            self.$confirm('确实要下线此报道专题吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = {
                    id: item.id.toString(),
                    publishStatus: '4'
                }
                $.ajax({
                    type: "POST",
                    url: "/reportTopic/push",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            self.$message.success('下线成功')
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