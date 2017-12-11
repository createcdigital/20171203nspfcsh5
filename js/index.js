/**
 * Created by createc on 2017/8/10.
 */
var swiperV = new Swiper('.swiper-container-v', {
    pagination: '.swiper-pagination-v',
    noSwipingClass : 'stop-swiping',
    paginationClickable: true,
    onInit: function(swiper){ //Swiper2.x的初始化是onFirstInit
        swiperAnimateCache(swiper); //隐藏动画元素
        swiperAnimate(swiper); //初始化完成开始动画
    },
    onSlideChangeEnd: function(swiper){
        swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
    }
});

var next = function (num) {
    swiperV.slideTo(num, 1000, true);
}

//获取URL参数函数
function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
var Request = new Object();
Request = GetRequest();
var score2 = Request['score'];
var rec2 = Request['rec'];


//提示阅读加积分
function integralAdd() {
    var M = {}
    // 判断是否已存在，如果已存在则直接显示
    if(M.dialog2){
        return M.dialog2.show();
    }
    M.dialog2 = jqueryAlert({
        'content' : '完成测试可获得20积分！',
        'modal'   : true,
        'buttons' :{
            '确定' : function(){
                M.dialog2.close();
            }
        }
    })
}


//获取时间
function CurentTime() {
    var now = new Date();
    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日
    var hh = now.getHours();            //时
    var mm = now.getMinutes();          //分
    var ss = now.getSeconds();           //秒
    var clock = year + "-";
    if(month < 10)
        clock += "0";
    clock += month + "-";
    if(day < 10)
        clock += "0";
    clock += day + " ";
    if(hh < 10)
        clock += "0";
    clock += hh + ":";
    if (mm < 10) clock += '0';
    clock += mm + ":";
    if (ss < 10) clock += '0';
    clock += ss;
    return(clock);
}

//获取url参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if ( r != null ){
        return decodeURI(r[2]);
    }else{
        return null;
    }
}

//获取sign,参数对象,密匙
function signKey(obj,key) {
    var keys = Object.keys(obj);
    var newKeys = keys.sort();
    var newObjectArray = [];
    for(x in newKeys){
        var attr = newKeys[x];
        console.log(attr);
        if(obj[attr] === '' || obj[attr] === null || obj[attr] === undefined || obj[attr] === 'sign'){
            continue;
        }
        var val = attr + '=' +obj[attr];
        newObjectArray.push(val);
    }
    var str = newObjectArray.join('&');
    str += key;
    str = md5(str).toUpperCase();
    return str;
}

var myDate = new Date();

var memberFlag = false;
function member() {
    var obj = {};
    obj.openid = getQueryString('openid');
    // obj.member_uni_id = 'o3o4zxPMqVE6v1U-ewf5S2Y22eYI';
    obj.timestamp = myDate.getTime();
    obj.appid = getQueryString('appId');
    obj.state = 'wx';
    obj.sign = signKey(obj,'2AF0D0FD2B0640A3849684AB544265B9');
    $.ajax({
        url: 'http://nivea.sweetmartmarketing.com/crmSrv/member/checkMemberInfoByWMC.do',
        type: 'POST',
        data: obj,
//        dataType: "json",
        success: function (data) {
            var D = JSON.parse(data);
            if(D['status'] == '2'){
                memberFlag = true;
            }
            if(D['status'] == '1'){
                memberFlag = false;
            }
        }
    })
}

member()//查询是否是会员


