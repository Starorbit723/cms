var vm = new Vue({
    el: '#fastinfo_list',
    data: {
        //搜索文章列表提交
        timeRange:[], //时间需要特殊处理,并且同步到searchForm
        pickerOptions:{
            disabledDate(time) {
                return time.getTime() > Date.now();
            }
        },  
        editorOptions:[
            // {
            //     userId:1,
            //     username:'admin'
            // }
        ],
        searchForm:{
            flashTitle:'',//标题
            flashStatus:[],// array[number] 状态 0未发布，1是待发布，2是已发布3是发布失败 4是待删除 5 删除
            flashCrtUser:'',//创建人编号
            startTime:'',
            endTime:''
        },
        //表格结果
        tableData: [{
            flashId:'',//快讯主键
            flashTitle:'',//快讯标题
            flashDesc:'',//快讯摘要
            flashSourceUrl:'',//快讯原文url
            flashSourceName:'',//快讯原文名称
            flashStatus:'',//快讯状态 0未发布，1是待发布，2是已发布3是发布失败 4是待删除 5 删除
            flashCrtTime:'',//创建时间
            flashCrtTimeMill:'',//创建时间毫秒值
            flashCrtUserId:'',//快讯创建人
            flashCount:'',//点击量
            flashImg:'',//快讯图片
            userName:'',//创建人名称
            flashSourceLink:'',//来源机构地址
            flashReleaseTime:''//发布时间
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
        this.getEditorOptionList()
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
            data.flashTitle = data.flashTitle.toString().trim()
            data.flashCrtUser = data.flashCrtUser.toString().trim()
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
                url: "/flash/list",
                contentType: "application/json",
			    data: JSON.stringify(data),
			    dataType: "json",
			    success: function(res){
					if(res.code == 200){
                        self.tableData = res.page.list
                        for (let i = 0; i < self.tableData.length; i++){
                            self.tableData[i].flashReleaseTime = self.transformTime(parseInt(self.tableData[i].flashReleaseTime))
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
        //新建快讯
        creatFastinfo () {
            setCookie ('createditfastinfo', '', 1)
            console.log(window.parent.location.hash)
            if (window.parent.location.hash == '#modules/content/edit_fastinfo.html') {
                window.parent.location.reload()
            } else {
                window.parent.location.href = '/index.html#modules/content/edit_fastinfo.html'
            }
            
        },
        //编辑快讯
        editThisFastinfo (item) {
            console.log(item)
            setCookie ('createditfastinfo', item.flashId , 1)
            window.parent.location.href = '/index.html#modules/content/edit_fastinfo.html'
        },
        //启用或禁用当前频道-----快讯没有待发布状态，发布直接传'2'
        togglestatusFastinfo (item){
            var self = this
            self.$confirm('确实要调整该专栏状态吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var requrl = ''
                if (item.flashStatus == 2) {
                    var data = {
                        flashId: item.flashId.toString(),
                        flashStatus: '0'
                    }
                    requrl = '/flash/update'
                } else if (item.flashStatus == 0 || item.flashStatus == 3) {
                    var data = {
                        flashId: item.flashId.toString(),
                        flashStatus: '2'
                    }
                    requrl = '/flash/push'
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: requrl,
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
        //删除快讯
        deleteThisFastinfo (item) {
            var self = this
            var data = {
                flashId:item.flashId,
                flashStatus: '5'
            }
            self.$confirm('确实要删除此条快讯吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/flash/update",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            self.startSearch()
                            self.$message.success('删除成功')
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