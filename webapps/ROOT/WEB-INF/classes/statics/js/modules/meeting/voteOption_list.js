var vm = new Vue({
    el: "#voteOption_list",
    data: {
        showChildPage: false,
        creatOrEdit:0,//0新建  1修改
        //搜索提交
        searchForm:{
            VoteId:'', //所属投票编号
            voteOptionStatus:'0',//状态 0正常 1删除
        },
        //列表查询结果
        tableData: [{
            voteOptionId:'',//投票选项编号
            voteId:'',//投票编号
            voteOptionName:'',//投票选项名称
            voteOptionCount:'',//投票选项数量
            voteOptionCrtUserId:'',//创建人用户编号
            voteOptionModUserId:'',//更新人用户编号
            voteOptionCrtTime:'',//创建时间
            voteOptionModTime:'',//更新时间
            voteOptionStatus:'',//嘉宾 状态 0正常 1删除
        }],

    }
})