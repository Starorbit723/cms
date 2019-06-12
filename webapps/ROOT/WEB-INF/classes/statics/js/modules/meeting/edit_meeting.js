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
        var validateMeetingStarTime = (rule, value, callback) => {
            console.log('start:',this.meetingForm.meetingStarTime,'end:',this.meetingForm.meetingEndTime)
            if (value =='') {
                callback(new Error('会议开始时间不能为空'));
            } else if (this.meetingForm.meetingEndTime !=='' && (value > this.meetingForm.meetingEndTime)) {
                callback(new Error('会议开始时间不能大于会议结束时间'));
            } else {
                callback();
            }
        }
        var validateMeetingEndTime = (rule, value, callback) => {
            console.log('start:',this.meetingForm.meetingStarTime,'end:',this.meetingForm.meetingEndTime)
            if (value =='') {
                callback(new Error('会议结束时间不能为空'));
            } else if (this.meetingForm.meetingStartTime !=='' && (value < this.meetingForm.meetingStartTime)) {
                callback(new Error('会议开始时间不能大于会议结束时间'));
            } else {
                callback();
            }
        }
        var validateMeetingEnrollStarTime = (rule, value, callback) => {
            console.log('start:',this.meetingForm.meetingEnrollStarTime,'end:',this.meetingForm.meetingEnrollEndTime)
            if (this.meetingForm.meetingEnrollEndTime !=='' && (value > this.meetingForm.meetingEnrollEndTime)) {
                callback(new Error('报名开始时间不能大于会议结束时间'));
            } else {
                callback();
            }
        }
        var validateMeetingEnrollEndTime = (rule, value, callback) => {
            console.log('start:',this.meetingForm.meetingEnrollStarTime,'end:',this.meetingForm.meetingEnrollEndTime)
            if (this.meetingForm.meetingEnrollStarTime !=='' && (value < this.meetingForm.meetingEnrollStarTime)) {
                callback(new Error('报名开始时间不能大于会议结束时间'));
            } else {
                callback();
            }
        }
        return {
            //新建或修改
            typeOfPage:'creat',
            //切换展示封面图库
            showCoverimgLib:false,
            //省市区选项
            RegionOptions: [{
                value: 'zhinan',
                label: '指南',
                children: [{
                value: 'shejiyuanze',
                label: '设计原则',
                children: [{
                    value: 'yizhi',
                    label: '一致'
                }, {
                    value: 'fankui',
                    label: '反馈'
                }, {
                    value: 'xiaolv',
                    label: '效率'
                }, {
                    value: 'kekong',
                    label: '可控'
                }]
                }, {
                value: 'daohang',
                label: '导航',
                children: [{
                    value: 'cexiangdaohang',
                    label: '侧向导航'
                }, {
                    value: 'dingbudaohang',
                    label: '顶部导航'
                }]
                }]
            }, {
            value: 'zujian',
            label: '组件',
            children: [{
                value: 'basic',
                label: 'Basic',
                children: [{
                value: 'layout',
                label: 'Layout 布局'
                }, {
                value: 'color',
                label: 'Color 色彩'
                }, {
                value: 'typography',
                label: 'Typography 字体'
                }, {
                value: 'icon',
                label: 'Icon 图标'
                }, {
                value: 'button',
                label: 'Button 按钮'
                }]
            }, {
                value: 'form',
                label: 'Form',
                children: [{
                value: 'radio',
                label: 'Radio 单选框'
                }, {
                value: 'checkbox',
                label: 'Checkbox 多选框'
                }, {
                value: 'input',
                label: 'Input 输入框'
                }, {
                value: 'input-number',
                label: 'InputNumber 计数器'
                }, {
                value: 'select',
                label: 'Select 选择器'
                }, {
                value: 'cascader',
                label: 'Cascader 级联选择器'
                }, {
                value: 'switch',
                label: 'Switch 开关'
                }, {
                value: 'slider',
                label: 'Slider 滑块'
                }, {
                value: 'time-picker',
                label: 'TimePicker 时间选择器'
                }, {
                value: 'date-picker',
                label: 'DatePicker 日期选择器'
                }, {
                value: 'datetime-picker',
                label: 'DateTimePicker 日期时间选择器'
                }, {
                value: 'upload',
                label: 'Upload 上传'
                }, {
                value: 'rate',
                label: 'Rate 评分'
                }, {
                value: 'form',
                label: 'Form 表单'
                }]
            }, {
                value: 'data',
                label: 'Data',
                children: [{
                value: 'table',
                label: 'Table 表格'
                }, {
                value: 'tag',
                label: 'Tag 标签'
                }, {
                value: 'progress',
                label: 'Progress 进度条'
                }, {
                value: 'tree',
                label: 'Tree 树形控件'
                }, {
                value: 'pagination',
                label: 'Pagination 分页'
                }, {
                value: 'badge',
                label: 'Badge 标记'
                }]
            }, {
                value: 'notice',
                label: 'Notice',
                children: [{
                value: 'alert',
                label: 'Alert 警告'
                }, {
                value: 'loading',
                label: 'Loading 加载'
                }, {
                value: 'message',
                label: 'Message 消息提示'
                }, {
                value: 'message-box',
                label: 'MessageBox 弹框'
                }, {
                value: 'notification',
                label: 'Notification 通知'
                }]
            }, {
                value: 'navigation',
                label: 'Navigation',
                children: [{
                value: 'menu',
                label: 'NavMenu 导航菜单'
                }, {
                value: 'tabs',
                label: 'Tabs 标签页'
                }, {
                value: 'breadcrumb',
                label: 'Breadcrumb 面包屑'
                }, {
                value: 'dropdown',
                label: 'Dropdown 下拉菜单'
                }, {
                value: 'steps',
                label: 'Steps 步骤条'
                }]
            }, {
                value: 'others',
                label: 'Others',
                children: [{
                value: 'dialog',
                label: 'Dialog 对话框'
                }, {
                value: 'tooltip',
                label: 'Tooltip 文字提示'
                }, {
                value: 'popover',
                label: 'Popover 弹出框'
                }, {
                value: 'card',
                label: 'Card 卡片'
                }, {
                value: 'carousel',
                label: 'Carousel 走马灯'
                }, {
                value: 'collapse',
                label: 'Collapse 折叠面板'
                }]
            }]
            }, {
            value: 'ziyuan',
            label: '资源',
            children: [{
                value: 'axure',
                label: 'Axure Components'
            }, {
                value: 'sketch',
                label: 'Sketch Templates'
            }, {
                value: 'jiaohu',
                label: '组件交互文档'
            }]
            }],
            //会议类型下拉选项
            meetingTypeOptions:[{
                value:'0',
                label:'v-talk'
            },{
                value:'1',
                label:'年会'
            }],
            //文章基本信息
            meetingForm:{
                meetingId:'',//主键
                meetingTitle:'',//标题
                meetingStarTime:'',//开始时间
                meetingEndTime:'',//结束时间
                meetingImg:'',//封面图
                meetingType:'',//类型
                meetingUrl:'http://www.baid.com',//会议链接
                meetingRegion:[],//会议所在区域-----前端自用字段
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
                meetingStatus:'',//会议状态(龙哥洗数据后定)
                meetingEnrollStarTime:'',//报名开始时间
                meetingEnrollEndTime:'',//报名结束时间
            },
            meetingFormRules:{
                meetingTitle: [
                    { required: true, message: '快讯标题不能为空', trigger: 'change' },
                    { max: 36, message: '您输入的字数超过36个字', trigger: 'change' }
                ],
                meetingStarTime:[
                    { required: true, validator:validateMeetingStarTime, trigger: 'change' }
                ],
                meetingEndTime:[
                    { required: true, validator:validateMeetingEndTime, trigger: 'change' }
                ],
                meetingEnrollStarTime:[
                    { required: false, validator:validateMeetingEnrollStarTime, trigger: 'change' }
                ],
                meetingEnrollEndTime:[
                    { required: false, validator:validateMeetingEnrollEndTime, trigger: 'change' }
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
                ]
            },
            //封面图库相关
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
        }
       
    },
    mounted () {
        var type = getCookie('createditfastinfo')
        if (type == '' || type == undefined) {
            this.typeOfPage = 'creat'
        } else {
            this.typeOfPage = 'edit'
            this.getEditFastinfoOrign(type)
        }
        console.log('type',this.typeOfPage)
    },
    methods:{
        //省市区发生变化时
        handleRegionChange(val){
            console.log('省市区发生变化',val)
        },
        handleCurrentChange (val) {
            this.pagination1.currPage = val
            this.searchCoverImg()
        },
        //打开封面图库弹层
        openAddCoverImg () {
            this.showCoverimgLib = true
            this.searchCoverImg(0)
        },
        //选择了某一张封面图片
        addThisCoverImg (item) {
            this.$refs['meetingForm'].clearValidate();
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
        //打开内容图库弹层
        openAddContentImg () {
            this.showContentimgLib = true
            this.searchContentImg(0)
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
        //保存会议 formName---表单名称   type----提交类型
        testMeetingInfo(type,formName) {
            var self = this
            console.log(formName)
            self.$refs[formName].validate((valid) =>{
                if (valid) {
                    //校验敏感词
                    console.log(self.meetingForm)
                }
            })
        }
        
    }
    
})
