var vm = new Vue({
    el: '#vote_list',
    data(){
        var validateId = (rule, value, callback) => {
            var urlReg = /^[0-9]*[1-9][0-9]*$/;
            if (!value) {
                callback(new Error('所属投票编号为必填项'));
            } else if (value !== '' && !urlReg.test(value)) {
                callback(new Error('所属投票编号只能为正整数'));
            } else {
                callback();
            }
        }
        return {
            //是否显示子页面
            showChildPage:true,
            creatOrEdit: 0, //0新建  1修改
            timeRange:[],
            searchForm: {
                voteMeetingId: '',
                startTime:'',
                endTime:''
            },
            tableData:[{}],
            //分页器相关
            pagination1: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
            voteForm: {
                voteId: '', //投票编号
                voteTitle: '', //投票名称
                voteType: '', //投票类型
                voteAbstract:'', //投票摘要
                voteMeetingId: '', //投票所属会议
                voteCrtUserId: '', //创建人用户编号
                voteModUserId: '', //更新人用户编号
                voteCrtTime: '', //创建时间
                voteModTime: '', //更新时间
                userName: '', //创建人
                voteOptions: [] //投票选项
            },
            voteFormRules: {
                voteType: [
                    {required: true, message: '投票类型为必填项', trigger: 'change'}
                ],
                voteTitle: [
                    {required: true, message: '投票名称为必填项', trigger: 'change'}
                ],
                voteAbstract: [
                    {required: true, message: '投票摘要为必填项', trigger: 'change'}
                ]
            }
            
        }
    },
    created() {
        this.startSearch(0)
    },
    mounted() {

    },
    methods: {
        // 开始搜索列表
        startSearch(type) {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchForm))
            console.log(JSON.stringify(data))
            data.voteMeetingId = data.voteMeetingId.toString().trim()
            $.ajax({
                type: "POST",
                url: "/vote/list",
                contentType: "application/json",
			    data: JSON.stringify(data),
                dataType: "json",
                success: function(res) {
                    console.log(res)
                    if(res.code == 200) {
                        self.tableData = res.page.list

                        self.pagination1 = {
                            currPage: res.page.currPage,
                            totalCount:res.page.totalCount,
                            totalPage: res.page.totalPage,
                            pageSize: res.page.pageSize
                        }
                    } else {
                        mapErrorStatus(res)
						vm.error = true;
						vm.errorMsg = res.msg;
                    }
                },
                error: function(res) {
                    mapErrorStatus(res)
                }
            
            })
        },
        // 新建或修改投票type:0  新增   type:1修改
        addOrEditVote(type, item) {
            var self = this
            console.log(self)
            if(type == 0) {
                self.showChildPage = true
            } else if(type == 1) {
                
            }
        }
    }
   
       
    
})
