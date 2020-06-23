var vm = new Vue({
    el: '#sensitive_words',
    data: {
        //主页子页切换
        showChildPage:false,
        showAddBox:false,
        //敏感词类型
        typeOptions:[],
        //搜索提交
        searchForm:{
            keyword:'',
            type:'',//类型creatForm
        },
        typeArr:['0','1','2','3'],
        //表格结果
        sensitiveWordTableData: [{
            id:'',//主键编号
            keyword:'',//敏感词
            type:'',//类型
            source:'',//来源备注
            crtUserId:'',//创建人编号
            crtTime:'',//创建时间
        }],
        //分页器相关
        pagination1: {
            currPage: 1,
            totalCount:0,
            totalPage:0,
            pageSize:20
        },
        //多选
        columnEditorChange:[],
        //新增弹框
        creatForm:{
            id:'',//主键编号
            keywords:'',//敏感词
            type:'',//类型
            source:'',//来源备注
            crtUserId:'',//创建人编号
            crtTime:'',//创建时间
        },
        creatFormRules: {
            keywords: [
                { required: true, message: '敏感词不能为空', trigger: 'change' }
            ],
            type:[
                { required: true, message: '类型为必选项', trigger: 'change' }
            ],
            source:[
                { required: true, message: '来源为必选项', trigger: 'change' }
            ],
        },
    },
    created() {
        this.getTypeOptions()
        this.startSearch()
    },
    methods:{
        //获取敏感词类型
        getTypeOptions () {
            var self = this
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "/sys/dict/list?type=sensitiveType",
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                       console.log(res.page.list)
                       self.typeOptions = res.page.list
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
        handleCurrentChange (val) {
            pagination1.currPage = val.toString()
            this.startSearch()
        },
        //下拉搜索类型改变
        selectTypeChange (val) {
            console.log('type===>',val)
            var tempArr = []
            if (val == null || val == '') {
                this.typeArr = ['0','1','2','3']
            } else {
                tempArr.push(val)
                this.typeArr = tempArr
            }
            console.log(this.typeArr)
        },
        //开始搜索专栏列表
        startSearch (type) {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchForm))
            data.keyword = data.keyword.toString().trim()
            data.type = this.typeArr
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
                url: "/sensitive/list",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.sensitiveWordTableData = res.page.list
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
        addSensitiveWord () {
            this.showAddBox = true
        },
        //专栏作者发生变化时
        authorChange (val) {
            console.log('作者发生变化',val)
        },
        //提交新增词汇
        submitCreat (formName) {
            var self = this
            self.$refs[formName].validate((valid) => {
                if (valid) {
                    //console.log(self.creatForm.keyword.replace(/[(^*\n*)|(^*\r*)]/g,',').replace(' ',','))
                    var data = {
                        keywords: self.creatForm.keywords.replace(/[(^*\n*)|(^*\r*)]/g,',').replace(' ',','),
                        type: self.creatForm.type,
                        source:self.creatForm.source,
                        crtUserId: self.getCookie('userId')
                    }
                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        url: "/sensitive/save",
                        data: JSON.stringify(data),
                        dataType: "json",
                        success: function(res){
                            if(res.code == 200){
                                self.$message.success('添加成功')
                                //反查回显
                                self.startSearch()
                                self.closeCreat('creatForm')
                            }else{
                                mapErrorStatus(res)
                                vm.error = true;
                                vm.errorMsg = res.msg;
                            }
                        },
                        error:function(res){
                            mapErrorStatus(res)
                        }
                    })
                }
            })
        },
        //返回清空表单
        closeCreat (formName){
            this.showAddBox = false
            this.$refs[formName].resetFields();
            this.creatForm={
                id:'',//主键编号
                keyword:'',//敏感词
                crtUserId:'',//创建人编号
                crtTime:'',//创建时间
            }
        },
        //移除关键词
        delThisWord (item) {
            var self = this
            self.$confirm('确实要移除该敏感词吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = []
                data.push(item.id.toString())
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/sensitive/delete",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res) {
                        if(res.code == 200){
                            console.log('文章移除专栏',res)
                            //反查回显
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
            })
        },
        //select选中文章时触发
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        //批量删除
        batchDeleteWord (){
            var self = this
            console.log(self.multipleSelection)
            self.$confirm('确实要移除该敏感词吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = []
                for (let i = 0; i < self.multipleSelection.length; i++) {
                    data.push(self.multipleSelection[i].id)
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/sensitive/delete",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res) {
                        if(res.code == 200){
                            self.$message.success('批量删除成功');
                            //前一页的文章列表回显
                            self.multipleSelection = []
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
        getCookie (name) { 
            var v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)')
            return v ? unescape(v[2]) : null
        } 
        
    }
})
