var vm = new Vue({
    el: '#edit_rank',
    data () {
        var validateWeight = (rule, value, callback) => {
            var urlReg = /^[0-9]*[1-9][0-9]*$/;
            var urlReg2 = /^-[0-9]*[1-9][0-9]*$/;
            if (value) {
                if (value == 0) {
                    callback();
                } else if (value.toString() == '0') {
                    callback();
                } else if (!urlReg.test(value) && !urlReg2.test(value) ) {
                    callback(new Error('权重只能填写整数或0'));
                } else {
                    callback();
                }
            } else {
                callback(new Error('权重为必填项'));
            }
        }
        
        return{
            //页面显示维度
            showChildPage:'0',//0 主页面  1机构榜编辑  2人物榜单编辑 3案例榜单编辑  4服务机构榜单编辑 
            //总榜单id
            rankId:'', 
            rankDataTree:[],
            //榜单类型选项 服务机构是--其他榜单
            rankTypeOptions:[{
                label:'目录',
                value:'0'
                },{
                    label:'机构榜单',
                    value:'1'
                },{
                    label:'人物榜单',
                    value:'2'
                },{
                    label:'其他',
                    value:'3'
                },{
                    label:'案例榜单',
                    value:'4'
                }
            ],
            //榜单序列选项
            rankOrderTypeOptions:[{
                    label:'PE主榜',
                    value:'1'
                },{
                    label:'VC主榜',
                    value:'2'
                },{
                    label:'LP主榜',
                    value:'3'
                },{
                    label:'其他',
                    value:'4'
                }
            ],
            //展示榜单信息弹出层
            showAddOrChangeRankInfo:false,
            ifFirstFloor:true, //是否1级目录
            ifCreatOrChangeInfo:'0',//0新建  1修改
            lsNode: {}, //临时存贮节点
            lsData: {}, //临时存贮节点数据
            rankInfoForm:{
                id:'',//主键
                parentId:'',//父节点
                rankId:'',//榜单id
                name:'',//名称
                weight:'-1',//权重排序
                sortOrder:'1',//排序方式，1，显示排序，2，不显示排序
                type:'',//榜单序列（类型）1：机构榜单；2：人物榜单；3：服务机构榜；4：案例榜单
                orderType:'4',//榜单序列（类型）{1：PE主榜；2：VC主榜；3：LP主榜；4：其他}
                level:'',//目录级别
                end:'',//是否为最后1级，0不是，1是
                description:'',//描述
                remarks:'',//备注
                createUserId:'',//
                updateUserId:'',//
                updateAt:'',//
                createAt:'',//
                delStatus:'1',//0已删除1未删除
            },
            rankInfoFormRules:{
                name:[
                    { required: true, message: '请填写标题', trigger: 'change' }
                ],
                description:[
                    { required: true, message: '请填写描述', trigger: 'change' }
                ],
                type:[
                    { required: true, message: '请选择类型', trigger: 'change' }
                ],
                weight:[
                    { required: true, validator: validateWeight, trigger: 'change' }
                ],
            },
            //编辑某一个榜单时的临时查询rankCatalogId,所有榜单公用字段
            currentSearchCatalogId: '',
            //////////////机构榜单
            searchInstituteForm:{
                rankCatalogId:'',
                name:'',
                delStatus:'1'
            },
            currentInstituteTableData:[],
            showInstituteLib: false,
            searchInstituteLibForm:{
                cooperationName:'',
                cooperationStatus:'0',
            },
            instituteLibData:[],
            pagination1: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
            //////////////人物榜单
            searchPeopleForm:{
                rankCatalogId:'',
                name:'',
                delStatus:'1'
            },
            currentPeopleTableData:[],
            showPeopleLib: false,
            searchPeopleLibForm:{
                guestName:'',
            },
            peopleLibData:[],
            pagination2: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
            //////////////案例榜单
            searchCaseForm:{
                rankCatalogId:'',
                name:'',
                delStatus:'1'
            },
            currentCaseTableData:[],
            ifCreatOrEditSingleCase: 'creat',//0新建 1编辑
            showAddOrEditCase:false, //新建编辑某条案例
            singleCaseForm:{
                id:'',//主键
                cvId:'',//投In关联id
                rankId:'',//榜单id
                rankCatalogId:'',//榜单目录Id
                name:'',//名称
                title: '0',//是否为标题1 标题，0数据
                logoUrl:'',//logo图片
                weight:'-1',//排序
                sortOrder:'',//排序方式，1，显示排序，2，不显示排序
                type:'',//类型{1：机构；2：企业；3：人物；4：其他}
                createUserId:'',//
                updateUserId:'',//
                updateAt:'',//
                createAt:'',//
                delStatus:'1',//已删除1未删除
            },
            singleCaseFormRules:{
                name:[
                    { required: true, message: '请填写标题', trigger: 'change' }
                ],
                title:[
                    { required: true, message: '请选择表头类型', trigger: 'change' }
                ],
                weight:[
                    { required: true, validator: validateWeight, trigger: 'change' }
                ],
            },
            //关联某一条案例的机构相关数据
            showCaseConnectPage:false, //打开关联机构浮层
            currentCaseId:'',//当前的案例id
            caseInnerSearchForm: {
                name:'',//
                rankCaseId:'',//案例的id
                delStatus:'1',
                title:'',
                institutionId:''
            },
            caseInstitutionTableData:[],//案例关联机构列表
            showCaseInstitutionCaseLib: false,//案例机构库
            searchCaseInstitutionLibForm:{
                cooperationName:'',
                cooperationStatus:'0',
            },
            caseInstitutionLibData:[],
            pagination3: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            },
            //////////////服务机构榜单
            searchServingForm:{
                rankCatalogId:'',
                name:'',
                delStatus:'1'
            },
            currentServingTableData:[],
            showAddOrEditServing: false,
            ifCreatOrEditSingleServing:'creat',
            servingForm:{
                id:'',//
                cvId:'',//投In关联id
                rankId:'',//榜单id
                rankCatalogId:'',//榜单目录Id
                institutionId:'',//机构管理ID
                name:'',//名称
                logoUrl:'',//logo图片
                weight:'-1',//排序
                sortOrder:'',//排序方式，1，显示排序，2，不显示排序
                type:'',//类型{1：机构；2：企业；3：人物；4：其他}
                createUserId:'',//
                updateUserId:'',//
                updateAt:'',//
                createAt:'',//
                delStatus:'1',//0已删除1未删除
            },
            servingFormRules:{
                name:[
                    { required: true, message: '请填写标题', trigger: 'change' }
                ],
                title:[
                    { required: true, message: '请选择表头类型', trigger: 'change' }
                ],
                weight:[
                    { required: true, validator: validateWeight, trigger: 'change' }
                ],
            },


        }
        
    },
    mounted () {
        var type = getCookie('createditrank')
        if (type == '' || type == undefined) {
            this.$confirm('请您选择要编辑的总榜单' , '提示', {
                dangerouslyUseHTMLString: true,
                closeOnClickModal: false,
                showCancelButton:false,
                showClose:false,
                confirmButtonText:'我知道了',
                type: 'warning'
            }).then(() => {
                setCookie ('createditrank', '', 1)
                window.parent.location.href = '/index.html#modules/rank/rank_list.html'
            })
        } else {
            this.rankId = getCookie('createditrank')
            this.getTreeByRankId()
        }
    },
    methods:{
        //获取总榜单下的树形数据
        getTreeByRankId () {
            var self = this
            var data = {
                rankId: self.rankId.toString()
            }
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "/rankCatalog/tree",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    console.log(res)
                    if (res.code == 200) {
                        self.rankDataTree = res.list
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
        },
        //打开榜单或目录属性对话框
        openRankInfoDialog () {
            this.showAddOrChangeRankInfo = true
        },
        //添加新榜单或目录
        addNewLevelOrRank () {
            this.ifCreatOrChangeInfo = '0' //0新建  1修改
            this.lsNode = {id:0} //临时存贮节点
            this.lsData = {id:0} //临时存贮节点数据
            this.rankInfoForm = {
                id:'',//主键
                parentId:'0',//父节点
                rankId: this.rankId,//榜单id
                name:'',//名称
                weight:'-1',//权重排序
                sortOrder:'1',//排序方式，1，显示排序，2，不显示排序
                type:'',//榜单序列（类型）1：机构榜单；2：人物榜单；3：服务机构榜；4：案例榜单
                orderType:'4',//榜单序列（类型）{1：PE主榜；2：VC主榜；3：LP主榜；4：其他}
                level:'',//目录级别
                end:'',//是否为最后1级，0不是，1是
                description:'',//描述
                remarks:'',//备注
                createUserId:'',//
                updateUserId:'',//
                updateAt:'',//
                createAt:'',//
                delStatus:'1',//0已删除1未删除
            }
            this.ifFirstFloor = true
            this.ifCreatOrChangeInfo = '0'//0新建  1修改
            //判断是否是1级目录
            if (this.ifFirstFloor) {
                this.rankInfoForm.level = 1
            }
            this.openRankInfoDialog()
        },
        //添加下一个层级
        appendLevelOrRank (node,data) {
            var parent = node.parent;
            var children = parent.data.children || parent.data;
            var index = children.findIndex(d => d.id == data.id);
            console.log('node',node,'data',data,'parent',parent,'children',children,'index',index)
            this.lsNode = node //临时存贮节点
            this.lsData = data //临时存贮节点数据
            this.ifCreatOrChangeInfo = '0' //0新建  1修改
            this.ifFirstFloor = false //是否1级目录
            this.rankInfoForm = {
                id:'',//主键
                parentId: data.id.toString(),//父节点,当前节点id作为下一级别的父节点id
                rankId: this.rankId,//榜单id
                name:'',//名称
                weight:'-1',//权重排序
                sortOrder:'1',//排序方式，1，显示排序，2，不显示排序
                type:'',//榜单序列（类型）1：机构榜单；2：人物榜单；3：服务机构榜；4：案例榜单
                orderType:'4',//榜单序列（类型）{1：PE主榜；2：VC主榜；3：LP主榜；4：其他}
                level: parseFloat(data.level) + 1,//目录级别
                end:'',//是否为最后1级，0不是，1是
                description:'',//描述
                remarks:'',//备注
                createUserId:'',//
                updateUserId:'',//
                updateAt:'',//
                createAt:'',//
                delStatus:'1',//0已删除1未删除
            }
            console.log('子目录添加层级',this.rankInfoForm)

            this.openRankInfoDialog()

        },
        //删除此目录
        removeThisCatalog(node,data) {
            var self = this
            console.log('node',node,'data',data)
            var _data = data
            self.$confirm('确实要删除此目录吗? 删除改目录层级会一并删除其所有子目录', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var reqdata = {
                    id: _data.id.toString(),
                    type: 1 //删除的类型 0榜单 1目录 2 案例榜单 3 案例榜单关系 4 机构榜单 5任务榜单 6 服务机构榜单
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: '/rank/updateStatus',
                    data: JSON.stringify(reqdata),
                    dataType: "json",
                    success: function(res){
                        console.log(res)
                        if (res.code == 200) {
                            self.getTreeByRankId()
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
        //保存榜单目录信息
        saveRankInfoForm (formName) {
            var self = this
            self.$refs[formName].validate((valid) =>{
                if (valid) {
                    var data = JSON.parse(JSON.stringify(self.rankInfoForm))
                    //判断是目录还是榜单
                    if (data.type == '0') {//0代表目录
                        data.end = 0 //是否为最后1级，0不是，1是
                    } else {
                        data.end = 1 //是否为最后1级，0不是，1是
                    }
                    //业务逻辑判断，层级只能是4 + 1 = 5级最多,5级必须是榜单
                    if (parseFloat(data.level) == 5 && data.end == 0) {
                        self.$message.error('最后一级必须为榜单，不能是目录')
                        return
                    }
                    //判断是新建还是修改
                    if (self.ifCreatOrChangeInfo == '0') {
                        var reqUrl = '/rankCatalog/save'
                    } else if (self.ifCreatOrChangeInfo == '1') {
                        var reqUrl = '/rankCatalog/update'
                    }
                    
                    console.log('新建的层级为:',data)
                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        url: reqUrl,
                        data: JSON.stringify(data),
                        dataType: "json",
                        success: function(res){
                            console.log(res)
                            if (res.code == 200) {
                                self.closeRankInfoForm('rankInfoForm')
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
        //关闭榜单配置弹框
        closeRankInfoForm (formName) {
            //请求回显
            this.getTreeByRankId()
            //还原数据
            this.showAddOrChangeRankInfo = false
            this.ifCreatOrChangeInfo='0'//0新建  1修改
            this.ifFirstFloor = true //是否1级目录
            this.lsNode= {} //临时存贮节点
            this.lsData= {} //临时存贮节点数据
            this.rankInfoForm = {
                id:'',//主键
                parentId:'',//父节点
                rankId: this.rankId,//榜单id
                name:'',//名称
                weight:'-1',//权重排序
                sortOrder:'1',//排序方式，1，显示排序，2，不显示排序
                type:'',//榜单序列（类型）1：机构榜单；2：人物榜单；3：服务机构榜；4：案例榜单
                orderType:'4',//榜单序列（类型）{1：PE主榜；2：VC主榜；3：LP主榜；4：其他}
                level:'',//目录级别
                end:'',//是否为最后1级，0不是，1是
                description:'',//描述
                remarks:'',//备注
                createUserId:'',//
                updateUserId:'',//
                updateAt:'',//
                createAt:'',//
                delStatus:'1',//0已删除1未删除
            }
            this.$refs[formName].resetFields();
        },
        //修改当前的目录或榜单
        changeLevelOrRank(node,data) {
            console.log('修改当前的目录或榜单',node,data)
            this.lsNode= node //临时存贮节点
            this.lsData= data //临时存贮节点数据
            this.rankInfoForm = JSON.parse(JSON.stringify(data))
            this.rankInfoForm.type = this.rankInfoForm.type.toString()
            this.rankInfoForm.orderType = this.rankInfoForm.orderType.toString()
            this.ifCreatOrChangeInfo = '1'//0新建  1修改
            this.showAddOrChangeRankInfo = true
        },
        
        //添加榜单数据
        editRankData(node,data) {
            var parent = node.parent;
            var children = parent.data.children || parent.data;
            var index = children.findIndex(d => d.id == data.id);
            console.log('node',node,'data',data,'parent',parent,'children',children,'index',index)
            this.lsNode = node //临时存贮节点
            this.lsData = data //临时存贮节点数据
            //设置当前榜单的查询rankCatalogId
            this.currentSearchCatalogId = data.id.toString()
            if (data.type == '1') {//1：机构榜单；2：人物榜单；3：服务机构榜；4：案例榜单
                console.log('机构榜','id=',data.id)
                this.searchInstituteForm.rankCatalogId = this.currentSearchCatalogId
                this.searchCurrentInstitute()
            } else if (data.type == '2') {
                console.log('人物榜','id=',data.id)
                this.searchPeopleForm.rankCatalogId = this.currentSearchCatalogId
                this.searchCurrentPeople()
            } else if (data.type == '3') {
                console.log('服务机构榜')
                this.searchServingForm.rankCatalogId = this.currentSearchCatalogId
                this.searchCurrentServing()
            } else if (data.type == '4') {
                console.log('案例榜单','id=',data.id)
                this.searchCaseForm.rankCatalogId = this.currentSearchCatalogId
                this.searchCurrentCase()
            }
        },
        ////////////////////////////////编辑机构榜单相关方法
        //搜索当前榜单下的机构--不分页
        searchCurrentInstitute () {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchInstituteForm))
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: '/rankInstitution/array',
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    console.log(res)
                    if (res.code == 200) {
                        self.currentInstituteTableData = res.list
                        self.showChildPage = '1'
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
        },
        //向机构榜单添加机构数据
        addInstituteToRank () {
            this.startSearchInstituteLib(0)
            this.showInstituteLib = true
        },
        //搜索机构库
        startSearchInstituteLib (type) {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchInstituteLibForm))
            data.cooperationName = data.cooperationName.toString().trim()
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
                url: "/cooperation/list",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.instituteLibData = res.page.list
                        self.pagination1 = {
                            currPage: res.page.currPage,
                            totalCount:res.page.totalCount,
                            totalPage:res.page.totalPage,
                            pageSize:res.page.pageSize
                        }
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
        },
        handleCurrentChange (val) {
            this.pagination1.currPage = val
            this.startSearchInstituteLib()
        },
        //添加机构到榜单
        addThisInstituteToRank (item){
            console.log('要添加的条目',item)
            var self = this
            //将人物库的数据copy一份调save接口来复制出一条原有数据进入业务表
            var copyData = {
                id:'',//主键
                cvId:'',//投In关联id
                rankId:'',//榜单id
                rankCatalogId: self.currentSearchCatalogId,//榜单目录Id
                institutionId: item.cooperationId.toString(),//给搜索同步一个机构id
                name: item.cooperationName,//名称
                logoUrl:item.cooperationImg,//logo图片
                weight:'-1',//排序
                sortOrder:'',//1，显示排序，2，不显示排序
                type:'',//1：机构；2：企业；3：人物；4：其他
                createUserId:'',//
                updateUserId:'',//
                updateAt:'',//
                createAt:'',//
                delStatus:'1',//0已删除1未删除
            }
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: '/rankInstitution/save',
                data: JSON.stringify(copyData),
                dataType: "json",
                success: function(res){
                    if (res.code == 200) {
                        self.backToInstituteRank()
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
        },
        //返回机构榜单编辑页面
        backToInstituteRank () {
            this.searchInstituteForm = {
                rankCatalogId: this.currentSearchCatalogId,
                name:'',
                delStatus:'1'
            }
            this.currentInstituteTableData=[]
            this.showInstituteLib = false
            this.searchInstituteLibForm = {
                cooperationName:'',
                cooperationStatus:'0',
            },
            this.instituteLibData = []
            this.pagination1 = {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            }
            //请求机构榜单不分页列表回显
            this.searchCurrentInstitute()
        },
        //机构榜单顺序调整
        instituteRankWeightChange(item){
            console.log('修改榜单权重',item)
            var self = this
            var data = {
                id: item.id.toString(),
                weight: item.weight
            }
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: '/rankInstitution/update',
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if (res.code == 200) {
                        //请求机构榜单不分页列表回显
                        self.searchCurrentInstitute()
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
        },
        //删除机构榜中的机构条目
        delThisInstituteFromRank (item) {
            var self = this
            self.$confirm('确实要删除该机构吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var reqdata = {
                    id: item.id.toString(),
                    type: 4 //删除的类型 0榜单 1目录 2 案例榜单 3 案例榜单关系 4 机构榜单 5任务榜单 6 服务机构榜单
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: '/rank/updateStatus',
                    data: JSON.stringify(reqdata),
                    dataType: "json",
                    success: function(res){
                        console.log(res)
                        if (res.code == 200) {
                            //请求机构榜单不分页列表回显
                            self.searchCurrentInstitute()
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
        //从机构榜返回到榜单目录
        backToRankListFromInstitute () {
            this.currentSearchCatalogId = ''
            this.searchInstituteForm = {
                rankCatalogId: '',
                name:'',
                delStatus:'1'
            }
            this.currentInstituteTableData=[]
            this.showInstituteLib = false
            this.searchInstituteLibForm = {
                cooperationName:'',
                cooperationStatus:'0',
            },
            this.instituteLibData = []
            this.pagination1 = {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            }
            this.showChildPage = '0'
        },
        ////////////////////////////////编辑人物榜单相关方法
        //搜索当前榜单下的机构--不分页
        searchCurrentPeople () {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchPeopleForm))
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: '/rankPerson/array',
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    console.log(res)
                    if (res.code == 200) {
                        self.currentPeopleTableData = res.list
                        self.showChildPage = '2'
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
        },
        //向人物榜单添加机构数据
        addPeopleToRank () {
            this.startSearchPeopleLib(0)
            this.showPeopleLib = true
        },
        //搜索人物库
        startSearchPeopleLib (type) {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchPeopleLibForm))
            data.guestName = data.guestName.toString().trim()
            if (type == 0) {
                Object.assign(data,{
                    page: '1',
                    limit: self.pagination2.pageSize.toString()
                })
            } else {
                Object.assign(data,{
                    page: self.pagination2.currPage.toString(),
                    limit: self.pagination2.pageSize.toString()
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
                        self.peopleLibData = res.page.list
                        self.pagination2 = {
                            currPage: res.page.currPage,
                            totalCount:res.page.totalCount,
                            totalPage:res.page.totalPage,
                            pageSize:res.page.pageSize
                        }
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
        },
        handleCurrentChange2 (val) {
            this.pagination2.currPage = val
            this.startSearchPeopleLib ()
        },
        //添加人物到榜单
        addThisPeopleToRank (item){
            console.log('要添加的条目',item)
            var self = this
            //将人物库的数据copy一份调save接口来复制出一条原有数据进入业务表
            var copyData = {
                id:'',//
                cvId:'',//投In关联id
                rankId:'',//榜单id
                rankCatalogId: self.currentSearchCatalogId,//榜单目录Id
                name: item.guestName,//名称
                alive:'1',//是否已故，0已故，1在世
                logoUrl:item.guestImg,//图片
                institutionId:'',//机构管理ID
                institutionName:item.guestCompany,//机构名称
                weight:'-1',//排序
                sortOrder:'',//排序方式，1，显示排序，2，不显示排序
                type:'',//1：机构；2：企业；3：人物；4：其他
                createUserId:'',//
                updateUserId:'',//
                updateAt:'',//
                createAt:'',//
                delStatus:'1',//0已删除1未删除
            }
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: '/rankPerson/save',
                data: JSON.stringify(copyData),
                dataType: "json",
                success: function(res){
                    if (res.code == 200) {
                        self.backToPeopleRank()
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
        },
        //返回机构榜单编辑页面
        backToPeopleRank () {
            this.searchPeopleForm = {
                rankCatalogId: this.currentSearchCatalogId,
                name:'',
                delStatus:'1'
            }
            this.currentPeopleTableData=[]
            this.showPeopleLib = false
            this.searchPeopleLibForm = {
                guestName:''
            },
            this.peopleLibData = []
            this.pagination2 = {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            }

            //请求人物榜单不分页列表回显
            this.searchCurrentPeople()
        },
        //机构榜单顺序调整
        peopleRankWeightChange(item){
            console.log('修改榜单权重',item)
            var self = this
            var data = {
                id: item.id.toString(),
                weight: item.weight
            }
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: '/rankPerson/update',
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if (res.code == 200) {
                        //请求人物榜单不分页列表回显
                        self.searchCurrentPeople()
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
        },
        //删除机构榜中的机构条目
        delThisPeopleFromRank (item) {
            var self = this
            self.$confirm('确实要删除该人物吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var reqdata = {
                    id: item.id.toString(),
                    type: 5 //删除的类型 0榜单 1目录 2 案例榜单 3 案例榜单关系 4 机构榜单 5任务榜单 6 服务机构榜单
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: '/rank/updateStatus',
                    data: JSON.stringify(reqdata),
                    dataType: "json",
                    success: function(res){
                        console.log(res)
                        if (res.code == 200) {
                            //请求机构榜单不分页列表回显
                            self.searchCurrentPeople()
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
        //从人物榜返回到榜单目录
        backToRankListFromPeople () {
            this.currentSearchCatalogId = ''
            this.searchPeopleForm = {
                rankCatalogId: '',
                name:'',
                delStatus:'1'
            }
            this.currentPeopleTableData=[]
            this.showPeopleLib = false
            this.searchPeopleLibForm={
                guestName:'',
            }
            this.peopleLibData = []
            this.pagination2 = {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            }
            this.showChildPage = '0'
        },
        ////////////////////////////////编辑案例榜单相关方法
        //搜索当前榜单下的案例--不分页
        searchCurrentCase () {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchCaseForm))
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: '/rankCase/array',
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    console.log(res)
                    if (res.code == 200) {
                        self.currentCaseTableData = res.list
                        self.showChildPage = '3'
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
        },
        //新建或编辑
        addOrEditCaseToRank(type){
            var self = this
            if (type == '0') {
                this.ifCreatOrEditSingleCase = 'creat'
                this.singleCaseForm.rankCatalogId = this.currentSearchCatalogId
                this.showAddOrEditCase = true
            } else {
                this.ifCreatOrEditSingleCase = 'edit'
                this.singleCaseForm.rankCatalogId = this.currentSearchCatalogId
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: '/rankCase/info/' + type.id,
                    dataType: "json",
                    success: function(res){
                        if (res.code == 200) {
                            console.log('编辑某一条案例',res.dict)
                            self.singleCaseForm = res.dict
                            self.showAddOrEditCase = true
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
            
        },
        //切换是否为表头
        ifTitleChange (val) {
            if (val == 1) {
                this.singleCaseForm.weight = 1000000
            } else {
                this.singleCaseForm.weight = -1
            }
        },
        //判断是否保存单条案例--如果该榜单有页头就不能保存成功
        ifSaveSingleCaseForm (formName){
            var self = this
            self.$refs[formName].validate((valid) =>{
                if (valid) {
                    var data = {
                        rankCatalogId: self.currentSearchCatalogId,
                        title:'1', //1为表头
                        delStatus:'1'
                    }
                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        url: '/rankCase/array',
                        data: JSON.stringify(data),
                        dataType: "json",
                        success: function(res){
                            if (res.code == 200) {
                                console.log('判断之前是否有表头返回',res.list.length !== 0)
                                if (res.list.length == 0) {
                                    self.saveSingleCaseForm()
                                } else if (res.list.length !== 0 && self.singleCaseForm.title == '1') {
                                    self.$message.error('表头已经存在，设置新表头请删除原来表头')
                                } else {
                                    self.saveSingleCaseForm()
                                }
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
        //保存单条案例
        saveSingleCaseForm () {
            var self = this
            //判断是新建还是修改
            if (self.ifCreatOrEditSingleCase == 'creat') {
                var reqUrl = '/rankCase/save'
            } else if (self.ifCreatOrEditSingleCase == 'edit') {
                var reqUrl = '/rankCase/update'
            }
            var data = JSON.parse(JSON.stringify(self.singleCaseForm))
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: reqUrl,
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if (res.code == 200) {
                        self.$message.success('保存成功');
                        self.closeSingleCaseForm('singleCaseForm')
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
        },
        //关闭新建或修改单条案例
        closeSingleCaseForm(formName){
            //还原数据
            this.searchCaseForm = {
                rankCatalogId:this.currentSearchCatalogId,
                name:'',
                delStatus:'1'
            },
            this.singleCaseForm = {
                id:'',//主键
                cvId:'',//投In关联id
                rankId:'',//榜单id
                rankCatalogId:this.currentSearchCatalogId,//榜单目录Id
                name:'',//名称
                title: '0',//是否为标题1 标题，0数据
                logoUrl:'',//logo图片
                weight:'-1',//排序
                sortOrder:'',//排序方式，1，显示排序，2，不显示排序
                type:'',//类型{1：机构；2：企业；3：人物；4：其他}
                createUserId:'',//
                updateUserId:'',//
                updateAt:'',//
                createAt:'',//
                delStatus:'1',//已删除1未删除
            }
            this.$refs[formName].resetFields();
            this.showAddOrEditCase = false
            //反显列表
            this.searchCurrentCase()
        },
        //案例榜单顺序权重改变
        caseRankWeightChange (item) {
            console.log('修改案例权重',item)
            var self = this
            var data = {
                id: item.id.toString(),
                weight: item.weight
            }
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: '/rankCase/update',
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if (res.code == 200) {
                        //请求人物榜单不分页列表回显
                        self.searchCurrentCase()
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
        },
        //从当前榜单中删除案例
        delThisCaseFromRank (item) {
            var self = this
            self.$confirm('确实要删除该案例吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var reqdata = {
                    id: item.id.toString(),
                    type: 2 //删除的类型 0榜单 1目录 2 案例榜单 3 案例榜单关系 4 机构榜单 5任务榜单 6 服务机构榜单
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: '/rank/updateStatus',
                    data: JSON.stringify(reqdata),
                    dataType: "json",
                    success: function(res){
                        console.log(res)
                        if (res.code == 200) {
                            //请求案例榜单不分页列表回显
                            self.searchCurrentCase()
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
        //从案例榜返回到榜单目录
        backToRankListFromCase () {
            this.currentSearchCatalogId = ''
            this.searchCaseForm={
                rankCatalogId:'',
                name:'',
                delStatus:'1'
            }
            this.currentCaseTableData = []
            this.ifCreatOrEditSingleCase = 'creat'//0新建 1编辑
            this.showAddOrEditCase = false //新建编辑某条案例
            this.singleCaseForm = {
                id:'',//主键
                cvId:'',//投In关联id
                rankId:'',//榜单id
                rankCatalogId:'',//榜单目录Id
                name:'',//名称
                title: '0',//是否为标题1 标题，0数据
                logoUrl:'',//logo图片
                weight:'-1',//排序
                sortOrder:'',//排序方式，1，显示排序，2，不显示排序
                type:'',//类型{1：机构；2：企业；3：人物；4：其他}
                createUserId:'',//
                updateUserId:'',//
                updateAt:'',//
                createAt:'',//
                delStatus:'1',//已删除1未删除
            }
            this.showChildPage = '0'
        },
        //关联某一条案例下的关联机构
        editInstituteToCaseItem (item) {
            this.currentCaseId = item.id.toString()
            this.caseInnerSearchForm.rankCaseId = this.currentCaseId
            this.showCaseConnectPage = true
            this.startSearchThisCaseIntitute()
        },
        //搜索该案例下的机构----不分页
        startSearchThisCaseIntitute () {
            var self = this
            var data = JSON.parse(JSON.stringify(self.caseInnerSearchForm))
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: ' /rankCaseInstitution/array',
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if (res.code == 200) {
                       console.log('榜单关联机构不分页返回',res.list)
                       self.caseInstitutionTableData = res.list
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
        },
        //给某一条案例添加关联机构
        addInstituteToThisCase () {
            this.showCaseInstitutionCaseLib = true
            this.startSearchInstituteLib2(0)
        },
        //搜索机构库
        startSearchInstituteLib2 (type) {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchCaseInstitutionLibForm))
            data.cooperationName = data.cooperationName.toString().trim()
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
                url: "/cooperation/list",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){

                        self.caseInstitutionLibData = res.page.list
                        self.pagination3 = {
                            currPage: res.page.currPage,
                            totalCount:res.page.totalCount,
                            totalPage:res.page.totalPage,
                            pageSize:res.page.pageSize
                        }
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
        },
        handleCurrentChange3 (val) {
            this.pagination3.currPage = val
            this.startSearchInstituteLib2()
        },
        //添加机构到案例
        addThisInstituteToCase (item){
            console.log('要添加的条目',item)
            var self = this
            //将机构库的数据copy一份调save接口来复制出一条原有数据进入业务表
            var copyData = {
                cvId:'',//
                rankId:'',//
                rankCatalogId:'',//
                rankCaseId: self.currentCaseId,//
                institutionId: item.cooperationId.toString(),//
                name: item.cooperationName,//名称
                logoUrl: item.cooperationImg,//logo图片
                title:'',//
                weight:'-1',//
                sortOrder:'',//
                type:'',//
                delStatus:'1',//
            }
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: '/rankCaseInstitution/save',
                data: JSON.stringify(copyData),
                dataType: "json",
                success: function(res){
                    if (res.code == 200) {
                        self.backToInstituteCase()
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
        },
        //返回案例机构列表编辑页面
        backToInstituteCase () {
            this.showCaseInstitutionCaseLib = false,//案例机构库
            this.searchCaseInstitutionLibForm = {
                cooperationName:'',
                cooperationStatus:'0',
            }
            this.caseInstitutionLibData = []
            this.pagination3 = {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
            }
            this.caseInnerSearchForm = {
                name:'',//
                rankCaseId: this.currentCaseId,//案例的id
                delStatus:'1',
                title:'',
                institutionId:''
            }
            //请求案例下的机构不分页列表回显
            this.startSearchThisCaseIntitute()
        },
        //案例榜单关联机构顺序调整
        caseRankInstituteWeightChange(item){
            console.log('修改榜单权重',item)
            var self = this
            var data = {
                id: item.id.toString(),
                weight: item.weight
            }
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: '/rankCaseInstitution/update',
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if (res.code == 200) {
                        //请求机构榜单不分页列表回显
                        self.startSearchThisCaseIntitute()
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
        },
        //返回案例榜单编辑页面
        backToInstituteToCaseList () {
            this.showCaseConnectPage = false, //打开关联机构浮层
            this.currentCaseId = ''//当前的案例id
            this.caseInnerSearchForm =  {
                name:'',//
                rankCaseId:'',//案例的id
                delStatus:'1',
                title:'',
                institutionId:''
            },
            this.caseInstitutionTableData =[]//案例关联机构列表
            //反显案例下的案例列表
            this.searchCurrentCase()
        },
        //从当前榜单中删除案例
        delThisInstituteFromCase (item) {
            var self = this
            self.$confirm('确实要删除该机构吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var reqdata = {
                    id: item.id.toString(),
                    type: 3 //删除的类型 0榜单 1目录 2 案例榜单 3 案例榜单关系 4 机构榜单 5任务榜单 6 服务机构榜单
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: '/rank/updateStatus',
                    data: JSON.stringify(reqdata),
                    dataType: "json",
                    success: function(res){
                        console.log(res)
                        if (res.code == 200) {
                            //请求案例榜单关联机构不分页列表回显
                            self.startSearchThisCaseIntitute()
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
        ////////////////////////////////编辑服务机构榜单相关方法
        //搜索当前榜单下的机构--不分页
        searchCurrentServing () {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchServingForm))
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: '/rankServing/array',
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    console.log(res)
                    if (res.code == 200) {
                        self.currentServingTableData = res.list
                        self.showChildPage = '4'
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
        },
        //新建或编辑服务到榜单
        addOrEditServingToRank (type) {
            var self = this
            if (type == '0') {
                this.ifCreatOrEditSingleServing = 'creat'
                this.servingForm.rankCatalogId = this.currentSearchCatalogId
                this.showAddOrEditServing = true
            } else {
                this.ifCreatOrEditSingleServing = 'edit'
                this.servingForm.rankCatalogId = this.currentSearchCatalogId
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: '/rankServing/info/' + type.id,
                    dataType: "json",
                    success: function(res){
                        if (res.code == 200) {
                            console.log('编辑某一条服务机构',res.dict)
                            self.servingForm = res.dict
                            self.showAddOrEditServing = true
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
        },
        //保存单条服务
        saveSingleServingForm(formName) {
            var self = this
            self.$refs[formName].validate((valid) =>{
                if (valid) {
                    var self = this
                    //判断是新建还是修改
                    if (self.ifCreatOrEditSingleServing == 'creat') {
                        var reqUrl = '/rankServing/save'
                    } else if (self.ifCreatOrEditSingleServing == 'edit') {
                        var reqUrl = '/rankServing/update'
                    }
                    var data = JSON.parse(JSON.stringify(self.servingForm))
                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        url: reqUrl,
                        data: JSON.stringify(data),
                        dataType: "json",
                        success: function(res){
                            if (res.code == 200) {
                                self.$message.success('保存成功');
                                self.closeSingleServingForm('servingForm')
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
        //关闭新建或编辑服务机构弹框
        closeSingleServingForm (formName) {
            //还原数据
            this.searchServingForm = {
                rankCatalogId:this.currentSearchCatalogId,
                name:'',
                delStatus:'1'
            },
            this.servingForm = {
                id:'',//
                cvId:'',//投In关联id
                rankId:'',//榜单id
                rankCatalogId:this.currentSearchCatalogId,//榜单目录Id
                institutionId:'',//机构管理ID
                name:'',//名称
                logoUrl:'',//logo图片
                weight:'-1',//排序
                sortOrder:'',//排序方式，1，显示排序，2，不显示排序
                type:'',//类型{1：机构；2：企业；3：人物；4：其他}
                createUserId:'',//
                updateUserId:'',//
                updateAt:'',//
                createAt:'',//
                delStatus:'1',//0已删除1未删除
            }
            this.ifCreatOrEditSingleServing = 'creat'
            this.$refs[formName].resetFields();
            this.showAddOrEditServing = false
            //反显列表
            this.searchCurrentServing()
        },
        //服务榜单顺序调整
        servingRankWeightChange(item){
            console.log('修改榜单权重',item)
            var self = this
            var data = {
                id: item.id.toString(),
                weight: item.weight
            }
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: '/rankServing/update',
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if (res.code == 200) {
                        //请求机构榜单不分页列表回显
                        self.searchCurrentServing()
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
        },
        //删除这条数据从服务机构榜
        delThisServingFromRank (item) {
            var self = this
            self.$confirm('确实要删除该条数据吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var reqdata = {
                    id: item.id.toString(),
                    type: 6 //删除的类型 0榜单 1目录 2 案例榜单 3 案例榜单关系 4 机构榜单 5任务榜单 6 服务机构榜单
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: '/rank/updateStatus',
                    data: JSON.stringify(reqdata),
                    dataType: "json",
                    success: function(res){
                        console.log(res)
                        if (res.code == 200) {
                            //请求服务机构榜单不分页列表回显
                            self.searchCurrentServing()
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
        //从机构榜返回到榜单目录
        backToRankListFromServing () {
            this.currentSearchCatalogId = ''
            this.searchServingForm={
                rankCatalogId:'',
                name:'',
                delStatus:'1'
            }
            this.currentServingTableData=[]
            this.showChildPage = '0' 
        },

        //返回榜单列表
        backToRankList(){
            setCookie ('createditrank', '', 1)
            window.parent.location.href = '/index.html#modules/rank/rank_list.html'
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
