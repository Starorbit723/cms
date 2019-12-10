

var vm = new Vue({
    el: '#meeting_live',
    data () {
        var validatePriority = (rule, value, callback) => {
            var urlReg = /^[0-9]*[1-9][0-9]*$/;
            var urlReg2 = /^-[0-9]*[1-9][0-9]*$/;
            if (value || value === 0) {
                if (value == 0) {
                    callback();
                } else if (value.toString() == '0') {
                    callback();
                } else if (!urlReg.test(value) && !urlReg2.test(value) ) {
                    callback(new Error('权重只能填写整数或0'));
                } else {
                    callback();
                }
            } else {
                callback(new Error('权重为必填项'));
            }
        }

        return {
            //图片基础地址
            picBaseUrl:'',
            //是否显示子页面
            showChildPage: '0',
            currentSearchMeetingliveId: '',
            showDetailPage: false,
            creatOrEdit:  0, //0新建  1修改
            picCount: '',
            searchForm: {
                reportTopicId: '',
                name: '', 
                delStatus: '1' //状态 0正常 1删除
            },
            tableData:[{}],
            showDiagramLab: false,
            diagramTableData:[],
            //分页器相关
            pagination1: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
             //分页器相关
             pagination2: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10000
            },
            // 新建会场报道
            meetingLiveListForm: {
                id: '',
                name: '',
                reportTopicId: '',
                delStatus: '1',
                createUserId: '',
                updateUserId: '',
                updateAt: '',
                createAt: '',
                modUserName: '',
            },
            meetingLiveListFormRules: {
                name: [
                    {required: true, message: '名称必填', trigger: 'change'}
                ]
            },
            meetingliveDataTemp: [],
            meetingliveData: {
                id: '',
                meetingPlaceTitle: '', //会议标题
                meetingNavTitle: '', //导航标题
                weight: '', //会议权重
                themTitle: '', //主题标题
                modelTitle: '', //模块标题
                type: '', //类型
                priority: '', //权重
                delStatus: '1', //删除状态 0已删除1未删除
                createUserId: '',
                updateUserId: '',
                updateAt: '',
                createAt: '',
                meetingReportListId: '', // 所属报道id
            },

            // ---------------------创建会场--------------------
            ifEdit: false,
            ifCreatOrEditPlace: 'creat',
            ifCreatOrEditModel: 'creat',
            maxWeight: '',
            meetinglivePlaceForm: {
                id: '',
                meetingPlaceTitle: '', //会议标题
                meetingNavTitle: '', //导航标题
                weight: '', //会议权重
                themTitle: '', //主题标题
                modelTitle: '', //模块标题
                type: '0', //类型
                priority: '-1', //权重
                delStatus: '1', //删除状态 0已删除1未删除
                createUserId: '',
                updateUserId: '',
                updateAt: '',
                createAt: '',
                meetingReportListId: '', // 所属报道id
            },
            meetinglivePlaceFormRules: {
                // weight:[
                //     { required: true, validator: validateWeight, trigger: 'change' }
                // ],
                priority:[
                    { required: true, validator: validatePriority, trigger: 'change' }
                ],
            },
            //初始化数据
            options: [{
                value: '0',
                label: '嘉宾演讲'
            }, {
                value: '1',
                label: '圆桌论坛'
            }],
            tempObj: {}, //临时存放模块信息



            // ------------------------------------嘉宾演讲模块----------------------------------------
           
            ifCreatOrEditGuest: 'creat', 
            guestOrPanel: 'guest',
            meetingGuestForm: {
                id: '',
                img: '',//嘉宾头像
                name: '', //姓名
                company: '', //公司
                position: '', //职位
                title: '', // 标题
                desc: '', //描述
                pcLink: '', //pc链接
                mlink: '', //m链接
                meetingReportId: '', //所属模块id
                createUserId: '',
                updateUserId: '',
                updateAt: '',
                createAt: '',
                delStatus: '1'
            },
            meetingGuestFormRules: {
                img: [
                    { required: true, message: '人物头像不能为空', trigger: 'change' }
                ],
                name:[
                    { required: true, message: '名称不能为空', trigger: 'change' }
                ],
                position:[
                    { required: true, message: '职位不能为空', trigger: 'change' }
                ],
                company:[
                    { required: true, message: '公司不能为空', trigger: 'change' }
                ],
                title:[
                    { required: true, message: '标题不能为空', trigger: 'change' }
                ],
                desc:[
                    { required: true, message: '摘要不能为空', trigger: 'change' }
                ]
            },
            //内容图库相关
            showContentImgLib:false,
            tempMeetingReportId: '',
            searchContentImgForm:{
                picTitle:'',
                picType:'1'//0封面图库 1内容图库 2图为图库
            },
            contentImgTableData:[],
            pagination3: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },

            // 圆桌论坛模块
            pagination4: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
            singPanelId: '',
            panelContentList:[{
                id: '',
                img: '',
                name: '',
                position: '',
                company: '',
                weight: '',
                isBigImg: '0', //是否为大图
                title: '', //标题
                desc: '', //描述
                pcLink: '', //pc链接
                mlink:'', //H5链接
                meetingReportId: '',
                createUserId: '',
                updateUserId: '',
                updateAt: '',
                createAt: '',
                delStatus: '1'
            }],
            ifCreatOrEditPanel: 'creat', 
            meetingPanelForm: {
                id: '',
                img: '',//嘉宾头像
                name: '', //姓名
                weight: '-1',
                isBigImg: '0',
                company: '', //公司
                position: '', //职位
                title: '', // 标题
                desc: '', //描述
                pcLink: '', //pc链接
                mlink: '', //m链接
                meetingReportId: '', //所属模块id
                createUserId: '',
                updateUserId: '',
                updateAt: '',
                createAt: '',
                delStatus: '1'
            },
            meetingPanelFormRules: {
                img: [
                    { required: true, message: '人物头像不能为空', trigger: 'change' }
                ],
                name:[
                    { required: true, message: '名称不能为空', trigger: 'change' }
                ],
                position:[
                    { required: true, message: '职位不能为空', trigger: 'change' }
                ],
                company:[
                    { required: true, message: '公司不能为空', trigger: 'change' }
                ],
                title:[
                    { required: true, message: '标题不能为空', trigger: 'change' }
                ],
                desc:[
                    { required: true, message: '摘要不能为空', trigger: 'change' }
                ],
                weight:[
                    { required: true, validator: validatePriority, trigger: 'change' }
                ],
            },
            checkOption: false,


        }
    },
    watch: {
       
    },
    created() {
        this.startSearch(0)
        console.log('location',window.location.href)
        if (window.location.href.indexOf('chinaventure.com.cn') !== -1 || window.location.href.indexOf('117.78.28.103') !== -1) {
            console.log('正式环境')
            this.picBaseUrl = 'https://chinaventure-static.obs.cn-north-1.myhuaweicloud.com'
        } else {
            console.log('开发测试环境')
            this.picBaseUrl = 'https://cvinfo-test.obs.cn-north-1.myhuaweicloud.com'
        }
    },
    mounted() {

    },
    methods: {
        // 开始搜索列表
        startSearch(type) {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchForm))
            data.reportTopicId = data.reportTopicId.toString().trim()
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
                url: "/meetingReportList/list",
                contentType: "application/json",
			    data: JSON.stringify(data),
                dataType: "json",
                success: function(res) {
                    if(res.code == 200) {
                        self.tableData = res.page.list
                        self.pagination1 = {
                            currPage: res.page.currPage,
                            totalCount:res.page.totalCount,
                            totalPage: res.page.totalPage,
                            pageSize: res.page.pageSize
                        }
                    } else {
                        mapErrorStatus(res)
						vm.error = true;
						vm.errorMsg = res.msg;
                    }
                },
                error: function(res) {
                    mapErrorStatus(res)
                }
            
            })
        },
        //切换页码
        handleCurrentChange (val) {
            this.pagination1.currPage = val
            this.startSearch() 
        },
         // 新建或修改会场报道  type:0 新增   type:1修改
        addOrEditMeetinglive(type, item) {
            var self = this
            self.creatOrEdit = type
            if(type == 0) {
                self.showChildPage = '1'
            } else if(type == 1) {
                $.ajax({
                    type: "POST",
                    url: "/meetingReportList/info/" + item.id,
                    contentType: "application/json",
                    dataType: "json",
                    success: function(res){
                        // console.log(res)
                        if(res.code == 200){
                            let data = res.dict
                            self.meetingLiveListForm = data
                            self.showChildPage = '1'
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
        //删除某项会场报道
        deleteThisMeetinglive(item) {
            var self = this
            self.$confirm('确实要删除该会场报道数据吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // console.log(item)
                var data = JSON.parse(JSON.stringify(item))
                data.delStatus = '0'
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/meetingReportList/delete",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res) {
                        if(res.code == 200) {
                            self.startSearch()
                            self.$message.success('删除成功')
                        } else {
                            mapErrorStatus(res)
                            vm.error = true
                            vm.errorMsg = res.msg
                        }
                    },
                    error: function(res) {
                        mapErrorStatus(res)
                    }
                })
            })
        },
         //保存
        testSubmit(formName) {
            var self = this
            self.$refs[formName].validate((valid) => {
                if(valid) {
                    if(self.creatOrEdit == 1) {
                        var data = {
                            reportTopicId: self.meetingLiveListForm.reportTopicId,
                            name: self.meetingLiveListForm.name,
                            delStatus: '1',
                            page: '1',
                            limit: '100'
                        }
                        $.ajax({
                            type: "POST",
                            url: "/meetingReportList/list",
                            contentType: "application/json",
                            data: JSON.stringify(data),
                            dataType: "json",
                            success: function(res) {
                                if(res.code == 200) {
                                   self.submitCreatEdit()
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
                    } else if (self.creatOrEdit == 0) {
                        self.submitCreatEdit()
                    }
                }
            })
        },
        // 提交
        submitCreatEdit() {
            var self = this
            var data = JSON.parse(JSON.stringify(self.meetingLiveListForm))
            console.log('准备提交保存的FORM', data)
            if (self.creatOrEdit == 0) {
                var reqUrl = '/meetingReportList/save'
            } else if (self.creatOrEdit == 1) {
                var reqUrl = '/meetingReportList/update'
            }
            $.ajax({
                type: "POST",
                url: reqUrl,
                contentType: "application/json",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res) {
                    if(res.code == 200) {
                        self.$message.success('保存成功')
                        self.startSearch()
                        self.closeCreatOrEdit('meetingLiveListForm')
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
        // 关闭页面
        closeCreatOrEdit(formName) {
            this.creatOrEdit = 0
            this.$refs[formName].resetFields();
            this. meetingLiveListForm = {
                id: '',
                name: '',
                reportTopicId: '',
                createUserId:'',
                updateUserId:'',
                createAt:'',
                updateAt:'',
                delStatus:'1',
            },
            this.showChildPage = '0'
        },




        //------------------------------------------编辑页面------------------------------------------------
        editMeetingliveDetail (item) {
            // console.log(item)
            this.currentSearchMeetingliveId = item.id.toString().trim()
            this.startSearch2(this.currentSearchMeetingliveId, 0)
            this.showChildPage = '2'
        },
        startSearch2(id, type) {
            var self = this
            var data1 = {
                meetingReportListId: id,
                delStatus: '1'
            }
            var data = JSON.parse(JSON.stringify(data1))
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
                url: "/meetingReport/list",
                contentType: "application/json",
			    data: JSON.stringify(data),
                dataType: "json",
                success: function(res) {
                    if(res.code == 200) {
                        self.pagination2 = {
                            currPage: res.page.currPage,
                            totalCount:res.page.totalCount,
                            totalPage: res.page.totalPage,
                            pageSize: res.page.pageSize
                        }
                        self.meetingliveData = res.page.list
                        var arr = res.page.list
                        if(arr.length == 0) {
                            self.maxWeight = 0
                            self.meetingliveDataTemp = []
                        } else {
                            for(let i = 0; i < arr.length; i++) {
                                for(let k = i+1; k < arr.length; k++) {
                                    let element_i = arr[i]
                                    let element_k = arr[k]
                                    if(Number(element_i.weight) == Number(element_k.weight)) {
                                        if(Number(element_i.priority) > Number(element_k.priority)) {
                                            arr[i] = element_k
                                            arr[k] = element_i
                                        }
                                    } else if(Number(element_i.weight) > Number(element_k.weight)) {
                                        arr[i] = element_k
                                        arr[k] = element_i
                                    }
                                }
                            }
                            for (let m = 0; m < arr.length; m++) {
                                for (let n = m+1; n <arr.length; n++) {
                                    let element_m = arr[m]
                                    let element_n = arr[n]
                                    if((element_m.weight == element_n.weight) && (element_m.priority == element_n.priority)) {
                                        if(element_m.id > element_n.id) {
                                            arr[m] = element_n
                                            arr[n] = element_m
                                        }
                                    }
                                }
                            }
                            // console.log(arr)
                            self.maxWeight = Number(arr[arr.length-1].weight)
                            var result = [],
                            obj = {},
                            index = 0;
                            arr.forEach(item => {
                                if(obj.hasOwnProperty(item.weight)) {
                                    result[obj[item.weight]].children.push(item)
                                } else {
                                    obj[item.weight] = index++;
                                    var list = {
                                        weight: '',
                                        meetingPlaceTitle: '',
                                        meetingNavTitle: '',
                                        type: '',
                                        children: []
                                    }
                                    list.meetingPlaceTitle = item.meetingPlaceTitle
                                    list.meetingNavTitle = item.meetingNavTitle
                                    list.type = item.type
                                    list.weight = item.weight
                                    list.children.push(item)
                                    result.push(list)
                                }
                            })
                            self.meetingliveDataTemp = result
                        }
                    } else {
                        mapErrorStatus(res)
						vm.error = true;
						vm.errorMsg = res.msg;
                    }
                }
            })
        },
        
    

        

        // -------------------------------新建会场-----------------------------------
        addOrEditNewPlace (type) {
            var self = this
            if (type == '0') {
                self.ifCreatOrEditPlace = 'creat'
                self.meetinglivePlaceForm.weight = (self.maxWeight+1).toString()
                self.showChildPage = '3'
            } else {
                self.tempObj = type
                self.ifCreatOrEditPlace = 'edit'
                self.ifEdit = true
                self. meetinglivePlaceForm.meetingPlaceTitle = type.meetingPlaceTitle
                self. meetinglivePlaceForm.meetingNavTitle = type.meetingNavTitle
                self. meetinglivePlaceForm.type = type.type
                self. meetinglivePlaceForm.weight = type.weight
                self.showChildPage = '3'
            }
        },
        backToMeetingliveList() {
            this.showChildPage = '0'
            this.meetingliveDataTemp = []
        },
        testSubmit2 (formName) {
            // var self = this
            // self.$refs[formName].validate((valid) => {
            //     if(valid) {
                  this.submitCreatEdit2()
            //     }
            // })
        },
        // 提交
        submitCreatEdit2 () {
            var self = this
            // console.log(self.meetinglivePlaceForm)
            if((self.meetinglivePlaceForm.meetingPlaceTitle.trim() == '' && self.meetinglivePlaceForm.meetingNavTitle.trim() !== '') || (self.meetinglivePlaceForm.meetingPlaceTitle.trim() !== '' && self.meetinglivePlaceForm.meetingNavTitle.trim() == '') || (self.meetinglivePlaceForm.meetingPlaceTitle.trim() !== '' && self.meetinglivePlaceForm.meetingPlaceTitle.trim() !== '#' && self.meetinglivePlaceForm.meetingNavTitle.trim() == '#') || (self.meetinglivePlaceForm.meetingPlaceTitle.trim() == '#' && self.meetinglivePlaceForm.meetingNavTitle.trim() !== ''&& self.meetinglivePlaceForm.meetingNavTitle.trim() !== '#')) {
                self.$message.error('会场标题和导航标题不能为空，且必须同时存在，若都无请填写"#"')
                return
            } else if (self.meetinglivePlaceForm.meetingPlaceTitle.trim() == '' && self.meetinglivePlaceForm.meetingNavTitle.trim() == '') {
                self.$message.error('会场标题和导航标题不能为空，且必须同时存在，若都无请填写"#"')
                return
            }
            var data1 = JSON.parse(JSON.stringify(self.meetinglivePlaceForm))
            data1.meetingReportListId = self.currentSearchMeetingliveId
            data1.themTitle = '#'
            data1.modelTitle = '#'
            // console.log('准备提交保存的FORM', data1)
            if (self.ifCreatOrEditPlace == 'creat') {
                var data = data1
                var reqUrl = '/meetingReport/save'
            } else if (self.ifCreatOrEditPlace == 'edit') {
                // console.log(self.tempObj)
                var arr = self.tempObj.children
                for(var i = 0; i < arr.length; i++) {
                    arr[i].meetingPlaceTitle = self.meetinglivePlaceForm.meetingPlaceTitle
                    arr[i].meetingNavTitle = self.meetinglivePlaceForm.meetingNavTitle
                }
                var data = arr
                var reqUrl = '/meetingReport/updateByList'
            }
            $.ajax({
                type: "POST",
                url: reqUrl,
                contentType: "application/json",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res) {
                    if(res.code == 200) {
                        self.$message.success('保存成功')
                        self.startSearch2(self.currentSearchMeetingliveId, 0)
                        self.closeCreatOrEditMeetinglivePlace('meetinglivePlaceForm')
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
        closeCreatOrEditMeetinglivePlace (formName) {
            this.ifCreatOrEditPlace = 'creat'
            this.$refs[formName].resetFields();
            this. meetinglivePlaceForm = {
                id: '',
                meetingPlaceTitle: '', //会议标题
                meetingNavTitle: '', //导航标题
                weight: '', //会议权重
                themTitle: '', //主题标题
                modelTitle: '', //模块标题
                type: '0', //类型
                priority: '-1', //权重
                delStatus: '1', //删除状态 0已删除1未删除
                createUserId: '',
                updateUserId: '',
                updateAt: '',
                createAt: '',
                meetingReportListId: '', // 所属报道id
            },
            this.ifEdit = false
            this.showChildPage = '2'
        },
        delThisMeetingPlace(item) {
            this.$confirm('确定要删除该项数据吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                    var data = item.children
                for(var i = 0; i < data.length; i++) {
                    data[i].delStatus = '0'
                }
                this.batchDelPlace(data)
            })
            
        },
        batchDelPlace(data) {
            var self = this
            var data = JSON.parse(JSON.stringify(data))
            // console.log(data)
            $.ajax({
                type: "POST",
                url: "/meetingReport/deleteByList",
                contentType: "application/json",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res) {
                    if(res.code == 200) {
                        self.$message.success('保存成功')
                        self.startSearch2(self.currentSearchMeetingliveId, 0)
                        
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
        MeetingPlaceMoveUp(index, item){
            var moveArr = JSON.parse(JSON.stringify(this.meetingliveDataTemp))
            let temp1 = moveArr[index - 1]
            let temp2 = moveArr[index]
            let tempWeight1 = temp1.weight
            let tempWeight2 = temp2.weight
            for(let i = 0; i < temp1.children.length; i++) {
                temp1.children[i].weight = tempWeight2
            }
            for(let k = 0; k < temp2.children.length; k++) {
                temp2.children[k].weight = tempWeight1
            }
            var data = (temp1.children).concat(temp2.children)
            this.batchDelPlace(data)
        },



        // -------------------------------新建模块------------------------------------
        addOrEditMeetingModel(type, item, index) {
            var self = this
            self.tempObj = JSON.parse(JSON.stringify(item))
            if(type == 0) {
                self.ifCreatOrEditModel = 'creat'
                self.meetinglivePlaceForm.meetingPlaceTitle = self.tempObj.meetingPlaceTitle
                self.meetinglivePlaceForm.meetingNavTitle = self.tempObj.meetingNavTitle
                self.meetinglivePlaceForm.weight = self.tempObj.weight
                self.meetinglivePlaceForm.meetingReportListId = self.currentSearchMeetingliveId
                self.showChildPage = '4'
            } else {
                self.ifCreatOrEditModel = 'edit'
                var id = self.tempObj.children[index].id
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: '/meetingReport/info/' + id,
                    dataType: "json",
                    success: function(res){
                        if (res.code == 200) {
                            self.meetinglivePlaceForm = res.dict
                            self.ifEdit = true
                            self.showChildPage = '4'
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
            
        },
        testSubmit3 (formName) {
            var self = this
            self.$refs[formName].validate((valid) => {
                if(valid) {
                  self.submitCreatEdit3()
                }
            })

        },
        submitCreatEdit3 () {
            var self = this
            var data = JSON.parse(JSON.stringify(self.meetinglivePlaceForm))
            console.log('准备提交保存的FORM', data)
            if(data.themTitle.trim() == '' || data.modelTitle == '') {
                self.$message.error('主题标题和模块标题不能为空，若无请填写"#"')
                return
            } 
            if (self.ifCreatOrEditModel == 'creat') {
                var reqUrl = '/meetingReport/save'
            } else if (self.ifCreatOrEditModel == 'edit') {
                var reqUrl = '/meetingReport/update'
            }
            $.ajax({
                type: "POST",
                url: reqUrl,
                contentType: "application/json",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res) {
                    if(res.code == 200) {
                        self.$message.success('保存成功')
                        self.startSearch2(self.currentSearchMeetingliveId, 0)
                        self.closeCreatOrEditMeetingliveModel('meetinglivePlaceForm')
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
        closeCreatOrEditMeetingliveModel (formName) {
            this.ifCreatOrEditModel = 'creat'
            this.$refs[formName].resetFields();
            this. meetinglivePlaceForm = {
                id: '',
                meetingPlaceTitle: '', //会议标题
                meetingNavTitle: '', //导航标题
                weight: '', //会议权重
                themTitle: '', //主题标题
                modelTitle: '', //模块标题
                type: '0', //类型
                priority: '-1', //权重
                delStatus: '1', //删除状态 0已删除1未删除
                createUserId: '',
                updateUserId: '',
                updateAt: '',
                createAt: '',
                meetingReportListId: '', // 所属报道id
            },
            this.ifEdit = false
            this.showChildPage = '2'
        },
        //删除某项主题
        delMeetingModel(item, index) {
            var self = this
            self.$confirm('确定要删除该项数据吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var delData = {}
                var id = item.children[index].id
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: '/meetingReport/info/' + id,
                    dataType: "json",
                    success: function(res){
                        if (res.code == 200) {
                            var data = JSON.parse(JSON.stringify(res.dict))  
                            data.delStatus = '0'
                            self.delModel(data)
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
            })
        },
        // 删除模块
        delModel(data) {
            var self = this
            // console.log(data)
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "/meetingReport/delete",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res) {
                    if(res.code == 200) {
                        self.startSearch2(self.currentSearchMeetingliveId, 0)
                        self.$message.success('删除成功')
                    } else {
                        mapErrorStatus(res)
                        vm.error = true
                        vm.errorMsg = res.msg
                    }
                },
                error: function(res) {
                    mapErrorStatus(res)
                }
            })
        },
        

        // ---------------------------嘉宾演讲模块------------------------------
        //链接校验
        validateUrl(value) {
            var urlReg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
            if(value.trim() !== '#') {
                if (value.trim() == '') {
                    this.$message.error('链接不能为空，暂无链接可填写"#"')
                } else if(!urlReg.test(value.trim())) {
                    this.$message.error('链接格式不正确')
                }
            }
        },
        addOrEditMeetingDetail(item) {
            if(item.type == '0') {
                this.tempMeetingReportId = item.id
                this.getEditMeetingGuest(item.id)
                this.showChildPage = '5'
            } else if(item.type == '1') {
                this.tempMeetingReportId = item.id
                this.getEditMeetingPanel(item.id, 0)
                this.showChildPage = '6'
            }
            
        },
        //编辑嘉宾演讲模块---数据反显
        getEditMeetingGuest(id) {
            var self = this
            let data = {
                meetingReportId: id.toString(),
                delStatus: '1'
            }
            $.ajax({
                type: "POST",
                url: '/speech/list',
                contentType: "application/json",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    // console.log(res)
                    if(res.code == 200){
                        if(res.page.list.length == 0) {
                            self.ifCreatOrEditGuest = 'creat'
                        } else {
                            self.meetingGuestForm = res.page.list[0]
                            self.meetingGuestForm.img = self.picBaseUrl+self.meetingGuestForm.img
                            self.ifCreatOrEditGuest = 'edit'
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
        testSubmit4(formName) {
            var self = this
            self.$refs[formName].validate((valid) => {
                if(valid) {
                  self.submitCreatEdit4()
                }
            })

        },
        submitCreatEdit4 () {
            var self = this
            var urlReg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
            if(self.meetingGuestForm.pcLink.trim() !== '#') {
                if (self.meetingGuestForm.pcLink.trim() == '') {
                    self.$message.error('链接不能为空，暂无链接可填写"#"')
                    return
                } else if(!urlReg.test(self.meetingGuestForm.pcLink.trim())) {
                    self.$message.error('链接格式不正确')
                    return
                }
            }
            if(self.meetingGuestForm.mlink.trim() !== '#') {
                if (self.meetingGuestForm.mlink.trim() == '') {
                    self.$message.error('链接不能为空，暂无链接可填写"#"')
                    return
                } else if(!urlReg.test(self.meetingGuestForm.mlink.trim())) {
                    self.$message.error('链接格式不正确')
                    return
                }
            }
            self.meetingGuestForm.meetingReportId = self.tempMeetingReportId
            var data = JSON.parse(JSON.stringify(self.meetingGuestForm))
            if (self.ifCreatOrEditGuest == 'creat') {
                var reqUrl = '/speech/save'
            } else if (self.ifCreatOrEditGuest == 'edit') {
                var reqUrl = '/speech/update'
            }
            $.ajax({
                type: "POST",
                url: reqUrl,
                contentType: "application/json",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res) {
                    if(res.code == 200) {
                        self.$message.success('保存成功')
                        self.startSearch2(self.currentSearchMeetingliveId, 0)
                        self.closeCreatOrEditMeetingGuest('meetingGuestForm')
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
        closeCreatOrEditMeetingGuest (formName) {
            this.ifCreatOrEditGuest = 'creat'
            this.$refs[formName].resetFields();
            this. meetingGuestForm = {
                img: '',//嘉宾头像
                name: '', //姓名
                company: '', //公司
                position: '', //职位
                title: '', // 标题
                desc: '', //描述
                pcLink: '', //pc链接
                mlink: '', //m链接
                meetingReportId: '', //所属模块id
                createUserId: '',
                updateUserId: '',
                updateAt: '',
                createAt: '',
                delStatus: '1'
            },
            this.showChildPage = '2'
        },
         // ----------------------内容图库相关---------------------
        handleCurrentChange3 (val) {
            this.pagination3.currPage = val
            this.searchContentImg()
        },
        //修改某一张内容图片
        chooseContentImg(type){
            if(type == '0') {
                this.guestOrPanel = 'guest'
            } else if (type == '1') {
                this.guestOrPanel = 'panel'
            }
            this.showContentImgLib = true
            this.searchContentImg(0)
        },
        //搜索内容图库
        searchContentImg(type){
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchContentImgForm))
            data.picTitle = data.picTitle.trim()
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
                        self.contentImgTableData = res.page.list
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
        //选择了某一张内容图片
        addThisContentImg (item) {
            if(this.guestOrPanel == 'guest') {
                this.meetingGuestForm.img = item.picUrl
            } else if (this.guestOrPanel == 'panel') {
                this.meetingPanelForm.img = item.picUrl
            }
            
            this.backToEdit()
        },
        //返回编辑页
        backToEdit (){
            this.showContentImgLib = false
            this.searchContentImgForm = {
                picTitle:'',
                picType:'1'//0封面图库 1内容图库 2图为图库
            }
            this.contentImgTableData = [],
            this.pagination3 = {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            }
        },   
        
        
        //--------------------编辑圆桌论坛模块---------------
        //切换页码
        handleCurrentChange4 (val) {
            this.pagination4.currPage = val
            this.getEditMeetingPanel(this.tempMeetingReportId, 1) 
        },
        ifBigImgChange(val) {
            if (val == 1) {
                this.meetingPanelForm.weight = 1000
                this.meetingPanelForm.name = '#'
                this.meetingPanelForm.position = '#'
                this.meetingPanelForm.company = '#'
                this.meetingPanelForm.desc = '#'
            } else {
                this.meetingPanelForm.weight = '-1'
                this.meetingPanelForm.name = ''
                this.meetingPanelForm.position = ''
                this.meetingPanelForm.company = ''
                this.meetingPanelForm.desc = ''
            }
        },
        backToMainPage() {
            this.startSearch2(this.currentSearchMeetingliveId, 0)
            this.showChildPage = '2';
        },
        getEditMeetingPanel(id, type) {
            var self = this
            let data = {
                meetingReportId: id.toString(),
                delStatus: '1'
            }
            if (type == 0) {
                Object.assign(data,{
                    page: '1',
                    limit: self.pagination4.pageSize.toString()
                })
            } else {
                Object.assign(data,{
                    page: self.pagination4.currPage.toString(),
                    limit: self.pagination4.pageSize.toString()
                })
            }
            $.ajax({
                type: "POST",
                url: '/forum/list',
                contentType: "application/json",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        // console.log(res.page)
                        self.panelContentList = res.page.list
                        for(var i = 0; i < self.panelContentList.length; i++) {

                            self.panelContentList[i].img = self.picBaseUrl+self.panelContentList[i].img
                        }
                        self.pagination4 = {
                            currPage: res.page.currPage,
                            totalCount:res.page.totalCount,
                            totalPage:res.page.totalPage,
                            pageSize:res.page.pageSize
                        }
                        // console.log(self.pagination4)
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
        addNewPanelItem (type) {
            if(type == '0') {
                this.ifCreatOrEditPanel = 'creat'
                this.showChildPage = '7'
            } else {
                this.ifCreatOrEditPanel = 'edit'
                this.singPanelId = type.id
                this.getSinglePanelInfo(type.id)
            }
            
        },
        getSinglePanelInfo(id) {
            var self = this
            $.ajax({
                type: "POST",
                url: "/forum/info/" + id,
                contentType: "application/json",
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.meetingPanelForm = res.dict
                        self.meetingPanelForm.img = self.picBaseUrl+self.meetingPanelForm.img
                        self.showChildPage = '7'
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
        testSubmit5(formName) {
            var self = this
            self.$refs[formName].validate((valid) => {
                if(valid) {
                    let data = {
                        meetingReportId: self.tempMeetingReportId.toString(),
                        delStatus: '1'
                    }
                    $.ajax({
                        type: "POST",
                        url: '/forum/list',
                        contentType: "application/json",
                        data: JSON.stringify(data),
                        dataType: "json",
                        success: function(res){
                            if(res.code == 200){
                                var arr = res.page.list
                                if(self.ifCreatOrEditPanel == 'creat') {
                                    if (res.page.list.length == 0) {
                                        self.submitCreatEdit5()
                                    } else if (res.page.list.length !== 0 ) {
                                        var ifHaveBigImg = false
                                        for(var i = 0; i < arr.length; i++){
                                            if(arr[i].isBigImg == '1' && self.meetingPanelForm.isBigImg == '1') {
                                                ifHaveBigImg = true  
                                            }  
                                        }  

                                        if(ifHaveBigImg) {
                                            self.$message.error('场景大图已经存在，设置新场景大图请删除原来场景大图')
                                            return
                                        } else {
                                            self.submitCreatEdit5()
                                        }
                                    } 
                                } else if (self.ifCreatOrEditPanel == 'edit') {
                                    var bigImgId = ''
                                    for(var i = 0; i < arr.length; i++){
                                        if(arr[i].isBigImg == '1') {
                                            bigImgId = arr[i].id
                                        }
                                    }
                                    if(bigImgId !== '' && (bigImgId !== self.meetingPanelForm.id) && self.meetingPanelForm.isBigImg == '1') {
                                        self.$message.error('场景大图已经存在，设置新场景大图请删除原来场景大图')
                                        return
                                    } else {
                                        self.submitCreatEdit5()
                                    }
                                    
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
                }
            })
        },
        submitCreatEdit5 () {
            var self = this
            var urlReg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
            if(self.meetingPanelForm.pcLink.trim() !== '#') {
                if (self.meetingPanelForm.pcLink.trim() == '') {
                    self.$message.error('链接不能为空，暂无链接可填写"#"')
                    return
                } else if(!urlReg.test(self.meetingPanelForm.pcLink.trim())) {
                    self.$message.error('链接格式不正确')
                    return
                }
            }
            if(self.meetingPanelForm.mlink.trim() !== '#') {
                if (self.meetingPanelForm.mlink.trim() == '') {
                    self.$message.error('链接不能为空，暂无链接可填写"#"')
                    return
                } else if(!urlReg.test(self.meetingPanelForm.mlink.trim())) {
                    self.$message.error('链接格式不正确')
                    return
                }
            }
            self.meetingPanelForm.meetingReportId = self.tempMeetingReportId
            var data = JSON.parse(JSON.stringify(self.meetingPanelForm))
            if (self.ifCreatOrEditPanel == 'creat') {
                var reqUrl = '/forum/save'
            } else if (self.ifCreatOrEditPanel == 'edit') {
                var reqUrl = '/forum/update'
            }
            $.ajax({
                type: "POST",
                url: reqUrl,
                contentType: "application/json",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res) {
                    if(res.code == 200) {
                        self.$message.success('保存成功')
                        self.getEditMeetingPanel(self.tempMeetingReportId, 0)
                        self.closeCreatOrEditMeetingPanel('meetingPanelForm')
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
        closeCreatOrEditMeetingPanel (formName) {
            this.ifCreatOrEditPanel = 'creat'
            this.$refs[formName].resetFields();
            this. meetingPanelForm = {
                id: '',
                img: '',//嘉宾头像
                name: '', //姓名
                weight: '-1',
                isBigImg: '0',
                company: '', //公司
                position: '', //职位
                title: '', // 标题
                desc: '', //描述
                pcLink: '', //pc链接
                mlink: '', //m链接
                meetingReportId: '', //所属模块id
                createUserId: '',
                updateUserId: '',
                updateAt: '',
                createAt: '',
                delStatus: '1'
            },
            this.showChildPage = '6'
        },
        deleteThisPanelItem(item) {
            var self = this
            self.$confirm('确实要删除该圆桌论坛数据吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = JSON.parse(JSON.stringify(item))
                data.delStatus = '0'
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/forum/update",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res) {
                        if(res.code == 200) {
                            self.$message.success('删除成功')
                            self.getEditMeetingPanel(self.tempMeetingReportId, 0)
                            self.showChildPage = '6'
                        } else {
                            mapErrorStatus(res)
                            vm.error = true
                            vm.errorMsg = res.msg
                        }
                    },
                    error: function(res) {
                        mapErrorStatus(res)
                    }
                })
            })
        },
        scaleChange(item) {
            var self = this
            if(item.weight.trim() == '') {
                item.weight = '-1'
            } else {
                var urlReg = /^[0-9]*[1-9][0-9]*$/;
                var urlReg2 = /^-[0-9]*[1-9][0-9]*$/;
                if(!urlReg.test(item.weight) && !urlReg2.test(item.weight) && item.weight !== '0') {
                    this.$message.error('权重只能填写整数或0')
                    return
                }
                
            }
            var data = JSON.parse(JSON.stringify(item))
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: '/forum/update',
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.getEditMeetingPanel(self.tempMeetingReportId, 0)
                        self.showChildPage = '6'
                        self.$message.success('保存成功')
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

    }
})
