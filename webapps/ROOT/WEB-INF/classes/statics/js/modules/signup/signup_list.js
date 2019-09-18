var vm = new Vue({
    el: '#signup_list',
    data: {
        showSignupList: true, //会议报名列表
        showAddorEditPage: false,  // 新增或修改报名信息列表
        showSingupInfoPage: false, // 报名信息页面
        showInvitationCodePage: false, // 邀请码页面信息
        createInvitationCodePage: false, // 生成邀请码页面
        showEditInfoPage: false, // 编辑报名信息页面
        chooseMeeting: true, // 绑定会议按钮是否能点击
        creatOrEdit:0,//0新建  1修改
        isDelSpecialBtn: false,
        isShowCheckTime: false, // 是否显示签到时间
        // isShowMinus: false, // 自定义减项是否显示
        isToEdit: false, // 会议类型是否可选
        pickerOptions:{
            disabledDate(time) {
                return time.getTime() > Date.now();
            }
        }, 
        timeRange: [], //时间需要特殊处理,并且同步到searchForm
        timeRange2: [], //searchMeetingForm
        searchForm:{
            signUpTitle: '', //报名页面名称
            startTime:'',//
            endTime:'', //
            signUpStatus: '0',
        },
        tableData:[],
        //分页器相关
        pagination1: {
            currPage: 1,
            totalCount:0,
            totalPage:0,
            pageSize:10
        },

        // --------------------------新建报名表基本信息---------------
        checkinTime: [1567267200000],  //1567267200000
        signupForm: {
            signUpTitle: '', // 报名名称
            signUpMeetingType: '', //会议类型 0 定制会议  1 通用会议
            signUpMeetingId: '',// 关联会议详情ID
            signUpInvitationCode: '0', //是否使用邀请码 0是1否
            signUpExamine: '0', // 是否需要审核 0是1否
            signUpIsToCheck: '0', // 是否需要签到 0是1否
            signUpDate: '', // 签到日期
            signUpImg: '', // 头图图片
            signUpName: true, //姓名
            signUpMobileCode: true, //手机号+验证码
            signUpPosition: false, //职位
            signUpCompany: false, //公司
            signUpEmail: false, //邮箱
            signUpCustom: false,
            signUpStatus: '0', //0正常1删除
            signUpOldMeetingId: '', //0 定制会议  1 通用会议
            signUpOldMeetingType: '',
            signUpJson: [
            //     {
            //     sectionId:0,  //id
            //     sectionTitle:'', //自定义标题
            //     sectionStatus:'1', //0删除 1正常
            //     limit:1,  //限制数量
            //     itemList:[   //选项
            //     // {
            //     //     itemId:0,  //选项id
            //     //     itemText:'',  // 选项文本
            //     //     itemStatus:'1',  // 1正常 0删除
            //     //     ifShow:true,   // 前端是否显示
            //     //     ifChoose:false  // 报名人是否选择该项
            //     // }]
            // ]}
            ]
        },
        signupFormRules:{
            signUpTitle: [
                {required: true, message: '报名名称为必填项', trigger: 'change'}
            ],
            signUpMeetingType: [
                {required: true, message: '会议类型为必填项', trigger: 'change'}
            ],
            signUpMeetingId: [
                {required: true, message: '关联会议详情ID为必填项', trigger: 'change'}
            ],
            signUpInvitationCode: [
                {required: true, message: '是否使用邀请码为必填项', trigger: 'change'}
            ],
            signUpExamine: [
                {required: true, message: '是否需要审核为必填项', trigger: 'change'}
            ],
            signUpImg: [
                {required: true, message: '头图图片为必填项', trigger: 'change'}
            ],
            signUpIsToCheck: [
                {required: true, message: '是否需要签到为必填项', trigger: 'change'}
            ]
        },
        //会议基础信息表
        meetingBaseInfoForm: {
            meetingBaseInfoId: '',
            meetingBaseInfoMeetingId: '',
            meetingBaseInfoTitle: '',
            meetingBaseInfoStartTime:'',
            meetingBaseInfoEndTime:'',
            meetingBaseInfoSignUpStartTime:'',
            meetingBaseInfoSignUpEndTime: '',
            meetingBaseInfoProvince: '',
            meetingBaseInfoCity:'',
            meetingBaseInfogArea: '',
            meetingBaseInfoAddress:'',
        },
        // 会议列表相关
        isBindMeeting: true,
        showCommonMeetingList: false,
        searchMeetingForm: {
            meetingTitle:'',//标题
            startTime:'',//开始时间
            endTime:'',//结束时间
            meetingStatus: ['0','1','2'],
            meetingSignUpId: '-1'
        },
        commonMeetingTableData: [],
         //分页器相关
         pagination4: {
            currPage: 1,
            totalCount:0,
            totalPage:0,
            pageSize:10
        },
         //分页器相关
         pagination5: {
            currPage: 1,
            totalCount:0,
            totalPage:0,
            pageSize:10
        },
        //内容图库相关
        showCoverimgLib: false,
        searchCoverimgForm:{
            picTitle:'',
            picType:'0'//0封面图库 1内容图库 2图为图库
        },
        contentImgTableData:[],


        // 报名人列表信息
        // signupId: '',
        // 某个会议所有参会人信息搜索
        searchInfoForm:{
            signUpId:'',
            signUpInfoName: '',
            signUpInfoMobile: ''
        },
        isToExamine: '',
        //分页器相关
        pagination2: {
            currPage: 1,
            totalCount:0,
            totalPage:0,
            pageSize:10
        },
        tableInfoData: [
            {
                // signUpInfoId: 5,
                // signUpInfoName: '张三',
                // signUpInfoPosition: 'ali',
                // signUpInfoCompany: 'ali',
                // signUpInfoMobile: 'ali',
                // signUpInfoInvitationCode: 'uudfY6',
                // signUpInfoEmail: '10e8je@qq.com',
                // signUpInfoStatus: '0'
            }
        ],


        //----------------------编辑报名信息---------------
        searchDetailForm: {
            signUpIsToCheck:'', //0是1否
            signUpInfoName: '', //姓名
            signUpInfoMobile: '', //手机
            signUpInfoCrtTime:'',  // 报名时间
            signInEntities: [], //签到列表
            signUpInfoStatus: '', //状态 0 待审核 1 已审核
            signUpInfoJson:[
                // {
                // sectionId: '',
                // sectionTitle:'',
                // sectionStatus:'',
                // limit:1,
                // itemList:[
                //         {
                //             itemId:0,
                //             itemText:'LP',
                //             itemStatus:'1',
                //             ifShow:true,
                //             ifChoose:false,
                //          }]
                // }
            ]
        },
        //签到时间
        sign_up_date:'',
        signInTimeList:[
        // {
        //     timeDate:1567699200000,
        //     timeText:'2019-09-06',
        //     ifSignIn:false
        // }
        ],
        //签到结果
        signInResult:[],

        showAllBaseInfo: [], // 联表查询之后拼接的全部信息（基本信息+结果数据）
        checkBaseInfoJson: [], // 存储查询的报名列表基本信息Json
        resultSignUpJson: [], // 存储结果的json

        //邀请码管理页面
        searchCodeForm: {
            meetingInvitationCodeSignUpId: '', //报名id
            meetingInvitationCodeName: '', //名称
            meetingInvitationCodePerson: '', // 生成人
            meetingInvitationCodeMobile: '', //手机号
            meetingInvitationCodeStatus: '', //状态 0 未使用 1 已使用 2已删除
        },
        //分页器相关
        pagination3: {
            currPage: 1,
            totalCount:0,
            totalPage:0,
            pageSize:10
        },
        tableCodeData: [],

        //----------------------------生成邀请码 ------------------
        saveBtn: false,
        createCodeForm: {
            number: '',
            meetingInvitationCodePerson: '',
            meetingInvitationCodeSignUpId: ''
        },
        createCodeFormRules: {
            number: [
                {required: true, message: '数量为必填项', trigger: 'change'}
            ],
            meetingInvitationCodePerson: [
                {required: true, message: '生成人为必填项', trigger: 'change'}
            ]
        },
        // 新生成的邀请码 
        ids: [],
    },
    watch: {
        timeRange (val) {
            if (val) {
                this.searchForm.startTime = val[0]
                this.searchForm.endTime = val[1]
            } else {
                this.searchForm.startTime = ''
                this.searchForm.endTime = ''
            }
        },
        timeRange2 (val) {
            if (val) {
                this.searchMeetingForm.startTime = val[0]
                this.searchMeetingForm.endTime = val[1]
            } else {
                this.searchMeetingForm.startTime = ''
                this.searchMeetingForm.endTime = ''
            }
        },
        checkinTime(val) {
            // console.log(val)
        }
    },
    
    created () {
        this.startSearch(0)
    },
    methods:{

        // ----------------------------------------报名列表首页---------------------------------
        handleCurrentChange(val){
            this.pagination1.currPage = val
            this.startSearch() 
        },
        //开始搜索列表
        startSearch(type){
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchForm))
            data.signUpTitle = data.signUpTitle.toString().trim()
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
                url: "/signUp/list",
                contentType: "application/json",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.tableData = res.page.list
                        for (let i = 0; i < self.tableData.length; i++){
                            self.tableData[i].signUpLink = "https://m.chinaventure.com.cn/signup/signupinfo.html?signUpId="+self.tableData[i].signUpId
                            
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
        //新建或修改报名信息 type:0  新增   type:1修改
        addOrEditSignup(type,item){
            var self = this
            self.creatOrEdit = type
            if (type == 0) {
                self.showAddorEditPage = true
                self.showSignupList = false
            } else if (type == 1) {
                // console.log(item)
                self.getEditMeetingOrign(item.signUpMeetingType, item.signUpMeetingId)
                $.ajax({
                    type: "POST",
                    url: "/signUp/info/" + item.signUpId.toString(),
                    contentType: "application/json",
                    dataType: "json",
                    success: function(res){
                        // console.log(res)
                        if(res.code == 200){
                            //json64反解
                            let data = res.dict
                            let map = $.base64.atob(data.signUpJson, true)
                            data.signUpJson = JSON.parse(map)
                            self.signupForm = data
                            self.signupForm.signUpOldMeetingId = self.signupForm.signUpMeetingId
                            self.signupForm.signUpOldMeetingType = self.signupForm.signUpMeetingType
                            if(self.signupForm.signUpDate !== '#') {
                                var result = self.signupForm.signUpDate.split(",");
                                for(var i = 0; i< result.length; i++) {
                                    self.checkinTime.push(Number(result[i]))
                                }
                            } else if(self.signupForm.signUpDate == '#') {
                                self.checkinTime= [1567267200000]
                            }
                            self.checkinTime.shift()
                            self.signupForm.signUpMobileCode = JSON.parse(self.signupForm.signUpMobileCode)
                            self.signupForm.signUpEmail = JSON.parse(self.signupForm.signUpEmail)
                            self.signupForm.signUpName = JSON.parse(self.signupForm.signUpName)
                            self.signupForm.signUpCompany = JSON.parse(self.signupForm.signUpCompany)
                            self.signupForm.signUpPosition = JSON.parse(self.signupForm.signUpPosition)
                            self.signupForm.signUpCustom = JSON.parse(self.signupForm.signUpCustom)
                            self.showSignupList = false
                            self.showAddorEditPage = true
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
        //数据反显
        getEditMeetingOrign(type, id) {
            var self = this
            if(type == "0") {
                var reqUrl = "/meeting/special/info/"
            } else if(type == "1") {
                var reqUrl = "/meetingInfo/info/"
            }
            $.ajax({
                type: "POST",
                url: reqUrl + id.toString(),
                contentType: "application/json",
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        // console.log('请求修改的会议返回结果：',res.dict)
                        self.showMeetingBaseInfo(res.dict.meetingBaseInfoId)
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
         //重新编辑会议返显基础信息表
         showMeetingBaseInfo(id){
            var self = this
            $.ajax({
				type: "POST",
                url: '/meetingBaseInfo/info/'+id.toString(),
                contentType: "application/json",
			    dataType: "json",
			    success: function(res){
					if(res.code == 200){
                        var data = res.dict
                        self.meetingBaseInfoForm.meetingBaseInfoTitle = data.meetingBaseInfoTitle
                        if(data.meetingBaseInfoStartTime == '') {
                            self.meetingBaseInfoForm.meetingBaseInfoStartTime = ''
                        } else {
                            self.meetingBaseInfoForm.meetingBaseInfoStartTime = self.transformTime(parseInt(data.meetingBaseInfoStartTime))
                        }
                        if(data.meetingBaseInfoEndTime == '') {
                            self.meetingBaseInfoForm.meetingBaseInfoEndTime = ''
                        } else {
                            self.meetingBaseInfoForm.meetingBaseInfoEndTime = self.transformTime(parseInt(data.meetingBaseInfoEndTime))
                        }
                        if(data.meetingBaseInfoSignUpEndTime == '') {
                            self.meetingBaseInfoForm.meetingBaseInfoSignUpEndTime = ''
                        } else {
                            self.meetingBaseInfoForm.meetingBaseInfoSignUpEndTime = self.transformTime(parseInt(data.meetingBaseInfoSignUpEndTime))
                        }
                        if(data.meetingBaseInfoSignUpStartTime == '') {
                            self.meetingBaseInfoForm.meetingBaseInfoSignUpStartTime = ''
                        } else {
                            self.meetingBaseInfoForm.meetingBaseInfoSignUpStartTime = self.transformTime(parseInt(data.meetingBaseInfoSignUpStartTime))
                        }
                        self.meetingBaseInfoForm.meetingBaseInfoProvince = data.meetingBaseInfoProvince
                        self.meetingBaseInfoForm.meetingBaseInfoCity =data.meetingBaseInfoCity
                        self.meetingBaseInfoForm.meetingBaseInfoArea = data.meetingBaseInfoArea
                        self.meetingBaseInfoForm.meetingBaseInfoAddress = data.meetingBaseInfoAddress
                        self.backToEdit2()
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

        // 删除报名信息
        deleteThisSignup(item) {
            var self = this
            self.$confirm('确实要删除该报名信息吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // console.log(item)
                item.signUpOldMeetingType = item.signUpMeetingType
                item.signUpOldMeetingId = item.signUpMeetingId
                var data = JSON.parse(JSON.stringify(item))
                // console.log(data)
                data.signUpStatus = "1"
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/signUp/update",
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



        // --------------------------------新建报名列表部分---------------------------------------
        

        // 选择会议类型
        changeLabel(val){
            var self = this
            self.isBindMeeting = false
            self.signUpMeetingType = val
            if(self.signupForm.signUpMeetingId !== ''){
                self.signupForm.signUpMeetingId = ''
                self.meetingBaseInfoForm = {
                    meetingBaseInfoId: '',
                    meetingBaseInfoMeetingId: '',
                    meetingBaseInfoTitle: '',
                    meetingBaseInfoStartTime:'',
                    meetingBaseInfoEndTime:'',
                    meetingBaseInfoSignUpStartTime:'',
                    meetingBaseInfoSignUpEndTime: '',
                    meetingBaseInfoProvince: '',
                    meetingBaseInfoCity:'',
                    meetingBaseInfogArea: '',
                    meetingBaseInfoAddress:'',
                }
            }
        },
        // 点击绑定会议按钮打开不同的会议列表
        bindMeeting(){
            var self = this
            // console.log(self.signupForm)
            self.searchMeeting()
            self.showCommonMeetingList = true
        },
        handleCurrentChange5 (val) {
            this.pagination5.currPage = val
            this.searchMeeting() 
        },
        // 搜索通用会议列表
        searchMeeting(type){
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchMeetingForm))
            data.meetingTitle = data.meetingTitle.toString().trim()
            if (type == 0) {
                Object.assign(data,{
                    page: '1',
                    limit: self.pagination5.pageSize.toString()
                })
            } else {
                Object.assign(data,{
                    page: self.pagination5.currPage.toString(),
                    limit: self.pagination5.pageSize.toString()
                })
            }
            if(self.signupForm.signUpMeetingType == 0) {
                var reqUrl = "/meeting/special/list"
            } else if(self.signupForm.signUpMeetingType == 1) {
                var reqUrl = "/meetingInfo/list"
            }
            $.ajax({
				type: "POST",
                url: reqUrl,
                contentType: "application/json",
			    data: JSON.stringify(data),
			    dataType: "json",
			    success: function(res){
					if(res.code == 200){
                        self.commonMeetingTableData = res.page.list
                        for (let i = 0; i < self.commonMeetingTableData.length; i++){
                            self.commonMeetingTableData[i].meetingStarTime = self.transformTime(parseInt(self.commonMeetingTableData[i].meetingStarTime))
                            self.commonMeetingTableData[i].meetingEndTime = self.transformTime(parseInt(self.commonMeetingTableData[i].meetingEndTime))
                            self.commonMeetingTableData[i].meetingModTime = self.transformTime(parseInt(self.commonMeetingTableData[i].meetingModTime))
                        }
                        self.pagination5 = {
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

       

        // 绑定会议
        addThisMeeting(item){
            var self = this
            self.signupForm.signUpMeetingId = item.meetingId
            $.ajax({
				type: "POST",
                url: '/meetingBaseInfo/info/'+item.meetingBaseInfoId.toString(),
                contentType: "application/json",
			    dataType: "json",
			    success: function(res){
					if(res.code == 200){
                        var data = res.dict
                        self.meetingBaseInfoForm.meetingBaseInfoTitle = data.meetingBaseInfoTitle
                        if(data.meetingBaseInfoStartTime == '') {
                            self.meetingBaseInfoForm.meetingBaseInfoStartTime = ''
                        } else {
                            self.meetingBaseInfoForm.meetingBaseInfoStartTime = self.transformTime(parseInt(data.meetingBaseInfoStartTime))
                        }
                        if(data.meetingBaseInfoEndTime == '') {
                            self.meetingBaseInfoForm.meetingBaseInfoEndTime = ''
                        } else {
                            self.meetingBaseInfoForm.meetingBaseInfoEndTime = self.transformTime(parseInt(data.meetingBaseInfoEndTime))
                        }
                        if(data.meetingBaseInfoSignUpEndTime == '') {
                            self.meetingBaseInfoForm.meetingBaseInfoSignUpEndTime = ''
                        } else {
                            self.meetingBaseInfoForm.meetingBaseInfoSignUpEndTime = self.transformTime(parseInt(data.meetingBaseInfoSignUpEndTime))
                        }
                        if(data.meetingBaseInfoSignUpStartTime == '') {
                            self.meetingBaseInfoForm.meetingBaseInfoSignUpStartTime = ''
                        } else {
                            self.meetingBaseInfoForm.meetingBaseInfoSignUpStartTime = self.transformTime(parseInt(data.meetingBaseInfoSignUpStartTime))
                        }
                        self.meetingBaseInfoForm.meetingBaseInfoProvince = data.meetingBaseInfoProvince
                        self.meetingBaseInfoForm.meetingBaseInfoCity =data.meetingBaseInfoCity
                        self.meetingBaseInfoForm.meetingBaseInfoArea = data.meetingBaseInfoArea
                        self.meetingBaseInfoForm.meetingBaseInfoAddress = data.meetingBaseInfoAddress
                        self.backToEdit2()
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


        //返回编辑页
        backToEdit2 (){
            this.showCommonMeetingList = false
            this.showAddorEditPage = true
            this.searchMeetingForm = {
                meetingTitle:'',//标题
                startTime:'',//开始时间
                endTime:'',//结束时间
                meetingStatus: ['0','1','2'],
                meetingSignUpId: '-1'
            }
            this.timeRange2 = []
            this.commonMeetingTableData = []
        },
        //头图图片
        chooseCovertImg() {
            this.showCoverimgLib = true
            this.searchCoverImg(0)
        },
        handleCurrentChange4(val){
            this.pagination4.currPage = val
            this.searchCoverImg() 
        },
        //搜索内容图库
        searchCoverImg(type){
            var self = this
            var data = JSON.parse(JSON.stringify(this.searchCoverimgForm))
            data.picTitle = data.picTitle.trim()
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
                contentType: "application/json",
                url: "/picture/list",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.contentImgTableData = res.page.list
                        self.pagination4 = {
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
        //选择了某一张封面图片
        addThisCoverImg (item) {
            this.signupForm.signUpImg = item.picUrl
            this.backToEdit()
        },
         //返回编辑页
         backToEdit (){
            this.showCoverimgLib = false
            this.showArticleDetail = true
            this.searchCoverimgForm = {
                picTitle:'',
                picType:'0'//0封面图库 1内容图库 2图为图库
            }
            this.contentImgTableData = []
        },
        
        //添加签到日期
        addOptions() {
            var self = this
            var len = self.checkinTime.length
            if(len >= 3) {
                self.$message.error('签到日期最多设置三天')
                return
            }
            if(self.checkinTime[len-1] !== '') {
                self.checkinTime.push('')
            } else {
                self.$message.error('请完成上一个自定义选项')
            }
            
        },
        //删除签到日期
        delOptions(index) {
            var self =this
            if(self.checkinTime.length <= 1) {
                self.checkinTime = [null]
                return
            } else {
                self.checkinTime.splice(index,1)
            }
        },
        changeSelfOpt(){
            var self = this
            if(self.signupForm.signUpCustom == true){
                var dataLength = self.signupForm.signUpJson.length
                var id = dataLength-1
                var showArr = []
                for(var k = 0; k < dataLength; k++) {
                    if(self.signupForm.signUpJson[k].sectionStatus == '1'){
                        showArr.push(self.signupForm.signUpJson[k])
                    }
                }
                if(showArr.length == 0) {
                    self.signupForm.signUpJson.push({
                        sectionId: id+1,
                        sectionTitle:'',
                        sectionStatus:'1',
                        limit:1,
                        itemList:[]
                    })
                }
            } 
        },
        //添加整条自定义选项
        addSelfOptions () {
            var self = this
            var dataLength = self.signupForm.signUpJson.length
            var id = dataLength-1
            var numReg = /^([1-9]\d*|[0]{1,1})$/;
            var optionIndex = self.signupForm.signUpJson[dataLength-1]
           
                    if(optionIndex.sectionStatus == '1') {
                        if(optionIndex.sectionTitle.trim() == ''){
                            self.$message.error('标题不能为空')
                        } else if(Number(optionIndex.limit) == NaN || (!numReg.test(Number(optionIndex.limit)) && optionIndex.limit.trim !=="")) {
                            self.$message.error("最大选项值必须为正整数")
                            return
                        } else if(Number(optionIndex.limit) > optionIndex.itemList.length) {
                            self.$message.error('最大选项值不能大于选项数量')
                            return
                        } else if(optionIndex.limit == '') {
                            optionIndex.limit = '1'
                        }else if(optionIndex.itemList.length > 0 && optionIndex.itemList[optionIndex.itemList.length-1].itemText.trim() == '') {
                            self.$message.error('请完成上一个具体选项的内容')
                            return
                        }
                        else {
                            self.signupForm.signUpJson.push({
                                sectionId: id+1,
                                sectionTitle:'',
                                sectionStatus:'1',
                                limit:1,
                                itemList:[]
                            })
                            // console.log(self.signupForm.signUpJson)
                        }
                    } else if(optionIndex.sectionStatus == '0') {
                        self.signupForm.signUpJson.push({
                            sectionId: id+1,
                            sectionTitle:'',
                            sectionStatus:'1',
                            limit:1,
                            itemList:[]
                        })
                    }
            
        },
        //删除整条自定义选项
        delSelfOptions () {
            var self = this
            var dataLength = self.signupForm.signUpJson.length
            // console.log(dataLength)
            if(self.creatOrEdit == '0') {
                if(dataLength == 1) {
                    self.signupForm.signUpJson.pop()
                    self.signupForm.signUpCustom = false
                } else {
                    self.signupForm.signUpJson.pop()
                }
            } else if(self.creatOrEdit == '1') {
                // var len = dataLength-1
                // for(var i = len; i >= 0; i--){
                //     if(self.signupForm.signUpJson[i].sectionStatus == '1') {
                //         self.signupForm.signUpJson[i].sectionStatus = '0'
                //         return
                //     } else if(self.signupForm.signUpJson[i].sectionStatus == '0') {
                //         for(var k = i-1; k >= 0; k--){
                //             if(k > 0 && self.signupForm.signUpJson[k].sectionStatus == '1') {
                //                 self.signupForm.signUpJson[k].sectionStatus = '0'
                //                 return
                //             } if(k == 0) {
                //                 self.signupForm.signUpJson[k].sectionStatus == '0'
                //                 self.signupForm.signUpCustom = false
                //                 // self.signupForm.signUpJson.push({
                //                 //     sectionId: id+1,
                //                 //     sectionTitle:'',
                //                 //     sectionStatus:'1',
                //                 //     limit:1,
                //                 //     itemList:[]
                //                 // })
                //             }
                //         }
                //         // console.log(self.signupForm.signUpJson)
                //     }
                // }

                var statusTrueArr = []
                for(var i = 0; i < dataLength; i++){
                    if(self.signupForm.signUpJson[i].sectionStatus == '1') {
                        statusTrueArr.push(self.signupForm.signUpJson[i])
                    }
                }
                // console.log(statusTrueArr)
                // console.log(self.signupForm.signUpJson)
                if(statusTrueArr.length == 1) {
                    for(var i = 0; i < dataLength; i++) {
                        if(self.signupForm.signUpJson[i].sectionId == statusTrueArr[0].sectionId){
                            self.signupForm.signUpJson[i].sectionStatus = '0'
                            self.signupForm.signUpCustom = false
                            return
                        }
                    }
                } else if(statusTrueArr.length > 1) {
                    for(var i = dataLength-1; i >0; i-- ){
                        for(var k = statusTrueArr.length-1; k> 0; k--){
                            // console.log(self.signupForm.signUpJson[i].sectionId)
                            // console.log(statusTrueArr[k].sectionId)
                            if(self.signupForm.signUpJson[i].sectionId == statusTrueArr[k].sectionId){
                                self.signupForm.signUpJson[i].sectionStatus = '0'
                                return
                            }
                        }
                        
                    }
                   
                }
            }


        },
        //添加具体的选项
        addSpecialOptions(index) {
            var self = this
            var len = self.signupForm.signUpJson[index].itemList.length
            var specialOptIndex = self.signupForm.signUpJson[index].itemList[len-1]
            var id = len-1
            if(len == 0 ) {
                self.signupForm.signUpJson[index].itemList.push({
                    itemId: id+1,
                    itemText:'',
                    itemStatus:'1',
                    ifShow:true,
                    ifChoose:false
                })
            } else if(len > 0 && len < 20) {
                self.isDelSpecialBtn = false
                if(specialOptIndex.itemStatus == '1') {
                    if(specialOptIndex.itemText.trim() !== ''){
                        self.signupForm.signUpJson[index].itemList.push({
                            itemId: id+1,
                            itemText:'',
                            itemStatus:'1',
                            ifShow:true,
                            ifChoose:false
                        })
                    } else {
                        self.$message.error('请完成上一个具体选项')
                    }
                } else if(specialOptIndex.itemStatus == '0') {
                    self.signupForm.signUpJson[index].itemList.push({
                        itemId: id+1,
                        itemText:'',
                        itemStatus:'1',
                        ifShow:false,
                        ifChoose:false
                    })
                }
            } else if(len >=20) {
                self.$message.error('选项数量不能超过20')
                return
            }
        },
        //删除具体的选项
        delSpecialOptions(index){
            var self = this
            var len = self.signupForm.signUpJson[index].itemList.length
                if(self.creatOrEdit == '0') {
                   if(len == 1) {
                    self.isDelSpecialBtn = true
                   } else {
                    self.isDelSpecialBtn = false
                    self.signupForm.signUpJson[index].itemList.pop() 
                   }
                } else if (self.creatOrEdit == '1') {
                    for(var i = len-1; i >= 0; i--){
                        if(self.signupForm.signUpJson[index].itemList[i].itemStatus == '1') {
                            self.signupForm.signUpJson[index].itemList[i].itemStatus = '0'
                            return
                        } else if(self.signupForm.signUpJson[index].itemList[i].itemStatus == '0') {
                            for(var k = i-1; k >= 0; k--){
                                if(self.signupForm.signUpJson[index].itemList[k].itemStatus == '1') {
                                    self.signupForm.signUpJson[index].itemList[k].itemStatus = '0'
                                    return
                                } 
                            }
                        }
                    }
                }
        },
        // 保存新建报名
        //保存
        testSubmit (formName) {
            var self = this
            self.$refs[formName].validate((valid) => {
                if (valid) {
                    if(self.signupForm.signUpIsToCheck == '0') {
                        for(var i = 0; i < self.checkinTime.length; i++) {
                            if(self.checkinTime[i] == null) {
                                self.$message.error('签到时间不能为空')
                                return
                            } else if (self.checkinTime[i] < 0) {
                                self.$message.error("签到日期需设置在1970年1月1日北京时间8点之后")
                                return
                            } else {
                                if(self.checkinTime.length == 2 && (Number(self.checkinTime[0]) == Number(self.checkinTime[1]))) {
                                    self.$message.error('签到时间不能重复')
                                    return
                                } else if(self.checkinTime.length == 3 && (Number(self.checkinTime[0]) == Number(self.checkinTime[1]))|| (Number(self.checkinTime[1]) == Number(self.checkinTime[2])) || (Number(self.checkinTime[0]) == Number(self.checkinTime[2]))) {
                                    self.$message.error('签到时间不能重复')
                                    return
                                }
                            }
                        } 
                    } else if(self.signupForm.signUpIsToCheck == '1') {
                        self.checkinTime =[1567267200000]
                    }
                    let validOptions = []
                    for(var i = 0; i < self.signupForm.signUpJson.length; i++){
                        if(self.signupForm.signUpJson[i].sectionStatus == '1'){
                            validOptions.push(self.signupForm.signUpJson[i].sectionStatus)
                        }
                    }
                    if(validOptions.length > 20) {
                        self.$message.error('选项不能超过20')
                        return
                    }
                     //验证自定义选项是否填写完成
                     var numReg = /^([1-9]\d*|[0]{1,1})$/;
                    if(self.signupForm.signUpCustom == true) {
                        for (let i = 0; i < self.signupForm.signUpJson.length; i++) {
                            if(self.signupForm.signUpJson[i].sectionStatus == '1'){
                                if (self.signupForm.signUpJson[i].sectionTitle.trim() == '' || (self.signupForm.signUpJson[i].itemList.length > 0 && self.signupForm.signUpJson[i].itemList[0].itemText.trim() == '')) {
                                    self.$message.error('还有选项未填写完成')
                                    return
                                } else if (self.signupForm.signUpJson[i].limit == ''){
                                    self.signupForm.signUpJson[i].limit = '1'
                                } else if (Number(self.signupForm.signUpJson[i].limit) == NaN || (!numReg.test(Number(self.signupForm.signUpJson[i].limit)) && self.signupForm.signUpJson[i].limit.trim !=="")){
                                    self.$message.error("最大选项值必须为正整数")
                                    return
                                } else if( self.signupForm.signUpJson[i].itemList.itemStatus == '1'){
                                    if (Number(self.signupForm.signUpJson[i].limit) > self.signupForm.signUpJson[i].itemList.length) {
                                        self.$message.error('最大选项值不能大于选项数量')
                                        return
                                    }
                                }
                                
                            }
                            
                        }

                    }
                    self.submitCreatEdit()
                }
            })
        },
        submitCreatEdit() {
            var self = this
            if(self.checkinTime[0] == null){
                self.signupForm.signUpDate = '#'
            } else {
                self.signupForm.signUpDate = self.checkinTime.join(',')
            }
            var data = JSON.parse(JSON.stringify(self.signupForm))
            // console.log('准备提交保存的Form',data)
            $.base64.utf8encode = true;
            var jsonString = JSON.stringify(data.signUpJson);
            var json64 = $.base64.btoa(jsonString);
            data.signUpJson = json64
            if (self.creatOrEdit == 0) {
                var reqUrl = '/signUp/save'
            } else if (self.creatOrEdit == 1) {
                var reqUrl = '/signUp/update'
            }
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
                        self.closeCreatOrEdit('signupForm')
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
         //关闭编辑页面
         closeCreatOrEdit(formName){
            this.checkinTime = [null],
            this.creatOrEdit = 0
            this.$refs[formName].resetFields();
            this.signupForm = {
                signUpTitle: '', // 报名名称
                signUpMeetingType: '', //会议类型 1通用会议 0定制会议
                signUpMeetingId: '',// 关联会议详情ID
                signUpInvitationCode: '', //是否使用邀请码 0是1否
                signUpExamine: '', // 是否需要审核 0是1否
                signUpDate: '', // 签到日期
                signUpImg: '', // 头图图片
                signUpName: true, //姓名
                signUpMobileCode: true, //手机号+验证码
                signUpPosition: false, //职位
                signUpCompany: false, //公司
                signUpEmail: false, //邮箱
                signUpCustom: false,
                signUpJson: [{
                    sectionId:0,
                    sectionTitle:'',
                    sectionStatus:'1',
                    limit:1,
                    itemList:[]
                }]
            },
            this.meetingBaseInfoForm = {
                meetingBaseInfoId: '',
                meetingBaseInfoMeetingId: '',
                meetingBaseInfoTitle: '',
                meetingBaseInfoStartTime:'',
                meetingBaseInfoEndTime:'',
                meetingBaseInfoSignUpStartTime:'',
                meetingBaseInfoSignUpEndTime: '',
                meetingBaseInfoProvince: '',
                meetingBaseInfoCity:'',
                meetingBaseInfogArea: '',
                meetingBaseInfoAddress:'',
            }
            this.showAddorEditPage = false
            this.showSignupList = true
        },

        // -----------------------报名用户列表搜索区开始-----------------------------------------
        handleCurrentChange2(val){
            this.pagination2.currPage = val
            this.startSearchInfo() 
        },
        checkSignupDetail(item) {
            var self =this
            self.searchInfoForm.signUpId = item.signUpId
            self.isToExamine = item.signUpExamine
            self.showSignupList = false
            self.showSingupInfoPage = true
            self.startSearchInfo()
        },
        //开始搜索报名用户列表
        startSearchInfo(type){
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchInfoForm))
            data.signUpInfoName = data.signUpInfoName.toString().trim()
            data.signUpInfoMobile = data.signUpInfoMobile.toString().trim()
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
                url: "/signUpInfo/list",
                contentType: "application/json",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.tableInfoData = res.page.list
                        self.pagination2 = {
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
        closeInvitationCodePage(formName){
            this.searchCodeForm = {
                meetingInvitationCodeSignUpId: '', //报名id
                meetingInvitationCodeName: '', //名称
                meetingInvitationCodePerson: '', // 生成人
                meetingInvitationCodeMobile: '', //手机号
                meetingInvitationCodeStatus: '', //状态 0 未使用 1 已使用 2已删除
            }
            this.tableCodeData =[]
            this.showInvitationCodePage = false
            this.showSignupList = true
        },


        // 控制审核是否通过的按钮
        changeSignupStatus(item){
            var self = this
            var changeStatus = ''
            if(item.signUpInfoStatus == '0'){
                changeStatus = '1'
            } else if(item.signUpInfoStatus == '1') {
                changeStatus = '0'
            }
            var data1 = {
                signUpId: item.signUpId,
                signUpInfoId: item.signUpInfoId,
                signUpInfoMobile: item.signUpInfoMobile,
                signUpInfoUserId: item.signUpInfoUserId,
                signUpInfoStatus: changeStatus
            }
            var data = JSON.parse(JSON.stringify(data1))
            $.ajax({
                type: "POST",
                url: "/signUpInfo/updateStatus",
                contentType: "application/json",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.searchInfoForm= {
                            signUpId: item.signUpId,
                            signUpInfoName: '',
                            signUpInfoMobile: ''
                        }
                        self.startSearchInfo()
                        
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
      
        // 具体参会人信息编辑
        editsignupInfo(item){
            var self = this
            $.ajax({
                type: "POST",
                url: "/signUp/info/" + item.signUpId.toString(),
                contentType: "application/json",
                dataType: "json",
                success: function(res){
                    // console.log('联表查询的报名信息', res)
                    if(res.code == 200){
                        //json64反解
                        let data = res.dict
                        let map = $.base64.atob(data.signUpJson, true)
                        data.signUpJson = JSON.parse(map)
                        self.searchDetailForm.signUpIsToCheck = data.signUpIsToCheck
                        self.isShowCheckTime = (self.searchDetailForm.signUpIsToCheck == '0')
                        // console.log(self.isShowCheckTime)
                        self.renderTimeList(data.signUpDate)
                        self.checkBaseInfoJson = JSON.parse(JSON.stringify(data.signUpJson))
                        self.checkResultInfo(item.signUpInfoId.toString())

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
           
        },
        // 签到时间
        //组合签到时间基本数据
        renderTimeList (data) {
            var self = this
            let tempArr = data.split(',')
            // console.log(tempArr)
            for (let i = 0; i < tempArr.length; i++) {
                self.signInTimeList.push({
                    timeDate: parseFloat(tempArr[i]),
                    timeText: self.transformTime2(parseInt(tempArr[i])),
                    ifSignIn: false
                })
            }
            // console.log(this.signInTimeList)
        },
        // 联表查报名信息
        checkResultInfo(id){
            var self = this
            $.ajax({
                type: "POST",
                url: "/signUpInfo/info/"+id,
                contentType: "application/json",
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                         //json64反解
                         let data = res.dict
                         let map = $.base64.atob(data.signUpInfoJson, true)
                         data.signUpInfoJson = JSON.parse(map)
                        //  console.log('报名信息返回列表', data)
                        //  data.signInEntities = ['1568131290000']
                        // console.log(self.signInTimeList)
                        for(var i = 0; i < data.signInEntities.length; i++) {
                            for(var k = 0; k < self.signInTimeList.length; k++) {
                                if(data.signInEntities[i].signInTime == self.signInTimeList[k].timeDate) {
                                    self.signInTimeList[k].timeText = self.transformTime(parseInt(data.signInEntities[i].signInDate))
                                    self.signInTimeList[k].ifSignIn = true
                                }
                            }
                        }

                         // 更新ifChoose状态
                         self.resultSignUpJson = JSON.parse(JSON.stringify(data.signUpInfoJson))
                         for(var i = 0; i < self.resultSignUpJson.length; i++) {
                             for(var k = 0; k < self.checkBaseInfoJson.length; k++) {
                                 if(self.resultSignUpJson[i].sectionId == self.checkBaseInfoJson[k].sectionId) {
                                     for(var m = 0; m < self.resultSignUpJson[i].itemList.length; m++) {
                                         for(var n = 0; n < self.checkBaseInfoJson[k].itemList.length; n++) {
                                             if(self.resultSignUpJson[i].itemList[m].itemId == self.checkBaseInfoJson[k].itemList[n].itemId){
                                                 self.checkBaseInfoJson[k].itemList[n].ifChoose = self.resultSignUpJson[i].itemList[m].ifChoose
                                             }
                                         }
                                     }
                                 }
                             }
                         }
                         self.searchDetailForm = JSON.parse(JSON.stringify(data))
                         self.showAllBaseInfo = JSON.parse(JSON.stringify(self.checkBaseInfoJson))
                        //  console.log(data)
                        //  console.log(self.searchDetailForm)
                        //  console.log(self.checkBaseInfoJson)
                        //  console.log('反显拼好的数据',self.showAllBaseInfo)
                         self.showSingupInfoPage = false
                         self.showEditInfoPage = true
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
           
        },
        //更新签到时间
        updateSigninTime() {

        },


        //保存
        testSubmit2 (formName) {
            var self = this
            // console.log(self.searchDetailForm.signUpInfoJson)
            // console.log(self.showAllBaseInfo)
            // for(var i = 0; i < self.searchDetailForm.signUpInfoJson.length; i++) {
            //     for(var k = 0; k < self.showAllBaseInfo.length; k++) {
            //         if(self.searchDetailForm.signUpInfoJson[i].sectionId == self.showAllBaseInfo[k].sectionId) {
            //             for(var m = 0; m < self.searchDetailForm.signUpInfoJson[i].itemList.length; m++) {
            //                 for(var n = 0; n < self.showAllBaseInfo[k].itemList.length; n++) {
            //                     if(self.searchDetailForm.signUpInfoJson[i].itemList[m].itemId == self.showAllBaseInfo[k].itemList[n].itemId){
            //                         self.searchDetailForm.signUpInfoJson[i].itemList[m].ifChoose =self.showAllBaseInfo[k].itemList[n].ifChoose
            //                     }
            //                 }
            //             }
            //         }
    
            //     }
            // }
            self.searchDetailForm.signUpInfoJson = JSON.parse(JSON.stringify(self.showAllBaseInfo))
            // console.log(self.searchDetailForm.signUpInfoJson)
            var data = JSON.parse(JSON.stringify(self.searchDetailForm))
            // console.log(data)
            $.base64.utf8encode = true;
            var jsonString = JSON.stringify(data.signUpInfoJson);
            var json64 = $.base64.btoa(jsonString);
            data.signUpInfoJson = json64
            $.ajax({
                type: "POST",
                url: "/signUpInfo/update",
                contentType: "application/json",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.$message.success('保存成功')
                        self.startSearchInfo()
                        self.closeCreatOrEdit2('searchDetailForm')
                        self.signInTimeList =[]
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
         //关闭编辑页面
         closeCreatOrEdit2(formName){
            this.searchDetailForm = {
                signUpInfoName: '', //姓名
                signUpInfoMobile: '', //手机
                signUpInfoCrtTime:'',  // 报名时间
                signInEntities: [], //签到列表
                signUpInfoJson:[{
                    sectionId: '',
                    sectionTitle:'',
                    sectionStatus:'1', 
                    limit:1,
                    itemList:[]
                }]
            }
            this.signInTimeList =[]
            this.showEditInfoPage= false
            this.showSingupInfoPage = true
        },




        //--------------------------------------------邀请码信息------------------------------------
        handleCurrentChange3(val){
            this.pagination3.currPage = val
            this.startSearchCode() 
        },
        checkInvitationCode(item) {
            var self = this
            self.searchCodeForm.meetingInvitationCodeSignUpId = item.signUpId
            self.showSignupList = false
            self.showInvitationCodePage = true
            self.startSearchCode()
        },
        // 开始搜索邀请码
        startSearchCode(type) {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchCodeForm))
            data.meetingInvitationCodeName = data.meetingInvitationCodeName.toString().trim()
            data.meetingInvitationCodeMobile = data.meetingInvitationCodeMobile.toString().trim()
            data.meetingInvitationCodePerson = data.meetingInvitationCodePerson.toString().trim()
            // console.log(data)
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
                url: "/meetingInvitationCode/list",
                contentType: "application/json",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.tableCodeData = res.page.list
                        self.pagination3 = {
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

        //下载全部邀请码
        downloadInvitaionCode() {
            var self = this
            // $.ajax({
            //     type: "GET",
                // url: "/meetingInvitationCode/excelsCode?meetingInvitationCodeSignUpId="+self.searchCodeForm.meetingInvitationCodeSignUpId,
                // contentType: "application/json",
                // dataType: "string",
                // complete: function() {
                    window.open("/meetingInvitationCode/excelsCode?meetingInvitationCodeSignUpId="+self.searchCodeForm.meetingInvitationCodeSignUpId)
                // }
            // })
        },

        // --------------------------生成邀请码页面--------------------
        createInvitaionCode() {
            this.showInvitationCodePage = false
            this.createInvitationCodePage = true
        },
        saveCreateCodeForm(formName) {
            var self = this
            self.$refs[formName].validate((valid) => {
                if(valid) {
                    self.saveBtn = true
                    var data = {
                        meetingInvitationCodeSignUpId: self.searchCodeForm.meetingInvitationCodeSignUpId,
                        number: self.createCodeForm.number,
                        meetingInvitationCodePerson: self.createCodeForm.meetingInvitationCodePerson,
                    }
                    $.ajax({
                        type: "POST",
                        url: '/meetingInvitationCode/codes',
                        contentType: "application/json",
                        data: JSON.stringify(data),
                        dataType: "json",
                        success: function(res) {
                            if(res.code == 200) {
                                self.$message.success('生成成功')
                                let arr = res.array
                                for(var i = 0; i < arr.length; i++){
                                    self.ids.push(arr[i].meetingInvitationCodeId)
                                }
                                // console.log(self.ids.join(','))
                                self.downloadNewCreatedCode(self.ids.join(','))
                                self.startSearchCode()
                                self.closeCreateCode('createCodeForm')
                                self.saveBtn = false
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
                   
                }
            })
        },

        downloadNewCreatedCode(id){
            var self = this
            var data = JSON.parse(JSON.stringify(id))
            // $.ajax({
            //     type: "GET",
            //     url: "/meetingInvitationCode/excelsCodeIds?ids=" + data,
            //     contentType: "application/json",
            //     // data: JSON.stringify(data),
            //     dataType: "string",
            //     complete: function() {
                    window.parent.open("/meetingInvitationCode/excelsCodeIds?ids="+data)
                    self.ids = []
            //     }
            // })
        },
        // 取消生成邀请码页面
        closeCreateCode(formName) {
            this.$refs[formName].resetFields()
            this.createCodeForm = {
                number:'',
                crtUser: ''
            }
            this.createInvitationCodePage = false
            this.showInvitationCodePage = true
        },


        // 下载参会信息
        downloadInfo() {
            var self = this
            // $.ajax({
            //     type: "GET",
            //     url: "/meetingInvitationCode/excels?meetingInvitationCodeSignUpId="+self.searchInfoForm.signUpId,
            //     contentType: "application/json",
            //     dataType: "string",
            //     complete: function() {
                    window.open("/meetingInvitationCode/excels?meetingInvitationCodeSignUpId="+self.searchInfoForm.signUpId)
            //     }
            // })
           
        },
        closeSingupInfoPage(formName){
            this.showSingupInfoPage = false
            this.showSignupList = true
            this.searchInfoForm = {
                signUpId:'',
                signUpInfoName: '',
                signUpInfoMobile: ''
            }
            this.tableInfoData =[]
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
         //时间格式转换工具
         transformTime2 (timestamp = +new Date()) {
            if (timestamp) {
                var time = new Date(timestamp);
                var y = time.getFullYear();
                var M = time.getMonth() + 1;
                var d = time.getDate();
                return y + '年' + M + '月' + d + '日'
              } else {
                  return '';
              }
        },
        addZero (m) {
            return m < 10 ? '0' + m : m;
        },
    }
})