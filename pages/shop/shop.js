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
        totalPriceDescription: '',
        totalCount: 0, // 总商品数
        selectFoods: {},
        cartShow: false,
        cartShowClass: 'none',
        status: 0,
        supplier: {}
    },
    //清空购物车
    empty: function() {
        this.setData({
            totalPrice: 0,
            totalCount: 0,
            selectFoods: [],
        })
        this.toggleCartShow()
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

    //移除商品
    decreaseCart: function(e) {
        let dish = e.currentTarget.dataset.dish;
        dish.quantity -= 1;
        if (dish.quantity <= 0) {
            dish.quantity = 0
        }
        let dishcategoryid = dish.dishcategoryid;
        let mark = `dishcategory${dishcategoryid}-dish${dish.id}-dishattr${dish.dishattrs[0].id}`
        let item = this.data.carArray.find(item => item.mark == mark)
        if (this.data.carArray.length <= 0 || !item) {
            return
        }
        item.quantity--;
        if (item.quantity <= 0) {
            item.quantity = 0
        }

        this.setData({
            carArray: this.data.carArray,
            supplier: this.data.supplier
        })
        this.calTotalPrice();
        this.setData({
            carArray: this.data.carArray,
            payDesc: this.payDesc()
        })
        //关闭弹起
        let count1 = 0
        for (let i = 0; i < this.data.carArray.length; i++) {
            if (this.data.carArray[i].quantity) {
                count1++;
            }
        }
        //console.log(count1)
        if (count1 <= 0) {
            this.setData({
                cartShow: 'none',
                comask: ''
            })
        }
    },
    //添加到购物车
    addCart(e) {
        let dish = e.currentTarget.dataset.dish; //当前菜品
        let selectFoods = this.data.selectFoods
        if (!selectFoods[dish.id]) {
            selectFoods[dish.id] = {
                quantity: 1,
                dish: dish,
                dishattr: dish.dishattrs[0],
                price: dish.dishattrs[0].price,
                totaldescription: util.formatDecimal(dish.dishattrs[0].price)
            }
        } else {
            selectFoods[dish.id]['quantity'] += 1;
            selectFoods[dish.id]['totaldescription'] = util.formatDecimal(selectFoods[dish.id]['price'] * selectFoods[dish.id]['quantity'])
        }

        let totalPrice = 0;
        let totalCount = 0;
        for (let key of Object.keys(selectFoods)) {
            totalCount += selectFoods[key]['quantity']
            totalPrice += 1 * selectFoods[key]['quantity'] * selectFoods[key]['dishattr']['price']
        }
        this.setData({
            totalPrice: totalPrice,
            totalCount: totalCount,
            selectFoods: selectFoods,
            totalPriceDescription: '￥' + (totalPrice / 100).toFixed(2)
        })
    },
    addShopCart: function(e) {
        this.addCart(e);
    },

    //結算
    pay() {
        if (this.data.totalPrice <= 0) {
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
    toggleCartShow: function() {
        this.data.cartShow = !this.data.cartShow;
        this.setData({
            cartShow: this.data.cartShow,
        })
        let cartShow = this.data.cartShow
        console.log(cartShow);
        if (cartShow) {
            this.setData({
                cartShowClass: 'block',
            })
        } else {
            this.setData({
                cartShowClass: 'none',
            })
        }
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
                        dish.quantity = 0;
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
