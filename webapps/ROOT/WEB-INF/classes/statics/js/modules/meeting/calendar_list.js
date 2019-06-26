var vm = new Vue({
    el: '#calendar_list',
    data: {
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
        rankDataTree:[
            {
                rankLevel:'1',
                rankTitle:'我是一级榜单名称',
                children:[{
                    rankLevel:'2',
                    rankTitle:'我是二级榜单名称',
                    children:[]
                }]
            }
        ],
        calendatForm:{
            flashId:'',//快讯主键
            flashTitle:'',//快讯标题
            flashDesc:'',//快讯摘要
            flashSourceUrl:'',//快讯原文url
            flashSourceName:'',//快讯原文名称
            flashStatus:'',//快讯状态 0未发布，1是待发布，2是已发布3是发布失败 4是待删除 5 删除
            flashCrtTime:'',//创建时间
            flashCrtTimeMill:'',//创建时间毫秒值
            flashCrtUserId:'',//快讯创建人
            flashCount:'',//点击量
            flashImg:'',//快讯图片
            userName:'',//创建人名称
            flashSourceLink:'',//快讯来源机构名称地址
            flashReleaseTime:''//发布时间
        },
        calendatFormRules:{
            flashTitle: [
                { required: true, message: '快讯标题不能为空', trigger: 'change' },
                { max: 36, message: '您输入的字数超过36个字', trigger: 'change' }
            ],
            flashDesc:[
                { required: true, message: '摘要不能为空', trigger: 'change' }
            ],
            flashSourceName:[
                { required: true, message: '来源名称不能为空', trigger: 'change' }
            ]
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
    mounted () {
        
    },
    methods:{
        //切换页码
        handleCurrentChange (val) {
            this.pagination1.currPage = val
            this.startSearch() 
        },
        //开始搜索列表
        startSearch(type){
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchForm))
            data.calendarTitle = data.calendarTitle.toString().trim()
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
                url: "/flash/list",
                contentType: "application/json",
			    data: JSON.stringify(data),
			    dataType: "json",
			    success: function(res){
					if(res.code == 200){
                        self.tableData = res.page.list
                        for (let i = 0; i < self.tableData.length; i++){
                            self.tableData[i].flashReleaseTime = self.transformTime(parseInt(self.tableData[i].flashReleaseTime))
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