//获取积分参数
function getIntegral(url,num,rem,flag) {
    var obj = {};
    obj.member_uni_id = getQueryString('openid');
    // obj.member_uni_id = 'o3o4zxPMqVE6v1U-eazXn5S2YeYI';
    obj.timestamp = myDate.getTime();
    obj.transaction_type_id = num;
    obj.transaction_time = CurentTime();
    obj.channel = '2';
    obj.remark = rem;
    obj.sign = signKey(obj,'2AF0D0FD2B0640A3849684AB544265B9');
    $.ajax({
        url:url,
        type:'POST',
        data:obj,
//        dataType: "json",
        success:function(data){
            var M = {};
            if(M.dialog3){
                return M.dialog1.show();
            }

            var D = JSON.parse(data);
            if(memberFlag){
                var jsonAlert= {
                    'content' : '',
                    'modal'   : true,
                    'buttons' :{
                        '确定' : function(){
                            M.dialog3.close();
                        },
                        '会员中心' : function(){
                            window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx36310fe660ca89bd&redirect_uri=http%3A%2F%2Fnivea.sweetmartmarketing.com%2FcrmSrv%2Fwx%2FzexWxNvy%3fappid%3dwx36310fe660ca89bd&response_type=code&scope=snsapi_userinfo&state=wx&component_appid=wx757dd6d09794aee2#wechat_redirect';
                        }
                    }
                }
            }else{
                var jsonAlert= {
                    'content' : '',
                    'modal'   : true,
                    'buttons' :{
                        '确定' : function(){
                            M.dialog3.close();
                        },
                        '加入会员' : function(){
                            window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx36310fe660ca89bd&redirect_uri=http%3A%2F%2Fnivea.sweetmartmarketing.com%2FcrmSrv%2Fwx%2FzexWxNvy%3fappid%3dwx36310fe660ca89bd&response_type=code&scope=snsapi_userinfo&state=wx&component_appid=wx757dd6d09794aee2#wechat_redirect';
                        }
                    }
                }
            }
            if(D['code'] == '40027'){
                if(flag == 1){
                    jsonAlert.content = '您已获得积分，不再增加！';
                    M.dialog3 = jqueryAlert(jsonAlert);
                }
                if(flag == 2){
                    jsonAlert.content = '您已获得分享积分，每日限1次！';
                    M.dialog3 = jqueryAlert(jsonAlert);
                }
            }
            //区别是否是会员的文案
            function content() {
                if(memberFlag){
                    if(flag == 1){
                        jsonAlert.content = '获得20积分，点击查看！';
                        M.dialog3 = jqueryAlert(jsonAlert);
                    }
                    if(flag == 2){
                        jsonAlert.content = '分享获得积分30积分，点击查看！';
                        M.dialog3 = jqueryAlert(jsonAlert);
                    }
                }else{
                    if(flag == 1){
                        jsonAlert.content = '获得20积分，加入会员查看！';
                        M.dialog3 = jqueryAlert(jsonAlert);
                    }
                    if(flag == 2){
                        jsonAlert.content = '分享获得积分30积分，加入会员查看！';
                        M.dialog3 = jqueryAlert(jsonAlert);
                    }
                }
            }
            if(D['code'] == '40029'){
                content();
            }
            if(D['code'] == '200'){
                content();
            }
        }
    })
}


//进入H5获取积分

var apiUrl = 'http://nivea.sweetmartmarketing.com/crmSrv/transaction/saveTransactionOnline.do';

//通过分享进来的显示朋友最后的测试结果页面
var showShare = function () {
    if(score2){
        swiperV.slideTo(7, 0, true);
        result(score2,rec2);
    }
};

//检测是否测试过
var test = function () {
    if(!score2){
        if(window.localStorage.score){
            var M = {}
            // 判断是否已存在，如果已存在则直接显示
            if(M.dialog2){
                return M.dialog2.show();
            }
            M.dialog2 = jqueryAlert({
                'content' : '您已获得积分，不再增加！',
                'modal'   : true,
                'buttons' :{
                    '确定' : function(){
                        M.dialog2.close();
                    }
                }
            })
            swiperV.slideTo(7, 0, true);
            result(window.localStorage.score,window.localStorage.rec);
        }else{
            integralAdd();
        }
    }
}
$("#question1 div,#question2 div,#question3 div,#question4 div,#question5 div,#question6 div").click(function () {
    $("#question1 div,#question2 div,#question3 div,#question4 div,#question5 div,#question6 div").html("");
    var oDiv = $("<img class='dian' src='img/public/dian.png' alt=''>");
    $(this).append(oDiv);
})

