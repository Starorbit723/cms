var vm = new Vue({
    el: '#zhanyi2020',
    data () {
        var validateUrl = (rule, value, callback) => {
            var urlReg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
            if (value) {
                if (!urlReg.test(value)) {
                    callback(new Error('链接格式不正确'));
                } else {
                    callback();
                }
            } else {
                callback(new Error('链接不能为空'));
            }
        }
        var validateUrl2 = (rule, value, callback) => {
            var urlReg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
            if (value) {
                if (value.trim() == '#') {
                    callback();
                } else if (!urlReg.test(value)) {
                    callback(new Error('链接格式不正确'));
                } else {
                    callback();
                }
            } else {
                callback();
            }
        }
        var validateUrl3 = (rule, value, callback) => {
            var urlReg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
            if (value) {
                if (value.trim() == '#') {
                    callback();
                } else if (!urlReg.test(value)) {
                    callback(new Error('链接格式不正确'));
                } else {
                    callback();
                }
            } else {
                callback(new Error('链接不能为空'));
            }
        }
        return {
            //新建或修改
            typeOfPage:'creat',
            //按钮请求开关
            ajaxController:true,
            //切换展示内容图库
            showContentImgLib:false,
            //折叠面板组件实例
            activeNames: ['1','2','3','5','6','7'],
            //文章基本信息
            meetingForm:{
                meetingId:'6',//会议编号
                meetingTitle:'',//标题
                meetingCrtUserId:'',//创建人编号
                meetingModUserId:'',//更新人编号
                meetingCrtTime:'',//创建时间
                meetingModTime:'',//更新时间
                meetingStatus:'',//状态 0 正常 1下线
                meetingImg:'',//封面图
                meetingDesc:'',//描述
                meetingBaseInfoId:'',//基础信息ID,写死
                meetingAgendaId:'',//日程ID,写死
                meetingGuestId:'',//嘉宾ID,写死
                meetingCooperationId:'',//合作机构ID,写死
                meetingRankId:'',//榜单ID,写死
                meetingJson:{
                    introduce:[{
                        paragraphText:''
                    }],
                    signUpLink:'',
                    signUpCodeImg:'',
                    onlineShowLabelText:'',
                    onlineShowUrl:''
                },
            },
            meetingFormRules:{
                // meetingTitle: [
                //     { required: true, message: '会议标题不能为空', trigger: 'change' }
                // ],
                meetingImg:[
                    { required: true, message: '请选择封面图', trigger: 'change' }
                ],
                "meetingJson.signUpLink": [
                    { required: true, validator: validateUrl, trigger: 'change' }
                ],
                "meetingJson.signUpCodeImg":[
                    { required: true, message: "报名二维码为必填项", trigger: 'change' }
                ],
                "meetingJson.onlineShowLabelText":[
                    { required: true, message: '请填写按钮文案', trigger: 'change' }
                ],
                "meetingJson.onlineShowUrl": [
                    { required: true, validator: validateUrl3, trigger: 'change' }
                ],
            },
            //封面图库相关
            showCoverimgLib:false,
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
            searchContentImgForm: {
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
        this.getEditMeetingOrign()
        //根据环境判断绑定的id
        if (window.location.href.indexOf('chinaventure.com.cn') !== -1 || window.location.href.indexOf('cvmedia.com.cn') !== -1 || window.location.href.indexOf('117.78.28.103') !== -1) {
            console.log('正式环境')
            this.meetingForm.meetingBaseInfoId = '60'//基础信息ID,写死
            this.meetingForm.meetingAgendaId = '48'//日程ID,写死
            this.meetingForm.meetingGuestId = '33'//嘉宾ID,写死
            this.meetingForm.meetingCooperationId = ''//合作机构ID,写死
        } else {
            console.log('测试环境')
            this.meetingForm.meetingBaseInfoId = '43'//基础信息ID,写死
            this.meetingForm.meetingAgendaId = '53'//日程ID,写死
            this.meetingForm.meetingGuestId = '42'//嘉宾ID,写死
            this.meetingForm.meetingCooperationId = '41'//合作机构ID,写死
        }
    },
    mounted () {
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
        //删除段落
        delParagraph(index){
            let Lv1Length = this.meetingForm.meetingJson.introduce.length
            if (Lv1Length >= 2) {
                this.meetingForm.meetingJson.introduce.splice(index, 1); 
            } else {
                this.$message.error('至少保留一个段落')
            }
        },
        //内容图页面变化
        handleCurrentChange2 (val) {
            this.pagination2.currPage = val
            this.searchContentImg ()
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
            console.log(self.searchContentImgForm)
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
        //选择了某一张封面图片
        addThisContentImg (item) {
            if (this.chooseImgObjName == 'signUp' && this.chooseImgObjIndex == 0) {
                this.meetingForm.meetingJson.signUpCodeImg = item.picUrl
            } else {
                this.meetingForm.meetingJson[this.chooseImgObjName][this.chooseImgObjIndex].imgUrl = item.picUrl
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
        
        //修改保存会议
        saveMeeting (formName) {
            var self = this
            self.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log(self.meetingForm)
                    if (self.ajaxController) {
                        //关闭请求开关
                        var data = JSON.parse(JSON.stringify(self.meetingForm))
                        $.base64.utf8encode = true;
                        var jsonString = JSON.stringify(data.meetingJson);
                        var json64 = $.base64.btoa(jsonString);
                        data.meetingJson = json64
                        console.log('6464',jsonString,json64)
                        self.ajaxController = false
                        console.log(JSON.stringify(data))
                        $.ajax({
                            type: "POST",
                            url: '/meeting/special/update',
                            contentType: "application/json",
                            data: JSON.stringify(data),
                            dataType: "json",
                            success: function(res){
                                if(res.code == 200){
                                    console.log('保存会议返回',res)
                                    self.$message.success('发布成功')
                                    self.ajaxController = true
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
                }
            })
            
        },
        //编辑会议---数据反显
        getEditMeetingOrign(type) {
            var self = this
            $.ajax({
                type: "POST",
                url: "/meeting/special/info/"+ '6',
                contentType: "application/json",
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        //json64反解
                        let data = res.dict
                        let map = $.base64.atob(data.meetingJson, true)
                        data.meetingJson = JSON.parse(map)
                        self.meetingForm = data
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
        //返回列表页
        closeAndBack () {
            window.parent.location.href = '/index.html#modules/meeting/meeting_list.html'
        },
        //打开封面图库弹层
        openAddCoverImg () {
            this.showCoverimgLib = true
            this.searchCoverImg(0)
        },
        //搜索封面图库
        searchCoverImg (type){
            var self = this
            var data = self.searchCoverimgForm
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
        //选择了某一张封面图片
        addThisCoverImg (item) {
            this.meetingForm.meetingImg = item.picUrl
            this.backToEdit()
        },
        //返回编辑页
        backToEdit (){
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
        handleCurrentChange (val) {
            this.pagination1.currPage = val
            this.searchCoverImg()
        },
        
    }
    
})
