var vm = new Vue({
    el: '#edit_rank',
    data: {
        //新建或修改
        typeOfPage:'creat',
        rankDataTree:[
            {
                rankLevel:'1',
                rankType:'level',
                scale:'-1',
                rankTitle:'我是一级榜单名称',
                children:[{
                    rankLevel:'2',
                    rankType:'level',
                    rankTitle:'我是二级榜单名称',
                    scale:'-1',
                    children:[{
                        rankLevel:'3',
                        rankType:'level',
                        rankTitle:'我是三级榜单名称',
                        scale:'-1',
                        children:[]
                    }]
                }]
            },
            {
                rankLevel:'1',
                rankType:'level',
                scale:'-1',
                rankTitle:'我是一级榜单名称',
                children:[{
                    rankLevel:'4',
                    rankType:'list',
                    scale:'-1',
                    rankTitle:'我是具体榜单名称'
                }]
            },
            
        ],
        //文章基本信息
        newsTagArray:[],
        rankinfoForm:{
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
        rankinfoFormRules:{
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
        //新增榜单---1级榜单
        addNewRank(){
            let Lv1Length = this.rankDataTree.length
            if (this.rankDataTree[Lv1Length - 1].rankTitle.trim() !== '') {
                this.rankDataTree.push({
                    rankLevel:'1',
                    rankType:'level',
                    scale:'-1',
                    rankTitle:'',
                    children:[]
                })
            } else {
                this.$message.error('请完成上一个榜单的内容')
            }
        },
        //在第1级添加4级榜单详情
        addRankLevel14(index){
            //判断上一级的内容是否为空
            if (this.rankDataTree[index].rankTitle.trim() == '') {
                this.$message.error('请完成上级榜单的内容')
                return
            }
            if (this.rankDataTree[index].children.length == 0) {
                this.rankDataTree[index].children.push({
                    rankLevel:'4',
                    rankType:'list',
                    rankTitle:'',
                    scale:'-1'
                })
            } else if (this.rankDataTree[index].children[0].rankType == 'list') {
                this.rankDataTree[index].children.push({
                    rankLevel:'4',
                    rankType:'list',
                    rankTitle:'',
                    scale:'-1'
                })
            } else {
                this.$message.error('不能添加榜单')
            }
        },
        //在第2级添加4级榜单详情
        addRankLevel24(index,index2) {
            // console.log(index,index2)
            //判断上一级的内容是否为空
            if (this.rankDataTree[index].children[index2].rankTitle.trim() == '') {
                this.$message.error('请完成上级榜单的内容')
                return
            }
            if (this.rankDataTree[index].children[index2].children.length == 0) {
                this.rankDataTree[index].children[index2].children.push({
                    rankLevel:'4',
                    rankType:'list',
                    rankTitle:'',
                    scale:'-1'
                })
            } else if (this.rankDataTree[index].children[index2].children[0].rankType == 'list') {
                this.rankDataTree[index].children[index2].children.push({
                    rankLevel:'4',
                    rankType:'list',
                    rankTitle:'',
                    scale:'-1'
                })
            } else {
                this.$message.error('不能添加榜单')
            }
            console.log(this.rankDataTree[index].children[index2])
        },
        //在第3级添加4级榜单详情
        addRankLevel34(index,index2,index3){
            //判断上一级的内容是否为空
            if (this.rankDataTree[index].children[index2].children[index3].rankTitle.trim() == '') {
                this.$message.error('请完成上级榜单的内容')
                return
            }
            this.rankDataTree[index].children[index2].children[index3].children.push({
                rankLevel:'4',
                rankType:'list',
                rankTitle:'',
                scale:'-1'
            })
        },
        //添加2级目录
        addTwoLevel(index){
            //判断上一级的内容是否为空
            if (this.rankDataTree[index].rankTitle.trim() == '') {
                this.$message.error('请完成上级榜单的内容')
                return
            }
            //判断同级上一条是否为空
            if (this.rankDataTree[index].children.length == 0) {
                this.rankDataTree[index].children.push({
                    rankLevel:'2',
                    rankType:'level',
                    rankTitle:'',
                    scale:'-1',
                    children:[]
                })
            } else if (this.rankDataTree[index].children[0].rankType == 'level') {
                this.rankDataTree[index].children.push({
                    rankLevel:'2',
                    rankType:'level',
                    rankTitle:'',
                    scale:'-1',
                    children:[]
                })
            } else {
                this.$message.error('不能添加2级目录')
            }
        },
        //添加3级目录
        addThreeLevel(index,index2) {
            //判断上一级的内容是否为空
            if (this.rankDataTree[index].children[index2].rankTitle.trim() == '') {
                this.$message.error('请完成上级榜单的内容')
                return
            }
            //判断同级上一条是否为空
            if (this.rankDataTree[index].children[index2].children.length == 0) {
                this.rankDataTree[index].children[index2].children.push({
                    rankLevel:'3',
                    rankType:'level',
                    rankTitle:'',
                    scale:'-1',
                    children:[]
                })
            } else if (this.rankDataTree[index].children[index2].children[0].rankType == 'level') {
                this.rankDataTree[index].children[index2].children.push({
                    rankLevel:'3',
                    rankType:'level',
                    rankTitle:'',
                    scale:'-1',
                    children:[]
                })
            } else {
                this.$message.error('不能添加3级目录')
            }
        },
        //删除一级榜单
        delThisLevel1(index){
            if (this.rankDataTree.length <= 1) {
                this.$message.error('至少保留一个榜单')
            } else {
                this.rankDataTree.splice(index, 1); 
            }
        },
        //删除2级层级
        delThisLevel2(index1,index2){
            this.rankDataTree[index1].children.splice(index2, 1); 
        },
        //删除第3个层级
        delThisLevel3(index,index2,index3){
            this.rankDataTree[index].children[index2].children.splice(index3, 1); 
        },
        //删除第4个层级
        delThisLevel4(index,index2,index3,index4){
            this.rankDataTree[index].children[index2].children[index3].children.splice(index4, 1); 
        },
        //权重调整1级
        scaleChangeLv1 (index){
            console.log('发生变化',index)
            if (this.rankDataTree[index].scale.trim() == '') {
                this.rankDataTree[index].scale = '-1'
                this.$message.error('权重值不能为空')
            }
            let arrSort = JSON.parse(JSON.stringify(this.rankDataTree));
            this.rankDataTree = arrSort.sort(this.compare('scale'))
        },
        //权重调整1级下的2级和4级
        scaleChangeLv124 (index,index2){
            if (this.rankDataTree[index].children[index2].scale.trim() == '') {
                this.rankDataTree[index].children[index2].scale = '-1'
                this.$message.error('权重值不能为空')
            }
            let arrSort = JSON.parse(JSON.stringify(this.rankDataTree[index].children));
            this.rankDataTree[index].children = arrSort.sort(this.compare('scale'))
        },
        //权重调整2级下的3级和4级
        scaleChangeLv234(index,index2,index3) {
            if (this.rankDataTree[index].children[index2].children[index3].scale.trim() == '') {
                this.rankDataTree[index].children[index2].children[index3].scale = '-1'
                this.$message.error('权重值不能为空')
            }
            let arrSort = JSON.parse(JSON.stringify(this.rankDataTree[index].children[index2].children));
            this.rankDataTree[index].children[index2].children = arrSort.sort(this.compare('scale'))
        },
        //权重调整3级下4级
        scaleChangeLv34(index,index2,index3,index4){
            if (this.rankDataTree[index].children[index2].children[index3].children[index4].scale.trim() == '') {
                this.rankDataTree[index].children[index2].children[index3].children[index4].scale = '-1'
                this.$message.error('权重值不能为空')
            }
            let arrSort = JSON.parse(JSON.stringify(this.rankDataTree[index].children[index2].children[index3].children));
            this.rankDataTree[index].children[index2].children[index3].children = arrSort.sort(this.compare('scale'))
        },
        //排序比较函数
        compare (prop) {
            console.log(prop)
            return function (obj1, obj2) {
                var val1 = obj1[prop];
                var val2 = obj2[prop];
                if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                    val1 = Number(val1);
                    val2 = Number(val2);
                }
                if (val1 > val2) {
                    return -1;
                } else if (val1 < val2) {
                    return 1;
                } else {
                    return 0;
                }
            }            
        },

    }
    
})
