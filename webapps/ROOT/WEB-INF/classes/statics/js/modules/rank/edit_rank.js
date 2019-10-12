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
            showChildPage:'0',//0 主页面  1机构榜编辑
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
                    label:'服务机构榜单',
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
                name:'',
                delStatus:'1',
                rankCatalogId:'-1'
            },
            instituteLibData:[],
            //分页器相关
            pagination1: {
                currPage: 1,
                totalCount:0,
                totalPage:0,
                pageSize:10
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
        //保存榜单目录信息
        saveRankInfoForm (formName) {
            var self = this
            self.$refs[formName].validate((valid) =>{
                if (valid) {
                    var data = JSON.parse(JSON.stringify(self.rankInfoForm))
                    //判断是新建还是修改
                    if (self.ifCreatOrChangeInfo == '0') {
                        var reqUrl = '/rankCatalog/save'
                    } else if (self.ifCreatOrChangeInfo == '1') {
                        var reqUrl = '/rankCatalog/update'
                    }
                    //判断是目录还是榜单
                    if (data.type == '0') {//0代表目录
                        data.end = 0 //是否为最后1级，0不是，1是
                    } else {
                        data.end = 1 //是否为最后1级，0不是，1是
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
        //添加榜单数据
        editRankData(node,data) {
            var parent = node.parent;
            var children = parent.data.children || parent.data;
            var index = children.findIndex(d => d.id == data.id);
            console.log('node',node,'data',data,'parent',parent,'children',children,'index',index)
            this.lsNode = node //临时存贮节点
            this.lsData = data //临时存贮节点数据
            if (data.type == '1') {//1：机构榜单；2：人物榜单；3：服务机构榜；4：案例榜单
                console.log('机构榜','id=',data.id)
                //设置当前榜单的查询rankCatalogId
                this.currentSearchCatalogId = data.id.toString()
                this.searchInstituteForm.rankCatalogId = this.currentSearchCatalogId
                this.searchCurrentInstitute()
            } else if (data.type == '2') {
                console.log('人物榜')
            } else if (data.type == '3') {
                console.log('服务机构榜')
            } else if (data.type == '4') {
                console.log('案例榜单')
            }
        },
        //////////////////////////编辑机构榜单相关方法
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
            data.name = data.name.toString().trim()
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
                url: "/rankInstitution/list",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.instituteLibData = res.page.list
                        for (let i = 0; i < self.instituteLibData.length; i++){
                            self.instituteLibData[i].createAt = self.transformTime(parseFloat(self.instituteLibData[i].createAt))
                            self.instituteLibData[i].updateAt = self.transformTime(parseFloat(self.instituteLibData[i].updateAt))
                        }
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
            var copyData = JSON.parse(JSON.stringify(item))
            //将所属目录id由-1置成当前的榜单id,将该条数据id置空后调save接口来复制出一条原有数据
            copyData.rankCatalogId = this.currentSearchCatalogId
            copyData.id = ''
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
                name:'',
                delStatus:'1',
                rankCatalogId:'-1'
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
                var data = {
                    id: item.id.toString(),
                    delStatus:'0',//0已删除1未删除
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
                name:'',
                delStatus:'1',
                rankCatalogId:'-1'
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









        remove(node, data) {
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex(d => d.id === data.id);
            children.splice(index, 1);
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
