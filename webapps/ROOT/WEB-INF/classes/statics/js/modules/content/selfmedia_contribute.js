var vm = new Vue({
    el: '#selfmedia_contribute',
    data: {
        //主页子页切换
        showChildPage:false,
        pickerOptions:{
            disabledDate(time) {
                return time.getTime() > Date.now();
            }
        },  
        //搜索提交
        uploadTime:[],
        searchForm:{
            draftTitle:'',
            startTime:'',
            endTime:''
        },
        //投稿文章列表
        articleData:[
        // {
        //     mediaId:'',
        //     draftId:'',
        //     draftTitle:'',
        //     draftUserId:'',
        //     draftStatus:'',
        //     draftUserName:'',
        //     draftCrtTime:'',
        //     draftOriginal: "",
        //     draftContent:'',
        //     draftPhone:'',
        //     draftSourceName: ""
        //     draftAuthor: ""
        //     draftImg:[], //图片地址字符串隔开
        // }
        ],
        //分页器相关
        pagination1: {
            currPage: 1,
            totalCount:0,
            totalPage:0,
            pageSize:20
        },
        //审阅弹出层相关
        showReadArticleDialog:false,
        lookedArticle:{
            mediaId:'',
            draftId:'',
            draftTitle:'',
            draftUserId:'',
            draftStatus:'',
            draftUserName:'',
            draftCrtTime:'',
            draftOriginal: '',
            draftContent:'',
            draftPhone:'',
            draftSourceName: '',
            draftAuthor: '',
            draftImg:[]
        }
    },
    watch:{
        uploadTime (val){
            this.searchForm.startTime = val[0]
            this.searchForm.endTime = val[1]
            console.log(this.searchForm)
        }
    },
    created () {
        this.startSearch()
    },
    methods:{
        handleCurrentChange (val) {
            this.pagination1.currPage = val
            this.startSearch()
        },
        //搜索自媒体列表
        startSearch () {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchForm))
            data.draftTitle = data.draftTitle.toString().trim()
            self.articleData = []
            Object.assign( data ,{
                page: self.pagination1.currPage.toString(),
                limit: self.pagination1.pageSize.toString()
            })
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: '/draft/list',
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        console.log('返回文章列表：', res)
                        self.articleData = res.page.list
                        for (let i = 0 ; i < res.page.list.length; i++) {
                            if (res.page.list[i].draftImg !== '' && res.page.list[i].draftImg.indexOf(',') !== -1) {
                                var tempArr = res.page.list[i].draftImg.split(',')
                                var dataArr = []
                                for (let k = 0;k < tempArr.length ; k++) {
                                    dataArr.push({
                                        src: tempArr[k]
                                    })
                                }
                                self.articleData[i].draftImg = dataArr
                            } else if (res.page.list[i].draftImg !== '' && res.page.list[i].draftImg.indexOf(',') == -1) {
                                let dataArr2 = []
                                dataArr2.push({
                                    src: res.page.list[i].draftImg 
                                })
                                self.articleData[i].draftImg = dataArr2
                            }
                        }
                        console.log(self.articleData)
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
        lookContributeArticle (item) {
            console.log(item)
            this.showReadArticleDialog = true
            this.selfmediaForm = JSON.parse(JSON.stringify(item))
            this.searchArticlePush()
        },
        //返回主列表
        backToSelfMediaList (){
            this.showReadArticleDialog = false
            this.selfmediaForm = {}
            this.articleData=[] 
            this.pagination1 = {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:20
            }
        },
        //阅读此篇文章
        readThisArticle (item) {
            console.log(item)
            this.lookedArticle = JSON.parse(JSON.stringify(item))
            this.showReadArticleDialog = true
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
        //删除此篇文章
        deleteThisArticle (item) {
            var self = this
            self.$confirm('确定要删除这篇投稿吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = {
                    draftId: item.draftId.toString(),
                    draftStatus: '0'
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: '/draft/update',
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            console.log('删除文章返回：', res)
                            self.startSearch() //请求列表回显
                            self.$message({
                                type: 'success',
                                message: '删除成功!'
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

    }
})
