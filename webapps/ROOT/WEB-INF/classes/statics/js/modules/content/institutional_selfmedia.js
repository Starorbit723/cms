var vm = new Vue({
    el: '#institutional_selfmedia',
    data: {
        //主页子页切换
        showChildPage:false,
        creatOrEdit:0,//0新建  1修改
        pickerOptions:{
            disabledDate(time) {
                return time.getTime() > Date.now();
            }
        },  
        //自媒体类型
        typeOptions:[{
            id:'',//作者的id
            mediaId:'',//媒体编号 -1代表普通用户
            loginName: '' //中文名
        }],
        //搜索提交
        uploadTime:[],
        searchForm:{
            mediaName:'',
            mediaType:'',
            mediaStatus:'',
            startTime:'',
            endTime:''
        },
        //自媒体列表
        selfMediaTableData:[{
            mediaId:'',//媒体编号
            mediaName:'',//媒体名称
            mediaStatus:'',//0下线1上线
            dictList:[], //作者列表
            mediaType:'',//媒体类型 1、专栏作者，2、机构作者，3、专家 4 评论员 5 其他
            mediaPriority:'',//媒体优先级
            mediaReleaseTime:'',//媒体最新发稿时间
            mediaImg:'',//媒体头像
            mediaIntroduction:'',//自媒体描述
            newsCount:'',//文章数
        }],
        pagination1: {
            currPage: 1,
            totalCount:0,
            totalPage:0,
            pageSize:20
        },
        //自媒体类型
        selfmediaOptions:[{
            label:'专栏作者',
            value:'1'
        },{
            label:'机构作者',
            value:'2'
        },{
            label:'专家',
            value:'3'
        },{
            label:'评论员',
            value:'4'
        },{
            label:'其他',
            value:'5'
        }],
        dictListChange:[], //用于临时存储
        //自媒体基本信息
        selfmediaForm:{
            mediaId:'',//媒体编号
            mediaName:'',//媒体名称
            dictList:[
                // {
                // id:'',//作者的id
                // mediaId:'',//媒体编号 -1代表普通用户
                // }
            ],
            mediaStatus:'',//0下线1上线
            mediaType:'',//媒体类型
            mediaPriority:'',//媒体优先级
            mediaReleaseTime:'',//媒体最新发稿时间
            mediaImg:'',//媒体头像
            mediaIntroduction:'',//自媒体描述
            newsCount:'',//文章数
        },
        //规则
        selfmediaFormRules:{
            mediaName: [
                { required: true, message: '请输入自媒体名称', trigger: 'change' }
            ],
            mediaType: [
                { required: true, message: '请选择类型', trigger: 'change' }
            ],
            // dictList: [
            //     { type: 'array', required: true, message: '请选择作者', trigger: 'change' }
            // ],
            mediaPriority: [
                { required: true, message: '权重不为空', trigger: 'change' }
            ],
            mediaIntroduction:[
                { required: true, message: '描述不为空', trigger: 'change' }
            ],
            mediaImg: [
                { required: true, message: '请上传自媒体头像', trigger: 'change' }
            ],
        },
        //自媒体下的文章
        articleData:[],
        pagination2: {
            currPage: 1,
            totalCount:0,
            totalPage:0,
            pageSize:10
        },
        //自媒体图库弹出层相关
        showMeidaLibDialog:false,
        searchSelfmediaimgForm:{
            picTitle:'',
            picType:'4'//0封面图库 1内容图库 2图为图库 3广告  4自媒体
        },
        selfmediaimgTableData:[],
        pagination3: {
            currPage: 1,
            totalCount:0,
            totalPage:0,
            pageSize:10
        },
    },
    watch:{
        uploadTime (val){
            this.searchForm.startTime = val[0]
            this.searchForm.endTime = val[1]
            console.log(this.searchForm)
        }
    },
    created () {
        this.startSearch(0)
    },
    methods:{
        handleCurrentChange (val) {
            this.pagination1.currPage = val
            this.startSearch()
        },
        handleCurrentChange2 (val) {
            this.pagination2.currPage = val
            this.searchMediaArticle()
        },
        handleCurrentChange3 (val) {
            this.pagination3.currPage = val
            this.searchSelfmediaImg()
        },
        //搜索自媒体列表
        startSearch (type) {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchForm))
            data.mediaName = data.mediaName.toString().trim()
            data.mediaType = data.mediaType.toString()
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
                url: '/media/list',
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        console.log('新增或修改返回：', res)
                        self.selfMediaTableData = res.page.list
                        self.pagination1 = {
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
            })
        },
        //切换至新建修改自媒体页面
        openCreatEditSelfMedia (item) {
            console.log(item)
            if(item == 0){
                this.showChildPage = true
                this.creatOrEdit = 0
                console.log('新建自媒体')
            } else {
                this.showChildPage = true
                this.creatOrEdit = 1
                this.selfmediaForm = JSON.parse(JSON.stringify(item))
                //如果是编辑，需要请求文章投稿列表
                this.searchMediaArticle()
                console.log('修改自媒体：',this.selfmediaForm)
            }
        },
        //切换自媒体上下线
        toggleThisSelfMedia (item) {
            var self = this
            self.$confirm('确定要修改当前自媒体状态吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (item.mediaStatus == 1) {
                    var data = {
                        mediaId:item.mediaId.toString(),
                        mediaStatus:'0'
                    }
                } else if (item.mediaStatus == 0) {
                    var data = {
                        mediaId:item.mediaId.toString(),
                        mediaStatus:'1'
                    }
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/media/update",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            self.startSearch() //请求列表回显
                            self.$message({
                                type: 'success',
                                message: '修改成功!'
                            })
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
        //新建或修改---保存当前自媒体
        submitEditSelfMedia (formName) {
            var self = this
            self.$refs[formName].validate((valid) => {
                if (valid) {
                    if (self.creatOrEdit == 0) {
                        var reqUrl = '/media/save'
                    } else if (self.creatOrEdit == 1){
                        var reqUrl = '/media/update'
                    }
                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        url: reqUrl,
                        data: JSON.stringify(self.selfmediaForm),
                        dataType: "json",
                        success: function(res){
                            if(res.code == 200){
                                console.log('新增或修改返回：', res)
                                self.startSearch() //请求列表回显
                                self.closeEditSelfMedia() //清空表单
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
        //取消编辑当前自媒体
        closeEditSelfMedia (formName){
            this.showChildPage = false //关闭页面
            this.creatOrEdit = 0 //还原新增修改判断
            this.pagination2 = {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            }
            this.articleData = []
            this.selfmediaForm = {
                mediaId:'',//媒体编号
                mediaName:'',//媒体名称
                mediaAuthor:[],
                mediaType:'',//媒体类型
                mediaPriority:'',//媒体优先级
                mediaReleaseTime:'',//媒体最新发稿时间
                mediaImg:'',//媒体头像
            }
            this.$refs['selfmediaForm'].resetFields();

        },
        //打开自媒体图库
        openSelfmediaImgLib () {
            this.searchSelfmediaImg(0)
            this.showMeidaLibDialog = true
        },
        //搜索图库
        searchSelfmediaImg (type){
            var self = this
            var data = self.searchSelfmediaimgForm
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
                        self.searchSelfmediaimgForm.picTitle = ''
                        self.selfmediaimgTableData = res.page.list
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
        //添加图片至页面
        addThisImg (item) {
            this.selfmediaForm.mediaImg = item.picUrl
            this.backToEdit()
        },
        //返回编辑页
        backToEdit (){
            this.showMeidaLibDialog = false
            this.searchSelfmediaimgForm = {
                picTitle:'',
                picType:'4'
            }
            this.selfmediaimgTableData = []
            this.pagination3 = {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            }
        },
        //请求自媒体下文章列表
        searchMediaArticle () {
            var self = this
            var data = {
                newsMediaId: self.selfmediaForm.mediaId.toString(),
                newsStatus:['2']
            }
            Object.assign(data,{
                page: self.pagination2.currPage.toString(),
                limit: self.pagination2.pageSize.toString(),
            })
            console.log(data)
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "/news/newsList",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res) {
                    if(res.code == 200){
                        self.articleData = res.page.list

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
        
        //关闭对话框清除内容 
        clearArticleContent() {
            this.lookedArticle = {
                mediaId:'',
                draftId:'',
                draftTitle:'',
                draftUserId:'',
                draftStatus:'',
                draftUserName:'',
                draftCrtTime:'',
                draftContent:'',
                draftImg:[]
            }
        },
        

    }
})
