let id = 1000;

var vm = new Vue({
    el: '#edit_rank',
    data: {
        //新建或修改
        typeOfPage:'creat',
        rankDataTree:[
            {
                rankLevel:'1',
                rankTitle:'我是一级榜单名称',
                children:[{
                    rankLevel:'2',
                    rankTitle:'我是二级榜单名称',
                    children:[]
                }]
            }
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
        //新增榜单---一级榜单
        addNewRank(){
            let Lv1Length = this.rankDataTree.length
            if (this.rankDataTree[Lv1Length - 1].rankTitle.trim() !== '') {
                this.rankDataTree.push({
                    rankLevel:'1',
                    rankTitle:'',
                    children:[]
                })
            } else {
                this.$message.error('请完成上一个榜单的内容')
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
        //在第二层级添加2级榜单
        addTwoLevel(index){
            console.log('添加了2级类',index)
            let Lv2Length = this.rankDataTree[index].children.length
            //判断上一级的内容是否为空
            if (this.rankDataTree[index].rankTitle.trim() == '') {
                this.$message.error('请完成上级榜单的内容')
                return
            }
            //判断同级上一条是否为空
            if (Lv2Length !== 0) {
                if (this.rankDataTree[index].children[Lv2Length - 1].rankTitle !== '') {
                    this.rankDataTree[index].children.push({
                        rankLevel:'2',
                        rankTitle:'',
                        children:[]
                    })
                } else {
                    this.$message.error('请完成上一个榜单的内容')
                }
            } else {
                this.rankDataTree[index].children.push({
                    rankLevel:'2',
                    rankTitle:'',
                    children:[]
                })
            }
            
            console.log(this.rankDataTree)
        },
        //删除2级层级
        delThisLevel2(index1,index2){
            this.rankDataTree[index1].children.splice(index2, 1); 
        },
        //在第二层级添加3级榜单
        addThreeLevel23(index){
            let Lv3Length = this.rankDataTree[index].children.length
            if (Lv3Length !== 0) {
                if (this.rankDataTree[index].children[Lv3Length - 1].rankTitle !== '') {
                    this.rankDataTree[index].children.push({
                        rankLevel:'3',
                        rankTitle:'',
                        children:[]
                    })
                } else {
                    this.$message.error('请完成上一个榜单的内容')
                }
            } else {
                this.rankDataTree[index].children.push({
                    rankLevel:'3',
                    rankTitle:'',
                    children:[]
                })
            }
            
            console.log(this.rankDataTree)
        },
        //再第二层级添加4级排行
        addRankLevel24 (index) {
            let Lv4Length = this.rankDataTree[index].children.length
            if (Lv4Length !== 0) {
                if (this.rankDataTree[index].children[Lv4Length - 1].rankTitle !== '') {
                    this.rankDataTree[index].children.push({
                        rankLevel:'4',
                        rankTitle:'',
                        children:[]
                    })
                } else {
                    this.$message.error('请完成上一个榜单的内容')
                }
            } else {
                this.rankDataTree[index].children.push({
                    rankLevel:'4',
                    rankTitle:'',
                    children:[]
                })
            }
            
            console.log(this.rankDataTree)
        },











        //保存快讯 opt: 0 保存，1保存并发布---快讯没有待发布状态
        saveFastinfoToDraft (opt,formName){
            var self = this
            //针对非必填字段验证
            //var urlReg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
            var urlReg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/
            if (self.rankinfoForm.flashSourceUrl.toString().trim() !=='' && !urlReg.test(self.rankinfoForm.flashSourceUrl)) {
                self.$message.error('原文网址链接不合法')
                return
            } else if (self.rankinfoForm.flashSourceUrl.toString().trim() =='') {
                self.rankinfoForm.flashSourceUrl = '#'
            }
            //判断是新建还是修改
            if (self.typeOfPage == 'creat') {
                var reqUrl = '/flash/save'
                var data = JSON.parse(JSON.stringify(self.rankinfoForm))
                data.flashStatus = '0'
                console.log('data',data, data.flashStatus)
            } else {
                var reqUrl = '/flash/update'
                var data = JSON.parse(JSON.stringify(self.rankinfoForm))
            }
            //标题中出现英文双引号修改为中文双引号，否则造成标签属性不闭合
            data.flashTitle = self.replaceDqm(data.flashTitle)
            self.$refs[formName].validate((valid) => {
                if (valid) {
                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        url: reqUrl,
                        data: JSON.stringify(data),
                        dataType: "json",
                        success: function(res){
                            if(res.code == 200){
                                console.log('提交保存返回',res)
                                if (opt == 0) {
                                    self.$message.success('保存成功')
                                    setCookie ('createditfastinfo', '', 1)
                                    window.parent.location.href = '/index.html#modules/content/fastinfo_list.html'
                                } else if (opt == 1) {
                                    self.rankinfoForm.flashId = res.flashId
                                    self.submitFastinfo()
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
        //发布快讯---状态改为2
        submitFastinfo () {
            var self = this
            var data = {
                flashId: self.rankinfoForm.flashId.toString(),
                flashStatus: '2'
            }
            $.ajax({
                type: "POST",
                url: "/flash/push",
                contentType: "application/json",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.$message.success('提交发布成功')
                        setCookie ('createditfastinfo', '', 1)
                        window.parent.location.href = '/index.html#modules/content/fastinfo_list.html'
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
        //返回取消编辑
        closeAndBack () {
            setCookie ('createditfastinfo', '', 1)
            window.parent.location.href = '/index.html#modules/content/fastinfo_list.html'
        },
        //请求原文章所有信息
        getEditFastinfoOrign (type) {
            var self = this
            console.log('当前快讯id:',type)
            $.ajax({
                type: "POST",
                url: "/flash/info/" + type.toString(),
                contentType: "application/json",
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.rankinfoForm = res.dict
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
        //替换引号
        replaceDqm (str) {
            var val=str.replace(/"([^"]*)"/g ,"“$1”");
            if(val.indexOf('"')<0){
                return val;
            }
            return replaceDqm(val);
        }
    }
    
})
