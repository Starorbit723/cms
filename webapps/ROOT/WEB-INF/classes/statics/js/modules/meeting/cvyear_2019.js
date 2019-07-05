var vm = new Vue({
    el: '#yearbeijing2019',
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
                meetingId:'',//会议编号
                meetingTitle:'',//标题
                meetingCrtUserId:'',//创建人编号
                meetingModUserId:'',//更新人编号
                meetingCrtTime:'',//创建时间
                meetingModTime:'',//更新时间
                meetingStatus:'',//状态 0 正常 1下线
                meetingJson:{
                    introduce:[{
                        paragraphText:'1111111'
                    }]
                },
            },
            meetingFormRules:{
                meetingTitle: [
                    { required: true, message: '会议标题不能为空', trigger: 'change' }
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
        handleChangeCollapse () {

        },
        //添加会议介绍段落
        addParagraph () {
            let Lv1Length = this.meetingForm.meetingJson.introduce.length
            if (this.meetingForm.meetingJson.introduce[Lv1Length - 1].paragraphText.trim() !== '') {
                this.meetingForm.meetingJson.introduce.push({
                    paragraphText:''
                })
            } else {
                this.$message.error('请完成上一个段落的内容')
            }
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
