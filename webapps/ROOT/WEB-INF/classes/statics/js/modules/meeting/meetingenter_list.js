var vm = new Vue({
    el: '#meetingenter_list',
    data () {
        var validateUrl = (rule, value, callback) => {
            var urlReg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
            if (value) {
                if (value.trim() == '#') {
                    callback();
                } else if (!urlReg.test(value)) {
                    callback(new Error('链接格式不正确'));
                } else {
                    callback();
                }
            } else {
                callback(new Error('链接为必填项'));
            }
        }
        var validateMeetingTimes = (rule, value, callback) => {
            console.log(value,value[0])
            if (value[0]) {
                if (value[0] == value[1]) {
                    callback(new Error('会议开始时间不能与会议结束时间相同'));
                } else {
                    callback();
                }
            } else {
                callback(new Error('会议时间为必填项'));
            }
            
        }
        var validateMeetingBaomingTimes = (rule, value, callback) => {
            if (value !== null){
                if (value[0]) {
                    if (value[0] == value[1]) {
                        callback(new Error('会议报名开始时间不能与会议报名结束时间相同'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            } else {
                callback();
            }
        }
        return {
            showChildPage: false,
            creatOrEdit:0,//0新建  1修改
            //省市区选项
            RegionOptions: [],
            //会议类型
            meetingOptions:[],
            //搜索提交
            timeRange:[],
            searchForm:{
                meetingTitle:'',//会议名称
                meetingType:'',//会议类型
                meetingStartTime:'',//开始时间
                meetingEndTime:'',//结束时间
            },
            //列表查询结果
            tableData: [{
                meetingId:'',//主键
                meetingTitle:'',//标题
                meetingStartTime:'',//开始时间
                meetingEndTime:'',//结束时间
                meetingImg:'',//封面图
                meetingType:'',//类型
                meetingUrl:'',//会议链接
                meetingProvince:'',//省
                meetingCity:'',//市
                meetingArea:'',//区
                meetingAddress:'',//详细地址
                meetingOrganizers:'',//举办方
                meetingDesc:'',//简介
                meetingCrtUserId:'',//创建人编号
                meetingCrtTime:'',//创建时间
                meetingModUserId:'',//更新人编号
                meetingModTime:'',//更新时间
                meetingStatus:'',//发布状态：会议状态 0 上线 1 下线 2 删除
                meetingEnrollStartTime:'',//会议报名开始时间
                meetingEnrollEndTime:'',//会议报名结束时间
                meetingCrtUserName:'',//创建人姓名
                meetingTagImgapp:'',//标签图片
                meetingTagContent:'',//APP标签内容
                meetingKeyword:'',//关键词
                meetingGuestName:'',//嘉宾名称(搜索)
            }],
            //分页器相关
            pagination1: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
            //会议合作机构表单
            meetingForm:{
                meetingId:'',//主键
                meetingTitle:'',//标题
                meetingStartTime:'',//开始时间
                meetingEndTime:'',//结束时间
                meetingImg:'',//封面图
                meetingType:'',//类型
                meetingUrl:'',//会议链接
                meetingProvince:'',//省
                meetingCity:'',//市
                meetingArea:'',//区
                meetingAddress:'',//详细地址
                meetingOrganizers:'',//举办方
                meetingDesc:'',//简介
                meetingCrtUserId:'',//创建人编号
                meetingCrtTime:'',//创建时间
                meetingModUserId:'',//更新人编号
                meetingModTime:'',//更新时间
                meetingStatus:'',//发布状态：会议状态 0 上线 1 下线 2 删除
                meetingEnrollStartTime:'',//会议报名开始时间
                meetingEnrollEndTime:'',//会议报名结束时间
                meetingCrtUserName:'',//创建人姓名
                meetingTagImgapp:'',//标签图片
                meetingTagContent:'',//APP标签内容
                meetingKeyword:'',//关键词
                meetingGuestName:'',//嘉宾名称(搜索)
                meetingRegion:[],//会议所在区域-----前端自用字段
                meetingTimes:[],//会议时间数组-----前端自用字段
                meetingBaomingTimes:[], //会议报名时间-----前端自用字段
            },
            meetingFormRules:{
                meetingTitle: [
                    { required: true, message: '会议标题不能为空', trigger: 'change' },
                ],
                meetingTimes:[
                    { type: 'array', required: true, validator: validateMeetingTimes, trigger: 'change' }
                ],
                meetingBaomingTimes:[
                    { type: 'array', validator: validateMeetingBaomingTimes, trigger: 'change' }
                ],
                meetingRegion:[
                    { type: 'array', required: true, message: '所在区域不能为空', trigger: 'change' }
                ],
                meetingUrl:[

                ],
                meetingImg:[
                    {required: true, message: '会议封面图为必选', trigger: 'change' },
                ]
                
            },
            //展示封面图库
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
    watch: {
        timeRange (val) {
            console.log(val)
            if (val) {
                this.searchForm.meetingStartTime = val[0]
                this.searchForm.meetingEndTime = val[1]
            } else {
                this.searchForm.meetingStartTime = ''
                this.searchForm.meetingEndTime = ''
            }
            console.log(this.searchForm)
        }
    },
    created () {
        this.startSearch(0)
        this.RegionOptions = regionJSON
        this.getMeetingType()
    },
    methods:{
        handleCurrentChange (val) {
            this.pagination1.currPage = val
            this.startSearch()
        },
        //开始搜索会议列表
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
                contentType: "application/json",
                url: "/meeting/list",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.tableData = res.page.list
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
        //新增或修改会议
        addOrEditMeeting(type,item) {
            var self = this
            self.creatOrEdit = type
            if(type == 0){
                self.showChildPage = true
                console.log('新增基本信息')
            } else {
                $.ajax({
                    type: "POST",
                    url: "/meeting/info/" + item.meetingId.toString(),
                    contentType: "application/json",
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            console.log('请求修改的会议返回结果：',res.dict)
                            self.editMeetingFilter(res.dict)
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
        //编辑反显前数据过滤
        editMeetingFilter (tempObj) {
            console.log('tempObj',tempObj)
            //省市区反显
            tempObj.meetingRegion = []
            for (let i = 0; i < this.RegionOptions.length; i++) {
                if (this.RegionOptions[i].label == tempObj.meetingBaseInfoProvince) {
                    tempObj.meetingRegion[0] = this.RegionOptions[i].value
                    for (let j = 0; j <this.RegionOptions[i].children.length; j ++) {
                        if (this.RegionOptions[i].children[j].label == tempObj.meetingBaseInfoCity) {
                            tempObj.meetingRegion[1] = this.RegionOptions[i].children[j].value
                            for (let k = 0; k < this.RegionOptions[i].children[j].children.length; k++) {
                                if (this.RegionOptions[i].children[j].children[k].label == tempObj.meetingBaseInfoArea) {
                                    tempObj.meetingRegion[2] = this.RegionOptions[i].children[j].children[k].value
                                }
                            }
                        }
                    }
                }
            }
            //会议时间反显
            tempObj.meetingTimes = [parseInt(tempObj.meetingBaseInfoStartTime),parseInt(tempObj.meetingBaseInfoEndTime)]
            tempObj.meetingBaomingTimes = [parseInt(tempObj.meetingBaseInfoSignUpStartTime),parseInt(tempObj.meetingBaseInfoSignUpEndTime)]
            this.meetingForm = tempObj
            this.$refs['meetingForm'].resetFields()
            this.showChildPage = true
        },
        //删除
        deleteThisBaseinfo (item){
            var self = this
            self.$confirm('确实要删除该会议数据吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = JSON.parse(JSON.stringify(item))
                data.meetingBaseInfoStatus = 1  //0 正常  1 删除
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/meetingBaseInfo/update",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res) {
                        if (res.code == 200) {
                            self.startSearch()
                            self.$message.success('删除成功')
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
        //省市区发生变化时
        handleRegionChange(val){
            for (let i = 0; i < this.RegionOptions.length; i++) {
                if (this.RegionOptions[i].value == val[0]) {
                    this.meetingForm.meetingBaseInfoProvince = this.RegionOptions[i].label
                    for (let j = 0; j <this.RegionOptions[i].children.length; j ++) {
                        if (this.RegionOptions[i].children[j].value == val[1]) {
                            this.meetingForm.meetingBaseInfoCity = this.RegionOptions[i].children[j].label
                            // for (let k = 0; k < this.RegionOptions[i].children[j].children.length; k++) {
                            //     if (this.RegionOptions[i].children[j].children[k].value == val[2]) {
                            //         this.meetingForm.meetingBaseInfoArea = this.RegionOptions[i].children[j].children[k].label
                            //     }
                            // }
                        }
                    }
                }
            }
            console.log('省市区发生变化',this.meetingForm.meetingBaseInfoProvince,this.meetingForm.meetingBaseInfoCity,this.meetingForm.meetingBaseInfoArea)
        },
        //会议起止时间变化
        handleMeetingTimesChange(val){
            if (val !== null) {
                this.meetingForm.meetingStartTime = val[0]
                this.meetingForm.meetingEndTime = val[1]
            } else {
                this.meetingForm.meetingStartTime = '-1'
                this.meetingForm.meetingEndTime = '-1'
            }
            console.log('会议时间变化',val,this.meetingForm.meetingStartTime,this.meetingForm.meetingEndTime)
        },
        //会议报名时间变化
        handleMeetingBaomingTimesChange(val){
            if (val !== null) {
                this.meetingForm.meetingEnrollStartTime = val[0]
                this.meetingForm.meetingEnrollEndTime = val[1]
            } else {
                this.meetingForm.meetingEnrollStartTime = '-1'
                this.meetingForm.meetingEnrollEndTime = '-1'
            }
            console.log('报名时间变化',val,this.meetingForm.meetingEnrollStartTime,this.meetingForm.meetingEnrollEndTime)
        },
        //新建或编辑保存
        testSubmit(formName) {
            var self = this
            self.$refs[formName].validate((valid) => {
                if (valid) {
                    //判断报名时间和开始时间规则
                    if (self.meetingForm.meetingEnrollEndTime > self.meetingForm.meetingStartTime) {
                        self.$message.error('会议报名截至时间不能大于会议开始时间')
                        return
                    }
                    self.submitCreatEdit()
                }
            })
        },
        //提交
        submitCreatEdit(){
            var self = this
            if (self.creatOrEdit == 0) {
                var reqUrl = '/meetingBaseInfo/save'
            } else if (self.creatOrEdit == 1) {
                var reqUrl = '/meetingBaseInfo/update'
            }
            var data = JSON.parse(JSON.stringify(self.meetingForm))
            $.ajax({
                type: "POST",
                url: reqUrl,
                contentType: "application/json",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.$message.success('保存成功')
                        self.startSearch()
                        self.closeCreatOrEdit('meetingForm')
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
        //取消编辑返回列表页
        closeCreatOrEdit (formName) {
            this.$refs[formName].resetFields();
            this.meetingForm = {
                meetingId:'',//主键
                meetingTitle:'',//标题
                meetingStartTime:'',//开始时间
                meetingEndTime:'',//结束时间
                meetingImg:'',//封面图
                meetingType:'',//类型
                meetingUrl:'',//会议链接
                meetingProvince:'',//省
                meetingCity:'',//市
                meetingArea:'',//区
                meetingAddress:'',//详细地址
                meetingOrganizers:'',//举办方
                meetingDesc:'',//简介
                meetingCrtUserId:'',//创建人编号
                meetingCrtTime:'',//创建时间
                meetingModUserId:'',//更新人编号
                meetingModTime:'',//更新时间
                meetingStatus:'',//发布状态：会议状态 0 上线 1 下线 2 删除
                meetingEnrollStartTime:'',//会议报名开始时间
                meetingEnrollEndTime:'',//会议报名结束时间
                meetingCrtUserName:'',//创建人姓名
                meetingTagImgapp:'',//标签图片
                meetingTagContent:'',//APP标签内容
                meetingKeyword:'',//关键词
                meetingGuestName:'',//嘉宾名称(搜索)
                meetingRegion:[],//会议所在区域-----前端自用字段
                meetingTimes:[],//会议时间数组-----前端自用字段
                meetingBaomingTimes:[], //会议报名时间-----前端自用字段
            }
            this.showChildPage = false
            this.creatOrEdit = 0
        },
        //打开封面图库弹层
        openAddCoverImg () {
            this.showCoverimgLib = true
            this.searchCoverImg(0)
        },
        //选择了某一张封面图片
        addThisCoverImg (item) {
            this.$refs['meetingForm'].clearValidate();
            this.meetingForm.meetingImg = item.picUrl
            this.backToEdit()
        },
        handleCurrentChange2 (val) {
            this.pagination2.currPage = val
            this.searchCoverImg()
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
        //搜索封面图库
        searchCoverImg (type){
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchCoverimgForm))
            data.picTitle = data.picTitle.trim()
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
        //获取会议类型
        getMeetingType () {
            var self = this
            $.ajax({
				type: "POST",
                url: "/sys/dict/list?type=meetingType" ,
			    dataType: "json",
			    success: function(res){
					if(res.code == 200){
                        self.meetingOptions = res.page.list
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