var vm = new Vue({
    el: '#interview_list',
    data () {
        var validateUrl = (rule, value, callback) => {
            var urlReg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
            if (value =='') {
                callback(new Error('链接不能为空'));
            } else if (!urlReg.test(value)) {
                callback(new Error('链接格式不正确'));
            } else {
                callback();
            }
        }
        var validatePriority = (rule, value, callback) => {
            var urlReg = /^[0-9]*[1-9][0-9]*$/;
            if (value.toString().trim() == '') {
                callback(new Error('权重不能为空'));
            } else if (value.toString().trim() !== '' && value == '-1') {
                callback();
            } else if (value.toString().trim() !== '' && !urlReg.test(value)) {
                callback(new Error('权重需改为正整数或-1,-1代表权重最低'));
            } else {
                callback();
            }
        }
        return {
            //主页子页切换
            showChildPage:false,
            pickerOptions:{
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },  
            searchForm:{
                visitName:'',
                visitTitle:'',
                visitStatus:'1'
            },
            //投稿文章列表
            interviewData:[
            // {
            //     id:'',//主键
            //     visitName:'',//人物名称
            //     visitCompany:'',//职位/公司
            //     visitTitle:'',//标题
            //     visitUrl:'',//链接
            //     visitTime:'',//时间
            //     visitImg:'',//封面
            //     visitWeight:'',//权重
            //     visitCrtUserId:'',
            //     visitModUserId:'',
            //     visitCrtTime:'',
            //     visitModTime:'',
            //     visitStatus:'',//0下线 1上线
            //     visitPersonId:'',
            //     visitInstitutionId:'',
            //     userName:'',
            // }
            ],
            //分页器相关
            pagination1: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
            creatOrEdit:'creat',
            interviewForm:{
                id:'',//主键
                visitName:'',//人物名称
                visitCompany:'',//职位/公司
                visitTitle:'',//标题
                visitUrl:'',//链接
                visitTime:'',//时间
                visitImg:'',//封面
                visitWeight:'-1',//权重
                visitCrtUserId:'',
                visitModUserId:'',
                visitCrtTime:'',
                visitModTime:'',
                visitStatus:'',//0下线 1上线
                visitPersonId:'',
                visitInstitutionId:'',
                userName:'',
            },
            interviewFormRules:{
                visitName: [
                    { required: true, message: '人物姓名不能为空', trigger: 'change' }
                ],
                visitCompany: [
                    { required: true, message: '公司/职位不能为空', trigger: 'change' }
                ],
                visitTitle:[
                    { required: true, message: '标题不能为空', trigger: 'change' }
                ],
                visitUrl:[
                    { required: true, validator: validateUrl, trigger: 'change' }
                ],
                visitTime:[
                    { required: true, message: '显示时间为必选项', trigger: 'change' }
                ],
                visitWeight:[
                    {  required: true,validator: validatePriority, trigger: 'change' }
                ],
                visitImg:[
                    { required: true, message: '请选择封面图', trigger: 'change' }
                ],
            },
            //封面图库相关
            showCoverimgLib:false,
            searchCoverimgForm:{
                picTitle:'',
                picType:'0'//0封面图库 1内容图库 2图为图库
            },
            coverimgTableData:[],
            pagination2: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
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
        //搜索自媒体列表
        startSearch (type) {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchForm))
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
                url: '/visit/list',
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.interviewData = res.page.list
                        for (let i = 0; i < self.interviewData.length; i++){
                            self.interviewData[i].visitTime = self.transformTime(parseInt(self.interviewData[i].visitTime))
                        }
                        console.log(self.interviewData)
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
        //新建或修改专访
        creatOrEditInterview(type){
            var self = this
            if (type == '0') {
                self.creatOrEdit = 'creat'
                self.showChildPage = true
            } else {
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/visit/info/" + type.id.toString(),
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            self.creatOrEdit = 'edit'
                            self.interviewForm = res.dict
                            self.showChildPage = true
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
        //提交新建或修改
        submitCreatEdit(formName){
            var self = this
            self.$refs[formName].validate((valid) =>{
                if (valid) {
                    console.log('字段检查完毕后结果',self.interviewForm)
                    if (self.creatOrEdit == 'creat') {
                        var reqUrl = '/visit/save'
                    } else {
                        var reqUrl = '/visit/update'
                    }
                    var data = JSON.parse(JSON.stringify(self.interviewForm))
                    data.visitTime = data.visitTime.toString()
                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        url: reqUrl,
                        data: JSON.stringify(data),
                        dataType: "json",
                        success: function(res){
                            if(res.code == 200){
                                self.$message.success('保存成功')
                                self.backToList()
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
        //返回列表
        backToList () {
            this.showChildPage = false
            this.$refs['interviewForm'].resetFields();
            this.creatOrEdit = 'creat'
            this.interviewForm = {
                id:'',//主键
                visitName:'',//人物名称
                visitCompany:'',//职位/公司
                visitTitle:'',//标题
                visitUrl:'',//链接
                visitTime:'',//时间
                visitImg:'',//封面
                visitWeight:'-1',//权重
                visitCrtUserId:'',
                visitModUserId:'',
                visitCrtTime:'',
                visitModTime:'',
                visitStatus:'',//0下线 1上线
                visitPersonId:'',
                visitInstitutionId:'',
                userName:'',
            }
            this.startSearch()
        },
        //删除条目
        deleteThisInterview (item) {
            var self = this
            self.$confirm('确认要删除该条专访吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = {
                    id : item.id.toString(),
                    visitStatus: '0'
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: '/visit/update',
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
        //搜索封面图库
        searchCoverImg (type){
            var self = this
            var data = self.searchCoverimgForm
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
                        self.coverimgTableData = res.page.list
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
        //打开封面图库弹层
        openAddCoverImg () {
            this.showCoverimgLib = true
            this.searchCoverImg(0)
        },
        handleCurrentChange2 (val) {
            this.pagination2.currPage = val
            this.searchCoverImg()
        },
        //选择了某一张封面图片
        addThisCoverImg (item) {
            this.$refs['interviewForm'].clearValidate();
            this.interviewForm.visitImg = item.picUrl
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
            this.pagination2 = {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            }
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
