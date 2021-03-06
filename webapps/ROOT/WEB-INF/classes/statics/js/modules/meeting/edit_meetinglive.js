var vm = new Vue({
    el: "#edit_meetinglive",
    data() {
        return {
            //新建或修改
            typeOfPage:'creat',
            //图片基础地址
            picBaseUrl:'',
             //折叠面板组件实例
            activeNames: ['1','2','3','4','5','6','7','8','9','10','11','12'],
            //会议关键词数组
            meetingTagArray:[],
            labelOptions:[],
            //专题报道基本信息
            meetingliveForm: {
                id:'',//主键
                name:'',//标题
                description:'',//简介
                publishStatus:'',//会议状态  1：发布(上线) 2：不发布(下线) 3：待发布(草稿) 4删除
                keywords:'', //会议关键词
                pcImg: '', //pc头图
                pcLink: '', //pc链接
                mImg: '',//m头图
                mLink: '',//m链接
                meetingReportListId: '',//会议报道id
                meetingAgendaId:'',//日程ID
                meetingCooperationId:'',//合作机构ID
                createUserId: '',
                updateUserId: '',
                updateAt: '',
                createAt: '',
                templateId: '',
                templateMid: '',
                templateAddress: '',
                templateMaddress: '',
                reportTopicUrl: '', //专题报道链接
                modUserName: '', // 更新人
                jsonData: { //前端渲染大数据
                    headPicBanner: {
                        isShowFloor: false,
                        headSwiperPicList: [
                            {
                                headSwiperPic: '', 
                                picUrlPc: '',
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
                name: [
                    { required: true, message: '报道专题名称不能为空', trigger: 'change' },
                    { max: 36, message: '您输入的字数超过36个字', trigger: 'change' }
                ],
                description:[
                    { required: true, message: '请填写报道专题简介', trigger: 'change' }
                ],
                keywords:[
                    { required: true, message: '请填写报道专题关键词', trigger: 'change' }
                ],
                pcImg:[
                    { required: true, message: '请选择PC头图', trigger: 'change' }
                ],
                mImg:[
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
            //展示会场报道表
            showMeetingLiveLib:false,
            searchMeetingLiveForm:{
                name:'',
                delStatus:'1',
                reportTopicId: '-1'
            },
            meetingLiveTableData:[],
            pagination2: {
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
                meetingAgendaReportTopicId:'-1',
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
                meetingCooperationReportTopicId:'-1',
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
        console.log('location',window.location.href)
        if (window.location.href.indexOf('chinaventure.com.cn') !== -1 || window.location.href.indexOf('117.78.28.103') !== -1) {
            console.log('正式环境')
            this.picBaseUrl = 'https://chinaventure-static.obs.cn-north-1.myhuaweicloud.com'
        } else {
            console.log('开发测试环境')
            this.picBaseUrl = 'https://cvinfo-test.obs.cn-north-1.myhuaweicloud.com'
        }
    },
    mounted () {
        var type = getCookie('createditmeetinglive')
        if (type == '' || type == undefined) {
            this.typeOfPage = 'creat'
        } else {
            this.typeOfPage = 'edit'
            this.getEditMeetingOrign(type)
        }
    },
    methods: {
        // 提交时出现蒙版
        load() {
        var bgLayer=$("#edit_meetinglive");
        $("<div class=\"bg-mask\"></div>").css({
                position: "absolute",
                top: "0",
                left: '0',
                display: "block",
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.2)",
            }).appendTo(bgLayer);
        },
        //取消加载层
        disLoad() {
            $(".bg-mask").remove();
        },
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
        validateUrl2(value) {
            var urlReg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
            if(value.trim() !== '') {
                if (value.trim() !== '#') {
                    if(!urlReg.test(value.trim())) {
                        this.$message.error('链接格式不正确')
                    }
                }
            }
        },


         //会议标签改变
        meetingTagChange (val) {
            for (let i = 0; i < this.meetingTagArray.length; i++) {
                if (this.meetingTagArray[i].length > 20) {
                    let tempArr = JSON.parse(JSON.stringify(this.meetingTagArray))
                    tempArr.splice(i,1) 
                    this.meetingTagArray = tempArr
                    this.$message.warning('单一标签最多20字')
                }
            }
            if (this.meetingTagArray.length > 5) {
                this.$message.warning('标签做多可设置为5个')
                this.meetingTagArray = this.meetingTagArray.splice(0,5)
            }
            var tempStr = ''
            tempStr = this.meetingTagArray.join(',')
            this.meetingliveForm.keywords = tempStr
            console.log('当前newsKeywords',this.meetingliveForm.keywords)
        },


        //折叠面板改变
        handleChangeCollapse(){
        },
        // 添加banner数据
        addBanner (index) {
            var self = this
            if(self.meetingliveForm.jsonData.headPicBanner.headSwiperPicList.length <= 5) {
                for(let i = 0; i < self.meetingliveForm.jsonData.headPicBanner.headSwiperPicList.length; i++) {
                    
                    if (self.meetingliveForm.jsonData.headPicBanner.headSwiperPicList[i].headSwiperPic.trim() == '') {
                        this.$message.error('楼层01轮播图：您还有未完成的banner图位');
                        return 
                    }
                    // if (self.meetingliveForm.jsonData.headPicBanner.headSwiperPicList[i].picUrlPc.trim() == ''){
                    //     this.$message.error('楼层01轮播图：PC链接不能为空,若无链接可填写"#"');
                    //     return
                    // } else 
                    if (self.meetingliveForm.jsonData.headPicBanner.headSwiperPicList[i].picUrlPc.trim() !== ''){
                        if(self.meetingliveForm.jsonData.headPicBanner.headSwiperPicList[i].picUrlPc.trim() == '#'){
                            self.meetingliveForm.jsonData.headPicBanner.headSwiperPicList[i].picUrlPc == '#'
                        } else {
                            var urlReg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
                            if(!urlReg.test(self.meetingliveForm.jsonData.headPicBanner.headSwiperPicList[i].picUrlPc.trim())){
                                this.$message.error('楼层01轮播图：PC链接格式不正确');
                                return
                            }
                        }
                    }
                }
                self.meetingliveForm.jsonData.headPicBanner.headSwiperPicList.splice((index+1), 0, {
                    headSwiperPic: '',
                    picUrlPc: '',
                })
            } else {
                self.$message.error('最多添加6组banner');
                return
            }    
        },
        //删除banner数据
        delBanner(index) {
            var headArr = this.meetingliveForm.jsonData.headPicBanner.headSwiperPicList
            // console.log(index, headArr)
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
            // console.log(objName,index)
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
                    self.meetingliveForm.pcImg= item.picUrl
                } else if (self.chooseImgObjIndex == 1) {
                    self.meetingliveForm.mImg = item.picUrl
                }
            } else if (self.chooseImgObjName == 'headSwiperPicList') {
                self.meetingliveForm.jsonData.headPicBanner.headSwiperPicList[self.chooseImgObjIndex].headSwiperPic = item.picUrl
            } else if (self.chooseImgObjName == 'headArticleList') {
                self.meetingliveForm.jsonData.headPicBanner.headArticleList[self.chooseImgObjIndex].headArticlePic = item.picUrl
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

        //---------------------搜索会场报道相关-------------------
        meetingLiveDefaultChange(val){
            if (val && this.meetingliveForm.meetingReportListId == '') {
                this.openAddMeetingLiveList()
            }
        },
        openAddMeetingLiveList () {
            this.showMeetingLiveLib = true
            this.searchMeetingLive(0)
        },
        searchMeetingLive (type){
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchMeetingLiveForm))
            data.name = data.name.toString().trim()
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
                url: "/meetingReportList/list",
                contentType: "application/json",
			    data: JSON.stringify(data),
			    dataType: "json",
			    success: function(res){
					if(res.code == 200){
                        self.meetingLiveTableData = res.page.list
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
        handleCurrentChange2 (val) {
            this.pagination2.currPage = val
            this.searchMeetingLive()
        },
        backToEditFromMeetingLive () {
            if (this.meetingliveForm.meetingReportListId == '') {
                this.meetingliveForm.jsonData.venueReport.isShowFloor = false
            }
            this.showMeetingLiveLib = false
            this.searchMeetingLiveForm = {
                name:'',
                delStatus:'1',
                reportTopicId:'-1'
            },
            this.meetingLiveTableData = []
            this.pagination2 = {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            }
        },
        addThisMeetingLive (item) {
            // console.log(item)
            this.meetingliveForm.meetingReportListId = item.id
            this.meetingliveForm.jsonData.venueReport.reportTitle = item.name
            this.backToEditFromMeetingLive()
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
                this.meetingliveForm.jsonData.calendar.isShowFloor = false
            }
            this.showCalendarLib = false
            this.searchCalendarForm = {
                meetingAgendaTitle:'',
                meetingAgendaStatus:'0',
                meetingAgendaReportTopicId:'-1',
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
            // console.log(item)
            this.meetingliveForm.meetingAgendaId = item.meetingAgendaId
            this.meetingliveForm.jsonData.calendar.calendarTitle = item.meetingAgendaTitle
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
            this.meetingliveForm.meetingCooperationId = item.meetingCooperationId
            this.meetingliveForm.jsonData.cooperation.cooperationTitle = item.meetingCooperationTitle
            this.backToEditFromCoperation()
        },
        backToEditFromCoperation(){
            if (this.meetingliveForm.meetingCooperationId == '') {
                this.meetingliveForm.jsonData.cooperation.isShowFloor = false
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
            // console.log('数据', self.meetingliveForm)
            self.$refs[formName].validate((valid) => {
                if(valid) {
                    self.saveMeetingLive(type)
                }
            })
        },
        //新建或修改保存报名专题
        saveMeetingLive(item) {
            var self = this
            var urlReg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
            if (self.typeOfPage == 'creat') {
                var reqUrl = '/reportTopic/save'
                self.meetingliveForm.publishStatus = '0'
            } else if (self.typeOfPage == 'edit') {
                var reqUrl = '/reportTopic/update'
            }
            if(self.meetingliveForm.pcLink.trim() !== '#') {
                if (self.meetingliveForm.pcLink.trim() == '') {
                    self.$message.error('PC链接不能为空，暂无链接可填写"#"')
                    return
                } else if(!urlReg.test(self.meetingliveForm.pcLink.trim())) {
                    self.$message.error('PC链接格式不正确')
                    return
                }
            }
            if(self.meetingliveForm.mLink.trim() !== '#') {
                if (self.meetingliveForm.mLink.trim() == '') {
                    self.$message.error('H5链接不能为空，暂无链接可填写"#"')
                    return
                } else if(!urlReg.test(self.meetingliveForm.mLink.trim())) {
                    self.$message.error('H5链接格式不正确')
                    return
                }
            }
            //大数据JSON处理
            if(self.meetingliveForm.jsonData.headPicBanner.isShowFloor) {
                for(let i = 0; i < self.meetingliveForm.jsonData.headPicBanner.headSwiperPicList.length; i++) {
                    if (self.meetingliveForm.jsonData.headPicBanner.headSwiperPicList[i].headSwiperPic.trim() == '') {
                        self.$message.error('楼层01轮播图：您还有未完成的banner图位');
                        return
                    } 
                    if (self.meetingliveForm.jsonData.headPicBanner.headSwiperPicList[i].picUrlPc.trim() !== ''){
                        if(self.meetingliveForm.jsonData.headPicBanner.headSwiperPicList[i].picUrlPc.trim() == '#'){
                            self.meetingliveForm.jsonData.headPicBanner.headSwiperPicList[i].picUrlPc == '#'
                        } else {
                            if(!urlReg.test(self.meetingliveForm.jsonData.headPicBanner.headSwiperPicList[i].picUrlPc.trim())){
                                this.$message.error('楼层01轮播图：PC链接格式不正确');
                                return
                            }
                        }
                    }
                }
                for(let k = 0; k < self.meetingliveForm.jsonData.headPicBanner.headArticleList.length; k++) {
                    if(self.meetingliveForm.jsonData.headPicBanner.headArticleList[k].headArticlePic.trim() == ''){
                        self.$message.error('楼层01头条文字区：你还有图片未上传');
                        return 
                    }
                    if (self.meetingliveForm.jsonData.headPicBanner.headArticleList[k].picUrlPc.trim() !== ''){
                        if(self.meetingliveForm.jsonData.headPicBanner.headArticleList[k].picUrlPc.trim() == '#'){
                            self.meetingliveForm.jsonData.headPicBanner.headArticleList[k].picUrlPc == '#'
                        } else {
                            if(!urlReg.test(self.meetingliveForm.jsonData.headPicBanner.headArticleList[k].picUrlPc.trim())){
                                this.$message.error('楼层01头条文字区：PC链接格式不正确');
                                return
                            }
                        }
                    }
                    if (self.meetingliveForm.jsonData.headPicBanner.headArticleList[k].picUrlMobile.trim() !== ''){
                        if(self.meetingliveForm.jsonData.headPicBanner.headArticleList[k].picUrlMobile.trim() == '#'){
                            self.meetingliveForm.jsonData.headPicBanner.headArticleList[k].picUrlMobile == '#'
                        } else {
                            if(!urlReg.test(self.meetingliveForm.jsonData.headPicBanner.headArticleList[k].picUrlMobile.trim())){
                                self.$message.error('楼层01头条文字区：H5链接格式不正确');
                                return
                            }
                        }
                    }
                    if(self.meetingliveForm.jsonData.headPicBanner.headArticleList[k].articleTitle.trim() == '') {
                        self.$message.error('楼层01头条文字区：标题不能为空');
                        return
                    }
                    if(self.meetingliveForm.jsonData.headPicBanner.headArticleList[k].articleDesc.trim() == '') {
                        self.$message.error('楼层01头条文字区：摘要不能为空');
                        return
                    }

                }
            }
            if(self.meetingliveForm.jsonData.calendar.isShowFloor) {
                var calendar = self.meetingliveForm.jsonData.calendar
                if (calendar.floorTitle.trim() == '' || calendar.navTitle.trim() == '') {
                    self.$message.error('楼层03：标题和导航标题均不能为空');
                    return
                }
            }
            if(self.meetingliveForm.jsonData.cooperation.isShowFloor) {
                var cooperation = self.meetingliveForm.jsonData.cooperation
                if(cooperation.floorTitle.trim() == '' || cooperation.navTitle.trim() == '') {
                    self.$message.error('楼层04：标题和导航标题均不能为空');
                    return
                }
            }

            var submitData = JSON.parse(JSON.stringify(self.meetingliveForm))
            // if(submitData.jsonData.headPicBanner.isShowFloor) {
            //     for(let i = 0; i < submitData.jsonData.headPicBanner.headSwiperPicList.length; i++) {
            //         var url1 = submitData.jsonData.headPicBanner.headSwiperPicList[i].headSwiperPic.trim()
            //         url1 = '/' + url1.split('/').slice(3).join('/');
            //         submitData.jsonData.headPicBanner.headSwiperPicList[i].headSwiperPic = url1
            //     }
            //     for(let k = 0; k < submitData.jsonData.headPicBanner.headArticleList.length; k++) {
            //         var url2 = submitData.jsonData.headPicBanner.headArticleList[k].headArticlePic.trim()
            //         url2 = '/' + url2.split('/').slice(3).join('/');
            //         submitData.jsonData.headPicBanner.headArticleList[k].headArticlePic = url2
            //     }
            // }
            $.base64.utf8encode = true;
            var jsonString = JSON.stringify(submitData.jsonData);
            var json64 = $.base64.btoa(jsonString);
            submitData.jsonData = json64
            $.ajax({
                type: "POST",
                url: reqUrl,
                contentType: "application/json",
                data: JSON.stringify(submitData),
                dataType: "json",
                beforeSend: function () {
                    self.load();
                },
                complete: function () {
                   self.disLoad();
                },
                success: function(res){
                    if(res.code == 200){
                        self.$message.success('保存成功')
                        console.log('保存报道专题返回',res)
                        if (self.typeOfPage == 'creat') {
                            if (item == 0) { // 0保存不发布
                                setCookie ('createditmeetinglive', '', 1) 
                                window.parent.location.href = '/index.html#modules/meeting/meetinglivepage_list.html'
                            } else if (item == 1) { // 1保存并发布
                                //回传id
                                self.meetingliveForm.id = res.reportTopicId
                                self.submitMeetingLive()
                            }
                        } else if (self.typeOfPage == 'edit') {
                            if (item == 0) { // 0保存不发布
                                setCookie ('createditmeetinglive', '', 1) 
                                window.parent.location.href = '/index.html#modules/meeting/meetinglivepage_list.html'
                            } else if (item == 1) { // 1保存并发布
                                self.submitMeetingLive()
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
        },
         //提交会议--更新发布状态即可
        submitMeetingLive () {
            var self = this
            //publishStatus=1 发布
            var _data = {
                id: self.meetingliveForm.id.toString(),
                publishStatus: '1'
            }
            $.ajax({
                type: "POST",
                url: "/reportTopic/push",
                contentType: "application/json",
                data: JSON.stringify(_data),
                dataType: "json",
                beforeSend: function () {
                    self.load();
                },
                complete: function () {
                   self.disLoad();
                },
                success: function(res){
                    if(res.code == 200){
                        self.$message.success('发布成功')
                        setCookie ('createditmeetinglive', '', 1) 
                        window.parent.location.href = '/index.html#modules/meeting/meetinglivepage_list.html'
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

        //编辑会议---数据反显
        getEditMeetingOrign(type) {
            var self = this
            $.ajax({
                type: "POST",
                url: "/reportTopic/info/"+ type.toString(),
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
        },
        //编辑反显前数据过滤
        editMeetingFilter (tempObj) {
            console.log('tempObj',tempObj)
            var self = this
            let data = JSON.parse(JSON.stringify(tempObj))
            if(data.mLink == null) {
                data.mLink = ''
            }
            if(data.pcLink == null) {
                data.pcLink = ''
            }
            data.mImg = self.picBaseUrl + data.mImg
            data.pcImg = self.picBaseUrl + data.pcImg
            // //json64反解
            let map = $.base64.atob(tempObj.jsonData, true)
            data.jsonData = JSON.parse(map)
            // if(data.jsonData.headPicBanner.isShowFloor) {
            //     for(let i = 0; i < data.jsonData.headPicBanner.headSwiperPicList.length; i++) {
            //         data.jsonData.headPicBanner.headSwiperPicList[i].headSwiperPic = self.picBaseUrl + data.jsonData.headPicBanner.headSwiperPicList[i].headSwiperPic
            //     }
            //     for(let k = 0; k < data.jsonData.headPicBanner.headArticleList.length; k++) {
            //         data.jsonData.headPicBanner.headArticleList[k].headArticlePic = self.picBaseUrl + data.jsonData.headPicBanner.headArticleList[k].headArticlePic
            //     }
            // }
            //关键词数组还原
            if (tempObj.newsKeywords !== '') {
                this.meetingTagArray = data.keywords.split(',')
            }
            this.meetingliveForm = data
            this.$refs['meetingliveForm'].resetFields()
        },

        closeAndBack () {
            setCookie ('createditmeetinglive', '', 1) 
            window.parent.location.href = '/index.html#modules/meeting/meetinglivepage_list.html'
        }

    }



})