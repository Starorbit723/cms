var vm = new Vue({
    el: '#advertisement_position',
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
                spaceName:'',
                spaceDelStatus:['0','1'] //前端状态筛选，不显示删除的条目
            },
            //图位查询表
            multipleSelection: [],//用户选中项
            advPosTableData: [{
                spaceId:'',//图位编号
                spaceName:'',//图位名称
                spaceWidth:'',//图位宽度
                spaceHeight:'',//图位高度
                spaceImg:'',//图位图片
                spaceType:'',//图位类型(1,广告图位，2，新闻图位）
                spaceShowType:'',//展示分类 0 web 1 wap 2 app
                spaceMediaType:'',//媒体类型 0 图文 1 文字 2 视频 3代码
                spaceMultiple:'',//是否多选（1，多图位，2，单图位）
                spaceTip:'',//提示
                spaceDescription:'',//描述
                spaceCreateUserId:'',
                spaceUpdateUserId:'',
                spaceCreateAt:'',
                spaceUpdateAt:'',
                spaceDelStatus:'',//0下线 1上线 2删除
                spaceTitle:''//标题
            }],
            //分页器相关
            pagination1: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
            //新建广告位相关
            showCreatAdvPos:false,
            creatAdvPosForm:{
                spaceId:'',//图位编号
                spaceName:'',//图位名称
                spaceWidth:'',//图位宽度
                spaceHeight:'',//图位高度
                spaceImg:'',//图位图片
                spaceType:'',//图位类型(1,广告图位，2，新闻图位）
                spaceShowType:'0',//展示分类 0 web 1 wap 2 app
                spaceMediaType:'0',//媒体类型 0 图文 1 文字 2 视频 3代码
                spaceMultiple:'',//是否多选（1，多图位，2，单图位）
                spaceTip:'',//提示
                spaceDescription:'',//描述
                spaceCreateUserId:'',
                spaceUpdateUserId:'',
                spaceCreateAt:'',
                spaceUpdateAt:'',
                spaceDelStatus: '0',//0下线 1上线 2删除
                spaceTitle:''//标题
            },
            creatAdvPosFormRules:{
                spaceName: [
                    { required: true, message: '图位名称不能为空', trigger: 'blur' }
                ],
                spaceWidth: [
                    { required: true, message: '图位宽度不能为空', trigger: 'blur' }
                ],
                spaceHeight: [
                    { required: true, message: '图位高度不能为空', trigger: 'blur' }
                ]
            },
            //修改图位相关
            showEditAdvPos:false,
            editAdvPosForm:{
                spaceId:'',//图位编号
                spaceName:'',//图位名称
                spaceWidth:'',//图位宽度
                spaceHeight:'',//图位高度
                spaceImg:'',//图位图片
                spaceType:'',//图位类型(1,广告图位，2，新闻图位）
                spaceShowType:'',//展示分类 0 web 1 wap 2 app
                spaceMediaType:'',//媒体类型 0 图文 1 文字 2 视频 3代码
                spaceMultiple:'',//是否多选（1，多图位，2，单图位）
                spaceTip:'',//提示
                spaceDescription:'',//描述
                spaceCreateUserId:'',
                spaceUpdateUserId:'',
                spaceCreateAt:'',
                spaceUpdateAt:'',
                spaceDelStatus:'',//0下线 1上线 2删除
                spaceTitle:''//标题
            },
            editAdvPosFormRules:{
                spaceName: [
                    { required: true, message: '图位名称不能为空', trigger: 'blur' }
                ],
                spaceWidth: [
                    { required: true, message: '图位宽度不能为空', trigger: 'blur' }
                ],
                spaceHeight: [
                    { required: true, message: '图位高度不能为空', trigger: 'blur' }
                ]
            },
            
            //编辑某一条广告位内容列表
            saveNowAdvTitle:'',//临时存储
            saveNowAdvId:'',//临时存储
            currentAdvContentList:[{
                focusId:'',//广告编号
                focusImg:'',//封面图片
                focusPlace位置:'',//首页，左侧，右侧，列表页
                focusAlt:'',//alt键图片简述
                focusTitle:'',//广告标题
                focusDesc:'',//广告描述
                focusKeyword:'',//广告关键字
                focusChannel:'',//广告属于频道
                focusUrl:'',//广告连接地址
                focusType:'',//广告图片类型 类型:1-PC，2-H5，3-APP
                focusPriority:'',//广告图片优先级
                focusModelType:'',//轮播类型
                focusStatus:'',//0是下线，1是在线
                focusIndustry:'',//广告图片属于行业
                focusEditor:'',//广告图片编辑
                focusTag:'',//广告图片标签
                focusFrom:'',//广告图片来源
                focusSourceUrl:'',//广告图片来源地址
                focusPara:'',//广告图片参数
                focusCrtTime:'',//广告图片建立时间
                focusModTime:'',//广告图片修改时间
                focusSpaceId:''//所修改的图位编号
            }],
            //新建修改某一个广告条目相关
            advItemForm:{
                focusSpaceId:'',//所修改的图位编号
                focusId:'',//广告编号
                focusImg:'',//封面图片
                focusPlace:'',//位置首页，左侧，右侧，列表页
                focusAlt:'',//alt键图片简述
                focusTitle:'',//广告标题
                focusDesc:'',//广告描述
                focusKeyword:'',//广告关键字
                focusChannel:'',//广告属于频道
                focusUrl:'',//广告连接地址
                focusType:'',//广告图片类型 类型:1-PC，2-H5，3-APP
                focusPriority:'',//广告图片优先级
                focusModelType:'',//轮播类型
                focusStatus:'',//0是下线，1是在线
                focusIndustry:'',//广告图片属于行业
                focusEditor:'',//广告图片编辑
                focusTag:'',//广告图片标签
                focusFrom:'',//广告图片来源
                focusSourceUrl:'',//广告图片来源地址
                focusPara:'',//广告图片参数
                focusCrtTime:'',//广告图片建立时间
                focusModTime:'',//广告图片修改时间
                focusModUserId:''
            },
            advItemFormRules:{
                focusTitle: [
                    { required: true, message: '标题不能为空', trigger: 'change' }
                ],
                focusImg:[
                    { required: true, message: '图片不能为空', trigger: 'change' }
                ],
                focusDesc:[
                    { required: true, message: '描述不能为空', trigger: 'change' }
                ],
                focusUrl:[
                    { required: true, validator: validateUrl, trigger: 'change' }
                ]
            },
            //广告图库相关
            showAdvimgLib:false,
            searchAdvimgForm:{
                picTitle:'',
                picType:'3'//0封面图库 1内容图库 2图为图库 3图为图库
            },
            advimgTableData:[],
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
            this.searchAdvImg()
        },
        //搜索图位列表
        startSearch (type) {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchForm))
            data.spaceName = data.spaceName.toString().trim()
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
                url: "/focusSpace/list",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.advPosTableData = res.page.list
                        for (let i = 0; i < self.advPosTableData.length; i++){
                            self.advPosTableData[i].spaceUpdateAt = self.transformTime(self.advPosTableData[i].spaceUpdateAt)
                        }
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
        openCreatAdvPos(){
            this.showCreatAdvPos = true
        },
        //创建一个新图位
        submitCreatAdvPos (formName) {
            var self = this
            self.$refs[formName].validate((valid) =>{
                if (valid) {
                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        url: "/focusSpace/save",
                        data: JSON.stringify(self.creatAdvPosForm),
                        dataType: "json",
                        success: function(res){
                            if(res.code == 200){
                                self.$message.success('新建图位成功');
                                self.startSearch(0)
                                self.closeCreatAdvPos('creatAdvPosForm')
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
        closeCreatAdvPos (formName) {
            this.$refs[formName].resetFields()
            this.showCreatAdvPos = false
            this.creatAdvPosForm = {
                spaceId:'',//图位编号
                spaceName:'',//图位名称
                spaceWidth:'',//图位宽度
                spaceHeight:'',//图位高度
                spaceImg:'',//图位图片
                spaceType:'',//图位类型(1,广告图位，2，新闻图位）
                spaceShowType:'0',//展示分类 0 web 1 wap 2 app
                spaceMediaType:'0',//媒体类型 0 图文 1 文字 2 视频 3代码
                spaceMultiple:'',//是否多选（1，多图位，2，单图位）
                spaceTip:'',//提示
                spaceDescription:'',//描述
                spaceCreateUserId:'',
                spaceUpdateUserId:'',
                spaceCreateAt:'',
                spaceUpdateAt:'',
                spaceDelStatus:'',//0下线 1上线
                spaceTitle:''//标题
            }
        },
        //修改选中图位基本属性
        attributeThisPosition (item) {
            this.editAdvPosForm = JSON.parse(JSON.stringify(item))
            this.editAdvPosForm.spaceShowType = this.editAdvPosForm.spaceShowType.toString()
            this.editAdvPosForm.spaceMediaType = this.editAdvPosForm.spaceMediaType.toString()
            this.showEditAdvPos = true
        },
        //修改一个图位状态
        submitEditAdvPos(formName){
            var self = this
            var data = JSON.parse(JSON.stringify(self.editAdvPosForm))
            data.spaceUpdateAt = null
            self.$refs[formName].validate((valid) =>{
                if (valid) {
                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        url: "/focusSpace/update",
                        data: JSON.stringify(data),
                        dataType: "json",
                        success: function(res){
                            if(res.code == 200){
                                self.$message.success('修改图位成功');
                                self.startSearch()
                                self.closeEditAdvPos('editAdvPosForm')
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
        closeEditAdvPos (formName) {
            this.$refs[formName].resetFields()
            this.showEditAdvPos = false
            this.editAdvPosForm = {
                spaceId:'',//图位编号
                spaceName:'',//图位名称
                spaceWidth:'',//图位宽度
                spaceHeight:'',//图位高度
                spaceImg:'',//图位图片
                spaceType:'',//图位类型(1,广告图位，2，新闻图位）
                spaceShowType:'',//展示分类 0 web 1 wap 2 app
                spaceMediaType:'',//媒体类型 0 图文 1 文字 2 视频 3代码
                spaceMultiple:'',//是否多选（1，多图位，2，单图位）
                spaceTip:'',//提示
                spaceDescription:'',//描述
                spaceCreateUserId:'',
                spaceUpdateUserId:'',
                spaceCreateAt:'',
                spaceUpdateAt:'',
                spaceDelStatus:'',//0下线 1上线
                spaceTitle:''//标题
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
                var data = {
                    spaceId:item.spaceId.toString(),
                    spaceDelStatus:'2'
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/focusSpace/update",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            self.$message.success('删除成功');
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
                if (item.spaceDelStatus == 1) {
                    var data = {
                        spaceId:item.spaceId.toString(),
                        spaceDelStatus:'0'
                    }
                } else if (item.spaceDelStatus == 0) {
                    var data = {
                        spaceId:item.spaceId.toString(),
                        spaceDelStatus:'1'
                    }
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/focusSpace/update",
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
        //select选中文章时触发
        handleSelectionChange(val) {
            this.multipleSelection = val
            console.log(this.multipleSelection)
        },
        //批量删除图位
        batchDeleteAdvPos () {
            var self = this
            self.$confirm('确实要批量删除选中图位吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = []
                for (let i = 0 ; i < self.multipleSelection.length; i++) {
                    data.push({
                        spaceId: self.multipleSelection[i].spaceId,
                        spaceDelStatus:'2'
                    })
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/focusSpace/updateByList",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            self.$message.success('删除成功');
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
        //批量启用图位
        batchEnableAdvPos () {
            var self = this
            self.$confirm('确实要批量启用选中图位吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = []
                for (let i = 0 ; i < self.multipleSelection.length; i++) {
                    data.push({
                        spaceId: self.multipleSelection[i].spaceId,
                        spaceDelStatus:'1'
                    })
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/focusSpace/updateByList",
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
        batchDisableAdvPos () {
            var self = this
            self.$confirm('确实要批量禁用选中图位吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = []
                for (let i = 0 ; i < self.multipleSelection.length; i++) {
                    data.push({
                        spaceId: self.multipleSelection[i].spaceId,
                        spaceDelStatus:'0'
                    })
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/focusSpace/updateByList",
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
        //修改图位内容细节参数
        editThisPosition (item){
            console.log('当前修改的图位',item)
            this.showChildPage = 1;
            this.saveNowAdvTitle = item.spaceName
            this.saveNowAdvId = item.spaceId
            this.startSearchAdvlist(this.saveNowAdvId)
        },
        //请求某一广告位下的资源列表
        startSearchAdvlist (id) {
            console.log(new Date().getTime())
            var self = this
            var data = {
                focusSpaceId:id.toString(),
                page: '1',
                limit: '1000'//目前不做分页
            }
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "/focus/list",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res) {
                    if(res.code == 200){
                        self.currentAdvContentList = res.page.list
                        for (let i = 0; i < self.currentAdvContentList.length; i++){
                            self.currentAdvContentList[i].focusModTime = self.transformTime(parseInt(self.currentAdvContentList[i].focusModTime))
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
        //新建广告条目
        addNewAdvItem () {
            this.showChildPage = 2;
        },
        //编辑这条广告条目
        editThisAdvItem (item) {
            console.log('当前要编辑的广告条目：',item)
            this.advItemForm = JSON.parse(JSON.stringify(item))
            this.showChildPage = 2;
        },
        //打开添加广告图弹出层
        openAddAdvImg () {
            this.showAdvimgLib = true
            this.searchAdvImg(0)
        },
        //搜索广告图库
        searchAdvImg (type){
            var self = this
            var data = self.searchAdvimgForm
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
                        self.advimgTableData = res.page.list
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
            this.advItemForm.focusImg = item.picUrl
            this.closeAdvimgLib()
        },
        //关闭广告图片库
        closeAdvimgLib () {
            this.showAdvimgLib = false
            this.searchAdvimgForm = {
                picTitle:'',
                picType:'3'//0封面图库 1内容图库 2图为图库 3图为图库
            }
            this.advimgTableData = []
            this.pagination2 = {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            }
        },
        //新建或更新条目
        creatOrSaveItem (formName) {
            var self = this
            self.$refs[formName].validate((valid) =>{
                if (valid) {
                    var data = JSON.parse(JSON.stringify(self.advItemForm))
                    data.focusDesc = self.replaceDqm(data.focusDesc)
                    console.log(self.advItemForm.focusDesc,data.focusDesc)
                    if (self.advItemForm.focusSpaceId !== ''){
                        var reqUrl = '/focus/update'
                    } else {
                        var reqUrl = '/focus/save'
                        //把这条广告保存至所属图位ID下
                        console.log(self.saveNowAdvId)
                        data.focusSpaceId = self.saveNowAdvId
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
                                self.closeToContentList('advItemForm')
                                self.startSearchAdvlist(self.saveNowAdvId)
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
        //删除图位中某一条项目
        deleteThisAdvItem(item){
            var self = this
            self.$confirm('确实要删除此条内容吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = [item.focusId]
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url:'/focus/delete',
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res){
                        if (res.code == 200) {
                            self.$message.success('删除成功')
                            self.startSearchAdvlist(self.saveNowAdvId)
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
        //取消新建或更新条目
        closeToContentList (formName) {
            this.$refs[formName].resetFields()
            this.showChildPage = 1
            this.advItemForm = {
                focusId:'',//广告编号
                focusImg:'',//封面图片
                focusPlace:'',//首页，左侧，右侧，列表页
                focusAlt:'',//alt键图片简述
                focusTitle:'',//广告标题
                focusDesc:'',//广告描述
                focusKeyword:'',//广告关键字
                focusChannel:'',//广告属于频道
                focusUrl:'',//广告连接地址
                focusType:'',//广告图片类型 类型:1-PC，2-H5，3-APP
                focusPriority:'',//广告图片优先级
                focusModelType:'',//轮播类型
                focusStatus:'',//0是下线，1是在线
                focusIndustry:'',//广告图片属于行业
                focusEditor:'',//广告图片编辑
                focusTag:'',//广告图片标签
                focusFrom:'',//广告图片来源
                focusSourceUrl:'',//广告图片来源地址
                focusPara:'',//广告图片参数
                focusCrtTime:'',//广告图片建立时间
                focusModTime:'',//广告图片修改时间
                focusSpaceId:'',//所修改的图位编号
                focusModUserId:''
            }
        },
        //返回到图位主页
        backToMainPage(){
            this.showChildPage = 0;
            this.saveNowAdvTitle = ''
            this.saveNowAdvId = ''
            this.currentAdvContentList = []
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