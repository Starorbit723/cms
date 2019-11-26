var vm = new Vue({
    el: "#edit_meetinglive",
    data() {
        return {
            //新建或修改
            typeOfPage:'creat',
             //按钮请求开关
            ajaxController:true,
             //折叠面板组件实例
            activeNames: ['1','2','3','4','5','6','7','8','9','10','11','12'],
            //会议关键词数组
            meetingTagArray:[],
            labelOptions:[],
            //专题报道基本信息
            meetingliveForm: {
                meetingId:'',//主键
                meetingTitle:'',//标题
                meetingStarTime:'',//开始时间
                meetingEndTime:'',//结束时间
                meetingEnrollStartTime:'',//报名开始时间
                meetingEnrollEndTime:'',//报名结束时间
                meetingType:'',//类型
                meetingUrl:'',//会议链接
                meetingDesc:'',//简介
                meetingStatus:'',//会议状态  1：发布(上线) 2：不发布(下线) 3：待发布(草稿) 4删除
                meetingKeywords:'', //会议关键词
                meetingPCpic: '', // PC头图
                meetingPCpicUrl: '', //PC头图链接
                meetingMobilepic: '', //H5头图
                meetingMobilepicUrl: '', //H5头图链接
                meetingliveId: '', //场会报道ID
                meetingAgendaId:'',//日程ID
                meetingCooperationId:'',//合作机构ID
                meetingliveJsonData:{ //前端渲染大数据
                    headPicBanner: {
                        isShowFloor: true,
                        headSwiperPicList: [
                            {
                                headSwiperPic: '',
                                picUrlPc: '',
                                picUrlMobile: '',
                            }
                        ],
                        headArticleList: [
                            {
                                headArticlePic: '',
                                picUrlPc: '',
                                picUrlMobile: '',
                                articleTitle: '',
                                articleDesc: '',
                            },
                            {
                                headArticlePic: '',
                                picUrlPc: '',
                                picUrlMobile: '',
                                articleTitle: '',
                                articleDesc: '',
                            },
                            {
                                headArticlePic: '',
                                picUrlPc: '',
                                picUrlMobile: '',
                                articleTitle: '',
                                articleDesc: '',
                            },
                        ]
                    },
                    venueReport: {
                        isShowFloor: false,
                        reportTitle: '',
                    },
                    calendar: {
                        isShowFloor: false,
                        floorTitle: '',
                        navTitle: '',
                        calendarTitle: ''
                    },
                    cooperation: {
                        isShowFloor:false,
                        floorTitle: '',
                        navTitle: '',
                        cooperationTitle: ''
                    }
                }
            },
            meetingliveFormRules: {
                meetingTitle: [
                    { required: true, message: '报道专题名称不能为空', trigger: 'change' },
                    { max: 36, message: '您输入的字数超过36个字', trigger: 'change' }
                ],
                meetingDesc:[
                    { required: true, message: '请填写报道专题简介', trigger: 'change' }
                ],
                meetingKeywords:[
                    { required: true, message: '请填写报道专题关键词', trigger: 'change' }
                ],
                meetingPCpic:[
                    { required: true, message: '请选择PC头图', trigger: 'change' }
                ],
                meetingMobilepic:[
                    { required: true, message: '请选择H5头图', trigger: 'change' }
                ],


            },
            //内容图库相关
            showContentImgLib:false,
            chooseImgObjName:'',
            chooseImgObjIndex:'',
            searchContentImgForm:{
                picTitle:'',
                picType:'1'//0封面图库 1内容图库 2图为图库
            },
            contentImgTableData:[],
            pagination1: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
            //展示日程表
            showCalendarLib:false,
            searchCalendarForm:{
                meetingAgendaTitle:'',
                meetingAgendaStatus:'0',
                meetingAgendaMeetingId:'-1',
            },
            calendarTableData:[],
            pagination3: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
            //展示合作伙伴
            showCoperationLib:false,
            searchCoperationForm:{
                meetingCooperationTitle:'',
                meetingCooperationStatus: "0",
                meetingCooperationMeetingId:'-1',
            },
            coperationTableData:[],
            pagination4: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
        }

    },
    created () {

    },
    mounted () {
        var type = getCookie('createditmeetinglive')
        if (type == '' || type == undefined) {
            this.typeOfPage = 'creat'
        } else {
            this.typeOfPage = 'edit'
            this.getEditMeetingOrign(type)
        }
        console.log('type',this.typeOfPage)

    },
    methods: {
        //链接校验
        validateUrl(value) {
            console.log(value)
            var urlReg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
            if(value.trim() !== '#') {
                if (value.trim() == '') {
                    this.$message.error('链接不能为空，暂无链接可填写"#"')
                } else if(!urlReg.test(value.trim())) {
                    this.$message.error('链接格式不正确')
                }
            }
        },


        //折叠面板改变
        handleChangeCollapse(){
        },
        // 添加banner数据
        addBanner (index) {
            var self = this
            if(self.meetingliveForm.meetingliveJsonData.headPicBanner.headSwiperPicList.length <= 5) {
                for(let i = 0; i < self.meetingliveForm.meetingliveJsonData.headPicBanner.headSwiperPicList.length; i++) {
                    
                    if (self.meetingliveForm.meetingliveJsonData.headPicBanner.headSwiperPicList[i].headSwiperPic.trim() == '') {
                        this.$message.error('楼层01轮播图：您还有未完成的banner图位');
                        return 
                    }
                    if (self.meetingliveForm.meetingliveJsonData.headPicBanner.headSwiperPicList[i].picUrlPc.trim() == ''){
                        this.$message.error('楼层01轮播图：PC链接不能为空,若无链接可填写"#"');
                        return
                    } else if (self.meetingliveForm.meetingliveJsonData.headPicBanner.headSwiperPicList[i].picUrlPc.trim() !== ''){
                        if(self.meetingliveForm.meetingliveJsonData.headPicBanner.headSwiperPicList[i].picUrlPc.trim() == '#'){
                            self.meetingliveForm.meetingliveJsonData.headPicBanner.headSwiperPicList[i].picUrlPc == '#'
                        } else {
                            var urlReg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
                            if(!urlReg.test(self.meetingliveForm.meetingliveJsonData.headPicBanner.headSwiperPicList[i].picUrlPc.trim())){
                                this.$message.error('楼层01轮播图：PC链接格式不正确');
                                return
                            }
                        }
                    }
                }
                self.meetingliveForm.meetingliveJsonData.headPicBanner.headSwiperPicList.splice((index+1), 0, {
                    headSwiperPic: '',
                    picUrlPc: '',
                    picUrlMobile: '',
                })
            } else {
                self.$message.error('最多添加6组banner');
                return
            }    
        },

        //删除banner数据
        delBanner(index) {
            var headArr = this.meetingliveForm.meetingliveJsonData.headPicBanner.headSwiperPicList
            console.log(index, headArr)
            if(headArr.length >=2) {
                headArr.splice(index,1)
            } else {
                this.$message.warning('至少保留一条banner数据')
            }
        },


        // ----------------------内容图库相关---------------------
        handleCurrentChange1 (val) {
            this.pagination1.currPage = val
            this.searchContentImg()
        },
        //修改某一张内容图片
        chooseContentImg(objName,index){
            console.log(objName,index)
            this.chooseImgObjName = objName
            this.chooseImgObjIndex = index
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
                url: "/picture/list",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.contentImgTableData = res.page.list
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
        //选择了某一张内容图片
        addThisContentImg (item) {
            var self = this
            //当chooseImgObjName == map  单独处理一下，选择的是location中的地图图片
            self.$refs['meetingliveForm'].clearValidate();
            if (self.chooseImgObjName == '') {
                if(self.chooseImgObjIndex == 0) {
                    self.meetingliveForm.meetingPCpic= item.picUrl
                } else if (self.chooseImgObjIndex == 1) {
                    self.meetingliveForm.meetingMobilepic = item.picUrl
                }
            } else if (self.chooseImgObjName == 'headSwiperPicList') {
                console.log(123)
                self.meetingliveForm.meetingliveJsonData.headPicBanner.headSwiperPicList[self.chooseImgObjIndex].headSwiperPic = item.picUrl
            } else if (self.chooseImgObjName == 'headArticleList') {
                self.meetingliveForm.meetingliveJsonData.headPicBanner.headArticleList[self.chooseImgObjIndex].headArticlePic = item.picUrl
            } 
            
            this.backToEdit()
        },
        //返回编辑页
        backToEdit (){
            this.showContentImgLib = false
            this.chooseImgObjName = ''
            this.chooseImgObjIndex = ''
            this.searchContentImgForm = {
                picTitle:'',
                picType:'1'//0封面图库 1内容图库 2图为图库
            }
            this.contentImgTableData = [],
            this.pagination1 = {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            }
        },

        //--------------------搜索日程表相关--------------------
        calendarDefaultChange(val){
            if (val && this.meetingliveForm.meetingAgendaId == '') {
                this.openAddCalendarList()
            }
        },
        openAddCalendarList () {
            this.showCalendarLib = true
            this.searchCalendar(0)
        },
        searchCalendar (type){
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchCalendarForm))
            data.meetingAgendaTitle = data.meetingAgendaTitle.toString().trim()
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
                url: "/meeting/agenda/list",
                contentType: "application/json",
			    data: JSON.stringify(data),
			    dataType: "json",
			    success: function(res){
					if(res.code == 200){
                        self.calendarTableData = res.page.list
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
        handleCurrentChange3 (val) {
            this.pagination3.currPage = val
            this.searchCalendar()
        },
        backToEditFromCalendar () {
            if (this.meetingliveForm.meetingAgendaId == '') {
                this.meetingliveForm.meetingliveJsonData.calendar.isShowFloor = false
            }
            this.showCalendarLib = false
            this.searchCalendarForm = {
                meetingAgendaTitle:'',
                meetingAgendaStatus:'0',
                meetingAgendaMeetingId:'-1',
            },
            this.calendarTableData = []
            this.pagination3 = {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            }
        },
        addThisCalendar (item) {
            console.log(item)
            this.meetingliveForm.meetingAgendaId = item.meetingAgendaId
            this.meetingliveForm.meetingliveJsonData.calendar.calendarTitle = item.meetingAgendaTitle
            this.backToEditFromCalendar()
        },

         //--------------------搜索合作伙伴相关--------------------
         coperationDefaultChange (val){
            if (val && this.meetingliveForm.meetingCooperationId == '') {
                this.openAddCoperationList()
            }
        },
        openAddCoperationList () {
            this.showCoperationLib = true
            this.searchCoperation(0)
        },
        searchCoperation (type){
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchCoperationForm))
            data.meetingCooperationTitle = data.meetingCooperationTitle.toString().trim()
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
                url: "/meeting/cooperation/list",
                contentType: "application/json",
			    data: JSON.stringify(data),
			    dataType: "json",
			    success: function(res){
					if(res.code == 200){
                        self.coperationTableData = res.page.list
                        self.pagination4 = {
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
        handleCurrentChange4 (val) {
            this.pagination4.currPage = val
            this.searchCoperation()
        },
        addThisCoperation (item) {
            console.log(item)
            this.meetingliveForm.meetingCooperationId = item.meetingCooperationId
            this.meetingliveForm.meetingliveJsonData.cooperation.cooperationTitle = item.meetingCooperationTitle
            this.backToEditFromCoperation()
        },
        backToEditFromCoperation(){
            if (this.meetingliveForm.meetingCooperationId == '') {
                this.meetingliveForm.meetingliveJsonData.cooperation.isShowFloor = false
            }
            this.showCoperationLib=false
            this.searchCoperationForm={
                meetingCooperationTitle:'',
                meetingCooperationStatus: "0",
                meetingCooperationMeetingId:'-1',
            }
            this.coperationTableData=[]
            this.pagination4 = {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            }
        },
        // 保存报道专题
        testMeetingLiveInfo (type, formName) {
            var self = this 
            console.log('数据', self.meetingliveForm)
            self.$refs[formName].validate((valid) => {
                if(valid) {
                    self.saveMeetingLive(type)
                }
            })

        },
        //新建或修改保存报名专题
        saveMeetingLive(type) {
            var self = this
            // if(self.ajaxController) {
            //     self.ajaxController = false
            //     if (self.typeOfPage == 'creat') {
            //         var reqUrl = '/meetingInfo/save'
            //         self.meetingliveForm.meetingStatus = '0'
            //     } else if (self.typeOfPage == 'edit') {
            //         var reqUrl = '/meetingInfo/update'
            //     }
            // }
            //大数据JSON处理
            if(self.meetingliveForm.meetingliveJsonData.headPicBanner.isShowFloor) {
                for(let i = 0; i < self.meetingliveForm.meetingliveJsonData.headPicBanner.headSwiperPicList.length; i++) {
                    if (self.meetingliveForm.meetingliveJsonData.headPicBanner.headSwiperPicList[i].headSwiperPic.trim() == '') {
                        self.$message.error('楼层01轮播图：您还有未完成的banner图位');
                        return 
                    }
                    if (self.meetingliveForm.meetingliveJsonData.headPicBanner.headSwiperPicList[i].picUrlPc.trim() == ''){
                        this.$message.error('楼层01轮播图：PC链接不能为空,若无链接可填写"#"');
                        return
                    } else if (self.meetingliveForm.meetingliveJsonData.headPicBanner.headSwiperPicList[i].picUrlPc.trim() !== ''){
                        if(self.meetingliveForm.meetingliveJsonData.headPicBanner.headSwiperPicList[i].picUrlPc.trim() == '#'){
                            self.meetingliveForm.meetingliveJsonData.headPicBanner.headSwiperPicList[i].picUrlPc == '#'
                        } else {
                            var urlReg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
                            if(!urlReg.test(self.meetingliveForm.meetingliveJsonData.headPicBanner.headSwiperPicList[i].picUrlPc.trim())){
                                this.$message.error('楼层01轮播图：PC链接格式不正确');
                                return
                            }
                        }
                    }
                }
                for(let k = 0; k < self.meetingliveForm.meetingliveJsonData.headPicBanner.headArticleList.length; k++) {
                    if(self.meetingliveForm.meetingliveJsonData.headPicBanner.headArticleList[k].headArticlePic.trim() == ''){
                        self.$message.error('楼层01头条文字区：你还有图片未上传');
                        return 
                    }
                    if (self.meetingliveForm.meetingliveJsonData.headPicBanner.headArticleList[k].picUrlPc.trim() == ''){
                        this.$message.error('楼层01头条文字区：PC链接不能为空,若无链接可填写"#"');
                        return
                    } else if (self.meetingliveForm.meetingliveJsonData.headPicBanner.headArticleList[k].picUrlPc.trim() !== ''){
                        if(self.meetingliveForm.meetingliveJsonData.headPicBanner.headArticleList[k].picUrlPc.trim() == '#'){
                            self.meetingliveForm.meetingliveJsonData.headPicBanner.headArticleList[k].picUrlPc == '#'
                        } else {
                            var urlReg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
                            if(!urlReg.test(self.meetingliveForm.meetingliveJsonData.headPicBanner.headArticleList[k].picUrlPc.trim())){
                                this.$message.error('楼层01头条文字区：PC链接格式不正确');
                                return
                            }
                        }
                    }
                    if (self.meetingliveForm.meetingliveJsonData.headPicBanner.headArticleList[k].picUrlPc.trim() == ''){
                        this.$message.error('楼层01头条文字区：H5链接不能为空,若无链接可填写"#"');
                        return
                    } else if (self.meetingliveForm.meetingliveJsonData.headPicBanner.headArticleList[k].picUrlMobile.trim() !== ''){
                        if(self.meetingliveForm.meetingliveJsonData.headPicBanner.headArticleList[k].picUrlMobile.trim() == '#'){
                            self.meetingliveForm.meetingliveJsonData.headPicBanner.headArticleList[k].picUrlMobile == '#'
                        } else {
                            var urlReg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
                            if(!urlReg.test(self.meetingliveForm.meetingliveJsonData.headPicBanner.headArticleList[k].picUrlMobile.trim())){
                                self.$message.error('楼层01头条文字区：H5链接格式不正确');
                                return
                            }
                        }
                    }
                    if(self.meetingliveForm.meetingliveJsonData.headPicBanner.headArticleList[k].articleTitle == '') {
                        self.$message.error('楼层01头条文字区：标题不能为空');
                        return
                    }
                    if(self.meetingliveForm.meetingliveJsonData.headPicBanner.headArticleList[k].articleDesc == '') {
                        self.$message.error('楼层01头条文字区：摘要不能为空');
                        return
                    }

                }
            }
            if(self.meetingliveForm.meetingliveJsonData.calendar.isShowFloor) {
                var calendar = self.meetingliveForm.meetingliveJsonData.calendar
                if (calendar.floorTitle.trim() == '' && calendar.navTitle.trim() !== '') {
                    self.$message.error('楼层03：标题不能为空');
                    return
                } else if (calendar.floorTitle.trim() !== '' && calendar.navTitle.trim() == '') {
                    self.$message.error('楼层03：导航标题不能为空');
                    return
                }
            }
            if(self.meetingliveForm.meetingliveJsonData.cooperation.isShowFloor) {
                var cooperation = self.meetingliveForm.meetingliveJsonData.cooperation
                if (cooperation.floorTitle.trim() == '' && cooperation.navTitle.trim() !== '') {
                    self.$message.error('楼层04：标题不能为空');
                    return
                } else if (cooperation.floorTitle.trim() !== '' && cooperation.navTitle.trim() == '') {
                    self.$message.error('楼层04：导航标题不能为空');
                    return
                }
            }

            var submitData = JSON.parse(JSON.stringify(self.meetingliveForm))
            $.base64.utf8encode = true;
            var jsonString = JSON.stringify(submitData.meetingliveJsonData);
            var json64 = $.base64.btoa(jsonString);
            submitData.meetingliveJsonData = json64

            // $.ajax({
            //     type: "POST",
            //     url: reqUrl,
            //     contentType: "application/json",
            //     data: JSON.stringify(submitData),
            //     dataType: "json",
            //     success: function(res){
            //         if(res.code == 200){
            //             self.$message.success('保存成功')
            //             console.log('保存报道专题返回',res)
            //             if (self.typeOfPage == 'creat') {
            //                 if (type == 0) { // 0保存不发布
            //                     setCookie ('createditmeetinglive', '', 1) 
            //                     window.parent.location.href = '/index.html#modules/meeting/meetinglivepage_list.html'
            //                 } else if (type == 1) { // 1保存并发布
            //                     //回传id
            //                     // self.meetingliveForm.meetingId = res.meetingId
            //                     self.submitMeeting()
            //                 }
            //             } else if (self.typeOfPage == 'edit') {
            //                 if (type == 0) { // 0保存不发布
            //                     setCookie ('createditmeetinglive', '', 1) 
            //                     window.parent.location.href = '/index.html#modules/meeting/meetinglivepage_list.html'
            //                 } else if (type == 1) { // 1保存并发布
            //                     self.submitMeeting()
            //                 }
            //             }  
            //         }else{
            //             self.ajaxController = true
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





        closeAndBack () {
            setCookie ('createditmeetinglive', '', 1) 
            window.parent.location.href = '/index.html#modules/meeting/meetinglivepage_list.html'
        }





    }



})