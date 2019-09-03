var vm = new Vue({
    el: '#signup_list',
    data: {
        showSignupList: false, //会议报名列表
        showAddorEditPage: true,  // 新增或修改报名信息列表
        creatOrEdit:0,//0新建  1修改
        //折叠面板组件实例
        activeNames: ['1','2','3','4','5','6','7','8','9','10','11','12'],
        pickerOptions:{
            disabledDate(time) {
                return time.getTime() > Date.now();
            }
        }, 
        timeRange: [], //时间需要特殊处理,并且同步到searchForm
        searchForm:{
            singupTitle: '', //报名页面名称
            startTime:'',//
            endTime:''//
        },
        tableData:[
            {
                singupTitle: '南京报名南京报名南京报名南京报名南京报名南京报名南京报名南京报名南京报名',
                signupCheck: '-1',
                signupModTime: '2018年3月',
                modUserName: 'shenda',
            }
        ],
        //分页器相关
        pagination1: {
            currPage: 1,
            totalCount:0,
            totalPage:0,
            pageSize:10
        },
        // 报名基本信息
        signupForm: {
            signupTitle: '',
            signupTime: '',
            isUseCode: '',

        }
    },
    watch: {
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
    created () {
        this.startSearch(0)
    },
    methods:{
        handleCurrentChange(val){
            // this.pagination1.currPage = val
            this.startSearch() 
        },
        //开始搜索列表
        startSearch(type){
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchForm))
            data.singupTitle = data.singupTitle.toString().trim()
            console.log(data)
            // if (type == 0) {
            //     Object.assign(data,{
            //         page: '1',
            //         limit: self.pagination1.pageSize.toString()
            //     })
            // } else {
            //     Object.assign(data,{
            //         page: self.pagination1.currPage.toString(),
            //         limit: self.pagination1.pageSize.toString()
            //     })
            // }
            // $.ajax({
            //     type: "POST",
            //     url: "",
            //     contentType: "application/json",
            //     data: JSON.stringify(data),
            //     dataType: "json",
            //     success: function(res){
            //         if(res.code == 200){
            //             self.tableData = res.page.list
            //             for (let i = 0; i < self.tableData.length; i++){
            //                 self.tableData[i].singupModTime = self.transformTime(parseInt(self.tableData[i].singupModTime))
            //             }
            //             self.pagination1 = {
            //                 currPage: res.page.currPage,
            //                 totalCount:res.page.totalCount,
            //                 totalPage: res.page.totalPage,
            //                 pageSize: res.page.pageSize
            //             }
            //         }else{
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
        //新建或修改日程 type:0  新增   type:1修改
        addOrEditSignup(type,item){
            var self = this
            self.creatOrEdit = type
            if (type == 0) {
                self.showAddorEditPage = true
                self.showSignupList = false
            } else if (type == 1) {
                // $.ajax({
                //     type: "POST",
                //     url: "/meeting/agenda/info/" + item.meetingAgendaId.toString(),
                //     contentType: "application/json",
                //     dataType: "json",
                //     success: function(res){
                //         if(res.code == 200){
                //             //json64反解
                //             let data = res.dict
                //             let map = $.base64.atob(data.meetingAgendaJson, true)
                //             data.meetingAgendaJson = JSON.parse(map)
                //             console.log(data)
                //             self.calendarForm = data
                //             self.showChildPage = true
                //         }else{
                //             mapErrorStatus(res)
                //             vm.error = true;
                //             vm.errorMsg = res.msg;
                //         }
                //     },
                //     error:function(res){
                //         mapErrorStatus(res)
                //     }
                // });
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