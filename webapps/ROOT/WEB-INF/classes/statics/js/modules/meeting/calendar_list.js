var vm = new Vue({
    el: '#calendar_list',
    data: {
        //是否显示子页面
        showChildPage: false,
        creatOrEdit:0,//0新建  1修改
        timeRange:[],
        searchForm:{
            meetingAgendaMeetingId:'',
            meetingAgendaStatus:'0',
            startTime:'',
            endTime:''
        },
        tableData:[{

        }],
        //分页器相关
        pagination1: {
            currPage: 1,
            totalCount:0,
            totalPage:0,
            pageSize:10
        },
        //日程对象
        calendarForm:{
            meetingAgendaId:'',//主键
            meetingAgendaMeetingId:'',//所属会议编号
            meetingAgendaCrtUserId:'',//
            meetingAgendaModUserId:'',//
            meetingAgendaCrtTime:'',//
            meetingAgendaModTime:'',//
            meetingAgendaStatus:'',//状态 0正常 1删除
            meetingAgendaJson:[{//日程JSON数据
                type:'date',
                labelText:'',
                timeValue:'',
                children:[
                //     {
                //     type:'place',
                //     labelText:'',
                //     children:[{
                //         type:'theme',
                //         labelText:'',
                //         children:[{
                //             type:'issue',
                //             timeRange:'',
                //             labelText:'',        
                //             contentText:''
                //         }]
                //     }]
                // }
                ]
            }],
        },
        calendarFormRules:{
        },
       
    },
    watch:{
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
    created(){
        this.startSearch(0)
    },
    mounted () {
        
    },
    methods:{
        //添加会场---1级维度
        addDaly () {
            let Lv1Length = this.calendarForm.meetingAgendaJson.length
            if (this.calendarForm.meetingAgendaJson[Lv1Length - 1].labelText.trim() !== '' && this.calendarForm.meetingAgendaJson[Lv1Length - 1].timeValue !== '') {
                this.calendarForm.meetingAgendaJson.push({
                    type:'date',
                    labelText:'',
                    timeValue:'',
                    children:[]
                })
            } else {
                this.$message.error('请完成上一个日程的内容')
            }
        },
        //删除日程---1级维度
        delDaly (index) {
            if (this.calendarForm.meetingAgendaJson.length <= 1) {
                this.$message.error('至少保留一个日程')
            } else {
                this.calendarForm.meetingAgendaJson.splice(index, 1); 
            }
        },
        //添加会场---index：所属一级索引  index2:所属二级索引
        addPlace (index) {
            console.log(index)
            let currentLv1 = this.calendarForm.meetingAgendaJson[index]
            if (currentLv1.children.length == 0) {
                this.calendarForm.meetingAgendaJson[index].children.push({
                    type:'place',
                    labelText:'',
                    children:[]
                })
            } else {
                if (currentLv1.children[currentLv1.children.length - 1].labelText.trim() !== '' || currentLv1.children[currentLv1.children.length - 1].labelText.trim() == '#') {
                    this.calendarForm.meetingAgendaJson[index].children.push({
                        type:'place',
                        labelText:'',
                        children:[]
                    })
                } else {
                    this.$message.error('请填写上一个会场信息，无信息需填写"#"')
                }
            }
        },
        //删除会场
        delPlace(index,index2){
            console.log(index,index2)
            this.calendarForm.meetingAgendaJson[index].children.splice(index2, 1); 
        },
        //添加主题 index：所属一级索引  index2:所属二级索引
        addTheme(index,index2) {
            console.log(index,index2)
            let currentLv2 = this.calendarForm.meetingAgendaJson[index].children[index2]
            console.log(currentLv2)
            if (currentLv2.children.length == 0) {
                this.calendarForm.meetingAgendaJson[index].children[index2].children.push({
                    type:'theme',
                    labelText:'',
                    children:[]
                })
            } else {
                if (currentLv2.children[currentLv2.children.length - 1].labelText.trim() !== '' || currentLv2.children[currentLv2.children.length - 1].labelText.trim() == '#') {
                    this.calendarForm.meetingAgendaJson[index].children[index2].children.push({
                        type:'theme',
                        labelText:'',
                        children:[]
                    })
                } else {
                    this.$message.error('请填写上一个主题信息，无信息需填写"#"')
                }
            }
        },
        //删除主题
        delTheme(index,index2,index3){
            console.log(index,index2,index3)
            this.calendarForm.meetingAgendaJson[index].children[index2].children.splice(index3, 1);
        },
        //添加议题index：所属一级索引  index2:所属二级索引 index3:所属三级索引
        addIssue(index,index2,index3){
            console.log(index,index2,index3)
            let currentLv3 = this.calendarForm.meetingAgendaJson[index].children[index2].children[index3]
            console.log(currentLv3)
            if (currentLv3.children.length == 0) {
                this.calendarForm.meetingAgendaJson[index].children[index2].children[index3].children.push({
                    type:'issue',
                    timeRange:'',
                    labelText:'',        
                    contentText:''
                })
            } else {
                if ((currentLv3.children[currentLv3.children.length - 1].labelText.trim() !== '' || currentLv3.children[currentLv3.children.length - 1].labelText.trim() == '#') && currentLv3.children[currentLv3.children.length - 1].timeRange !== '') {
                    this.calendarForm.meetingAgendaJson[index].children[index2].children[index3].children.push({
                        type:'issue',
                        timeRange:'',
                        labelText:'',        
                        contentText:''
                    })
                } else {
                    this.$message.error('请填写上一个议题相关内容')
                }
            }

        },
        //删除议题index：所属一级索引  index2:所属二级索引 index3:所属三级索引 index4:所属四级索引
        delIssue (index,index2,index3,index4) {
            console.log(index,index2,index3,index4)
            this.calendarForm.meetingAgendaJson[index].children[index2].children[index3].children.splice(index4, 1);
        },
        //保存
        submitCreatEdit (formName) {
            var self = this
            if (self.creatOrEdit == 0) {
                var reqUrl = '/meeting/agenda/save'
            } else if (self.creatOrEdit == 1) {
                var reqUrl = '/meeting/agenda/update'
            }
            var data = JSON.parse(JSON.stringify(self.calendarForm))
            $.base64.utf8encode = true;
            var jsonString = JSON.stringify(data.meetingAgendaJson);
            var json64 = $.base64.btoa(jsonString);
            data.meetingAgendaJson = json64
            console.log('6464',jsonString,json64)
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
                        self.closeCreatOrEdit('calendarForm')
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
            this.showChildPage = false
            this.creatOrEdit = 0
            this.calendarForm = {
                agendaId:'',//主键
                agendaMeetingId:'',//所属会议编号
                agendaCrtUserId:'',//
                agendaModUserId:'',//
                agendaCrtTime:'',//
                agendaModTime:'',//
                agendaStatus:'',//状态 0正常 1删除
                meetingAgendaJson:[{
                    type:'date',
                    labelText:'',
                    timeValue:'',
                    children:[]
                }],
            }
        },





        //切换页码
        handleCurrentChange (val) {
            this.pagination1.currPage = val
            this.startSearch() 
        },
        //开始搜索列表
        startSearch(type){
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchForm))
            //data.calendarTitle = data.calendarTitle.toString().trim()
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
                url: "/meeting/agenda/list",
                contentType: "application/json",
			    data: JSON.stringify(data),
			    dataType: "json",
			    success: function(res){
					if(res.code == 200){
                        self.tableData = res.page.list
                        for (let i = 0; i < self.tableData.length; i++){
                            self.tableData[i].agendaCrtTime = self.transformTime(parseInt(self.tableData[i].agendaCrtTime))
                            self.tableData[i].agendaModTime = self.transformTime(parseInt(self.tableData[i].agendaModTime))
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
        //新建或修改日程 type:0  新增   type:1修改
        addOrEditCalendar(type,item){
            var self = this
            self.creatOrEdit = type
            if (type == 0) {
                self.showChildPage = true
            } else if (type == 1) {
                $.ajax({
                    type: "POST",
                    url: "/meeting/agenda/info/" + item.meetingAgendaId.toString(),
                    contentType: "application/json",
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            //json64反解
                            let data = res.dict
                            let map = $.base64.atob(data.meetingAgendaJson, true)
                            data.meetingAgendaJson = JSON.parse(map)
                            console.log(data)
                            self.calendarForm = data
                            self.showChildPage = true
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
