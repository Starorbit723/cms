var vm = new Vue({
    el: '#calendar_list',
    data: {
        //是否显示子页面
        showChildPage: false,
        creatOrEdit:0,//0新建  1修改
        timeRange:[],
        searchForm:{
            calendarId:'',
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
            agendaId:'',//主键
            agendaMeetingId:'',//所属会议编号
            agendaCrtUserId:'',//
            agendaModUserId:'',//
            agendaCrtTime:'',//
            agendaModTime:'',//
            agendaStatus:'',//状态 0正常 1删除
            agendaJsonjson:[{//日程JSON数据
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
        //this.startSearch(0)
    },
    mounted () {
        
    },
    methods:{
        //添加会场---1级维度
        addDaly () {
            let Lv1Length = this.calendarForm.agendaJsonjson.length
            if (this.calendarForm.agendaJsonjson[Lv1Length - 1].labelText.trim() !== '' && this.calendarForm.agendaJsonjson[Lv1Length - 1].timeValue !== '') {
                this.calendarForm.agendaJsonjson.push({
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
            if (this.calendarForm.agendaJsonjson.length <= 1) {
                this.$message.error('至少保留一个日程')
            } else {
                this.calendarForm.agendaJsonjson.splice(index, 1); 
            }
        },
        //添加会场---index：所属一级索引  index2:所属二级索引
        addPlace (index) {
            console.log(index)
            let currentLv1 = this.calendarForm.agendaJsonjson[index]
            if (currentLv1.children.length == 0) {
                this.calendarForm.agendaJsonjson[index].children.push({
                    type:'place',
                    labelText:'',
                    children:[]
                })
            } else {
                if (currentLv1.children[currentLv1.children.length - 1].labelText.trim() !== '' || currentLv1.children[currentLv1.children.length - 1].labelText.trim() == '#') {
                    this.calendarForm.agendaJsonjson[index].children.push({
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
            this.calendarForm.agendaJsonjson[index].children.splice(index2, 1); 
        },
        //添加主题 index：所属一级索引  index2:所属二级索引
        addTheme(index,index2) {
            console.log(index,index2)
            let currentLv2 = this.calendarForm.agendaJsonjson[index].children[index2]
            console.log(currentLv2)
            if (currentLv2.children.length == 0) {
                this.calendarForm.agendaJsonjson[index].children[index2].children.push({
                    type:'theme',
                    labelText:'',
                    children:[]
                })
            } else {
                if (currentLv2.children[currentLv2.children.length - 1].labelText.trim() !== '' || currentLv2.children[currentLv2.children.length - 1].labelText.trim() == '#') {
                    this.calendarForm.agendaJsonjson[index].children[index2].children.push({
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
            this.calendarForm.agendaJsonjson[index].children[index2].children.splice(index3, 1);
        },
        //添加议题index：所属一级索引  index2:所属二级索引 index3:所属三级索引
        addIssue(index,index2,index3){
            console.log(index,index2,index3)
            let currentLv3 = this.calendarForm.agendaJsonjson[index].children[index2].children[index3]
            console.log(currentLv3)
            if (currentLv3.children.length == 0) {
                this.calendarForm.agendaJsonjson[index].children[index2].children[index3].children.push({
                    type:'issue',
                    timeRange:'',
                    labelText:'',        
                    contentText:''
                })
            } else {
                if ((currentLv3.children[currentLv3.children.length - 1].labelText.trim() !== '' || currentLv3.children[currentLv3.children.length - 1].labelText.trim() == '#') && currentLv3.children[currentLv3.children.length - 1].timeRange !== '') {
                    this.calendarForm.agendaJsonjson[index].children[index2].children[index3].children.push({
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
            this.calendarForm.agendaJsonjson[index].children[index2].children[index3].children.splice(index4, 1);
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
                url: "/agenda/list",
                contentType: "application/json",
			    data: JSON.stringify(data),
			    dataType: "json",
			    success: function(res){
					if(res.code == 200){
                        self.tableData = res.page.list
                        // for (let i = 0; i < self.tableData.length; i++){
                        //     self.tableData[i].flashReleaseTime = self.transformTime(parseInt(self.tableData[i].flashReleaseTime))
                        // }
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
        //新建或修改日程
        addOrEditCalendar(type,item){
            if (type == 0) {
                this.showChildPage = true
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
