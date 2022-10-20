// index.js
// 获取应用实例
const app = getApp()
var util = require('../../utils/util.js')
var audioCtx = wx.createInnerAudioContext()
Page({
  data: {
    item:0,
    tab:0,
    playlist:[{
      id:1,title:'演员',singer:'薛之谦',
      src:'http://music.163.com/song/media/outer/url?id=32507038',
      coverImgUrl:'../images/1.jpg'
    },{
      id:2,title:'认真的雪',singer:'薛之谦',
      src:'http://music.163.com/song/media/outer/url?id=169185',
      coverImgUrl:'../images/2.jpg'
    },{
      id:3,title:'动物世界',singer:'薛之谦',
      src:'http://music.163.com/song/media/outer/url?id=468517654',
      coverImgUrl:'../images/3.jpg'
    },{
      id:4,title:'爱之梦',singer:'李斯特',
      src:'http://music.163.com/song/media/outer/url?id=5276814.mp3',
      coverImgUrl:'../images/4.jpg'
    },
    ],
    state:'paused',
    playIndex:0,
    play:{
      currentTime:'00:00',
      duration:'00:00',
      percent:0,
      title:'',
      singer:'',
      coverImgUrl:'../images/4.jpg'
    },
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },

  // 播放函数
  // ,
  onReady: function () {
    console.log("开始播放初始化");
    //播放失败检测
    audioCtx.onError(function(){
     console.log('播放失败：'+audioCtx.src)
    })
    //播放完成自动换下一曲
    var that = this;
    audioCtx.onEnded(function(){
      // 注意这里的that不可以使用this来替换，因为这里的that是onReady中的this
      // 如果这里写成了this表示的是audioCtx.onEnded的this，这两个this是不一样的
      that.next();
     })
     //自动更新播放进度
     audioCtx.onPlay(function(){ })
     audioCtx.onTimeUpdate(function(){
     that.setData({
         'play.duration': util.formatTimeSong(audioCtx.duration),
         'play.currentTime': util.formatTimeSong(audioCtx.currentTime),
         'play.percent': audioCtx.currentTime/audioCtx.duration*100
         })
     })
     //默认选择第1曲
     this.setMusic(0)
     },

    sliderChange:function(e){
      var second=e.detail.value*audioCtx.duration/100
      audioCtx.seek(second)
      this.setData({
        'play.currentTime': util.formatTimeSong(e.detail.value*audioCtx.duration),
      })
     },  
setMusic:function(index){
    var music=this.data.playlist[index]
    audioCtx.src = music.src;
    // 涮新新歌曲的总时长,使程序获取到新播放歌曲的总时长
    audioCtx.onCanplay(()=> {
      // 必须。可以当做是初始化时长
      audioCtx.duration;
    })
    this.setData({
      playIndex:index,
      'play.title':music.title,
      'play.singer':music.singer,
      'play.coverImgUrl':music.coverImgUrl,
      'play.currentTime':'00:00',
      'play.duration':util.formatTimeSong(audioCtx.duration),
      'play.percent':0
    })
  }, 
  play:function(){
    audioCtx.play()
    this.setData({state:'running'})
    console.log("开始播放")
  },
  pause:function(){
    audioCtx.pause()
    this.setData({state:'paused'})
  },
  next:function(){
    var index=this.data.playIndex>=this.data.playlist.length-1?0:this.data.playIndex+1
    this.setMusic(index)
    if(this.data.state=='running'){
      this.play()
    }
 }, 
 pre:function(){
  var index=this.data.playIndex<=0?this.data.playlist.length-1:this.data.playIndex-1
  this.setMusic(index)
  if(this.data.state=='running'){
    this.play()
  }
}, 
    sliderChanging:function(e)
  {
    console.log(e.detail.value)
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  changePage: function () {
    this.setData({
      showView: (!this.data.showView)
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
