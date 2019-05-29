var vm = new Vue({
    el: '#edit_fastinfo',
    data: {
        //新建或修改
        typeOfPage:'creat',
        //文章基本信息
        newsTagArray:[],
        fastinfoForm:{
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
        fastinfoFormRules:{
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
        //保存快讯 opt: 0 保存，1保存并发布---快讯没有待发布状态
        saveFastinfoToDraft (opt,formName){
            var self = this
            //针对非必填字段验证
            var urlReg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
            if (self.fastinfoForm.flashSourceUrl.toString().trim() !=='' && !urlReg.test(self.fastinfoForm.flashSourceUrl)) {
                self.$message.error('原文网址链接不合法')
                return
            } else if (self.fastinfoForm.flashSourceUrl.toString().trim() =='') {
                self.fastinfoForm.flashSourceUrl = '#'
            }
            if (self.typeOfPage == 'creat') {
                var reqUrl = '/flash/save'
                var data = JSON.parse(JSON.stringify(self.fastinfoForm))
                data.flashStatus = '0'
                console.log('data',data, data.flashStatus)
            } else {
                var reqUrl = '/flash/update'
                var data = JSON.parse(JSON.stringify(self.fastinfoForm))
            }
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
                                    self.fastinfoForm.flashId = res.flashId
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
                flashId: self.fastinfoForm.flashId.toString(),
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
                        self.fastinfoForm = res.dict
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
    }
    
})
