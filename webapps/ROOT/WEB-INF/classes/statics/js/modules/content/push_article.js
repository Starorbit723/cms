var vm = new Vue({
    el: '#push_article',
    data: {
        leftList:[],//左侧列表
        rightList:[],//右侧列表
        totalList:[],//全部列表，用于提交遍历
        outArrayLeft:[],
        outArrayRight:[]
    },
    created () {
        this.requestData()
    },
    methods:{
        requestData() {
            var self = this
            var param = {
                recStatus:'1',
                page: '1',
                limit: '2000'
            }
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "/indexRecommend/list",
                data: JSON.stringify(param),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.leftList = res.srcPage.list
                        self.rightList = res.page.list
                        self.totalList = JSON.parse(JSON.stringify(self.leftList)).concat(JSON.parse(JSON.stringify(self.rightList)))
                        for(let i = 0; i < self.leftList.length; i++){
                            self.outArrayLeft.push({id:self.leftList[i].recId})
                        }
                        for(let k = 0; k < self.rightList.length; k++){
                            self.outArrayRight.push({id:self.rightList[k].recId})
                        }
                        console.log('leftList',self.leftList,'rightList',self.rightList,'totalList',self.totalList)
                    } else {
                        mapErrorStatus(res)
                        vm.error = true;
                        vm.errorMsg = res.msg;
                    }
                },
                error:function(res){
                    mapErrorStatus(res)
                }
                
            })
        },
        submitPushTest(){
            var self = this
            self.$confirm('确实提交文章推荐吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (self.outArrayRight.length !== 10) {
                    self.$message.error('推荐位文章必须为10个')
                    return
                } else {
                    var inserData = []
                    for (let i = 0; i < self.outArrayRight.length; i++){
                        for (let k = 0; k < self.totalList.length; k++ ) {
                            if (self.totalList[k].recId == self.outArrayRight[i].id) {
                                inserData.push({
                                    recId: self.totalList[k].recId,
                                    recUrl: self.totalList[k].recUrl,
                                    recNewsId:self.totalList[k].newsEntity.newsId,
                                    recPriority: 10 - i
                                })
                            }
                        }
                    }
                    console.log('inserData',inserData)
                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        url: "/indexRecommend/save",
                        data: JSON.stringify(inserData),
                        dataType: "json",
                        success: function(res){
                            if (res.code == 200) {
                                self.continuitySubmit()
                            } else {
                                mapErrorStatus(res)
                                vm.error = true;
                                vm.errorMsg = res.msg;
                            }
                        },
                        error:function(res){
                            mapErrorStatus(res)
                        }
                        
                    })
                }
            })
            
        },
        continuitySubmit() {
            var self = this
            var waitData = []
            for (let m = 0; m < self.outArrayLeft.length; m++){
                for (let n = 0; n < self.totalList.length; n++ ) {
                    if (self.totalList[n].recId == self.outArrayLeft[m].id) {
                        waitData.push({
                            recId: self.totalList[n].recId,
                            recStatus: '1',
                            recNewsId:self.totalList[n].newsEntity.newsId
                        })
                    }
                }
            }
            console.log('waitData',waitData)
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "/indexRecommendSrc/update",
                data: JSON.stringify(waitData),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.leftList=[],//左侧列表
                        self.rightList=[],//右侧列表
                        self.totalList=[],//全部列表，用于提交遍历
                        self.outArrayLeft=[],
                        self.outArrayRight=[]
                        self.$message.success('保存推荐成功')
                        console.log(self.leftList,self.rightList,self.totalList,self.outArrayLeft,self.outArrayRight)
                        //数据回显
                        window.location.reload()
                    } else {
                        mapErrorStatus(res)
                        vm.error = true;
                        vm.errorMsg = res.msg;
                    }
                },
                error:function(res){
                    mapErrorStatus(res)
                }
            })
        },
        nowStatus(){
            var self = this
            self.outArrayLeft = []
            self.outArrayRight = []
            var leftNow = $('#nestable .dd-list').children()
            for (let i = 0; i< leftNow.length; i++) {
                self.outArrayLeft.push({
                    id:leftNow[i].attributes.id.value
                })
            }
            var rightNow = $('#nestable2 .dd-list').children()
            for (let i = 0; i< rightNow.length; i++) {
                self.outArrayRight.push({
                    id: rightNow[i].attributes.id.value
                })
            }
            console.log('outArrayLeft',self.outArrayLeft)
            console.log('outArrayRight',self.outArrayRight)
        }
    },  
})


$(document).ready(function(){

    //点击详情打开iframe查看新闻页内容方法
    //由于dd-list事件都已经在框架内阻止了冒泡捕获，因此委托给子节点完成
    $(".dd-list").on('click', ".dd-item .toDetail", function(e){
        console.log("当前打开的链接为", e.currentTarget.attributes.url.value);
        window.open('https://www.chinaventure.com.cn' + e.currentTarget.attributes.url.value) 
        // $('#newsWindow').attr('src', e.currentTarget.attributes.url.value);
        // $('.newsDetailShow').css('display','block')
    });
    // $('.news_meng_bg').on('click',function(){
    //     $('#newsWindow').attr('src', '');
    //     $('.newsDetailShow').css('display','none')
    // })
    // $('.iframe_header').on('click',function(){
    //     $('#newsWindow').attr('src', '');
    //     $('.newsDetailShow').css('display','none')
    // })

   
    //输出用户选中的新闻条目
    var updateOutput = function(e){
        var list   = e.length ? e : $(e.target),
            output = list.data('output');
        var outArray = list.nestable('serialize')
        if (window.JSON) {
            var maxLength = 10
            var rightNum = $('#nestable2 .dd-list').children().length
            if (rightNum > maxLength) {
                var temp = $('#nestable2 .dd-list').children("li:last-child")
                $('#nestable2 .dd-list').children("li:last-child").remove()
                $('#nestable .dd-list').append(temp[0])
            } 
            //output.val(window.JSON.stringify(list.nestable('serialize')));//, null, 2));
            vm.nowStatus()
        } else {
            output.val('JSON browser support required for this demo.');
        }

    };

    // activate Nestable for list 1
    $('#nestable').nestable({
        group: 1
    }).on('change', updateOutput);
    
    // activate Nestable for list 2
    $('#nestable2').nestable({
        group: 1
    }).on('change', updateOutput);


    // output initial serialised data

    updateOutput($('#nestable').data('output', $('#nestable-output')));

    updateOutput($('#nestable2').data('output', $('#nestable2-output')));


    // $('#nestable-menu').on('click', function(e)

    // {

    //     var target = $(e.target),

    //         action = target.data('action');

    //     if (action === 'expand-all') {

    //         $('.dd').nestable('expandAll');

    //     }

    //     if (action === 'cullapse-all') {

    //         $('.dd').nestable('cullapseAll');

    //     }

    // });

});
