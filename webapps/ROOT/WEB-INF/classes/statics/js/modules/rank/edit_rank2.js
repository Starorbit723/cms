var vm = new Vue({
    el: '#edit_rank',
    data() {
        return{
            //新建或修改
            typeOfPage:'creat',
            rankDataTree:[{
                id: 1,
                label: '2级榜单目录名称',
                ifLastNode: false,
                rankInfoType:'0',
                level:2,
                children: [{
                    id: 2,
                    label: '3级榜单目录名称',
                    ifLastNode: false,
                    rankInfoType:'0',
                    level:3,
                    children: [{
                            id: 3,
                            label: '4级榜单名称1111111111',
                            ifLastNode: true,
                            rankInfoType:'1',
                            level:4,
                        }, {
                            id: 4,
                            label: '4级榜单名称12222222222222',
                            ifLastNode: true,
                            rankInfoType:'1',
                            level:4,
                    }]
                }]
            },{
                id: 8,
                label: '2级榜单目录名称3333333333333333',
                ifLastNode: false,
                rankInfoType:'0',
                level:2,
                children:[{
                    id: 112,
                    label: '4级榜单目录名称8677867867',
                    ifLastNode: true,
                    rankInfoType:'1',
                    level:4,
                }]
            },{
                id: 5,
                label: '4级榜单目录名称3333333333333333',
                ifLastNode: true,
                rankInfoType:'1',
                level:4,
            },{
                id: 6,
                label: '4级榜单目录名称44444444444444',
                ifLastNode: true,
                rankInfoType:'1',
                level:4,
            },{
                id: 7,
                label: '4级榜单目录名称555555555555555',
                ifLastNode: true,
                rankInfoType:'1',
                level:4,
            }],
            //榜单类型选项
            rankTypeOptions:[{
                    label:'目录',
                    value:'0'
                },{
                    label:'机构榜单',
                    value:'1'
                },{
                    label:'人物榜单',
                    value:'2'
                }
            ],
            //展示榜单信息弹出层
            showAddOrChangeRankInfo:false,
            ifCreatOrChangeInfo:'0',//0新建  1修改
            lsNode: {}, //临时存贮节点
            lsData: {}, //临时存贮节点数据
            rankInfoForm:{
                rankInfoTitle:'',
                rankInfoDesc:'',
                rankInfoType:'0',
                rankInfoGravity:'-1',
            },
            rankInfoFormRules:{
                rankInfoTitle:[
                    { required: true, message: '请填写标题', trigger: 'change' }
                ],
                rankInfoDesc:[
                    { required: true, message: '请填写描述', trigger: 'change' }
                ],
                rankInfoType:[
                    { required: true, message: '请选择类型', trigger: 'change' }
                ],
                rankInfoGravity:[
                    { required: true, message: '请填写权重', trigger: 'change' }
                ],
            }

        }
        
       
    },
    mounted () {
        var type = getCookie('createditfastinfo')
        if (type == '' || type == undefined) {
            this.typeOfPage = 'creat'
        } else {
            this.typeOfPage = 'edit'
            this.getEditFastinfoOrign(type)
        }
        console.log('type',this.typeOfPage)
    },
    methods:{
        //添加新榜单或目录
        addNewLevelOrRank () {
            this.ifCreatOrChangeInfo = '0' //0新建  1修改
            this.lsNode = {id:0} //临时存贮节点
            this.lsData = {id:0} //临时存贮节点数据
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
                    
                    self.rankDataTree.push({
                        id: new Date().getTime(),
                        label: self.rankInfoForm.rankInfoTitle,
                        desc: self.rankInfoForm.rankInfoDesc,
                        rankInfoType: '0',
                        ifLastNode:false,
                        level: 2,
                        children:[]
                    })
                    self.closeRankInfoForm('rankInfoForm')
                }
            })
        },
        //关闭榜单目录信息
        closeRankInfoForm (formName) {
            this.showAddOrChangeRankInfo = false,
            this.ifCreatOrChangeInfo='0'//0新建  1修改
            this.rankInfoForm = {
                rankInfoTitle:'',
                rankInfoDesc:'',
                rankInfoType:'0',
                ifLastNode:false,
                level:'',
                rankInfoGravity:'-1',
            }
            this.$refs[formName].resetFields();
        },
        appendLevelOrRank (node,data) {
            console.log('node',node,'data',data)
            this.ifCreatOrChangeInfo = '0' //0新建  1修改
            this.lsNode = node //临时存贮节点
            this.lsData = data //临时存贮节点数据
            this.openRankInfoDialog()

            //模拟假数据请求
            var newChild = { 
                id: new Date().getTime(), 
                label: '假数据榜单或目录标题',
                ifLastNode: false,
                rankInfoType:'0',
                level:3, 
            }
            if (!data.children) {
                this.$set(data, 'children', []);
            }
            data.children.push(newChild);
        },

        remove(node, data) {
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex(d => d.id === data.id);
            children.splice(index, 1);
        },



    }
    
})
