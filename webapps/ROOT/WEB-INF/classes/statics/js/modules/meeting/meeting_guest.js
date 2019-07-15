var vm = new Vue({
    el: '#meeting_guest',
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
            showChildPage: false,
            creatOrEdit:0,//0新建  1修改
            //搜索提交
            searchForm:{
                meetingGuestMeetingId:'',
                meetingGuestStatus:'0',
            },
            //列表查询结果
            tableData: [{
                meetingGuestId:'',//主键
                meetingGuestMeetingId:'',//所属会议编号
                meetingGuestCrtUserId:'',
                meetingGuestModUserId:'',
                meetingGuestCrtTime:'',
                meetingGuestModTime:'',
                meetingGuestStatus:'',//状态 0正常 1删除
                userName:'',//创建人
                meetingTitle:'',//所属会议标题
                modUserName:'',//更新人
                meetingGuestJson:'',//json
            }],
            //分页器相关
            pagination1: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
            //会议合作机构表单
            meetingGuestForm:{
                meetingGuestId:'',//主键
                meetingGuestMeetingId:'',//所属会议编号
                meetingGuestCrtUserId:'',
                meetingGuestModUserId:'',
                meetingGuestCrtTime:'',
                meetingGuestModTime:'',
                meetingGuestStatus:'',//状态 0正常 1删除
                userName:'',//创建人
                meetingTitle:'',//所属会议标题
                modUserName:'',//更新人
                meetingGuestJson:[
                    // {
                    //    guestName:'',
                    //    guestImg:'',
                    //    guestPosition:'',//嘉宾职位
                    //    guestCompany:'',//嘉宾公司
                    // }
                ],//json
            },
            meetingGuestFormRules:{
                meetingGuestMeetingId: [
                    { required: true, validator: validateId, trigger: 'change' }
                ]
                
            },
            //当前打开图库时的索引记录
            chooseIndex:'',
            chooseIndex2:'',
            multipleSelection: [],
            //嘉宾库弹出层相关
            showGuestLibDialog:false,
            searchGuestForm:{
                guestName:'',
                guestStatus:'0'
            },
            guestTableData:[
                //{
                // guestId:'',//主键编号
                // guestName:'',//嘉宾名称
                // guestPosition:'',//嘉宾职位
                // guestCompany:'',//嘉宾公司
                // guestImg:'',//嘉宾头像
                // guestPriority:'',//嘉宾顺序
                // guestCrtUserId:'',//创建人用户编号
                // guestModUserId:'',//更新人用户编号
                // guestCrtTime:'',//创建时间
                // guestModTime:'',//更新时间
                // guestStatus:'',//嘉宾 状态 0正常 1删除
                // guestCrtUserName:'',//创建人名称
                // guestModUserName:'',//更新人名称
                //}
            ],
            pagination3: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
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
        handleCurrentChange3 (val) {
            this.pagination3.currPage = val
            this.searchGuest()
        },
        //开始搜索专题列表
        startSearch (type) {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchForm))
            data.meetingGuestMeetingId = data.meetingGuestMeetingId.toString().trim()
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
                url: "/meeting/guest/list",
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
        //前移
        moveUp(index){
            var moveArr = JSON.parse(JSON.stringify(this.meetingGuestForm.meetingGuestJson))
            let temp = moveArr[index - 1]
            let temp2 = moveArr[index]
            moveArr[index - 1] = temp2
            moveArr[index] = temp
            this.meetingGuestForm.meetingGuestJson = moveArr
        },
        //后移
        moveDown(index){
            var moveArr = JSON.parse(JSON.stringify(this.meetingGuestForm.meetingGuestJson))
            let temp = moveArr[index]
            let temp2 = moveArr[index + 1]
            moveArr[index + 1] = temp
            moveArr[index] = temp2
            this.meetingGuestForm.meetingGuestJson = moveArr
        },
        //添加嘉宾
        addGuestToList(){
            this.searchGuest(0)
            this.showGuestLibDialog = true
        },
        //搜索嘉宾库
        searchGuest (type){
            var self = this
            var data = self.searchGuestForm
            if (type == 0) {
                Object.assign(data,{
                    page: '1',
                    limit: self.pagination3.pageSize.toString()
                })
            } else {
                Object.assign(data,{
                    page: self.pagination3.currPage.toString(),
                    limit: self.pagination3.pageSize.toString()
                })
            }
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "/guest/list",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.searchGuestForm.guestName = ''
                        self.guestTableData = res.page.list
                        self.pagination3 = {
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
        //添加图片至页面
        addThisImg (item) {
            console.log('单个选择添加某个logo',item)
            this.meetingGuestForm.meetingGuestJson.push({
                guestName: item.guestName,
                guestPosition:item.guestPosition,
                guestCompany:item.guestCompany,
                guestImg: item.guestImg
            });
            this.backToEdit()
        },
        //删除所选的logo
        delThisGuest(index){
            this.meetingGuestForm.meetingGuestJson.splice(index, 1); 
        },
        //批量添加图片至列表
        batchAddGuest () {
            console.log(this.multipleSelection)
            for (let i=0; i < this.multipleSelection.length; i++) {
                this.meetingGuestForm.meetingGuestJson.push({
                    guestName: this.multipleSelection[i].guestName,
                    guestPosition:this.multipleSelection[i].guestPosition,
                    guestCompany:this.multipleSelection[i].guestCompany,
                    guestImg: this.multipleSelection[i].guestImg
                });
            }
            this.backToEdit()
        },
        //多选批量
        handleSelectionChange (val) {
            console.log(val)
            this.multipleSelection = val;
        },
        //返回编辑页
        backToEdit (){
            this.showGuestLibDialog = false
            this.multipleSelection = []
            this.chooseIndex = ''
            this.chooseIndex2 = ''
            this.searchGuestForm = {
                guestName:'',
                guestStatus:'0'
            }
            this.guestTableData = []
            this.pagination3 = {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            }
        },
        //新增或修改嘉宾
        addOrEditGuest(type,item) {
            var self = this
            self.creatOrEdit = type
            if(type == 0){
                self.showChildPage = true
                console.log('新增嘉宾')
            } else {
                $.ajax({
                    type: "POST",
                    url: "/meeting/guest/info/" + item.meetingGuestId.toString(),
                    contentType: "application/json",
                    dataType: "json",
                    success: function(res){
                        if(res.code == 200){
                            //json64反解
                            let data = res.dict
                            let map = $.base64.atob(data.meetingGuestJson, true)
                            data.meetingGuestJson = JSON.parse(map)
                            console.log(data)
                            self.meetingGuestForm = data
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
                console.log('修改机构',self.meetingGuestForm.picUrl)
            }
        },
        //删除
        deleteThisGuest (item){
            var self = this
            self.$confirm('确实要删除该嘉宾数据吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = JSON.parse(JSON.stringify(item))
                data.meetingGuestStatus = 1  //0 正常  1 删除
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/meeting/guest/update",
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

        //新建或编辑保存--优先上传图片，再提交保存
        testSubmit(formName) {
            var self = this
            self.$refs[formName].validate((valid) => {
                if (valid) {
                    //验证是否有重复数据
                    if (self.creatOrEdit == 0) {
                        var data = {
                            meetingGuestMeetingId:self.meetingGuestForm.meetingGuestMeetingId,
                            meetingGuestStatus:'0',
                            page: '1',
                            limit: '100'
                        }
                        $.ajax({
                            type: "POST",
                            url: "/meeting/guest/list",
                            contentType: "application/json",
                            data: JSON.stringify(data),
                            dataType: "json",
                            success: function(res){
                                if(res.code == 200){
                                    if (res.page.list.length == 0) {
                                        self.submitCreatEdit()
                                    } else {
                                        self.$message.error('该会议数据已存在，不能重复创建')
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
                    } else if (self.creatOrEdit == 1) {
                        self.submitCreatEdit()
                    }


                }
            })
        },
        //提交
        submitCreatEdit(){
            var self = this
            if (self.creatOrEdit == 0) {
                var reqUrl = '/meeting/guest/save'
            } else if (self.creatOrEdit == 1) {
                var reqUrl = '/meeting/guest/update'
            }
            var data = JSON.parse(JSON.stringify(self.meetingGuestForm))
            $.base64.utf8encode = true;
            var jsonString = JSON.stringify(data.meetingGuestJson);
            var json64 = $.base64.btoa(jsonString);
            data.meetingGuestJson = json64
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
                        self.closeCreatOrEdit('meetingGuestForm')
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
        //取消编辑返回列表页
        closeCreatOrEdit (formName) {
            this.$refs[formName].resetFields();
            this.meetingGuestForm = {
                meetingGuestId:'',//主键
                meetingGuestMeetingId:'',//所属会议编号
                meetingGuestCrtUserId:'',
                meetingGuestModUserId:'',
                meetingGuestCrtTime:'',
                meetingGuestModTime:'',
                meetingGuestStatus:'',//状态 0正常 1删除
                userName:'',//创建人
                meetingTitle:'',//所属会议标题
                modUserName:'',//更新人
                meetingGuestJson:[],//json
            }
            this.showChildPage = false
            this.creatOrEdit = 0
        },
        handleAvatarSuccess(res, file) {
            //this.articleForm.imageUrl = URL.createObjectURL(file.raw);
        },
        
        
    }
})