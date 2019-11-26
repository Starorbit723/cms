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
                                picUrlPc: '4',
                                picUrlMobile: '4',
                            }
                        ],
                        headArticleList: [
                            {
                                headArticlePic: '',
                                picUrlPc: '',
                                picUrlMobile: '',
                                articleTitle: '',
                                articleDest: '',
                            }
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

            },
             //封面图库相关
            showCoverimgLib:false,
            chooseImgType:'',
            searchCoverimgForm:{
                picTitle:'',
                picType:'0'//0封面图库 1内容图库 2图为图库
            },
            coverimgTableData:[],
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


         //折叠面板改变
         handleChangeCollapse(){
        },


        // ----------------------封面图库相关---------------------
        //封面图页面变化
        handleCurrentChange (val) {
            this.pagination1.currPage = val
            this.searchCoverImg()
        },
        //打开封面图库弹层  type：0  封面图  1会议头图-pc  2会议头图-M
        openAddCoverImg (type) {
            this.showCoverimgLib = true
            this.searchCoverImg(0)
            this.chooseImgType = type
        },
        //选择了某一张封面图片
        addThisCoverImg (item) {
            this.$refs['meetingliveForm'].clearValidate();
            if (this.chooseImgType == 1) {
                this.meetingliveForm.meetingPCpic = item.picUrl
            } else if (this.chooseImgType == 2) {
                this.meetingliveForm.meetingMobilepic = item.picUrl
            }
            this.backToEdit()
        },
        //返回编辑页
        backToEdit (){
            this.chooseImgType = ''
            this.showCoverimgLib = false
            this.searchCoverimgForm = {
                picTitle:'',
                picType:'0'//0封面图库 1内容图库 2图为图库
            }
            this.coverimgTableData = []
            this.pagination1 = {
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
                        self.coverimgTableData = res.page.list
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
                this.meetingliveForm.meetingliveJsonData.coperation.isShowFloor = false
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





    }



})