//开始测试
$("#begin").click(function () {
    next(1);
    _hmt.push(['_trackEvent', '按钮', '开始测试', 'literature']);
})

//点击分享
$("#sq").click(function () {
    var a = $("<img onclick='$(this).remove()' class='share' src='img/page8/share.jpg' alt=''>");
    $('.page8').append(a);
})

var score = 0;//分数
var rec;//推荐产品类型
var qusAry = [];
var qusNum = 0;
//点击NEXT答题的函数
var answerFun = function (num) {
    if(num == 1){var quse = '你每天会在自己的皮肤上花费多久时间?';}
    if(num == 2){var quse = '当你处于干燥环境中，你的皮肤会？';}
    if(num == 3){var quse = '日常防晒中，你会采取以下哪种方式防晒？';}
    if(num == 4){var quse = '假如你在30℃的天气下逛街，你的腋下会出现以下哪种情况？';}
    if(num == 5){var quse = '一年四季中，你的嘴唇常规状态是？';}
    if(num == 6){var quse = '如果有一个改变自己皮肤的机会，你最想改变什么？';}
    var flag = 1;
    var ans = $("#question"+num+" div");
    for(var i=0;i<ans.length;i++){
        if(ans.eq(i).html() != ""){
            flag = 0;
            var s = ans.eq(i).attr('score');
            score = score + parseInt(s);
            var r = ans.eq(i).attr('rec');
            qusNum++;
            var Qdata = "{'field_code':'Q0"+qusNum+"','field_name':'"+quse+"','optionList':[{'option_code':'1','option_name':'"+ans.eq(i).attr('ans')+"','channel':'2','remark':'test','add_time':'"+CurentTime()+"'}]}";
            qusAry.push(Qdata);
            if(!rec){
                rec = r;
            }
            next(num+1);
        }
    }
    if(flag==1){
        var M = {};
        if(M.dialog1){
            return M.dialog1.show();
        }
        M.dialog1 = jqueryAlert({
            'content' : '请选择答案!',
            'closeTime' : 2000
        })
    }
    if(num ==6 ){
        localStorage.score = score;
        localStorage.rec = rec;
        result(score,rec);
        _hmt.push(['_trackEvent', '按钮', '完成答题', 'literature']);

        getIntegral(apiUrl,'11031','打开活动链接获取积分',1);

        //发送答案数据
        var obj2 = {};
        obj2.member_uni_id = getQueryString('openid');
        // obj2.member_uni_id = 'o3o4zxPMqVE6v1U-eazXn5S2YeYI';
        obj2.timestamp = myDate.getTime();
        obj2.memberExList = "["+qusAry.toString()+"]";
        obj2.sign = signKey(obj2,'2AF0D0FD2B0640A3849684AB544265B9');
        console.log(obj2.memberExList);
        $.ajax({
            url:'http://nivea.sweetmartmarketing.com/crmSrv/member/saveMemberEx.do',
            type:'POST',
            data:obj2,
//        dataType: "json",
            success:function(data){
                console.log(data);
            }
        })
    }
}

//点击再测一次
$("#zcyc").click(function () {
    localStorage.removeItem("score");
    localStorage.removeItem("rec");
    _hmt.push(['_trackEvent', '按钮', '再测一次', 'literature']);
    window.location.href='http://nivea.fphis.com/crm/nxpfcs-n/share.html';
})

