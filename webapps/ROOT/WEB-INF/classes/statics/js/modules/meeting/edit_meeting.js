var vm = new Vue({
    el: '#edit_meeting',
    data () {
        var validateUrl = (rule, value, callback) => {
            var urlReg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
            if (value =='') {
                callback(new Error('链接不能为空'));
            } else if (!urlReg.test(value)) {
                callback(new Error('链接格式不正确'));
            } else {
                callback();
            }
        }
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
            //新建或修改
            typeOfPage:'creat',
            //按钮请求开关
            ajaxController:true,
            //切换展示封面图库
            showCoverimgLib:false,
            //切换展示内容图库
            showContentImgLib:false,
            //省市区选项
            RegionOptions: [],
            //会议类型下拉选项
            meetingTypeOptions:[],
            //折叠面板组件实例
            activeNames: ['1','2','3','4','5','6','7','8','9','10'],
            //文章基本信息
            meetingForm:{
                meetingId:'',//主键
                meetingTitle:'',//标题
                meetingStarTime:'',//开始时间
                meetingEndTime:'',//结束时间
                meetingImg:'',//封面图
                meetingType:'',//类型
                meetingUrl:'',//会议链接
                meetingRegion:[],//会议所在区域-----前端自用字段
                meetingTimes:[],//会议时间数组-----前端自用字段
                meetingBaomingTimes:[], //会议报名时间-----前端自用字段
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
                meetingStatus:'',//会议状态  1：发布(上线) 2：不发布(下线) 3：待发布(草稿) 4删除
                meetingEnrollStarTime:'',//报名开始时间
                meetingEnrollEndTime:'',//报名结束时间
                meetingCrtUserName:'',//创建人姓名
                meetingJsonData:{ //前端渲染大数据
                    headPic:{
                        isShow: true,
                        picUrl: '',
                        isShowSelfConfig: true,
                        selfConfigZone:[{
                            type:'text',
                            titleCn:'标题',
                            titleEn:'TITLE',
                            innerText:'内容',
                        },{
                            type:'img',
                            titleCn:'标题',
                            titleEn:'TITLE',
                            imgUrl:'https://cvinfo-test.obs.cn-north-1.myhuaweicloud.com/head/6546992352198656.jpg',
                        }]
                    },
                    introduce:{
                        isShow: true,
                        isShowSelfConfig: true,
                        selfConfigZone:[]
                    },
                    guest:{
                        isShow: true,
                        isShowSelfConfig: true,
                        selfConfigZone:[]
                    },
                    timeLine:{
                        isShow: true,
                        timeConfig:[{
                            singleDate:'',
                            list:[{
                                time:'',
                                text:''
                            }]
                        }],
                        isShowSelfConfig: true,
                        selfConfigZone:[]
                    }
                }
            },
            meetingFormRules:{
                meetingTitle: [
                    { required: true, message: '会议标题不能为空', trigger: 'change' },
                    { max: 36, message: '您输入的字数超过36个字', trigger: 'change' }
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
                meetingType:[
                    { required: true, message: '会议类型不能为空', trigger: 'change' }
                ],
                meetingUrl:[
                    { required: true, validator: validateUrl, trigger: 'change' }
                ],
                meetingImg:[
                    { required: true, message: '请选择会议封面图', trigger: 'change' }
                ],
                meetingDesc:[
                    { required: true, message: '请填写会议简介', trigger: 'change' }
                ]
            },
            //封面图库相关
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
        }
       
    },
    created () {
       this.RegionOptions = regionJSON
       this.getMeetingType()
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
        //省市区发生变化时
        handleRegionChange(val){
            for (let i = 0; i < this.RegionOptions.length; i++) {
                if (this.RegionOptions[i].value == val[0]) {
                    this.meetingForm.meetingProvince = this.RegionOptions[i].label
                    for (let j = 0; j <this.RegionOptions[i].children.length; j ++) {
                        if (this.RegionOptions[i].children[j].value == val[1]) {
                            this.meetingForm.meetingCity = this.RegionOptions[i].children[j].label
                            for (let k = 0; k < this.RegionOptions[i].children[j].children.length; k++) {
                                if (this.RegionOptions[i].children[j].children[k].value == val[2]) {
                                    this.meetingForm.meetingArea = this.RegionOptions[i].children[j].children[k].label
                                }
                            }
                        }
                    }
                }
            }
            console.log('省市区发生变化',this.meetingForm.meetingProvince,this.meetingForm.meetingCity,this.meetingForm.meetingArea)
        },
        //会议起止时间变化
        handleMeetingTimesChange(val){
            if (val !== null) {
                this.meetingForm.meetingStarTime = val[0]
                this.meetingForm.meetingEndTime = val[1]
            } else {
                this.meetingForm.meetingStarTime = ''
                this.meetingForm.meetingEndTime = ''
            }
            console.log('会议时间变化',val,this.meetingForm.meetingStarTime,this.meetingForm.meetingEndTime)
        },
        //会议报名时间变化
        handleMeetingBaomingTimesChange(val){
            if (val !== null) {
                this.meetingForm.meetingEnrollStarTime = val[0]
                this.meetingForm.meetingEnrollEndTime = val[1]
            } else {
                this.meetingForm.meetingEnrollStarTime = '#'
                this.meetingForm.meetingEnrollEndTime = '#'
            }
            console.log('报名时间变化',val,this.meetingForm.meetingEnrollStarTime,this.meetingForm.meetingEnrollEndTime)
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
        //会议日程——删除某一天日程中的某一条
        delCalendar(index){

        },
        //封面图页面变化
        handleCurrentChange (val) {
            this.pagination1.currPage = val
            this.searchCoverImg()
        },
        //打开封面图库弹层  type：0  封面图  1会议头图
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
                this.meetingForm.meetingJsonData.headPic.picUrl = item.picUrl
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
            this.showContentImgLib = true
            this.chooseImgObjName = objName
            this.chooseImgObjIndex = index
            this.searchContentImg(0)
        },
        //搜索内容图库
        searchContentImg(type){
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
        //选择了某一张封面图片
        addThisContentImg (item) {
            this.meetingForm.meetingJsonData[this.chooseImgObjName].selfConfigZone[this.chooseImgObjIndex].imgUrl = item.picUrl
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
        //保存会议 formName---表单名称   type----提交类型
        testMeetingInfo(type,formName) {
            var self = this
            //判断报名时间和开始时间规则
            console.log(self.meetingForm)
            if (self.meetingForm.meetingEnrollEndTime > self.meetingForm.meetingStarTime) {
                self.$message.error('会议报名截至时间不能大于会议开始时间')
                return
            }
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
                    var reqUrl = '/meeting/save'
                    self.meetingForm.meetingStatus = '3'
                } else if (self.typeOfPage == 'edit') {
                    var reqUrl = '/meeting/update'
                }
                $.ajax({
                    type: "POST",
                    url: reqUrl,
                    contentType: "application/json",
                    data: JSON.stringify(self.meetingForm),
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
            //不走CMS逻辑，只需要改状态即可  meetingStatus=1 已发布
            self.meetingForm.meetingStatus = '1' 
            $.ajax({
                type: "POST",
                url: "/meeting/update",
                contentType: "application/json",
                data: JSON.stringify(self.meetingForm),
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
                url: "/meeting/info/"+ type.toString(),
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
            //省市区反显
            tempObj.meetingRegion = []
            for (let i = 0; i < this.RegionOptions.length; i++) {
                if (this.RegionOptions[i].label == tempObj.meetingProvince) {
                    tempObj.meetingRegion[0] = this.RegionOptions[i].value
                    for (let j = 0; j <this.RegionOptions[i].children.length; j ++) {
                        if (this.RegionOptions[i].children[j].label == tempObj.meetingCity) {
                            tempObj.meetingRegion[1] = this.RegionOptions[i].children[j].value
                            for (let k = 0; k < this.RegionOptions[i].children[j].children.length; k++) {
                                if (this.RegionOptions[i].children[j].children[k].label == tempObj.meetingArea) {
                                    tempObj.meetingRegion[2] = this.RegionOptions[i].children[j].children[k].value
                                }
                            }
                        }
                    }
                }
            }
            //会议时间反显
            tempObj.meetingTimes = [parseInt(tempObj.meetingStarTime),parseInt(tempObj.meetingEndTime)]
            //会议报名时间反显--非必填项
            if (tempObj.meetingEnrollStarTime !== '#') {
                tempObj.meetingBaomingTimes = [parseInt(tempObj.meetingEnrollStarTime),parseInt(tempObj.meetingEnrollEndTime)]
            } else {
                tempObj.validateMeetingBaomingTimes = []
            }
            //会议类型转换
            tempObj.meetingType = tempObj.meetingType.toString()
            this.meetingForm = tempObj
            this.$refs['meetingForm'].resetFields()
        },
        //返回列表页
        closeAndBack () {
            setCookie ('createditmeeting', '', 1) 
            window.parent.location.href = '/index.html#modules/meeting/meeting_list.html'
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
                        self.meetingTypeOptions = res.page.list
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

        
    }
    
})
