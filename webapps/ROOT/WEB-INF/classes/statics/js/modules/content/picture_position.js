var vm = new Vue({
    el: '#picture_position',
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
        };
        return {
            //主列表页与子页面切换
            showChildPage:0, //0图位列表 1单一图位管理列表 2新建修改单一图位条目
            //搜索提交
            searchForm:{
                name:''
            },
            //图位查询表
            multipleSelection: [],//用户选中项
            picPosTableData: [{
                id:'',//主键
                name:'',//名称
                desc:'',//描述
                crtTime:'',//创建时间
                status:'',//状态 0下线 1上线
                crtUserId:'',//创建人编号
                modUserId:'',//更新人编号
                width:'',//宽度
                height:'',//高度
                modUserName:'',//更新用户名称
                type:'',//分类 0 只添加广告 1 可添加新闻或者广告
                minCount:'',//最小图片数量
                showType:'',//展示分类 0 web 1 wap 2 app
                mediaType:''//,媒体类型 0 图文 1 文字 2 视频 3代码
            }],
            //分页器相关
            pagination1: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
            //新建图位相关
            showCreatPicPos:false,
            creatNewPicPosForm:{
                id:'',//主键
                name:'',//名称
                desc:'',//描述
                crtTime:'',//创建时间
                status:'',//状态 0下线 1上线
                crtUserId:'',//创建人编号
                modUserId:'',//更新人编号
                width:'',//宽度
                height:'',//高度
                modUserName:'',//更新用户名称
                type:'',//分类 0 只添加广告 1 可添加新闻或者广告
                minCount:'',//最小图片数量
                showType:'0',//展示分类 0 web 1 wap 2 app
                mediaType:'0'//,媒体类型 0 图文 1 文字 2 视频 3代码
            },
            creatNewPicPosFormRules:{
                name: [
                    { required: true, message: '图位名称不能为空', trigger: 'blur' }
                ],
                width: [
                    { required: true, message: '图位宽度不能为空', trigger: 'blur' }
                ],
                height: [
                    { required: true, message: '图位高度不能为空', trigger: 'blur' }
                ],

            },
            //修改图位相关
            showEditPicPos:false,
            editNewPicPosForm:{
                id:'',//主键
                name:'',//名称
                desc:'',//描述
                crtTime:'',//创建时间
                status:'',//状态 0下线 1上线
                crtUserId:'',//创建人编号
                modUserId:'',//更新人编号
                width:'',//宽度
                height:'',//高度
                modUserName:'',//更新用户名称
                type:'',//分类 0 只添加广告 1 可添加新闻或者广告
                minCount:'',//最小图片数量
                showType:'0',//展示分类 0 web 1 wap 2 app
                mediaType:'0'//,媒体类型 0 图文 1 文字 2 视频 3代码
            },
            editNewPicPosFormRules:{
                name: [
                    { required: true, message: '图位名称不能为空', trigger: 'blur' }
                ],
                width: [
                    { required: true, message: '图位宽度不能为空', trigger: 'blur' }
                ],
                height: [
                    { required: true, message: '图位高度不能为空', trigger: 'blur' }
                ]
            },
            //编辑某一条广告位内容列表
            saveNowPosTitle:'',//临时存储
            saveNowPosId:'',//临时存储
            currentPosContentList:[{
                picChannel: '',
                picCrtTime: "",
                picDesc: "",
                picEditor: '',
                picFrom: '',
                picId: '',
                picIndustry: '',
                picKeyword: "",
                picModTime: "",
                picPara: "",
                picPriority: '',
                picSourceUrl: "",
                picStatus: '',
                picTag: "",
                picTitle: "",
                picType: '',
                picTypeId: "",
                picTypeName: '',
                picUrl: ""
            }],
            //新建修改某一个广告条目相关
            posItemForm:{
                picId:'',//图片编号
                picTitle:'',//图片标题
                picDesc:'',//图片详情
                picUrl:'',//图片地址
                picType:'3',//图片分类
                picStatus:'',//图片状态
                picEditor:'',//图片编辑
                picTypeId:'',//图位图片编号 type=3 传入
                picSourceUrl:''//图片来源地址
            },
            posItemFormRules:{
                picTitle: [
                    { required: true, message: '标题不能为空', trigger: 'change' }
                ],
                picUrl:[
                    { required: true, message: '图片不能为空', trigger: 'change' }
                ],
                picDesc:[
                    { required: true, message: '描述不能为空', trigger: 'change' }
                ],
                picSourceUrl:[
                    { required: true, validator: validateUrl, trigger: 'change' }
                ]
            },
            //图位图库相关
            showPosimgLib:false,
            searchPosimgForm:{
                picTitle:'',
                picType:'2'//0封面图库 1内容图库 2图为图库 3广告图库
            },
            posimgTableData:[],
            pagination2: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            }
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
        handleCurrentChange2 (val){
            this.pagination2.currPage = val
            this.searchPosImg()
        },
        //搜索图位列表
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
                contentType: "application/json",
                url: "/pictureType/list",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.picPosTableData = res.page.list
                        self.pagination1 = {
                            currPage: res.page.currPage,
                            totalCount: res.page.totalCount,
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
        //打开新建图位弹层
        openCreatPicPos(){
            this.showCreatPicPos = true
        },
        //创建一个新图位
        submitCreatPicPos (formName){
            var self = this
            self.$refs[formName].validate((valid) =>{
                if (valid) {
                    
                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        url: "/pictureType/save",
                        data: JSON.stringify(self.creatNewPicPosForm),
                        dataType: "json",
                        success: function(res){
                            if(res.code == 200){
                                self.$message.success('新建图位成功');
                                self.startSearch(0)
                                self.closeCreatPicPos('creatNewPicPosForm')
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
        //取消创建一个新图位
        closeCreatPicPos (formName) {
            this.$refs[formName].resetFields()
            this.showCreatPicPos = false
            this.creatNewPicPosForm = {
                title:'',//标题
                name:'',//名称
                desc:'',//描述
                width:'',
                height:'',
                crtTime:'',//创建时间
                status:'',//状态 0下线 1上线
                crtUserId:'',//创建人编号
                modTime:'',//修改时间
                modUserName:'',//修改人姓名
                type:'0'//分类 0 只添加广告 1 可添加新闻或者广告
            }
        },
        //修改图位基本属性
        attributeThisPosition (item) {
            this.editNewPicPosForm = JSON.parse(JSON.stringify(item))
            this.editNewPicPosForm.showType = this.editNewPicPosForm.showType.toString()
            this.editNewPicPosForm.mediaType = this.editNewPicPosForm.mediaType.toString()
            this.showEditPicPos = true
        },
        //修改一个图位状态
        submitEditPicPos(formName){
            var self = this
            self.$refs[formName].validate((valid) =>{
                if (valid) {
                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        url: "/pictureType/update",
                        data: JSON.stringify(self.editNewPicPosForm),
                        dataType: "json",
                        success: function(res){
                            if(res.code == 200){
                                self.$message.success('修改图位成功');
                                self.startSearch(0)
                                self.closeEditPicPos('editNewPicPosForm')
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
        //取消修改一个新图位
        closeEditPicPos (formName) {
            this.$refs[formName].resetFields()
            this.showEditPicPos = false
            this.editNewPicPosForm = {
                title:'',//标题
                name:'',//名称
                desc:'',//描述
                width:'',
                height:'',
                crtTime:'',//创建时间
                status:'',//状态 0下线 1上线
                crtUserId:'',//创建人编号
                modTime:'',//修改时间
                modUserName:'',//修改人姓名
                type:'0'//分类 0 只添加广告 1 可添加新闻或者广告
            }
        },
        //删除选中图位
        deleteThisPosition (item) {
            var self = this
            self.$confirm('确实要删除该图位吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = [item.id]
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/pictureType/delete",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            self.$message.success('删除成功');
                            self.startSearch(0)
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
        //select选中文章时触发
        handleSelectionChange(val) {
            this.multipleSelection = val
            console.log(this.multipleSelection)
        },
        //批量删除图位
        batchDeletePicPos () {
            var self = this
            self.$confirm('确实要批量删除选中图位吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = []
                for (let i = 0 ; i < self.multipleSelection.length; i++) {
                    data.push(self.multipleSelection[i].id)
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/pictureType/delete",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            self.$message.success('删除成功');
                            self.multipleSelection = []
                            self.startSearch(0)
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
        //批量启用图位
        batchEnablePicPos () {
            var self = this
            self.$confirm('确实要批量启用选中图位吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = []
                for (let i = 0 ; i < self.multipleSelection.length; i++) {
                    self.multipleSelection[i].status = '1'
                    data.push(self.multipleSelection[i])
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/pictureType/updateByList",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            self.$message.success('批量启用成功');
                            self.multipleSelection = []
                            self.startSearch()
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
        //批量禁用图位
        batchDisablePicPos () {
            var self = this
            self.$confirm('确实要批量禁用选中图位吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = []
                for (let i = 0 ; i < self.multipleSelection.length; i++) {
                    self.multipleSelection[i].status = '0'
                    data.push(self.multipleSelection[i])
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/pictureType/updateByList",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            self.$message.success('批量禁用成功');
                            self.multipleSelection = []
                            self.startSearch()
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
        //启用或禁用当前图位
        togglestatusThisPosition (item){
            var self = this
            self.$confirm('确实要调整该图位状态吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (item.status == 1) {
                    var data = {
                        id:item.id.toString(),
                        status:'0'
                    }
                } else if (item.status == 0) {
                    var data = {
                        id:item.id.toString(),
                        status:'1'
                    }
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/pictureType/update",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            self.$message.success('状态修改成功');
                            self.startSearch()
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
        //修改图位内容细节参数
        editThisPosition (item){
            console.log('当前修改的图位',item)
            this.showChildPage = 1;
            this.saveNowPosTitle = item.name
            this.saveNowPosId = item.id
            this.startSearchPoslist(this.saveNowPosId)
        },
        //请求某一广告位下的资源列表
        startSearchPoslist (id) {
            var self = this
            var data = {
                picType:'3',//图位用图
                picTypeId:id.toString(),
                page: '1',
                limit: '1000'//目前不做分页
            }
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "/picture/list",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if (res.code == 200) {
                        self.currentPosContentList = res.page.list
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
        //新建广告条目
        addNewPosItem () {
            this.showChildPage = 2;
            console.log('新建条目',this.saveNowPosId)
        },
        //编辑这条广告条目
        editThisPosItem (item) {
            console.log('当前要编辑的广告条目：',item)
            this.posItemForm = JSON.parse(JSON.stringify(item))
            this.showChildPage = 2
        },
        //删除图位中某一条项目
        deleteThisPosItem(item){
            var self = this
            self.$confirm('确实要删除此条内容吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = [item.picId]
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url:'/picture/delete',
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res){
                        if (res.code == 200) {
                            self.$message.success('删除成功')
                            self.startSearchPoslist(self.saveNowPosId)
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
        //新建或更新条目
        creatOrSaveItem (formName) {
            var self = this
            self.$refs[formName].validate((valid) =>{
                if (valid) {
                    var data = JSON.parse(JSON.stringify(self.posItemForm))
                    data.picDesc = self.replaceDqm(data.picDesc)
                    if (self.posItemForm.picId !== ''){
                        var reqUrl = '/picture/update'
                    } else {
                        var reqUrl = '/picture/save'
                        //把这条信息保存至所属图位ID下
                        console.log(self.saveNowPosId)
                        data.picTypeId = self.saveNowPosId
                        console.log('准备提交data',data)
                    }
                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        url: reqUrl,
                        data: JSON.stringify(data),
                        dataType: "json",
                        success: function(res){
                            if(res.code == 200){
                                self.$message.success('保存成功')
                                self.closeToContentList('posItemForm')
                                self.startSearchPoslist(self.saveNowPosId)
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
        //取消新建或更新条目
        closeToContentList (formName) {
            this.$refs[formName].resetFields()
            this.showChildPage = 1
            this.posItemForm = {
                picId:'',//图片编号
                picTitle:'',//图片标题
                picDesc:'',//图片详情
                picUrl:'',//图片地址
                picType:'3',//图片分类
                picStatus:'',//图片状态
                picEditor:'',//图片编辑
                picTypeId:'',//图位图片编号 type=3 传入
                picSourceUrl:''//图片来源地址
            }
        },
        //打开添加图位图弹出层
        openAddPosImg () {
            this.showPosimgLib = true
            this.searchPosImg(0)
        },
        //搜索图位图库
        searchPosImg (type){
            var self = this
            var data = self.searchPosimgForm
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
                        self.posimgTableData = res.page.list
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
        //添加图片至Form
        addThisImgToForm (item){
            this.posItemForm.picUrl = item.picUrl
            this.closePosimgLib()
        },
        //关闭广告图片库
        closePosimgLib () {
            this.showPosimgLib = false
            this.searchPosimgForm = {
                picTitle:'',
                picType:'2'//0封面图库 1内容图库 2图为图库 3图为图库
            }
            this.posimgTableData = []
            this.pagination2 = {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            }
        },
        //返回到图位主页
        backToMainPage(){
            this.showChildPage = 0;
            this.saveNowPosTitle = ''
            this.saveNowPosId = ''
            this.currentPosContentList = []
        },
        //替换引号
        replaceDqm (str) {
            var val=str.replace(/"([^"]*)"/g ,"“$1”");
            if(val.indexOf('"')<0){
                return val;
            }
            return replaceDqm(val);
        }
    }
})