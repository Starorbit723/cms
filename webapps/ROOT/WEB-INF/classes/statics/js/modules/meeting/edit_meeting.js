var vm = new Vue({
    el: '#edit_meeting',
    data () {
        var validateScaleNumber = (rule, value, callback) => {
            var urlReg = /^[0-9]*[1-9][0-9]*$/;
            if (!urlReg.test(value)) {
                callback(new Error('规模人数只能为正整数'));
            } else {
                callback();
            }
        }
        var validateUrl = (rule, value, callback) => {
            var urlReg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
            if (value == '') {
                callback(new Error('链接不能为空'));
            } else if (value.trim() == '#') {
                callback();
            } else if (!urlReg.test(value)) {
                callback(new Error('链接格式不正确，暂无链接可填写"#"'));
            } else {
                callback();
            }
        }
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
            //文章基本信息
            meetingForm:{
                meetingId:'',//主键
                meetingTitle:'',//标题
                meetingStarTime:'',//开始时间
                meetingEndTime:'',//结束时间
                meetingType:'',//类型
                meetingUrl:'',//会议链接
                meetingDesc:'',//简介
                meetingStatus:'',//会议状态  1：发布(上线) 2：不发布(下线) 3：待发布(草稿) 4删除
                meetingKeywords:'', //会议关键词
                meetingTheme:'',//会议主题
                meetingOrganizer:'',//主办单位
                meetingCoOrganizer:'',//协办单位
                meetingScaleNumber:'',//规模人数
                meetingHoldTime:'',//举办时间字符串
                meetingAddress:'',//会议举办地址
                meetingAgendaId:'',//日程ID
                meetingGuestId:'',//嘉宾ID
                meetingVoteId:'',//投票ID
                meetingInteractionId:'',//文章问答互动ID
                meetingDiagramId:'',//高清组图ID
                meetingCooperationId:'',//合作机构ID
                meetingCrtUserId:'',//创建人编号
                meetingCrtTime:'',//创建时间
                meetingModUserId:'',//更新人编号
                meetingModTime:'',//更新时间
                meetingCrtUserName:'',//创建人姓名
                meetingTemplateId:'',
                meetingTemplateMid:'',
                meetingTemplateAddress:'',
                meetingTemplateMaddress:'',
                meetingSignUpUrl:'',//报名链接
                meetingJsonData:{ //前端渲染大数据
                    headPicBanner:{
                        isShowFloor:true,
                        isShowDefaultModel: true,
                        isShowSelfConfig: false,
                        picUrlPc: '',
                        picUrlMobile: '',
                        picLink:'',
                        selfConfigZone:[
                        // {
                        //     type:'text',
                        //     titleCn:'标题',
                        //     titleEn:'TITLE',
                        //     innerText:'内容',
                        // },{
                        //     type:'img',
                        //     titleCn:'标题',
                        //     titleEn:'TITLE',
                        //     toLinkUrl:"https://www.baidu.com",
                        //     imgUrl:'https://cvinfo-test.obs.cn-north-1.myhuaweicloud.com/head/6546992352198656.jpg',
                        // }
                        ]
                    },
                    basicInformation:{
                        isShowFloor:true,
                        isShowDefaultModel: true,
                        isShowSelfConfig: false,
                        selfConfigZone:[]
                    },
                    meetingIntroduce:{
                        floorTitleCn:'活动介绍',
                        floorTitleEn:'ACTIVITY DESCRIPTION',
                        isShowFloor:true,
                        isShowDefaultModel: true,
                        isShowSelfConfig: false,
                        paragraph:[{
                            innerText:''
                        }],
                        selfConfigZone:[]
                    },
                    calendar:{
                        floorTitleCn:'会议议程',
                        floorTitleEn:'MEETING AGENDA',
                        isShowFloor:true,
                        isShowDefaultModel: false,
                        isShowSelfConfig: false,
                        selfConfigZone:[]
                    },
                    guest:{
                        floorTitleCn:'嘉宾介绍',
                        floorTitleEn:'GUEST INTRODUCTION',
                        isShowFloor:true,
                        isShowDefaultModel: false,
                        isShowSelfConfig: false,
                        selfConfigZone:[]
                    },
                    guestOpinion:{
                        floorTitleCn:'嘉宾观点',
                        floorTitleEn:'GUEST VIEWS',
                        isShowFloor:true,
                        isShowDefaultModel: true,
                        isShowSelfConfig: false,
                        opinionList:[{
                            guestName:'',
                            guestPosition:'',
                            guestCompany:'',
                            guestImg:'',
                            guestOpinionText:''
                        }],
                        selfConfigZone:[]
                    },
                    vote:{
                        floorTitleCn:'投票',
                        floorTitleEn:'VOTE',
                        isShowFloor:true,
                        isShowDefaultModel: false,
                        isShowSelfConfig: false,
                        selfConfigZone:[]
                    },
                    articleQuestion:{
                        floorTitleCn:'相关报道',
                        floorTitleEn:'RELEVANT REPORTS',
                        isShowFloor:true,
                        isShowDefaultModel: false,
                        isShowSelfConfig: false,
                        selfConfigZone:[]
                    },
                    pictureGroup:{
                        floorTitleCn:'图片直播',
                        floorTitleEn:'PICTURE',
                        isShowFloor:true,
                        isShowDefaultModel: false,
                        isShowSelfConfig: false,
                        selfConfigZone:[]
                    },
                    location:{
                        floorTitleCn:'会议地点',
                        floorTitleEn:'WHERE',
                        isShowFloor:true,
                        isShowDefaultModel: true,
                        isShowSelfConfig: false,
                        locationImgUrl:'',
                        selfConfigZone:[]
                    },
                    coperation:{
                        floorTitleCn:'合作伙伴',
                        floorTitleEn:'PARTNER',
                        isShowFloor:true,
                        isShowDefaultModel: false,
                        isShowSelfConfig: false,
                        selfConfigZone:[]
                    }
                }
            },
            meetingFormRules:{
                meetingTitle: [
                    { required: true, message: '会议标题不能为空', trigger: 'change' },
                    { max: 50, message: '您输入的字数超过50个字', trigger: 'change' }
                ],
                meetingDesc:[
                    { required: true, message: '请填写会议简介', trigger: 'change' }
                ],
                meetingKeywords:[
                    { required: true, message: '请填写会议关键词', trigger: 'change' }
                ],
                meetingTheme: [
                    { required: true, message: '主题不能为空', trigger: 'change' },
                    { max: 36, message: '您输入的字数超过36个字', trigger: 'change' }
                ],
                meetingOrganizer:[
                    { required: true, message: '请填写主办单位', trigger: 'change' }
                ],
                meetingScaleNumber:[
                    { required: true, validator: validateScaleNumber, trigger: 'change' }
                ],
                meetingHoldTime:[
                    { required: true, message: '请填写举办时间', trigger: 'change' }
                ],
                meetingAddress:[
                    { required: true, message: '请填写举办地址', trigger: 'change' }
                ],
                meetingSignUpUrl:[
                    { required: true, validator: validateUrl, trigger: 'change' }
                ]
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
            //内容图库相关
            showContentImgLib:false,
            chooseImgObjName:'',
            chooseImgObjIndex:'',
            searchContentImgForm:{
                picTitle:'',
                picType:'1'//0封面图库 1内容图库 2图为图库
            },
            contentImgTableData:[],
            pagination2: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
            //展示日程表
            showCalendarLib:false,
            searchCalendarForm:{
                meetingAgendaTitle:''
            },
            calendarTableData:[],
            pagination3: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
            //展示嘉宾数据表
            showGuestLib:false,
            searchGuestForm:{
                meetingGuestTitle:''
            },
            guestTableData:[],
            pagination4: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
            //展示嘉宾库
            currentOpinionIndex:'',
            showGuestInfoLib:false,
            searchGuestInfoForm:{
                guestName:''
            },
            guestInfoTableData:[],
            pagination5: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
            //展示投票
            showVoteLib:false,
            searchVoteForm:{
                voteTitle:''
            },
            voteTableData:[],
            pagination6: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
            //展示文章问答
            showArticleQuestionLib:false,
            searchArticleQuestionForm:{
                interactionTitle:''
            },
            articleQuestionTableData:[],
            pagination7: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
            //展示高清组图
            showPictrueGroupLib:false,
            searchPictrueGroupForm:{
                diagramTitle:''
            },
            pictrueGroupTableData:[],
            pagination8: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
            //展示合作伙伴
            showCoperationLib:false,
            searchCoperationForm:{
                meetingCooperationTitle:''
            },
            coperationTableData:[],
            pagination9: {
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
        var type = getCookie('createditmeeting')
        if (type == '' || type == undefined) {
            this.typeOfPage = 'creat'
        } else {
            this.typeOfPage = 'edit'
            this.getEditMeetingOrign(type)
        }
        console.log('type',this.typeOfPage)
    },
    methods:{
        //嘉宾观点上移
        opinionMoveUp(index){
            console.log(index)
            var moveArr = JSON.parse(JSON.stringify(this.meetingForm.meetingJsonData.guestOpinion.opinionList))
            let temp = moveArr[index - 1]
            let temp2 = moveArr[index]
            moveArr[index - 1] = temp2
            moveArr[index] = temp
            this.meetingForm.meetingJsonData.guestOpinion.opinionList = moveArr
        },
        //嘉宾观点下移
        opinionMoveDown(index){
            var moveArr = JSON.parse(JSON.stringify(this.meetingForm.meetingJsonData.guestOpinion.opinionList))
            let temp = moveArr[index]
            let temp2 = moveArr[index + 1]
            moveArr[index + 1] = temp
            moveArr[index] = temp2
            this.meetingForm.meetingJsonData.guestOpinion.opinionList = moveArr
        },
        //添加嘉宾观点
        addGuestOpinion(index){
            for (let i = 0; i < this.meetingForm.meetingJsonData.guestOpinion.opinionList.length; i++) {
                if (this.meetingForm.meetingJsonData.guestOpinion.opinionList[i].guestOpinionText.trim() == '' || this.meetingForm.meetingJsonData.guestOpinion.opinionList[i].guestImg == '') {
                    this.$message.error('您还有未完成的观点');
                    return 
                }
            }
            this.meetingForm.meetingJsonData.guestOpinion.opinionList.splice((index + 1), 0, {
                guestName:'',
                guestPosition:'',
                guestCompany:'',
                guestImg:'',
                guestOpinionText:''
            }); 
        },
        //删除嘉宾观点
        delGuestOpinion(index) {
            if (this.meetingForm.meetingJsonData.guestOpinion.opinionList.length >= 2) {
                this.meetingForm.meetingJsonData.guestOpinion.opinionList.splice(index, 1);
            } else {
                this.$message.warning('至少保留一条观点')
            }
        },
        //会议标签改变
        meetingTagChange (val) {
            console.log('meetingTagChange',val)
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
            this.meetingForm.meetingKeywords = tempStr
            console.log('当前newsKeywords',this.meetingForm.meetingKeywords)
        },
        //添加会议介绍段落
        addParagraph (index) {
            for (let i = 0; i < this.meetingForm.meetingJsonData.meetingIntroduce.paragraph.length; i++) {
                if (this.meetingForm.meetingJsonData.meetingIntroduce.paragraph[i].innerText.trim() == '') {
                    this.$message.error('您还有未完成的段落');
                    return 
                }
            }
            this.meetingForm.meetingJsonData.meetingIntroduce.paragraph.splice((index+1), 0, {
                innerText:''
            }); 
        },
        //移除会议介绍段落
        removeParagraph (index) {
            if (this.meetingForm.meetingJsonData.meetingIntroduce.paragraph.length >= 2) {
                this.meetingForm.meetingJsonData.meetingIntroduce.paragraph.splice(index, 1); 
            } else {
                this.$message.error('至少保留一个段落')
            }
        },
        //折叠面板改变
        handleChangeCollapse(){
        },
        //新增文案楼层
        addNewSelfConfigFloor(objName,type){
            var self = this
            let currentLength = this.meetingForm.meetingJsonData[objName].selfConfigZone.length
            if (currentLength >= 1) { //现有一条以上数据
                let lastItem = this.meetingForm.meetingJsonData[objName].selfConfigZone[currentLength - 1]
                console.log('lastItem',lastItem)
                //判断上一篇内容是否填入，如果没填入不能进行后续新建
                if (lastItem.type == 'text' && (lastItem.titleCn.trim() == '' || lastItem.titleEn.trim() == '' || lastItem.innerText.trim() == '')) {
                    self.$message.error('上一项内容未填写完成，无法新建新内容条目')
                    return
                } else if (lastItem.type == 'img' && (lastItem.titleCn.trim() == '' || lastItem.titleEn.trim() == '' || lastItem.imgUrl.trim() == '')) {
                    self.$message.error('上一项内容未填写完成，无法新建新内容条目')
                    return
                }
            }
            if (type == 'text') {
                self.meetingForm.meetingJsonData[objName].selfConfigZone.push({
                    type:'text',
                    titleCn:'',
                    titleEn:'',
                    innerText:'',
                })
            } else if (type == 'img') {
                self.meetingForm.meetingJsonData[objName].selfConfigZone.push({
                    type:'img',
                    titleCn:'',
                    titleEn:'',
                    toLinkUrl:'',
                    imgUrl:'',
                })
            }
            
        },
        //移除某一个自定义条目
        removeSelfConfigItem (objName,index){
            console.log(objName,index,this.meetingForm.meetingJsonData[objName].selfConfigZone)
            this.meetingForm.meetingJsonData[objName].selfConfigZone.splice(index, 1); 
            console.log(this.meetingForm.meetingJsonData[objName].selfConfigZone)
        },
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
            this.$refs['meetingForm'].clearValidate();
            if (this.chooseImgType == 0) {
                this.meetingForm.meetingImg = item.picUrl
            } else if (this.chooseImgType == 1) {
                this.meetingForm.meetingJsonData.headPicBanner.picUrlPc = item.picUrl
            } else if (this.chooseImgType == 2) {
                this.meetingForm.meetingJsonData.headPicBanner.picUrlMobile = item.picUrl
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
        //内容图页面变化
        handleCurrentChange2 (val) {
            this.pagination2.currPage = val
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
                        self.contentImgTableData = res.page.list
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
        //选择了某一张内容图片
        addThisContentImg (item) {
            //当chooseImgObjName == map  单独处理一下，选择的是location中的地图图片
            if (this.chooseImgObjName == 'map' && this.chooseImgObjIndex == '0') {
                this.meetingForm.meetingJsonData.location.locationImgUrl = item.picUrl
            } else {
                this.meetingForm.meetingJsonData[this.chooseImgObjName].selfConfigZone[this.chooseImgObjIndex].imgUrl = item.picUrl
            }
            this.backToEdit2()
        },
        //返回编辑页
        backToEdit2 (){
            this.showContentImgLib = false
            this.chooseImgObjName = ''
            this.chooseImgObjIndex = ''
            this.searchContentImgForm = {
                picTitle:'',
                picType:'1'//0封面图库 1内容图库 2图为图库
            }
            this.contentImgTableData = [],
            this.pagination2 = {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            }
        },
        //--------------------搜索日程表相关--------------------
        calendarDefaultChange(val){
            if (val && this.meetingForm.meetingAgendaId == '') {
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
            if (this.meetingForm.meetingAgendaId == '') {
                this.meetingForm.meetingJsonData.calendar.isShowDefaultModel = false
            }
            this.showCalendarLib = false
            this.searchCalendarForm = {
                meetingTitle:''
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
            this.meetingForm.meetingAgendaId = item.meetingAgendaId
            this.backToEditFromCalendar()
        },
        //--------------------搜索嘉宾表相关--------------------
        guestDefaultChange(val){
            if (val && this.meetingForm.meetingGuestId == '') {
                this.openAddGuestList()
            }
        },
        openAddGuestList () {
            this.showGuestLib = true
            this.searchGuest(0)
        },
        searchGuest (type){
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchGuestForm))
            data.meetingGuestTitle = data.meetingGuestTitle.toString().trim()
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
                url: "/meeting/guest/list",
                contentType: "application/json",
			    data: JSON.stringify(data),
			    dataType: "json",
			    success: function(res){
					if(res.code == 200){
                        self.guestTableData = res.page.list
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
            this.searchGuest()
        },
        backToEditFromGuest () {
            if (this.meetingForm.meetingGuestId == '') {
                this.meetingForm.meetingJsonData.guest.isShowDefaultModel = false
            }
            this.showGuestLib=false
            this.searchGuestForm={
                meetingTitle:''
            },
            this.guestTableData=[]
            this.pagination4= {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            }
        },
        addThisGuest (item) {
            this.meetingForm.meetingGuestId = item.meetingGuestId
            this.backToEditFromGuest()
        },
        //--------------------搜索嘉宾库相关--------------------
        openGuestMessageLib(index) {
            this.showGuestInfoLib = true
            this.currentOpinionIndex = index
            this.searchGuestInfo(0)
        },
        searchGuestInfo (type){
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchGuestInfoForm))
            data.guestName = data.guestName.toString().trim()
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
            $.ajax({
				type: "POST",
                url: "/guest/list",
                contentType: "application/json",
			    data: JSON.stringify(data),
			    dataType: "json",
			    success: function(res){
					if(res.code == 200){
                        self.guestInfoTableData = res.page.list
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
        handleCurrentChange5 (val) {
            this.pagination5.currPage = val
            this.searchGuestInfo()
        },
        addThisGuestInfo (item) {
            this.meetingForm.meetingJsonData.guestOpinion.opinionList[this.currentOpinionIndex].guestName = item.guestName
            this.meetingForm.meetingJsonData.guestOpinion.opinionList[this.currentOpinionIndex].guestPosition = item.guestPosition
            this.meetingForm.meetingJsonData.guestOpinion.opinionList[this.currentOpinionIndex].guestCompany = item.guestCompany
            this.meetingForm.meetingJsonData.guestOpinion.opinionList[this.currentOpinionIndex].guestImg = item.guestImg
            this.backToEditFromGuestInfo()
        },
        backToEditFromGuestInfo(){
            this.currentOpinionIndex = ''
            this.showGuestInfoLib = false
            this.searchGuestInfoForm = {
                guestName:''
            }
            this.guestInfoTableData = []
            this.pagination5 = {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            }
        },
        //--------------------搜索投票相关--------------------
        voteDefaultChange (val){
            if (val && this.meetingForm.meetingVoteId == '') {
                this.openAddVoteList()
            }
        },
        openAddVoteList () {
            this.showVoteLib = true
            this.searchVote(0)
        },
        searchVote (type){
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchVoteForm))
            data.voteTitle = data.voteTitle.toString().trim()
            if (type == 0) {
                Object.assign(data,{
                    page: '1',
                    limit: self.pagination6.pageSize.toString()
                })
            } else {
                Object.assign(data,{
                    page: self.pagination6.currPage.toString(),
                    limit: self.pagination6.pageSize.toString()
                })
            }
            $.ajax({
				type: "POST",
                url: "/vote/list",
                contentType: "application/json",
			    data: JSON.stringify(data),
			    dataType: "json",
			    success: function(res){
					if(res.code == 200){
                        self.voteTableData = res.page.list
                        self.pagination6 = {
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
        handleCurrentChange6 (val) {
            this.pagination6.currPage = val
            this.searchVote()
        },
        addThisVote (item) {
            this.meetingForm.meetingVoteId = item.voteId
            this.backToEditFromVote()
        },
        backToEditFromVote (){
            if (this.meetingForm.meetingVoteId == '') {
                this.meetingForm.meetingJsonData.vote.isShowDefaultModel = false
            }
            this.showVoteLib = false
            this.searchVoteForm = {
                voteTitle:''
            }
            this.voteTableData = []
            this.pagination6 = {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            }
        },
        //--------------------搜索文章问答相关--------------------
        articleQuestionDefaultChange (val){
            if (val && this.meetingForm.meetingInteractionId == '') {
                this.openAddArticleQuestionList()
            }
        },
        openAddArticleQuestionList () {
            this.showArticleQuestionLib = true
            this.searchArticleQuestion(0)
        },
        searchArticleQuestion (type){
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchArticleQuestionForm))
            data.interactionTitle = data.interactionTitle.toString().trim()
            if (type == 0) {
                Object.assign(data,{
                    page: '1',
                    limit: self.pagination7.pageSize.toString()
                })
            } else {
                Object.assign(data,{
                    page: self.pagination7.currPage.toString(),
                    limit: self.pagination7.pageSize.toString()
                })
            }
            $.ajax({
				type: "POST",
                url: "/interaction/list",
                contentType: "application/json",
			    data: JSON.stringify(data),
			    dataType: "json",
			    success: function(res){
					if(res.code == 200){
                        self.articleQuestionTableData = res.page.list
                        self.pagination7 = {
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
        handleCurrentChange7 (val) {
            this.pagination7.currPage = val
            this.searchArticleQuestion()
        },
        addThisArticleQuestion (item) {
            this.meetingForm.meetingInteractionId = item.interactionId
            this.backToEditFromArticleQuestion()
        },
        backToEditFromArticleQuestion(){
            if (this.meetingForm.meetingInteractionId == '') {
                this.meetingForm.meetingJsonData.articleQuestion.isShowDefaultModel = false
            }
            this.showArticleQuestionLib=false
            this.searchArticleQuestionForm={
                interactionTitle:''
            }
            this.articleQuestionTableData=[]
            this.pagination7= {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            }
        },
        //--------------------搜索高清组图相关--------------------
        pictureGroupDefaultChange (val){
            if (val && this.meetingForm.meetingDiagramId == '') {
                this.openAddPictureGroupList()
            }
        },
        openAddPictureGroupList () {
            this.showPictrueGroupLib = true
            this.searchPictureGroup(0)
        },
        searchPictureGroup (type){
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchPictrueGroupForm))
            data.diagramTitle = data.diagramTitle.toString().trim()
            if (type == 0) {
                Object.assign(data,{
                    page: '1',
                    limit: self.pagination8.pageSize.toString()
                })
            } else {
                Object.assign(data,{
                    page: self.pagination8.currPage.toString(),
                    limit: self.pagination8.pageSize.toString()
                })
            }
            $.ajax({
				type: "POST",
                url: "/diagram/list",
                contentType: "application/json",
			    data: JSON.stringify(data),
			    dataType: "json",
			    success: function(res){
					if(res.code == 200){
                        self.pictrueGroupTableData = res.page.list
                        self.pagination8 = {
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
        handleCurrentChange8 (val) {
            this.pagination8.currPage = val
            this.searchPictureGroup()
        },
        addThisPictureGroup (item) {
            this.meetingForm.meetingDiagramId = item.diagramId
            this.backToEditFromPictureGroup()
        },
        backToEditFromPictureGroup(){
            if (this.meetingForm.meetingDiagramId == '') {
                this.meetingForm.meetingJsonData.pictureGroup.isShowDefaultModel = false
            }
            this.showPictrueGroupLib=false
            this.searchPictrueGroupForm={
                diagramTitle:''
            }
            this.pictrueGroupTableData=[]
            this.pagination8={
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            }
        },
        //--------------------搜索合作伙伴相关--------------------
        coperationDefaultChange (val){
            if (val && this.meetingForm.meetingCooperationId == '') {
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
                    limit: self.pagination9.pageSize.toString()
                })
            } else {
                Object.assign(data,{
                    page: self.pagination9.currPage.toString(),
                    limit: self.pagination9.pageSize.toString()
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
                        self.pagination9 = {
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
        handleCurrentChange9 (val) {
            this.pagination9.currPage = val
            this.searchCoperation()
        },
        addThisCoperation (item) {
            this.meetingForm.meetingCooperationId = item.meetingCooperationId
            this.backToEditFromCoperation()
        },
        backToEditFromCoperation(){
            if (this.meetingForm.meetingCooperationId == '') {
                this.meetingForm.meetingJsonData.coperation.isShowDefaultModel = false
            }
            this.showCoperationLib=false
            this.searchCoperationForm={
                meetingTitle:''
            }
            this.coperationTableData=[]
            this.pagination9 = {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            }

        },
        //保存会议 formName---表单名称   type----提交类型
        testMeetingInfo(type,formName) {
            var self = this
            //判断报名时间和开始时间规则
            console.log('数据',self.meetingForm)
            self.$refs[formName].validate((valid) =>{
                if (valid) {
                    self.saveMeeting(type)
                }
            })
        },
        //新建或修改保存会议
        saveMeeting (type) {
            var self = this
            if (self.ajaxController) {
                //关闭请求开关
                self.ajaxController = false
                if (self.typeOfPage == 'creat') {
                    var reqUrl = '/meetingInfo/save'
                    self.meetingForm.meetingStatus = '0'
                } else if (self.typeOfPage == 'edit') {
                    var reqUrl = '/meetingInfo/update'
                }
                //大数据JSON处理
                var submitData = JSON.parse(JSON.stringify(self.meetingForm))
                $.base64.utf8encode = true;
                var jsonString = JSON.stringify(submitData.meetingJsonData);
                var json64 = $.base64.btoa(jsonString);
                submitData.meetingJsonData = json64
                $.ajax({
                    type: "POST",
                    url: reqUrl,
                    contentType: "application/json",
                    data: JSON.stringify(submitData),
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            self.$message.success('保存成功')
                            console.log('保存会议返回',res)
                            if (self.typeOfPage == 'creat') {
                                if (type == 0) { // 0保存不发布
                                    setCookie ('createditmeeting', '', 1) 
                                    window.parent.location.href = '/index.html#modules/meeting/meeting_list.html'
                                } else if (type == 1) { // 1保存并发布
                                    //回传id
                                    self.meetingForm.meetingId = res.meetingId
                                    self.submitMeeting()
                                }
                            } else if (self.typeOfPage == 'edit') {
                                if (type == 0) { // 0保存不发布
                                    setCookie ('createditmeeting', '', 1) 
                                    window.parent.location.href = '/index.html#modules/meeting/meeting_list.html'
                                } else if (type == 1) { // 1保存并发布
                                    self.submitMeeting()
                                }
                            }  
                        }else{
                            self.ajaxController = true
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
        //提交会议--更新发布状态即可
        submitMeeting () {
            var self = this
            //meetingStatus=1 待发布
            self.meetingForm.meetingStatus = '1'
            //大数据JSON处理
            var submitData = JSON.parse(JSON.stringify(self.meetingForm))
            $.base64.utf8encode = true;
            var jsonString = JSON.stringify(submitData.meetingJsonData);
            var json64 = $.base64.btoa(jsonString);
            submitData.meetingJsonData = json64
            $.ajax({
                type: "POST",
                url: "/meeting/update",
                contentType: "application/json",
                data: JSON.stringify(submitData),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.$message.success('发布成功')
                        setCookie ('createditmeeting', '', 1) 
                        window.parent.location.href = '/index.html#modules/meeting/meeting_list.html'
                    }else{
                        self.ajaxController = true
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
                url: "/meetingInfo/info/"+ type.toString(),
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
            let data = tempObj
            //json64反解
            let map = $.base64.atob(tempObj.meetingJsonData, true)
            data.meetingJsonData = JSON.parse(map)
            //关键词数组还原
            if (tempObj.newsKeywords !== '') {
                this.meetingTagArray = data.meetingKeywords.split(',')
            }
            this.meetingForm = data
            this.$refs['meetingForm'].resetFields()
        },
        //返回列表页
        closeAndBack () {
            setCookie ('createditmeeting', '', 1) 
            window.parent.location.href = '/index.html#modules/meeting/meeting_list.html'
        },
 
    }
    
})
