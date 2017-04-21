// pages/goods/goods.js
Page({
    data: {
        toView: '0',
        toViewIndex: 0,
        toViewCart: '0',
        scrollTop: 100,
        foodCounts: 0,
        totalPrice: 0, // 总价格
        totalCount: 0, // 总商品数
        carArray: [],
        minPrice: 20, //起送價格
        payDesc: '',
        deliveryPrice: 4, //配送費
        fold: true,
        selectFoods: [{
            price: 20,
            count: 2
        }],
        cartShow: 'none',
        status: 0,
        comask: '',
        supplier: {}
    },

    //选择分类
    selectMenu: function(e) {
        var index = e.currentTarget.dataset.itemIndex;
        this.setData({
            toView: 'order' + index.toString(),
            toViewIndex: index
        })
        console.log(this.data.toView);
    },

    //移除商品
    decreaseCart: function(e) {
        var index = e.currentTarget.dataset.itemIndex;
        var parentIndex = e.currentTarget.dataset.parentindex;
        this.data.supplier.supplierdishlist[parentIndex].supplierdishlist[index].Count--
            var num = this.data.supplier.supplierdishlist[parentIndex].supplierdishlist[index].Count;
        var mark = 'a' + index + 'b' + parentIndex
        var price = this.data.supplier.supplierdishlist[parentIndex].supplierdishlist[index].price;
        var obj = {
            price: price,
            num: num,
            mark: mark,
            name: name,
            index: index,
            parentIndex: parentIndex
        };
        var carArray1 = this.data.carArray.filter(item => item.mark != mark);
        carArray1.push(obj);
        console.log(carArray1);
        this.setData({
            carArray: carArray1,
            supplier: this.data.supplier
        })
        this.calTotalPrice()
        this.setData({
            payDesc: this.payDesc(),
        })
        //关闭弹起
        var count1 = 0
        for (let i = 0; i < carArray1.length; i++) {
            if (carArray1[i].num == 0) {
                count1++;
            }
        }
        //console.log(count1)
        if (count1 == carArray1.length) {
            if (num == 0) {
                this.setData({
                    cartShow: 'none',
                    comask: ''
                })
            }
        }
    },
    decreaseShopCart: function(e) {
        this.decreaseCart(e);
    },
    //添加到购物车
    addCart(e) {
        var index = e.currentTarget.dataset.itemIndex;
        var parentIndex = e.currentTarget.dataset.parentindex;
        this.data.supplier.supplierdishlist[parentIndex].supplierdishlist[index].Count = this.data.supplier.supplierdishlist[parentIndex].supplierdishlist[index].Count || 0;
        this.data.supplier.supplierdishlist[parentIndex].supplierdishlist[index].Count++;
        var mark = 'a' + index + 'b' + parentIndex
        var price = this.data.supplier.supplierdishlist[parentIndex].supplierdishlist[index].price;
        var num = this.data.supplier.supplierdishlist[parentIndex].supplierdishlist[index].Count;
        var name = this.data.supplier.supplierdishlist[parentIndex].supplierdishlist[index].supplierdishname;
        var obj = {
            price: price,
            num: num || 1,
            mark: mark,
            name: name,
            index: index,
            parentIndex: parentIndex
        };
        var carArray1 = this.data.carArray.filter(item => item.mark != mark)
        carArray1.push(obj)
        console.log(carArray1);
        this.setData({
            carArray: carArray1,
            supplier: this.data.supplier
        })
        this.calTotalPrice();
        this.setData({
            payDesc: this.payDesc()
        })
    },
    addShopCart: function(e) {
        this.addCart(e);
    },
    //计算总价
    calTotalPrice: function() {
        var carArray = this.data.carArray;
        var totalPrice = 0;
        var totalCount = 0;
        for (var i = 0; i < carArray.length; i++) {
            totalPrice += carArray[i].price * carArray[i].num;
            totalCount += carArray[i].num
        }
        this.setData({
            totalPrice: totalPrice,
            totalCount: totalCount,
            //payDesc: this.payDesc()
        });
    },
    //差几元起送
    payDesc() {
        if (this.data.totalPrice === 0) {
            return `￥${this.data.minPrice}元起送`;
        } else if (this.data.totalPrice < this.data.minPrice) {
            let diff = this.data.minPrice - this.data.totalPrice;
            return '还差' + diff + '元起送';
        } else {
            return '去结算';
        }
    },
    //結算
    pay() {
        if (this.data.totalPrice < this.data.minPrice) {
            return;
        }
        // window.alert('支付' + this.totalPrice + '元');
        //确认支付逻辑
        var resultType = "success";
        wx.redirectTo({
            url: '../goods/pay/pay?resultType=' + resultType
        })
    },
    //彈起購物車
    toggleList: function() {
        if (!this.data.totalCount) {
            return;
        }


        this.setData({
            fold: !this.data.fold,
        })
        var fold = this.data.fold

        //console.log(this.data.fold);
        this.cartShow(fold)
        // this.toggleMask(fold)
    },
    toggleMask: function() {
        if (!this.data.fold) {
            this.toggleList()
        }
    },
    cartShow: function(fold) {
        console.log(fold);
        if (fold == false) {
            this.setData({
                cartShow: 'block',
                comask: 'comask'
            })
        } else {
            this.setData({
                cartShow: 'none',
                comask: ''
            })
        }
        console.log(this.data.cartShow);
    },
    tabChange: function(e) {
        var showtype = e.target.dataset.type;
        this.setData({
            status: showtype,
        });
    },
    onLoad: function(option) {
        console.log(option);
        let that = this;
        // 页面初始化 option为页面跳转所带来的参数
        this.setData({
            payDesc: this.payDesc()
        });

        wx.request({
            url: 'https://ct.etao.cn/api/supplier/menu',
            method: 'GET',
            data: {
                supplierid: option.supplierid,
                menutypeid: 2
            },
            header: {
                'Accept': 'application/json'
            },
            success: function(res) {
                that.setData({
                    supplier: res.data.data
                });
            }
        })
    },
    onReady: function() {
        // 页面渲染完成
    },
    onShow: function() {
        // 页面显示
    },
    onHide: function() {
        // 页面隐藏
    },
    onUnload: function() {
        // 页面关闭
    }
})
