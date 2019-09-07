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
        isShowselfConfig: false, // 自定义选项表
        creatOrEdit:0,//0新建  1修改
        isDelBtn: false,
        isDelSpecialBtn: false,
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
        checkinTime: [1567267200000],
        signupForm: {
            signUpTitle: '', // 报名名称
            signUpMeetingType: '', //会议类型
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
            signUpStatus: '0', //0正常1删除
            signUpJson: [{
                sectionId:0,
                sectionTitle:'',
                sectionStatus:'1', //存在
                limit:1,
               itemList:[
            //   {
            //         itemId:0,
            //         itemText:'LP',
            //         itemStatus:'1',
            //         ifShow:true,
            //         ifChoose:false
            //     },{
            //         itemId:1,
            //         itemText:'GP',
            //         itemStatus:'1',
            //         ifShow:false,
            //         ifChoose:false
            //     },{
            //         itemId:2,
            //         itemText:'NP',
            //         itemStatus:'1',
            //         ifShow:true,
            //         ifChoose:false
            //     }]
            // },{
            //     sectionId:1,
            //     sectionTitle:'参会权益',
            //     sectionStatus:'1',
            //     limit:2,
            //     itemList:[{
            //         itemId:0,
            //         itemText:'主会场-投资者年会上午场',
            //         itemStatus:'1',
            //         ifShow:true,
            //         ifChoose:false
            //     },{
            //         itemId:1,
            //         itemText:'分会场-投资者年会第二天的下午场',
            //         itemStatus:'1',
            //         ifShow:true,
            //         ifChoose:false
            //     },{
            //         itemId:2,
            //         itemText:'专家论坛-投资者的数据分享大会',
            //         itemStatus:'1',
            //         ifShow:false,
            //         ifChoose:false
            //     },{
            //         itemId:3,
            //         itemText:'分会场2-国际商业专家评审团演讲',
            //         itemStatus:'1',
            //         ifShow:true,
            //         ifChoose:false
            //     },{
            //         itemId:4,
            //         itemText:'晚宴-投资者之夜',
            //         itemStatus:'1',
            //         ifShow:true,
            //         ifChoose:false
            //     }
                ]
            }]
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
            ]
        },
        //会议基础信息表
        meetingBaseInfoForm: {
            meetingBaseInfoId: '2',
            meetingBaseInfoMeetingId: '2',
            meetingBaseInfoTitle: '3',
            meetingBaseInfoStartTime:'3',
            meetingBaseInfoEndTime:'3',
            meetingBaseInfoSignUpStartTime:'3',
            meetingBaseInfoSignUpEndTime: '3',
            meetingBaseInfoProvince: '3',
            meetingBaseInfoCity:'3',
            meetingBaseInfogArea: '3',
            meetingBaseInfoAddress:'3',
        },
        // 会议列表相关
        isBindMeeting: true,
        showCommonMeetingList: false,
        searchMeetingForm: {
            meetingTitle:'',//标题
            startTime:'',//开始时间
            endTime:'',//结束时间
            meetingStatus: ['0','1','2','3','4']
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
        //分页器相关
        pagination2: {
            currPage: 1,
            totalCount:0,
            totalPage:0,
            pageSize:10
        },
        searchInfoForm: {
            participateName: '',
            phoneNum: ''
        },
        tableInfoData: [],
        //----------------------编辑报名信息---------------
        searchDetailForm: {
            signUpInfoName: '2', //姓名
            signUpInfoMobile: '3', //手机
            signUpInfoCrtTime:'3',  // 报名时间
            signInEntities: ['1','2','3'], //签到列表
            signUpInfoJson:[{
                sectionId:0,
                sectionTitle:'11111',
                sectionStatus:'1',
                limit:1,
                itemList:[
                    {
                        itemId:0,
                        itemText:'LP',
                        itemStatus:'1',
                        ifShow:true,
                        ifChoose:false,
                    }, {
                        itemId:1,
                        itemText:'GP',
                        itemStatus:'0',
                        ifShow:true,
                        ifChoose:true,
                    }, {
                        itemId:2,
                        itemText:'touzi',
                        itemStatus:'1',
                        ifShow:true,
                        ifChoose:true,
                    }
                ]
        
            },{
                sectionId:1,
                sectionTitle:'erer',
                sectionStatus:'1',
                limit:1,
                itemList:[
                    {
                        itemId:0,
                        itemText:'LP',
                        itemStatus:'1',
                        ifShow:true,
                        ifChoose:false
                    }
                ]
        
            }]

        },





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
            crtUser: ''
        },
        createCodeFormRules: {
            number: [
                {required: true, message: '数量为必填项', trigger: 'change'}
            ],
            crtUser: [
                {required: true, message: '生成人为必填项', trigger: 'change'}
            ]
        }
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
            // console.log(this.searchForm)
        },
        timeRange2 (val) {
            if (val) {
                this.searchMeetingForm.startTime = val[0]
                this.searchMeetingForm.endTime = val[1]
            } else {
                this.searchMeetingForm.startTime = ''
                this.searchMeetingForm.endTime = ''
            }
            // console.log(this.searchMeetingForm)
        },
        checkinTime(val) {
            this.signupForm.signUpDate = val.join(',')
            // console.log(this.signupForm.signUpDate)
        }
    },
    
    created () {
        this.startSearch(0)
    },
    methods:{
        // chooseTime(val) {
        //     console.log(val)
        // },

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
            console.log(data)
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
                    console.log(res)
                    if(res.code == 200){
                        self.tableData = res.page.list
                        for (let i = 0; i < self.tableData.length; i++){
                            self.tableData[i].signUpModTime = self.transformTime(parseInt(self.tableData[i].signUpModTime))
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
                $.ajax({
                    type: "POST",
                    url: "/signUp/info/" + item.signUpId.toString(),
                    contentType: "application/json",
                    dataType: "json",
                    success: function(res){
                        console.log(res)
                        if(res.code == 200){
                            //json64反解
                            let data = res.dict
                            let map = $.base64.atob(data.signUpJson, true)
                            console.log()
                            data.signUpJson = JSON.parse(map)
                            console.log(data)
                            // console.log(JSON.stringify(data.signUpJson))
                            self.signupForm = data
                            var result = self.signupForm.signUpDate.split(",");
                            for(var i = 0; i< result.length; i++) {
                                self.checkinTime.push(Number(result[i]))
                            }
                            self.checkinTime.shift()
                            self.signupForm.signUpEmail = Boolean(self.signupForm.signUpEmail)
                            self.signupForm.signUpName = Boolean(self.signupForm.signUpName)
                            self.signupForm.signUpCompany = Boolean(self.signupForm.signUpCompany)
                            self.signupForm.signUpPosition = Boolean(self.signupForm.signUpPosition)
                            self.signupForm.signUpCustom = Boolean(self.signupForm.signUpCustom)
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
        // 删除报名信息
        deleteThisSignup(item) {
            var self = this
            self.$confirm('确实要删除该投票数据吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = JSON.parse(JSON.stringify(item))
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
            // console.log(val)
            this.isBindMeeting = false
            this.signUpMeetingType = val
        },
        // 点击绑定会议按钮打开不同的会议列表
        bindMeeting(){
            var self = this
            console.log(self.signUpMeetingType)
            self.showCommonMeetingList = true
            self.searchMeeting()

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
            console.log(data)
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
            if(self.signUpMeetingType == 0) {
                var reqUrl = "/meeting/special/list"
            } else if(self.signUpMeetingType == 1) {
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
            console.log(item)
            self.signupForm.signUpMeetingId = item.meetingId
            self.showCommonMeetingList = false
            self.showAddorEditPage = true
            // $.ajax({
			// 	type: "POST",
            //     url: '/meetingBaseInfo/info'+item.meetingBaseInfoId.toString(),
            //     contentType: "application/json",
			//     dataType: "json",
			//     success: function(res){
			// 		if(res.code == 200){
            //             var data = res.page.list
            //             self.meetingBaseInfoTitle = data.meetingBaseInfoTitle
            //             self.meetingBaseInfoStartTime = self.transform(data.meetingBaseInfoStartTime)
            //             self.meetingBaseInfoEndTime = self.transform(data.meetingBaseInfoEndTime)
            //             self.meetingBaseInfoSignUpStartTime = self.transform(data.meetingBaseInfoSignUpStartTime)
            //             self.meetingBaseInfoSignUpEndTime = self.transform(data.meetingBaseInfoSignUpEndTime)
            //             self.meetingBaseInfoProvince = data.meetingBaseInfoProvince
            //             self.meetingBaseInfoCity =data.meetingBaseInfoCity
            //             self.meetingBaseInfogArea = data.meetingBaseInfogArea
            //             self.meetingBaseInfoAddress = data.meetingBaseInfoAddress
            //             self.backToEdit2()
                       
			// 		}else{
			// 			mapErrorStatus(res)
            //             vm.error = true;
            //             vm.errorMsg = res.msg;
            //         }
            //     },
            //     error:function(res){
            //         mapErrorStatus(res)
            //     }
			// });

        },
        //返回编辑页
        backToEdit2 (){
            this.showCommonMeetingList = false
            this.showAddorEditPage = true
            this.searchMeetingForm = {
                meetingTitle:'',//标题
                startTime:'',//开始时间
                endTime:'',//结束时间
                meetingStatus: ['0','1','2','3','4']
            }
            this.commonMeetingTableData = []
        },
        //头图图片
        chooseCovertImg() {
            this.showCoverimgLib = true
            this.searchCoverImg(0)
        },
        handleCurrentChange4(val){
            // this.pagination4.currPage = val
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
            if(len >=3) {
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
                self.$message.error('至少保留一个选项')
                return
            } else {
                self.checkinTime.splice(index,1)
            }

        },
        //点击自定义选项
        // changeselfOptions(val) {
        //     console.log(val)
        //     if(val == false) {
        //         isShowselfConfig = false
        //     }
        // },
        //添加整条自定义选项
        addSelfOptions() {
            // console.log(this.signupForm.signUpJson.length)
            var self = this
            self.isDelBtn = false
            self.isShowselfConfig = true
            var dateLength = self.signupForm.signUpJson.length
            console.log(dateLength)
            var id = dateLength-1
            var numReg = /^([1-9]\d*|[0]{1,1})$/;
            var optionIndex = self.signupForm.signUpJson[dateLength - 1]
            if(optionIndex.sectionStatus == '1') {
                if(optionIndex.sectionTitle.trim() == ''){
                    self.$message.error('标题不能为空')
                } else if(Number(optionIndex.limit) == NaN || (!numReg.test(Number(optionIndex.limit)) && optionIndex.limit.trim !=="")) {
                    self.$message.error("最大值必须为正整数")
                    return
                } else if(Number(optionIndex.limit) > optionIndex.itemList.length) {
                    self.$message.error('最大选项值不能大于选项数量')
                    return
                } else {
                    self.signupForm.signUpJson.push({
                        sectionId: id+1,
                        sectionTitle:'',
                        sectionStatus:'1',
                        limit:1,
                        itemList:[]
                    })
                    console.log(self.signupForm.signUpJson)
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
            var dateLength = self.signupForm.signUpJson.length
            console.log(dateLength)
            if(self.creatOrEdit == '0') {
                self.signupForm.signUpJson.pop()
            } else if(self.creatOrEdit == '1') {
                for(var i = dateLength-1; i > 0; i--){
                    if(self.signupForm.signUpJson[i].sectionStatus == '1') {
                        self.signupForm.signUpJson[i].sectionStatus = '0'
                    } else if(self.signupForm.signUpJson[i].sectionStatus == '0') {
                        if(i == 1) {
                            self.signupForm.signUpJson[i-1].sectionStatus = '0'
                            self.isDelBtn = true
                        } else {
                            self.signupForm.signUpJson[i-1].sectionStatus = '0'
                        }
                    }
                }
                // console.log(self.signupForm.signUpJson)
            }
        },
        //添加具体的选项
        addSpecialOptions(index) {
            // console.log(index)
            var self = this
            self.isDelSpecialBtn = false
            var len = self.signupForm.signUpJson[index].itemList.length
            // console.log(len)
            var id = len-1
            if(len == 0 ) {
                self.signupForm.signUpJson[index].itemList.push({
                    itemId: 0,
                    itemText:'',
                    itemStatus:'1',
                    ifShow:false,
                    ifChoose:false
                })
            } else if(len > 0) {
                if( self.signupForm.signUpJson[index].itemList[len-1].itemText !== ''){
                    self.signupForm.signUpJson[index].itemList.push({
                        itemId: id+1,
                        itemText:'',
                        itemStatus:'1',
                        ifShow:false,
                        ifChoose:false
                    })
                } else {
                    self.$message.error('请完成上一个具体选项')
                }
            }
            console.log(self.signupForm.signUpJson)
        },
        //删除具体的选项
        delSpecialOptions(index){
            console.log(index)
            var self = this
            var dateLength = self.signupForm.signUpJson[index].itemList.length
            console.log(dateLength)
            if(self.creatOrEdit == '0') {
                self.signupForm.signUpJson[index].itemList.pop()
            } else if(self.creatOrEdit == '1') {
                for(var i = dateLength-1; i > 0; i--){
                    if(self.signupForm.signUpJson[index].itemList[i].itemStatus == '1') {
                        self.signupForm.signUpJson[index].itemList[i].itemStatus = '0'
                    } else if(self.signupForm.signUpJson[index].itemList[i].itemStatus == '0') {
                        if(i == 1) {
                            // self.signupForm.signUpJson[index].itemList[i-1].itemStatus = '0'
                            self.$message.error('至少保留一个选项')
                            self.isDelSpecialBtn = true
                        } else {
                            self.signupForm.signUpJson[index].itemList[i-1].itemStatus = '0'
                        }
                    }
                }
            }
            console.log(self.signupForm.signUpJson[index].itemList)
        },
        // 保存新建报名
        //保存
        testSubmit (formName) {
            var self = this
            self.$refs[formName].validate((valid) => {
                if (valid) {
                    //验证自定义选项是否填写完成
                    for (let i = 0; i < self.signupForm.signUpJson.length; i++) {
                        if (self.signupForm.signUpJson[i].sectionTitle.trim() == '' || (self.signupForm.signUpJson[i].itemList[0].itemText.trim() == '')) {
                            self.$message.error('还有选项未填写完成')
                            return
                        }
                    }
                    self.submitCreatEdit()
                }
            })
        },
        submitCreatEdit() {
            var self = this
            var data = JSON.parse(JSON.stringify(self.signupForm))
            console.log('准备提交保存的Form',data)
            $.base64.utf8encode = true;
            var jsonString = JSON.stringify(data.signUpJson);
            var json64 = $.base64.btoa(jsonString);
            data.signUpJson = json64
            console.log('6464',jsonString,json64)
            console.log(JSON.stringify(data))
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
            this.showAddorEditPage = false
            this.showSignupList = true
            this.creatOrEdit = 0
            this.signupForm = {
                signUpTitle: '', // 报名名称
                signUpMeetingType: '', //会议类型
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
            }
        },






        // -----------------------报名用户列表搜索区开始-----------------------------------------
        handleCurrentChange2(val){
            // this.pagination2.currPage = val
            this.startSearchInfo() 
        },
        checkSignupDetail(item) {
            var self =this
            self.searchInfoForm.signUpId = item.signUpId
            self.showSignupList = false
            self.showSingupInfoPage = true
            self.startSearchInfo()
        },
        //开始搜索报名用户列表
        startSearchInfo(type){
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchInfoForm))
            data.participateName = data.participateName.toString().trim()
            data.phoneNum = data.phoneNum.toString().trim()
            console.log(data)
            // if (type == 0) {
            //     Object.assign(data,{
            //         page: '1',
            //         limit: self.pagination2.pageSize.toString()
            //     })
            // } else {
            //     Object.assign(data,{
            //         page: self.pagination2.currPage.toString(),
            //         limit: self.pagination2.pageSize.toString()
            //     })
            // }
            // $.ajax({
            //     type: "POST",
            //     url: "/signUpInfo/list",
            //     contentType: "application/json",
            //     data: JSON.stringify(data),
            //     dataType: "json",
            //     success: function(res){
            //         if(res.code == 200){
            //             self.tableInfoData = res.page.list
            //             self.pagination2 = {
            //                 currPage: res.page.currPage,
            //                 totalCount:res.page.totalCount,
            //                 totalPage: res.page.totalPage,
            //                 pageSize: res.page.pageSize
            //             }
            //         }else{
            //             mapErrorStatus(res)
            //             vm.error = true;
            //             vm.errorMsg = res.msg;
            //         }
            //     },
            //     error:function(res){
            //         mapErrorStatus(res)
            //     }
            // });
        },
        // 报名控制按钮
        changeSignupStatus(item) {
            console.log(item)
            if(item.signupStatus == '0') {
                console.log(123)
                item.signupStatus == "1"
            } else if(item.signupStatus == '1') {
                console.log(234)
                item.signupStatus == "0"
            }
        },
        // 具体参会人信息编辑
        editsignupInfo(item){
            console.log(item)
            $.ajax({
                type: "POST",
                url: " /signUpInfo/info/"+item.signUpInfoId.toString(),
                contentType: "application/json",
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.searchDetailForm = res.dict
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

        //保存
        testSubmit2 (formName) {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchDetailForm))
            console.log(data)
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
            this.showEditInfoPage= false
            this.showSingupInfoPage = true
        },




        //--------------------------------------------邀请码信息------------------------------------
        handleCurrentChange3(val){
            // this.pagination3.currPage = val
            this.startSearchCode() 
        },
        checkInvitationCode(item) {
            var self = this
            self.searchInfoForm.signUpId = item.signUpId
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
            console.log(data)
            // if (type == 0) {
            //     Object.assign(data,{
            //         page: '1',
            //         limit: self.pagination3.pageSize.toString()
            //     })
            // } else {
            //     Object.assign(data,{
            //         page: self.pagination3.currPage.toString(),
            //         limit: self.pagination3.pageSize.toString()
            //     })
            // }
            // $.ajax({
            //     type: "POST",
            //     url: "+signupId",
            //     contentType: "application/json",
            //     data: JSON.stringify(data),
            //     dataType: "json",
            //     success: function(res){
            //         if(res.code == 200){
            //             self.tableCodeData = res.page.list
            //             self.pagination3 = {
            //                 currPage: res.page.currPage,
            //                 totalCount:res.page.totalCount,
            //                 totalPage: res.page.totalPage,
            //                 pageSize: res.page.pageSize
            //             }
            //         }else{
            //             mapErrorStatus(res)
            //             vm.error = true;
            //             vm.errorMsg = res.msg;
            //         }
            //     },
            //     error:function(res){
            //         mapErrorStatus(res)
            //     }
            // });
        },

        // --------------------------生成邀请码页面--------------------
        createInvitaionCode() {
            console.log(123)
            this.showInvitationCodePage = false
            this.createInvitationCodePage = true
        },
        saveCreateCodeForm(formName) {
            self.$refs[formName].validate((valid) => {
                if(valid) {
                    self.saveBtn = true
                    var data = {
                        number: self.createCodeForm.number,
                        crtUser: self.createCodeForm.crtUser,
                        // voteStatus: '0',
                        page: '1',
                        limit: '100'
                    }
                    $.ajax({
                        type: "POST",
                        url: "update",
                        contentType: "application/json",
                        data: JSON.stringify(data),
                        dataType: "json",
                        success: function(res) {
                            if(res.code == 200) {
                                self.$message.success('保存成功')
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
        // 取消生成邀请码页面
        closeCreateCode(formName) {
            // this.$refs[formName].resetFields()
            this.createCodeForm = {
                number:'',
                crtUser: ''
            }
            this.createInvitationCodePage = false
            this.showInvitationCodePage = true
        },






        showtime(){
            console.log(event)

        },

        // 下载参会信息
        downloadInfo() {
            $.ajax({
                type: "POST",
                url: url,
                data: params,
                success: function(response, status, request) {
                    var disp = request.getResponseHeader('Content-Disposition');
                    if (disp && disp.search('attachment') != -1) {
                        var form = $('<form method="POST" action="' + url + '">');
                        $.each(params, function(k, v) {
                            form.append($('<input type="hidden" name="' + k +
                                    '" value="' + v + '">'));
                        });
                        $('body').append(form);
                        form.submit();
                    }
                }
            })
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
    }
})