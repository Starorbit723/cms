var vm = new Vue({
    el: '#meeting_rank',
    data () { 
        var validateId = (rule, value, callback) => {
            var urlReg = /^[0-9]*[1-9][0-9]*$/;
            if (value.trim() == '') {
                callback(new Error('所属会议编号为必填项'));
            } else if (value !== '' && !urlReg.test(value)) {
                callback(new Error('所属会议编号只能为正整数'));
            } else {
                callback();
            }
        }
        return {
            showChildPage:false,
            creatOrEdit:0,//0新建  1修改
            //搜索提交
            searchForm:{
                meetingRankMeetingId:'',
                meetingRankStatus:'0',
            },
            //列表查询结果
            tableData: [{
                meetingRankId:'',//主键  
                meetingRankMeetingId:'',//所属会议编号
                meetingRankCrtUserId:'',//
                meetingRankModUserId:'',//
                meetingRankCrtTime:'',//
                meetingRankModTime:'',//
                meetingRankStatus:'',//状态 0正常 1删除
                meetingRankJson:[],//
            }],
            //分页器相关
            pagination1: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
            //封面图表单
            rankForm:{
                meetingRankId:'',//主键  
                meetingRankMeetingId:'',//所属会议编号
                meetingRankCrtUserId:'',//
                meetingRankModUserId:'',//
                meetingRankCrtTime:'',//
                meetingRankModTime:'',//
                meetingRankStatus:'',//状态 0正常 1删除
                meetingRankJson:[{
                        rankLevel:'1',
                        rankTitle:'',
                        children:[
                    //    {
                    //         rankLevel:'2',
                    //         rankTitle:'',
                    //         children:[{
                    //             rankLevel:'3',
                    //             rankTitle:'',
                    //             children:[{
                    //                 rankLevel:'4',
                    //                 rankTitle:'',
                    //             }]
                    //         }]
                    //     }
                        ]
                    }
                ],
            },
            rankFormRules:{
                meetingRankMeetingId: [
                    { required: true, validator: validateId, trigger: 'change' }
                ]
            }
        }
    },
    watch: {
    },
    created () {
        this.startSearch(0)
    },
    methods:{
        handleCurrentChange (val) {
            this.pagination1.currPage = val
            this.startSearch()
        },
        //添加一级榜单
        addNewRank () {
            let Lv1Length = this.rankForm.meetingRankJson.length
            if (this.rankForm.meetingRankJson[Lv1Length - 1].rankTitle.trim() !== '') {
                this.rankForm.meetingRankJson.push({
                    rankLevel:'1',
                    rankTitle:'',
                    children:[]
                })
            } else {
                this.$message.error('请完成上一个1级榜单的内容')
            }
        },
        //删除日程---1级维度
        delLv1 (index) {
            if (this.rankForm.meetingRankJson.length <= 1) {
                this.$message.error('至少保留一个榜单')
            } else {
                this.rankForm.meetingRankJson.splice(index, 1); 
            }
        },
        //添加2级榜单
        addLv2(index){
            console.log(index)
            let currentLv1 = this.rankForm.meetingRankJson[index]
            if (currentLv1.children.length == 0) {
                this.rankForm.meetingRankJson[index].children.push({
                    rankLevel:'2',
                    rankTitle:'',
                    children:[]
                })
            } else {
                if (currentLv1.children[currentLv1.children.length - 1].rankTitle.trim() !== '' || currentLv1.children[currentLv1.children.length - 1].rankTitle.trim() == '#') {
                    this.rankForm.meetingRankJson[index].children.push({
                        rankLevel:'2',
                        rankTitle:'',
                        children:[]
                    })
                } else {
                    this.$message.error('请填写上一个榜单信息，无信息需填写"#"')
                }
            }
        },
        //删除2级榜单
        delLv2(index,index2) {
            console.log(index,index2)
            this.rankForm.meetingRankJson[index].children.splice(index2, 1); 
        },
        //添加3级榜单
        addLv3(index,index2) {
            console.log(index,index2)
            let currentLv2 = this.rankForm.meetingRankJson[index].children[index2]
            console.log(currentLv2)
            if (currentLv2.children.length == 0) {
                this.rankForm.meetingRankJson[index].children[index2].children.push({
                    rankLevel:'3',
                    rankTitle:'',
                    children:[]
                })
            } else {
                if (currentLv2.children[currentLv2.children.length - 1].rankTitle.trim() !== '' || currentLv2.children[currentLv2.children.length - 1].rankTitle.trim() == '#') {
                    this.rankForm.meetingRankJson[index].children[index2].children.push({
                        rankLevel:'3',
                        rankTitle:'',
                        children:[]
                    })
                } else {
                    this.$message.error('请填写上一个榜单信息，无信息需填写"#"')
                }
            }
        },
        //删除3级
        delLv3(index,index2,index3) {
            console.log(index,index2,index3)
            this.rankForm.meetingRankJson[index].children[index2].children.splice(index3, 1);
        },
        //添加4级
        addLv4(index,index2,index3){
            console.log(index,index2,index3)
            let currentLv3 = this.rankForm.meetingRankJson[index].children[index2].children[index3]
            console.log(currentLv3)
            if (currentLv3.children.length == 0) {
                this.rankForm.meetingRankJson[index].children[index2].children[index3].children.push({
                    rankLevel:'4',
                    rankTitle:'',
                })
            } else {
                if (currentLv3.children[currentLv3.children.length - 1].rankTitle.trim() !== '' || currentLv3.children[currentLv3.children.length - 1].rankTitle.trim() == '#') {
                    this.rankForm.meetingRankJson[index].children[index2].children[index3].children.push({
                        rankLevel:'4',
                        rankTitle:'',
                    })
                } else {
                    this.$message.error('请填写上一个榜单信息')
                }
            }
        },
        //删除4级
        delLv4(index,index2,index3,index4){
            console.log(index,index2,index3,index4)
            this.rankForm.meetingRankJson[index].children[index2].children[index3].children.splice(index4, 1);
        },
        //移动一级菜单
        moveUpLv1 (index) {
            var moveArr = JSON.parse(JSON.stringify(this.rankForm.meetingRankJson))
            let temp = moveArr[index - 1]
            let temp2 = moveArr[index]
            moveArr[index - 1] = temp2
            moveArr[index] = temp
            this.rankForm.meetingRankJson = moveArr
        },
        moveDownLv1(index) {
            var moveArr = JSON.parse(JSON.stringify(this.rankForm.meetingRankJson))
            let temp = moveArr[index]
            let temp2 = moveArr[index + 1]
            moveArr[index + 1] = temp
            moveArr[index] = temp2
            this.rankForm.meetingRankJson = moveArr
        },
        //移动二级菜单
        moveUpLv2(index,index2) {
            var moveArr = JSON.parse(JSON.stringify(this.rankForm.meetingRankJson[index].children))
            let temp = moveArr[index2 - 1]
            let temp2 = moveArr[index2]
            moveArr[index2 - 1] = temp2
            moveArr[index2] = temp
            this.rankForm.meetingRankJson[index].children = moveArr
        },
        moveDownLv2(index,index2) {
            var moveArr = JSON.parse(JSON.stringify(this.rankForm.meetingRankJson[index].children))
            let temp = moveArr[index2]
            let temp2 = moveArr[index2 + 1]
            moveArr[index2 + 1] = temp
            moveArr[index2] = temp2
            this.rankForm.meetingRankJson[index].children = moveArr
        },
        //移动三级菜单
        moveUpLv3(index,index2,index3) {
            var moveArr = JSON.parse(JSON.stringify(this.rankForm.meetingRankJson[index].children[index2].children))
            let temp = moveArr[index3 - 1]
            let temp2 = moveArr[index3]
            moveArr[index3 - 1] = temp2
            moveArr[index3] = temp
            this.rankForm.meetingRankJson[index].children[index2].children = moveArr
        },
        moveDownLv3(index,index2,index3) {
            var moveArr = JSON.parse(JSON.stringify(this.rankForm.meetingRankJson[index].children[index2].children))
            let temp = moveArr[index3]
            let temp2 = moveArr[index3 + 1]
            moveArr[index3 + 1] = temp
            moveArr[index3] = temp2
            this.rankForm.meetingRankJson[index].children[index2].children = moveArr
        },
        //移动三级菜单
        moveUpLv4(index,index2,index3,index4) {
            var moveArr = JSON.parse(JSON.stringify(this.rankForm.meetingRankJson[index].children[index2].children[index3].children))
            let temp = moveArr[index4 - 1]
            let temp2 = moveArr[index4]
            moveArr[index4 - 1] = temp2
            moveArr[index4] = temp
            this.rankForm.meetingRankJson[index].children[index2].children[index3].children = moveArr
        },
        moveDownLv4(index,index2,index3,index4) {
            var moveArr = JSON.parse(JSON.stringify(this.rankForm.meetingRankJson[index].children[index2].children[index3].children))
            let temp = moveArr[index4]
            let temp2 = moveArr[index4 + 1]
            moveArr[index4 + 1] = temp
            moveArr[index4] = temp2
            this.rankForm.meetingRankJson[index].children[index2].children[index3].children = moveArr
        },

        //开始搜索专题列表
        startSearch (type) {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchForm))
            data.meetingRankMeetingId = data.meetingRankMeetingId.toString().trim()
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
                url: "/meeting/rank/list",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.tableData = res.page.list
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
        //新增或修改嘉宾
        addOrEditRank(type,item) {
            var self = this
            self.creatOrEdit = type
            if(type == 0){
                self.showChildPage = true
            } else {
                $.ajax({
                    type: "POST",
                    url: "/meeting/rank/info/" + item.meetingRankId.toString(),
                    contentType: "application/json",
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            //json64反解
                            let data = res.dict
                            let map = $.base64.atob(data.meetingRankJson, true)
                            data.meetingRankJson = JSON.parse(map)
                            console.log(data)
                            self.rankForm = data
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
        //删除图片
        deleteThisRank (item){
            var self = this
            self.$confirm('确实要删除该榜单吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = JSON.parse(JSON.stringify(item))
                data.meetingRankStatus = 1  //0 正常  1 删除
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/meeting/rank/update",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res) {
                        if (res.code == 200) {
                            self.startSearch()
                            self.$message.success('删除成功')
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
            })
        },
        //提交表单
        submitCreatEdit (formName) {
            var self = this
            self.$refs[formName].validate((valid) => {
                if (valid) {
                    //验证一级表单是否填写完成
                    for (let i = 0; i < self.rankForm.meetingRankJson.length; i++) {
                        if (self.rankForm.meetingRankJson[i].rankTitle.trim() == '') {
                            self.$message.error('还有榜单未填写完成')
                            return
                        }
                    }
                    if (self.creatOrEdit == 0) {
                        var reqUrl = '/meeting/rank/save'
                    } else if (self.creatOrEdit == 1){
                        var reqUrl = '/meeting/rank/update'
                    }
                    var data = JSON.parse(JSON.stringify(self.rankForm))
                    $.base64.utf8encode = true;
                    var jsonString = JSON.stringify(data.meetingRankJson);
                    var json64 = $.base64.btoa(jsonString);
                    data.meetingRankJson = json64
                    console.log('6464',jsonString,json64)
                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        url: reqUrl,
                        data: JSON.stringify(data),
                        dataType: "json",
                        success: function(res){
                            if (res.code == 200) {
                                self.$message.success('保存成功');
                                self.startSearch() //列表回显
                                self.closeEditCreatEdit('rankForm')
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
                }
            })
        },
        //取消编辑返回列表页
        closeEditCreatEdit (formName) {
            this.$refs[formName].resetFields();
            this.rankForm = {
                meetingRankId:'',//主键  
                meetingRankMeetingId:'',//所属会议编号
                meetingRankCrtUserId:'',//
                meetingRankModUserId:'',//
                meetingRankCrtTime:'',//
                meetingRankModTime:'',//
                meetingRankStatus:'',//状态 0正常 1删除
                meetingRankJson:[{
                        rankLevel:'1',
                        rankTitle:'',
                        children:[]
                    }
                ],
            }
            this.showChildPage = false
            this.creatOrEdit = 0
        },
        handleAvatarSuccess(res, file) {
            //this.articleForm.imageUrl = URL.createObjectURL(file.raw);
        },
        
        
    }
})