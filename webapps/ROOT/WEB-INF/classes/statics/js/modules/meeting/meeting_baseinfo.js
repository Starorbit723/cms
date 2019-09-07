var vm = new Vue({
    el: '#meeting_baseinfo',
    data () {
        var validateMeetingTimes = (rule, value, callback) => {
            console.log(value)
            if (value !== null) {
                if (value !== [] && (value[0] == value[1])) {
                    callback(new Error('会议开始时间不能与会议结束时间相同'));
                } else {
                    callback();
                }
            } else {
                callback(new Error('会议时间为必填项'));
            }
            
        }
        var validateMeetingBaomingTimes = (rule, value, callback) => {
            if (value !== null && value !== undefined) {
                if (value[0] !== '#' && value[0] !== undefined && (value[0] == value[1])) {
                    callback(new Error('报名开始时间不能与报名结束时间相同'));
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
            //搜索提交
            searchForm:{
                meetingBaseInfoMeetingId:'',
                meetingBaseInfoTitle:'',
                meetingBaseInfoStatus:'0',
            },
            //列表查询结果
            tableData: [{
                meetingBaseInfoId:'',//主键
                meetingBaseInfoMeetingId:'',//所属会议id
                meetingBaseInfoTitle:'',//会议基本信息标题
                meetingBaseInfoStartTime:'',//会议开始时间
                meetingBaseInfoEndTime:'',//会议结束时间
                meetingBaseInfoSignUpStartTime:'',//报名开始时间
                meetingBaseInfoSignUpEndTime:'',//报名结束时间
                meetingBaseInfoProvince:'',//所在省
                meetingBaseInfoCity:'',//所在市
                meetingBaseInfogArea:'',//所在区
                meetingBaseInfoAddress:'',//详细地址
                meetingBaseInfoCrtUserId:'',//
                meetingBaseInfoModUserId:'',//
                meetingBaseInfoCrtTime:'',//
                meetingBaseInfoModTime:'',//
                meetingBaseInfoStatus:'',//状态 0正常 1下线
                userName:'',//创建人
            }],
            //分页器相关
            pagination1: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
            //会议合作机构表单
            meetingBaseinfoForm:{
                meetingBaseInfoId:'',//主键
                meetingBaseInfoMeetingId:'',//所属会议id
                meetingBaseInfoTitle:'',//会议基本信息标题
                meetingBaseInfoStartTime:'',//会议开始时间
                meetingBaseInfoEndTime:'',//会议结束时间
                meetingBaseInfoSignUpStartTime:'',//报名开始时间
                meetingBaseInfoSignUpEndTime:'',//报名结束时间
                meetingBaseInfoProvince:'',//所在省
                meetingBaseInfoCity:'',//所在市
                meetingBaseInfogArea:'',//所在区
                meetingBaseInfoAddress:'',//详细地址
                meetingRegion:[],//会议所在区域-----前端自用字段
                meetingTimes:[],//会议时间数组-----前端自用字段
                meetingBaomingTimes:[], //会议报名时间-----前端自用字段
                meetingBaseInfoCrtUserId:'',//
                meetingBaseInfoModUserId:'',//
                meetingBaseInfoCrtTime:'',//
                meetingBaseInfoModTime:'',//
                meetingBaseInfoStatus:'',//状态 0正常 1下线
                userName:'',//创建人
            },
            meetingBaseinfoFormRules:{
                meetingBaseInfoTitle: [
                    { required: true, message: '会议标题不能为空', trigger: 'change' },
                ],
                meetingTimes:[
                    { type: 'array', required: true, validator: validateMeetingTimes, trigger: 'change' }
                ],
                meetingBaomingTimes:[
                    { type: 'array', required: true, validator: validateMeetingBaomingTimes, trigger: 'change' }
                ],
                meetingRegion:[
                    { type: 'array', required: true, message: '所在区域不能为空', trigger: 'change' }
                ],
                meetingBaseInfoAddress:[
                    { required: true, message: '详细地址不能为空', trigger: 'change' }
                ]
                
            },

        }
    },
    watch: {
    },
    created () {
        this.startSearch(0)
        this.RegionOptions = regionJSON
    },
    methods:{
        handleCurrentChange (val) {
            this.pagination1.currPage = val
            this.startSearch()
        },
        //开始搜索专题列表
        startSearch (type) {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchForm))
            data.meetingBaseInfoTitle = data.meetingBaseInfoTitle.toString().trim()
            data.meetingBaseInfoMeetingId = data.meetingBaseInfoMeetingId.toString().trim()
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
                url: "/meetingBaseInfo/list",
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
        //新增或修改会议基本信息
        addOrEditBaseinfo(type,item) {
            var self = this
            self.creatOrEdit = type
            if(type == 0){
                self.showChildPage = true
                console.log('新增基本信息')
            } else {
                $.ajax({
                    type: "POST",
                    url: "/meeting/guest/info/" + item.meetingGuestId.toString(),
                    contentType: "application/json",
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            //json64反解
                            let data = res.dict
                            let map = $.base64.atob(data.meetingGuestJson, true)
                            data.meetingGuestJson = JSON.parse(map)
                            console.log(data)
                            self.meetingBaseinfoForm = data
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
                console.log('修改机构',self.meetingBaseinfoForm.picUrl)
            }
        },
        //删除
        deleteThisBaseinfo (item){
            var self = this
            self.$confirm('确实要删除该嘉宾数据吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = JSON.parse(JSON.stringify(item))
                data.meetingGuestStatus = 1  //0 正常  1 删除
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/meeting/guest/update",
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
                    this.meetingBaseinfoForm.meetingBaseInfoProvince = this.RegionOptions[i].label
                    for (let j = 0; j <this.RegionOptions[i].children.length; j ++) {
                        if (this.RegionOptions[i].children[j].value == val[1]) {
                            this.meetingBaseinfoForm.meetingBaseInfoCity = this.RegionOptions[i].children[j].label
                            for (let k = 0; k < this.RegionOptions[i].children[j].children.length; k++) {
                                if (this.RegionOptions[i].children[j].children[k].value == val[2]) {
                                    this.meetingBaseinfoForm.meetingBaseInfogArea = this.RegionOptions[i].children[j].children[k].label
                                }
                            }
                        }
                    }
                }
            }
            console.log('省市区发生变化',this.meetingBaseinfoForm.meetingBaseInfoProvince,this.meetingBaseinfoForm.meetingBaseInfoCity,this.meetingBaseinfoForm.meetingBaseInfogArea)
        },
        //会议起止时间变化
        handleMeetingTimesChange(val){
            if (val !== null) {
                this.meetingBaseinfoForm.meetingBaseInfoStartTime = val[0]
                this.meetingBaseinfoForm.meetingBaseInfoEndTime = val[1]
            } else {
                this.meetingBaseinfoForm.meetingBaseInfoStartTime = ''
                this.meetingBaseinfoForm.meetingBaseInfoEndTime = ''
            }
            console.log('会议时间变化',val,this.meetingBaseinfoForm.meetingBaseInfoStartTime,this.meetingBaseinfoForm.meetingBaseInfoEndTime)
        },
        //会议报名时间变化
        handleMeetingBaomingTimesChange(val){
            if (val !== null) {
                this.meetingBaseinfoForm.meetingBaseInfoSignUpStartTime = val[0]
                this.meetingBaseinfoForm.meetingBaseInfoSignUpEndTime = val[1]
            } else {
                this.meetingBaseinfoForm.meetingBaseInfoSignUpStartTime = ''
                this.meetingBaseinfoForm.meetingBaseInfoSignUpEndTime = ''
            }
            console.log('报名时间变化',val,this.meetingBaseinfoForm.meetingBaseInfoSignUpStartTime,this.meetingBaseinfoForm.meetingBaseInfoSignUpEndTime)
        },
        //新建或编辑保存
        testSubmit(formName) {
            var self = this
            self.$refs[formName].validate((valid) => {
                if (valid) {
                    //验证是否有重复数据
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
            var data = JSON.parse(JSON.stringify(self.meetingBaseinfoForm))
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
                        self.closeCreatOrEdit('meetingBaseinfoForm')
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
            this.meetingBaseinfoForm = {
                meetingBaseInfoId:'',//主键
                meetingBaseInfoMeetingId:'',//所属会议id
                meetingBaseInfoTitle:'',//会议基本信息标题
                meetingBaseInfoStartTime:'',//会议开始时间
                meetingBaseInfoEndTime:'',//会议结束时间
                meetingBaseInfoSignUpStartTime:'',//报名开始时间
                meetingBaseInfoSignUpEndTime:'',//报名结束时间
                meetingBaseInfoProvince:'',//所在省
                meetingBaseInfoCity:'',//所在市
                meetingBaseInfogArea:'',//所在区
                meetingBaseInfoAddress:'',//详细地址
                meetingBaseInfoCrtUserId:'',//
                meetingBaseInfoModUserId:'',//
                meetingBaseInfoCrtTime:'',//
                meetingBaseInfoModTime:'',//
                meetingBaseInfoStatus:'',//状态 0正常 1下线
                userName:'',//创建人
            }
            this.showChildPage = false
            this.creatOrEdit = 0
        },

    }
})