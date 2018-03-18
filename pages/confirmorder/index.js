var app = getApp()
Page({
    data: {
        paymentmethodtype: 0,
        paymentmethods: ['微信支付', '会员卡支付'],
    },
    bindPickerChange: function(e) {
        this.setData({
            paymentmethodtype: e.detail.value
        })
    },
    onLoad: function(option) {

    }
})
