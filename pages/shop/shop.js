// pages/shop/shop.js
let app = getApp();
const util = require('../../utils/util.js');

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
        fold: false,
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
        let dishid = e.currentTarget.dataset.dishcategoryid;
        this.setData({
            toView: 'order' + dishid.toString(),
            toViewIndex: dishid
        })
        console.log(this.data.toView);
    },
    choosespec: function(e) {
        this.fold = !this.fold;
        console.log(e.currentTarget.dataset);
    },

    //移除商品
    decreaseCart: function(e) {
        let dishid = e.currentTarget.dataset.dishid;
        let dishcategoryid = e.currentTarget.dataset.dishcategoryid;
        this.data.supplier.dishcategories[dishcategoryid].dishs[dishid].quantity--
            let quantity = this.data.supplier.dishcategories[dishcategoryid].dishs[dishid].quantity;
        let mark = `dishcategory${dishcategoryid}-dish${dishid}`
        let price = this.data.supplier.dishcategories[dishcategoryid].dishs[dishid].dishattrs[0].price;
        let obj = {
            price: price,
            quantity: quantity,
            mark: mark,
            name: name,
            dishid: dishid,
            dishcategoryid: dishcategoryid
        };
        let carArray1 = this.data.carArray.filter(item => item.mark != mark);
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
        let count1 = 0
        for (let i = 0; i < carArray1.length; i++) {
            if (carArray1[i].quantity == 0) {
                count1++;
            }
        }
        //console.log(count1)
        if (count1 == carArray1.length) {
            if (quantity == 0) {
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
        console.log(e.currentTarget.dataset);
        let dishid = e.currentTarget.dataset.dishid;
        let dishcategoryid = e.currentTarget.dataset.dishcategoryid;
        this.data.supplier.dishcategories[dishcategoryid].dishs[dishid].quantity = this.data.supplier.dishcategories[dishcategoryid].dishs[dishid].quantity || 0;
        this.data.supplier.dishcategories[dishcategoryid].dishs[dishid].quantity++;
        let mark = `dishcategory${dishcategoryid}-dish${dishid}`
        let price = this.data.supplier.dishcategories[dishcategoryid].dishs[dishid].dishattrs[0].price;
        let quantity = this.data.supplier.dishcategories[dishcategoryid].dishs[dishid].quantity;
        let name = this.data.supplier.dishcategories[dishcategoryid].dishs[dishid].name;
        let obj = {
            price: price,
            quantity: quantity || 1,
            mark: mark,
            name: name,
            dishid: dishid,
            dishcategoryid: dishcategoryid
        };
        console.log('obj');
        console.log(obj);
        let carArray1 = this.data.carArray.filter(item => item.mark != mark)
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
        let totalPrice = 0;
        let totalCount = 0;
        for (let dishcategory of this.data.supplier.dishcategories) {
            for (let dish of dishcategory.dishs) {
                if (dish.quantity <= 0) {
                    continue
                }

                for (let dishattr of dish.dishattrs) {
                    totalPrice += dishattr.price * dishattr.quantity;
                    totalCount += dishattr.quantity
                }
            }
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
        let resultType = "success";
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
        let fold = this.data.fold

        this.cartShow(fold)
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
        let showtype = e.target.dataset.type;
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
            url: app.globalData.baseUrl,
            method: 'post',
            data: {
                query: `query querysupplier($supplierid: Int!, $marketmask: String, $customerlevelid: Int = 0) { supplier(id: $supplierid, marketmask: $marketmask) { id name address logo intro dishcategories: fn_h5_dishcategories { id dishcategoryid: id name intro dishs: fn_h5_dishs { id dishid:id dishcategoryid dishs supplierid dishimage name markets dishsuites { id virtualdishid dishid dishattrid dish { id name } dishattr { id name price stock packagefee } attrlimit } dishproperties { id selected: id name dishid tag attrtaglimit attrlimit price } dishattrs: fn_h5_dishattrs { id stock name price packagefee satisfy_rate: id month_sales: id rating: id fn_specialoffers { id activityid activityname activitypackageid activitypackagename discountrate discount integral extraprice sellingprice originalprice quantity nthdish dishcategoryid dishid dishattrid } fn_dishcoupons { id activityid activityname activitypackageid activitypackagename discountrate discount integral extraprice sellingprice originalprice quantity nthdish dishcategoryid dishid dishattrid } fn_customercoupontemplates(customerlevelid: $customerlevelid) { id customerlevelid customerlevelname customercoupontemplateid name dishid dishattrid sellingprice originalprice discountrate discount integral extraprice } } } } } } `,
                variables: {
                    supplierid: 1,
                    marketmask: '111111111111111',
                    customerlevelid: 0
                }
            },
            header: {
                'Accept': 'application/json'
            },
            success: function(res) {
                console.log(res)
                let [supplier] = res.data.data.supplier;
                for (let dishcategory of supplier.dishcategories) {
                    for (let dish of dishcategory.dishs) {
                        for (let dishattr of dish.dishattrs) {
                            //只能在这里格式化
                            dishattr.pricetext = util.formatDecimal(dishattr.price);
                        }
                    }
                }
                that.setData({
                    supplier: supplier
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
