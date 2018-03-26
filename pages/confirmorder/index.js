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
    bindPickerChange: function(e) {
        this.setData({
            paymentmethodtype: e.detail.value
        })
    },
    bindEattimeChange: function(e) {
        this.setData({
            eattimeindex: e.detail.value
        })
    },
    bindDineModeChange: function(e) {
        this.setData({
            dinemodeindex: e.detail.value
        })
    },
    bindTextAreaBlur: function(e) {
        console.log(e.detail.value)
    },
    chooseeattime: function() {
        wx.navigateTo({
            url: '/pages/confirmorder/eattime/eattime',
        });
    },
    onLoad: function(option) {
        let self = this
        self.ppeattime()
        wx.getStorage({
            key: `shoppingcart`,
            success: function(res) {
                console.log('res.data');
                console.log(res.data);
                self.setData({
                    shoppingcart: res.data
                })
            }
        })
    },
    ppeattime: function() {
        let self = this
        let current = new Date();
        let timecount = current.getHours() * 4 + Math.ceil(current.getMinutes() / 15);
        let eattimes = []
        for (let i = timecount; i < (8 + timecount); i++) {
            let fh = Math.floor(i / 4)
            let fm = ''
            switch (i % 4) {
                case 0:
                    fm = '00'
                    break;
                case 1:
                    fm = '15'
                    break;
                case 2:
                    fm = '30'
                    break;
                case 3:
                    fm = '45'
                    break;
            }

            eattimes.push(`${fh}:${fm}`);
        }
        this.setData({
            eattimes: eattimes
        })
    }
})
