//index.js
//获取应用实例
var app = getApp()
Page({
    data: {
        supplier:{}
    },

    onLoad: function() {
        let that = this;
        wx.request({
            url: app.globalData.baseUrl,
            method: 'post',
            data: {
                query: `query querysupplier($supplierid:Int!){ supplier(id: $supplierid) { id stars name logo address hotline } } `,
                variables: {
                    supplierid: 1
                }
            },
            header: {
                'Accept': 'application/json'
            },
            success: function(res) {
                console.log(res)
                let [supplier] = res.data.data.supplier;
                that.setData({
                    supplier: supplier
                });
            }
        })
    }
})
