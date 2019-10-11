var vm = new Vue({
    el: '#edit_rank',
    data () {
        var validateWeight = (rule, value, callback) => {
            var urlReg = /^[0-9]*[1-9][0-9]*$/;
            var urlReg2 = /^-[0-9]*[1-9][0-9]*$/;
            if (value) {
                if (value.trim() == '0') {
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
            // rankDataTree:[{
            //     id: 1,
            //     label: '2级榜单目录名称',
            //     ifLastNode: false,
            //     rankInfoType:'0',
            //     level:2,
            //     children: [{
            //         id: 2,
            //         label: '3级榜单目录名称',
            //         ifLastNode: false,
            //         rankInfoType:'0',
            //         level:3,
            //         children: [{
            //                 id: 3,
            //                 label: '4级榜单名称1111111111',
            //                 ifLastNode: true,
            //                 rankInfoType:'1',
            //                 level:4,
            //             }, {
            //                 id: 4,
            //                 label: '4级榜单名称12222222222222',
            //                 ifLastNode: true,
            //                 rankInfoType:'1',
            //                 level:4,
            //         }]
            //     }]
            // },{
            //     id: 8,
            //     label: '2级榜单目录名称3333333333333333',
            //     ifLastNode: false,
            //     rankInfoType:'0',
            //     level:2,
            //     children:[{
            //         id: 112,
            //         label: '4级榜单目录名称8677867867',
            //         ifLastNode: true,
            //         rankInfoType:'1',
            //         level:4,
            //     }]
            // },{
            //     id: 5,
            //     label: '4级榜单目录名称3333333333333333',
            //     ifLastNode: true,
            //     rankInfoType:'1',
            //     level:4,
            // },{
            //     id: 6,
            //     label: '4级榜单目录名称44444444444444',
            //     ifLastNode: true,
            //     rankInfoType:'1',
            //     level:4,
            // },{
            //     id: 7,
            //     label: '4级榜单目录名称555555555555555',
            //     ifLastNode: true,
            //     rankInfoType:'1',
            //     level:4,
            // }],
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
            /////////机构榜单
            searchInstituteForm:{
                rankCatalogId:'',
                delStatus:'1'
            },
            currentInstituteTableData:[],

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
        //打开榜单或目录属性对话框
        openRankInfoDialog () {
            this.showAddOrChangeRankInfo = true
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
        appendRankData(node,data) {

        },
        //////////////////////////添加机构榜单相关方法
        //搜索当前榜单下的机构--不分页
        searchCurrentInstitute(){

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
        }


    }
    
})
