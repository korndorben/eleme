//index.js
//获取应用实例
var app = getApp()
Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        suppliers:[]
    },

    onLoad: function() {
        console.log('onLoad')
        var that = this
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function(userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            })
        })


        wx.getLocation({
            type: 'wgs84',
            success: function(res) {
                wx.request({
                    url: 'http://ct.etao.cn/api/supplier/list',
                    method: 'get',
                    data: {
                        currlongitude: res.longitude,
                        currlatitude: res.latitude,
                        type: 2
                    },
                    header: {
                        'Accept': 'application/json'
                    },
                    success: function(res) {
                        that.setData({
                            suppliers: res.data.data.list
                        });
                    }
                })
            }
        })

    }
})
