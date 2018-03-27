var app = getApp()
Page({
    data: {
        paymentmethodtype: 0,
        paymentmethods: ['微信支付', '会员卡支付'],
        eattimeindex: 0,
        eattimes: [],
        dinemodes: ['店内用餐', '打包带走(产生打包费用)'],
        dinemodeindex: 0,
        shoppingcart: {
            selection: {},
            totalPrice: 0,
            totalPriceDescription: ''
        }
    },
    onLoad: function(option) {
        let self = this
        wx.getStorage({
            key: `shoppingcart`,
            success: function(res) {
                self.setData({
                    shoppingcart: res.data
                })
            }
        })
    },
})
