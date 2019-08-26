var vm = new Vue({
    el: '#meeting_list',
    data: {
        //搜索文章列表提交
        timeRange:[], //时间需要特殊处理,并且同步到searchForm
        searchForm:{
            meetingTitle:'',//标题
            startTime:'',//开始时间
            endTime:'',//结束时间
            meetingStatus: ['0','1','2','3','4']
        },
        //表格结果
        tableData: [{
            meetingId:'',//主键
            meetingTitle:'',//标题
            meetingStarTime:'',//开始时间
            meetingEndTime:'',//结束时间
            meetingType:'',//类型
            meetingUrl:'',//会议链接
            meetingDesc:'',//简介
            meetingStatus:'',//会议状态  1：发布(上线) 2：不发布(下线) 3：待发布(草稿) 4删除
            meetingKeywords:'', //会议关键词
            meetingTheme:'',//会议主题
            meetingOrganizer:'',//主办单位
            meetingCoOrganizer:'',//协办单位
            meetingScaleNumer:'',//规模人数
            meetingHoldTime:'',//举办时间字符串
            meetingAddress:'',//会议举办地址
            meetingAgendaId:'',//日程ID
            meetingGuestId:'',//嘉宾ID
            meetingVoteId:'',//投票ID
            meetingInteractionId:'',//文章问答互动ID
            meetingDiagramId:'',//高清组图ID
            meetingCooperationId:'',//合作机构ID
            meetingCrtUserId:'',//创建人编号
            meetingCrtTime:'',//创建时间
            meetingModUserId:'',//更新人编号
            meetingModTime:'',//更新时间
            meetingCrtUserName:'',//创建人姓名
            meetingTemplateId:'',
            meetingTemplateMid:'',
            meetingTemplateAddress:'',
            meetingTemplateMaddress:'',
            meetingSignUpUrl:'',//报名链接
            meetingJsonData:[]
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
        //this.getMeetingType()
        this.startSearch(0)
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
            data.meetingTitle = data.meetingTitle.toString().trim()
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
                url: "/meetingInfo/list",
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
        //新建会议--跳转至详情页
        creatMeeting () {
            setCookie ('createditmeeting', '', 1)
            if (window.parent.location.hash == '#modules/meeting/edit_meeting.html') {
                window.parent.location.reload()
            } else {
                window.parent.location.href = '/index.html#modules/meeting/edit_meeting.html'
            }
        },
        //编辑会议
        editThisMeeting(item) {
            setCookie ('createditmeeting', item.meetingId, 1)
            window.parent.location.href = '/index.html#modules/meeting/edit_meeting.html'
        },
        //删除会议
        deleteThisMeeting (item) {
            var self = this
            self.$confirm('确实要删除此会议页面吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = {
                    meetingId: item.meetingId.toString(),
                    meetingStatus: '5'
                }
                $.ajax({
                    type: "POST",
                    url: "/meetingInfo/update",
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
        //发布会议
        onlineThisMeeting (item) {
            var self = this
            self.$confirm('确实要发布此会议吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = {
                    meetingId: item.meetingId.toString(),
                    meetingStatus: '1'
                }
                $.ajax({
                    type: "POST",
                    url: "/meetingInfo/update",
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
        //下线会议
        offlineThisMeeting (item) {
            var self = this
            self.$confirm('确实要下线此会议吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = {
                    meetingId: item.meetingId.toString(),
                    meetingStatus: '4'
                }
                $.ajax({
                    type: "POST",
                    url: "/meetingInfo/update",
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
        //获取会议类型
        // getMeetingType () {
        //     var self = this
        //     $.ajax({
		// 		type: "POST",
        //         url: "/sys/dict/list?type=meetingType" ,
		// 	    dataType: "json",
		// 	    success: function(res){
		// 			if(res.code == 200){
        //                 self.meetingTypeOptions = res.page.list
		// 			} else {
		// 				mapErrorStatus(res)
        //                 vm.error = true;
        //                 vm.errorMsg = res.msg;
        //             }
        //         },
        //         error:function(res){
        //             mapErrorStatus(res)
        //         }
		// 	});
        // },
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