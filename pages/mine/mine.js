
//获取应用实例
var app = getApp()
var that;
var common = require('../template/getCode.js');
var Bmob = require("../../utils/bmob.js");
Page({
  onLoad: function (options) {
    that = this;
    that.setData({
      upImg: true,
      loading: false,
      isdisabled: false,
      modifyLoading: false
    })
  },
  onReady: function () {
    wx.hideToast()
  },
  onShow: function () {

    var user_id = wx.getStorageSync('user_id')
    var my_username = wx.getStorageSync('my_username');
    var open_id = wx.getStorageSync('user_openid');
    var objectId = user_id//currentUser._id;
    var me = new Bmob.User();
    me.id = objectId;
    var resultss = [];

    var Comments = Bmob.Object.extend("Comments");
    var query = new Bmob.Query(Comments);

    query.equalTo("fid", user_id);

    var myname = wx.getStorageSync('my_nick')
    // 查询所有数据
    query.find({
      success: function (results) {
        console.log("共查询到 " + results.length + " 条记录!", results);
        // 循环处理查询到的数据
        if (results.length == 0) {
          var query1 = new Bmob.Query(Comments);
          console.log("olderUserName", myname)
          query1.equalTo("olderUserName", myname);
          query1.find({
            success: function (results1) {
              console.log("共查询到 " + results1.length + " 条记录!!!", results1);
              for (var i = 0; i < results1.length; i++) {
                var object = results1[i];
                object.set('behavior', 3);
                resultss[i] = object;
              }
            }
          })
        }
        else {
          for (var i = 0; i < results.length; i++) {
            var object = results[i];
             //var gettype = Object.prototype.toString;
             //console.log('tt', gettype.call(object.createdAt));
            //console.log(object.createdAt.substring(11,19));
            if (object.get('username') != my_username) {
              if (object.get('olderUserName')) {
                console.log(object.get('olderUserName'), myname)
                if (object.get('olderUserName') == myname) {
                  object.set('behavior', 3);
                  resultss[i] = object
                }
                resultss[i] = object
              }
              else {
                resultss[i] = object
              }
            }
          }
          resultss = that.clear_arr_trim(resultss);
        }

 

        that.setData({
          remindscount: resultss.length-wx.getStorageSync("newsnum")
        });
        wx.setStorageSync("newsnum", resultss.length)
      },
      error: function (error) {
        // 查询失败
      }
    });

    var myInterval = setInterval(getReturn, 500);
    function getReturn() {
      wx.getStorage({
        key: 'user_id',
        success: function (ress) {
          if (ress.data) {
            clearInterval(myInterval)
            wx.getStorage({
              key: 'my_avatar',
              success: function (res) {
                that.setData({
                  userImg: res.data,
                  loading: true
                })
              }
            })
            wx.getStorage({
              key: 'my_nick',
              success: function (res) {
                that.setData({
                  userName: res.data,
                  inputValue: res.data

                })
              }
            })
            //var newsLen = 0;
            // wx.request({
            //   url: '',
            //   header: {
            //     "sessionKey": ress.data
            //   },
            //   data: {
            //     "count": 1000
            //   },
            //   method: "GET",
            //   success: function (res) {
            //     if (res.data.error_code == "0") {
            //       for (var i = 0; i < res.data.result.length; i++) {
            //         if (res.data.result[i].is_read == "0") {
            //           newsLen = newsLen + 1;
            //         }
            //       }
            //       that.setData({
            //         remindscount: newsLen

            //       })
            //       wx.setStorageSync('remindscount', newsLen)
            //     }
            //     else {
            //       common.dataLoading(res.data.error, "loading");
            //     }

            //   }
            // })
          }

        }
      })

    }

  },
  modifySex: function(){
    var sex = wx.getStorageSync("sex");
    var nick = wx.getStorageSync("my_nick");
    if(sex=="男"){
      sex = "女";
      wx.getStorage({
        key: 'my_username',
        success: function (ress) {
          if (ress.data) {
            var my_username = ress.data;
            wx.getStorage({
              key: 'user_openid',
              success: function (openid) {
                var openid = openid.data;
                var user = Bmob.User.logIn(my_username, openid, {
                  success: function (users) {
                    users.set('sex', sex);  // attempt to change username
                    users.save(null, {
                      success: function (user) {
                        wx.setStorageSync('sex', sex);
                      },
                      error: function (error) {
                        console.log(error)
                      }
                    });
                  }
                });
              }, function(error) {
                console.log(error);
              }
            })
          }

        }
      })
      wx.showToast({
        title: '性别已改为:'+sex,
        icon: 'success'
      })
    }
    else{
        sex = "男";
        wx.setStorageSync("sex", sex);
      wx.getStorage({
        key: 'my_username',
        success: function (ress) {
          if (ress.data) {
            var my_username = ress.data;
            wx.getStorage({
              key: 'user_openid',
              success: function (openid) {
                var openid = openid.data;
                var user = Bmob.User.logIn(my_username, openid, {
                  success: function (users) {
                    users.set('sex', sex);  // attempt to change username
                    users.save(null, {
                      success: function (user) {
                        wx.setStorageSync('sex', sex);
                      },
                      error: function (error) {
                        console.log(error)
                      }
                    });
                  }
                });
              }, function(error) {
                console.log(error);
              }
            })
          }

        }
      })
        wx.showToast({
          title: '性别已改为:'+sex,
          icon: 'success'
        })
      
    }
  },
  modifyImg: function () {//修改头像
    wx.getStorage({
      key: 'user_id',
      success: function (ress) {
        var key = ress.data
        if (key) {
          wx.showActionSheet({
            itemList: ['相册', '拍照'],
            success: function (res) {
              if (!res.cancel) {
                var sourceType = [];
                if (res.tapIndex == 0) {
                  sourceType = ['album']//从相册选择
                }
                else if (res.tapIndex == 1) {
                  sourceType = ['camera']//拍照
                }
                wx.chooseImage({
                  count: 1, // 默认9
                  sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                  sourceType: sourceType, // 可以指定来源是相册还是相机，默认二者都有
                  success: function (imageResult) {
                    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                    that.setData({
                      upImg: false
                    })
                    var tempFilePaths = imageResult.tempFilePaths;
                    if (tempFilePaths.length > 0) {
                      var name = tempFilePaths;//上传的图片的别名
                      var file = new Bmob.File(name, tempFilePaths);
                      file.save().then(function (resu) {
                        wx.setStorageSync('my_avatar', resu.url());
                        that.setData({
                          upImg: true
                        });
                        var newImge = resu.url();
                        wx.getStorage({
                          key: 'my_username',
                          success: function (ress) {
                            var my_username = ress.data;
                            wx.getStorage({
                              key: 'user_openid',
                              success: function (openid) {
                                var openid = openid.data
                                var user = Bmob.User.logIn(my_username, openid, {
                                  success: function (users) {
                                    users.set('userPic', newImge);  // attempt to change username
                                    users.save(null, {
                                      success: function (user) {
                                        that.setData({
                                          userImg: newImge
                                        })
                                        common.dataLoading("修改头像成功", "success");
                                      }
                                    });
                                  }
                                });
                              }, function(error) {
                                console.log(error);
                              }
                            })
                          }, function(error) {
                            console.log(error);
                          }
                        })
                      }, function (error) {
                        that.setData({
                          upImg: true
                        })
                        common.dataLoading(error, "loading");
                        console.log(error);
                      })
                    }

                  }
                })
              }
            }
          })
        }

      }
    })

  },
  hiddenComment: function () {
    that.setData({
      isModifyNick: false,
      inputValue: that.data.userName
    })
  },
  bindKeyInput: function (e) {//同步input和昵称显示
    that.setData({
      inputValue: e.detail.value
    })
  },
  modifyNick: function () {
    that.setData({
      isModifyNick: true,
    })
  },
  modyfiNick: function (e) {//修改昵称

    that.setData({
      isdisabled: true,
      modifyLoading: true
    })
    wx.getStorage({
      key: 'my_username',
      success: function (ress) {
        if (ress.data) {
          var my_username = ress.data;
          wx.getStorage({
            key: 'user_openid',
            success: function (openid) {
              var openid = openid.data;
              var user = Bmob.User.logIn(my_username, openid, {
                success: function (users) {
                  users.set('nickname', e.detail.value.changeNick);  // attempt to change username
                  users.save(null, {
                    success: function (user) {
                      wx.setStorageSync('my_nick', e.detail.value.changeNick);
                      that.setData({
                        userName: that.data.inputValue,
                        isModifyNick: false,
                        isdisabled: false,
                        modifyLoading: false
                      })
                      common.dataLoading("修改成功", "success");

                    },
                    error: function (error) {
                      common.dataLoading(res.data.error, "loading");
                      that.setData({
                        isModifyNick: false,
                        isdisabled: false,
                        modifyLoading: false,
                        inputValue: that.data.userName
                      })
                    }
                  });
                }
              });
            }, function(error) {
              console.log(error);
            }
          })
        }

      }
    })

  },
  scorequery: function(e){
    wx.getStorage({
      key: 'my_username',
      success: function (ress) {
        if (ress.data) {
          var my_username = ress.data;
          wx.getStorage({
            key: 'user_openid',
            success: function (openid) {
              var openid = openid.data;
              var user = Bmob.User.logIn(my_username, openid, {
                success: function (users) {
                  var score = users.get('score');
                  wx.showToast({
                    title: '当前积分:'+score,
                  })
                }
              });
            }, function(error) {
              console.log(error);
            }
          })
        }

      }
    })
  },
  clear_arr_trim: function (array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] == "" || typeof (array[i]) == "undefined") {
        array.splice(i, 1);
        i = i - 1;
      }
    }
    return array;
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  }

})
