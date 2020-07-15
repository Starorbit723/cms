var vm = new Vue({
    el: '#guest_list',
    data: {
        //主页子页切换
        showChildPage:false,
        //搜索提交
        searchForm:{
            customerName:'',
            customerSale:'',
            customerPhone:'',
            delStatus:'1', //0已删除 1未删除
            startTime:'',
            endTime:'',
        },
        //表格结果
        guestTableData: [{
            customerId:'', //客户编号
            customerName:'', //客户姓名
            customerCompany:'', //公司
            customerPosition:'', //职位
            customerCity:'', //城市
            customerPhone:'', //手机号
            customerSale:'', //所属销售
            customerStatus:'', //跟踪状态
            customerDesc:'',//业务描述
            customerActivity:'', //
            customerCrtUserId:'', //
            customerModUserId:'', //
            customerCrtTime:'', //
            customerModTime:'', //
            delStatus:'', //删除状态 0已删除 1未删除
            userName:'', //创建人名称
        }],
        //分页器相关
        pagination1: {
            currPage: 1,
            totalCount:0,
            totalPage:0,
            pageSize:20
        },
        //多选
        columnEditorChange:[],
        //新增弹框
        guestForm:{
            customerId:'', //客户编号
            customerName:'', //客户姓名
            customerCompany:'', //公司
            customerPosition:'', //职位
            customerCity:'', //城市
            customerPhone:'', //手机号
            customerSale:'', //所属销售
            customerStatus:'', //跟踪状态
            customerDesc:'',//业务描述
            customerActivity:'', //
            customerCrtUserId:'', //
            customerModUserId:'', //
            customerCrtTime:'', //
            customerModTime:'', //
            delStatus:'', //删除状态 0已删除 1未删除
            userName:'', //创建人名称
        },
        guestFormRules: {
        },
    },
    created() {
        this.startSearch()
    },
    methods:{
        handleCurrentChange (val) {
            this.pagination1.currPage = val.toString()
            this.startSearch()
        },
        //开始搜索列表
        startSearch (type) {
            var self = this
            var data = JSON.parse(JSON.stringify(self.searchForm))
            data.customerName = data.customerName.toString().trim()
            data.customerSale = data.customerSale.toString().trim()
            data.customerPhone = data.customerPhone.toString().trim()
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
                url: "/customer/list",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(res){
                    if(res.code == 200){
                        self.guestTableData = res.page.list
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
        //点击编辑客户信息
        editThisGuest(item){
            this.guestForm = JSON.parse(JSON.stringify(item))
            this.showChildPage = true
        },
        //提交新增词汇
        submitEditGuest (formName) {
            var self = this
            self.$refs[formName].validate((valid) => {
                if (valid) {
                    var data = JSON.parse(JSON.stringify(self.guestForm))
                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        url: "/customer/update",
                        data: JSON.stringify(data),
                        dataType: "json",
                        success: function(res){
                            if(res.code == 200){
                                self.$message.success('修改成功')
                                //反查回显
                                self.startSearch()
                                self.backToList('guestForm')
                            }else{
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
        //返回清空表单
        backToList (formName){
            this.showChildPage = false
            this.$refs[formName].resetFields();
            this.guestForm = {
                customerId:'', //客户编号
                customerName:'', //客户姓名
                customerCompany:'', //公司
                customerPosition:'', //职位
                customerCity:'', //城市
                customerPhone:'', //手机号
                customerSale:'', //所属销售
                customerStatus:'', //跟踪状态
                customerDesc:'',//业务描述
                customerActivity:'', //
                customerCrtUserId:'', //
                customerModUserId:'', //
                customerCrtTime:'', //
                customerModTime:'', //
                delStatus:'', //删除状态 0已删除 1未删除
                userName:'', //创建人名称
            }
        },
        //下载数据
        downloadData () {
            var self = this
            self.$confirm('确实要下载数据吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = JSON.parse(JSON.stringify(self.searchForm))
                data.page = '1'
                data.limit = '100'
                data.customerName = data.customerName.toString().trim()
                data.customerSale = data.customerSale.toString().trim()
                data.customerPhone= data.customerPhone.toString().trim()
                data.delStatus = data.delStatus.toString().trim()//0已删除 1未删除
                data.startTime = ''
                data.endTime = ''
                var jsonData = JSON.stringify(data)
                console.log('jsondata',jsonData)
                $.base64.utf8encode = true;
                var jsondata64 = $.base64.btoa(jsonData);
                console.log('jsondata64',jsondata64)
                window.open("/customer/customerExcel?jsonData="+ jsondata64)
            })
        },
        //删除客户
        delThisGuest (item) {
            var self = this
            self.$confirm('确实要移除该客户吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = JSON.parse(JSON.stringify(item))
                data.delStatus = '0' //0已删除 1未删除
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/customer/update",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(res) {
                        if(res.code == 200){
                            //反查回显
                            self.startSearch()
                            self.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
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
            })
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