//显示结果的函数
var result = function (score,rec) {
    $("#score").text(score);
    if(score>0 && score<50 || score==50){
        $("#introduce").text("SQ值已低至红色预警，现在挽救还来得及");
    }else if(score>50 && score<100 || score==100){
        $("#introduce").text("SQ值指数平平，人群中的你还不够耀眼");
    }else if(score>100 && score<150 || score==150){
        $("#introduce").text("SQ值指数爆表，自带女神光环");
    }
    if(rec=="deo"){var oDiv = $("<a href='https://item.jd.com/4086453.html'><img class='yx' src='img/page8/yx.png' alt=''></a>")}
    if(rec=="lip"){var oDiv = $("<a href='https://sale.jd.com/m/act/wbYciRz6C8SX.html'><img class='cb' src='img/page8/cb.png' alt=''></a>")}
    if(rec=="qs"){var oDiv = $("<a href='https://sale.jd.com/m/act/ioVNz20PcmgX.html'><img class='qs' src='img/page8/qs.png' alt=''></a>")}
    if(rec=="yr"){var oDiv = $("<a href='https://item.m.jd.com/product/4524831.html'><img class='yr' src='img/page8/yr.png' alt=''></a>")}
    if(rec=="fs"){var oDiv = $("<a href='https://item.jd.com/2378068.html#crumb-wrap'><img class='fs' src='img/page8/fs.png' alt=''></a>")}
    $(".page8").append(oDiv);
    wx.ready(function () {
        wx.onMenuShareTimeline({
            title: 'NIVEA', // 分享标题
            link: "http://nivea.fphis.com/crm/nxpfcs-n/share.html?score="+score+"&rec="+rec+"", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'http://nivea.fphis.com/crm/nxpfcs-n/img/logo.png', // 分享图标
            success: function () {
                getIntegral(apiUrl,'11032','内容分享获取积分',2);
                _hmt.push(['_trackEvent', '分享', '朋友圈', 'literature']);
            }
        });
        wx.onMenuShareAppMessage({
            title: 'NIVEA', // 分享标题
            desc: 'NIVEA女性皮肤测试', // 分享描述
            link: "http://nivea.fphis.com/crm/nxpfcs-n/share.html?score="+score+"&rec="+rec+"", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'http://nivea.fphis.com/crm/nxpfcs-n/img/logo.png', // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                getIntegral(apiUrl,'11032','内容分享获取积分',2);
                _hmt.push(['_trackEvent', '分享', '朋友', 'literature']);
            },
            cancel: function () {

            }
        });
    })
};

test();//是否测试过
showShare();//分享进来
//微信api操作
var url = window.location.href;
var appid;
var timestamp;
var nonceStr;
var signature;
$.ajax({
    url:'http://nivea.fphis.com/api/jsconfigure',
    type:'POST',
    async: false,
    data:{url:url},
    dataType: "json",
    success:function(data){
        appid = data['appId'];
        timestamp = data['timestamp'];
        nonceStr = data['nonceStr'];
        signature = data['signature'];
    }
})

wx.config({
    debug: false,
    appId: appid,
    timestamp: timestamp,
    nonceStr: nonceStr,
    signature: signature,
    jsApiList: [
        // 所有要调用的 API 都要加到这个列表中,,,,,
        "onMenuShareTimeline",
        "onMenuShareAppMessage",
        "checkJsApi",
        "chooseImage",
        "uploadImage",
    ]
});
if(!score2 && !window.localStorage.score){
    wx.ready(function () {
        wx.onMenuShareTimeline({
            title: 'NIVEA', // 分享标题
            link: "http://nivea.fphis.com/crm/nxpfcs-n/share.html", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'http://nivea.fphis.com/crm/nxpfcs-n/img/logo.png', // 分享图标
            success: function () {
                _hmt.push(['_trackEvent', '分享', '朋友圈', 'literature']);
                getIntegral(apiUrl,'11032','内容分享获取积分',2);
            }
        });
        wx.onMenuShareAppMessage({
            title: 'NIVEA', // 分享标题
            desc: 'NIVEA女性皮肤测试', // 分享描述
            link: "http://nivea.fphis.com/crm/nxpfcs-n/share.html", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'http://nivea.fphis.com/crm/nxpfcs-n/img/logo.png', // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                _hmt.push(['_trackEvent', '分享', '朋友', 'literature']);
                getIntegral(apiUrl,'11032','内容分享获取积分',2);
            },
            cancel: function () {

            }
        });
    })
}
