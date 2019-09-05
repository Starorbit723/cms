var vm = new Vue({
    el: '#signup_list',
    data: {
        showSignupList: false, //会议报名列表
        showAddorEditPage: true,  // 新增或修改报名信息列表
        showSingupInfoPage: false, // 报名信息页面
        showInvitationCodePage: false, // 邀请码页面信息
        createInvitationCodePage: false, // 生成邀请码页面
        creatOrEdit:0,//0新建  1修改
        //折叠面板组件实例
        activeNames: ['1','2','3','4','5','6','7','8','9','10','11','12'],
        pickerOptions:{
            disabledDate(time) {
                return time.getTime() > Date.now();
            }
        }, 
        timeRange: [], //时间需要特殊处理,并且同步到searchForm
        searchForm:{
            signUpTitle: [''], //报名页面名称
            startTime:'',//
            endTime:''//
        },
        tableData:[
            {
                // singupTitle: '南京报名南京报名南京报名南京报名南京报名南京报名南京报名南京报名南京报名',
                // signupCheck: '-1',
                // signupModTime: '2018年3月',
                // modUserName: 'shenda',
            }
        ],
        //分页器相关
        pagination1: {
            currPage: 1,
            totalCount:0,
            totalPage:0,
            pageSize:10
        },
        // 报名表基本信息
        signupForm: {
            meetingBaseInfoTitle: '',
            meetingBaseInfoMeetingId: '',
            signupTime: '',
            isUseCode: '',
            checkinTime: [],
            headPic: '',
        },
        signupFormRules: {
            meetingBaseInfoTitle: [
                {required: true, message: '报名名称为必填项', trigger: 'change'}
            ],
            meetingBaseInfoMeetingId: [
                {required: true, message: '会议详情ID为必填项', trigger: 'change'}
            ]
        },


        // 报名人列表信息
        signupId: '',
        // 某个会议所有参会人信息搜索
        searchInfoForm:{
            participateName: '',
            phoneNum: ''
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
        tableInfoData: [
            {
                ID: '2',
                name: '张三玛格丽娅',
                title: '总经理',
                company: 'alibaba',
                phoneNum: '13716667890',
                code: 'QWE4D7E',
                email: '222333@qq.com',
                checkStatus: '1',
                signupStatus: '0'
            },
            {
                ID: '3',
                name: '张三玛格丽娅',
                title: '总经理',
                company: 'alibaba',
                phoneNum: '13716667890',
                code: 'QWE4D7E',
                email: '222333@qq.com',
                checkStatus: '0',
                signupStatus: '1'
            },
            {
                ID: '4',
                name: '张三玛格丽娅',
                title: '总经理',
                company: 'alibaba',
                phoneNum: '13716667890',
                code: 'QWE4D7E',
                email: '222333@qq.com',
                checkStatus: '1',
                signupStatus: '0'
            },
            {
                ID: '5',
                name: '张三玛格丽娅',
                title: '总经理',
                company: 'alibaba',
                phoneNum: '13716667890',
                code: 'QWE4D7E',
                email: '222333@qq.com',
                checkStatus: '0',
                signupStatus: '1'
            }
        ],





        //邀请码管理页面
        searchCodeForm: {
            signupUser: '', // 名称
            phoneNum: '', //手机号
            crtUser: '',  //创建人
        },
        //分页器相关
        pagination3: {
            currPage: 1,
            totalCount:0,
            totalPage:0,
            pageSize:10
        },
        tableCodeData: [
            {
                signupUser: '张三玛格丽娅',
                phoneNum: '13716667890',
                codeCompany: 'alibaba',
                code: 'QWE4D7E',
                useStatus: '-1',
                crtUser: 'shenda'
            },
            {
                signupUser: '张三玛格丽娅',
                phoneNum: '13716667890',
                codeCompany: 'alibaba',
                code: 'QWE4D7E',
                useStatus: '0',
                crtUser: 'shenda'
            },
            {
                signupUser: '张三玛格丽娅',
                phoneNum: '13716667890',
                codeCompany: 'alibaba',
                code: 'QWE4D7E',
                useStatus: '-1',
                crtUser: 'shenda'
            },
            {
                signupUser: '张三玛格丽娅',
                phoneNum: '13716667890',
                codeCompany: 'alibaba',
                code: 'QWE4D7E',
                useStatus: '0',
                crtUser: 'shenda'
            }
        ],

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
            console.log(val)
            if (val) {
                this.searchForm.startTime = val[0]
                this.searchForm.endTime = val[1]
            } else {
                this.searchForm.startTime = ''
                this.searchForm.endTime = ''
            }
            console.log(this.searchForm)
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
            // if (type == 0) {
            //     Object.assign(data,{
            //         page: '1',
            //         limit: self.pagination1.pageSize.toString()
            //     })
            // } else {
            //     Object.assign(data,{
            //         page: self.pagination1.currPage.toString(),
            //         limit: self.pagination1.pageSize.toString()
            //     })
            // }
            // $.ajax({
            //     type: "POST",
            //     url: "/signUp/list",
            //     contentType: "application/json",
            //     data: JSON.stringify(data),
            //     dataType: "json",
            //     success: function(res){
            //         console.log(res)
            //         if(res.code == 200){
            //             self.tableData = res.page.list
            //             for (let i = 0; i < self.tableData.length; i++){
            //                 self.tableData[i].singupModTime = self.transformTime(parseInt(self.tableData[i].singupModTime))
            //             }
            //             self.pagination1 = {
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
        //新建或修改报名信息 type:0  新增   type:1修改
        addOrEditSignup(type,item){
            var self = this
            self.creatOrEdit = type
            if (type == 0) {
                self.showAddorEditPage = true
                self.showSignupList = false
            } else if (type == 1) {
                // $.ajax({
                //     type: "POST",
                //     url: "/meeting/agenda/info/" + item.meetingAgendaId.toString(),
                //     contentType: "application/json",
                //     dataType: "json",
                //     success: function(res){
                //         if(res.code == 200){
                //             //json64反解
                //             let data = res.dict
                //             let map = $.base64.atob(data.meetingAgendaJson, true)
                //             data.meetingAgendaJson = JSON.parse(map)
                //             console.log(data)
                //             self.calendarForm = data
                //             self.showChildPage = true
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
            }
        },
        // 删除报名信息
        deleteThisSignup(item) {
            var self = this
            // self.$confirm('确实要删除该投票数据吗？', '提示', {
            //     confirmButtonText: '确定',
            //     cancelButtonText: '取消',
            //     type: 'warning'
            // }).then(() => {
            //     var data = JSON.parse(JSON.stringify(item))
            //     data.voteStatus = "1"
            //     $.ajax({
            //         type: "POST",
            //         contentType: "application/json",
            //         url: "",
            //         data: JSON.stringify(data),
            //         dataType: "json",
            //         success: function(res) {
            //             if(res.code == 200) {
            //                 self.startSearch()
            //                 self.$message.success('删除成功')
            //             } else {
            //                 mapErrorStatus(res)
            //                 vm.error = true
            //                 vm.errorMsg = res.msg
            //             }
            //         },
            //         error: function(res) {
            //             mapErrorStatus(res)
            //         }
            //     })
            // })
        },




        // -----------------------报名用户列表搜索区开始-----------------------------------------
        handleCurrentChange2(val){
            // this.pagination2.currPage = val
            this.startSearchInfo() 
        },
        checkSignupDetail(item) {
            var self =this
            self.signupId = item.signupId
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
            //     url: "+id",
            //     contentType: "application/json",
            //     data: JSON.stringify(data),
            //     dataType: "json",
            //     success: function(res){
            //         if(res.code == 200){
            //             self.tableInfoData = res.page.list
            //             
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




        //--------------------------------------------邀请码信息------------------------------------
        handleCurrentChange3(val){
            // this.pagination3.currPage = val
            this.startSearchCode() 
        },
        checkInvitationCode(item) {
            var self = this
            self.signupId = item.signupId
            self.showSignupList = false
            self.showInvitationCodePage = true
            self.startSearchCode()
        },
        // 开始搜索邀请码
        startSearchCode(type) {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchCodeForm))
            data.signupUser = data.signupUser.toString().trim()
            data.phoneNum = data.phoneNum.toString().trim()
            data.crtUser = data.crtUser.toString().trim()
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