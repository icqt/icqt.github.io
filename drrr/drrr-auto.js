// ==UserScript==
// @name       DRRR.COM智能脚本 - 自动对话 - 自动点歌
// @namespace   Violentmonkey Scripts
// @match       https://drrr.com/room/*
// @grant       none
// @version     1.20
// @author      阿太网络 QQ:121610059
// @update      2023/05/24 上午11:02:03
// ==/UserScript==

/* 全局脚本配置 */
const apiAdress = 'https://api.ataisoft.533526.top/drrrAuto'
localStorage.setItem('drrrAutoSwitch', 'true')     //默认脚本是否开启 true为打开 false为关闭
localStorage.removeItem('selfName')     //清除机器人名字
/* 全局配置结束 */
let div = document.createElement('div')    //创建一个脚本全局开关div
div.id = 'drrr-auto-switch'
div.style.cssText = `
    height: 90px;
    width: 30px;
    position: fixed;
    top: 45vh;
    z-index: 9999;
    text-align: center;
    color: #fff;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
    cursor: pointer;`
document.body.appendChild(div)  //插入到网页中
let drrrAutoTipDiv = document.createElement('div')    //创建一个脚本全局提示div
let bacc = window.innerWidth <= 414 ? '#fff' :  'rgba(255,255,255,.9)'     //手机访问改变输入框的背景色
drrrAutoTipDiv.id = 'drrr-auto-Tip'
drrrAutoTipDiv.style.cssText = `
    height: 25px;
    line-height: 25px;
    width: 100%;
    position: fixed;
    top: 0;
    z-index: 9999;
    text-align: center;
    color: #000;
    font-size: 14px;
    font-weight:bold;
    background-color: ${bacc};`
document.body.appendChild(drrrAutoTipDiv)  //插入到网页中
let drrrAutoSwitch = document.querySelector('#drrr-auto-switch')
let drrrAutoTip = document.querySelector('#drrr-auto-Tip')
document.querySelector('.message_box').style.top = '25px'   //默认输入框往下挪
if (localStorage.getItem('drrrAutoSwitch') === 'true') {   //初启动后判断一下脚本开启状态
    drrrAutoSwitch.style.backgroundColor = '#7dc555'    //调整背景颜色为绿色
    drrrAutoSwitch.innerText = '关闭脚本'    //修改文字提示
    drrrAutoTip.style.color = '#7dc555'    //修改提示信息文字颜色
    drrrAutoTip.innerText = 'DRRR智能脚本已开启'    //修改提示信息文字
}else{
    drrrAutoSwitch.style.backgroundColor = 'red'    //调整背景颜色为红色
    drrrAutoSwitch.innerText = '开启脚本'    //修改文字提示
    drrrAutoTip.style.color = 'red'    //修改提示信息文字颜色
    drrrAutoTip.innerText = 'DRRR智能脚本已关闭'    //修改提示信息文字
}
drrrAutoSwitch.addEventListener('click', () => {    //开关点击事件
    if (localStorage.getItem('drrrAutoSwitch') === 'true') {   //脚本关闭状态就打开
        localStorage.setItem('drrrAutoSwitch', 'false')  //保存开关状态为开启
        drrrAutoSwitch.style.backgroundColor = 'red'    //调整背景颜色为红色
        drrrAutoSwitch.innerText = '开启脚本'    //修改文字提示
        drrrAutoTip.style.color = 'red'    //修改提示信息文字颜色
        drrrAutoTip.innerText = 'DRRR智能脚本已关闭'    //修改提示信息文字
    }else{
        localStorage.setItem('drrrAutoSwitch', 'true')  //保存开关状态为开启
        drrrAutoSwitch.style.backgroundColor = '#7dc555'    //调整背景颜色为绿色
        drrrAutoSwitch.innerText = '关闭脚本'    //修改文字提示
        drrrAutoTip.style.color = '#7dc555'    //修改提示信息文字颜色
        drrrAutoTip.innerText = 'DRRR智能脚本已开启'    //修改提示信息文字
    }
})
let talks = document.querySelector('.talks')
let talksInitNum = 0    //设置一个变量接收初始化的talks数量
initTalks() //获取talks
talks.addEventListener('DOMNodeInserted', (e) => {  //开始监听dom
    if (
        localStorage.getItem('drrrAutoSwitch') === 'true' &&    //脚本开关打开才会执行
        e.target.tagName === 'DL'&&         //判断是否为消息标签
        talks.childNodes.length > talksInitNum  //初始化talks消息条数
    ){
        let message = e.target.querySelector('.body.select-text')
        let username = e.target.querySelector('span.select-text').innerText
        let messageText = message.innerText
        let selfName = getSelfName()
        if(messageText.includes(`@${selfName}`)){   //匹配到@信息
            let removeAtContent = messageText.replace(`@${selfName}`, '').trim()    //删除@信息
            console.log(`${username}: ${removeAtContent}`)    //打印接收到的消息
            getReply(removeAtContent)   //处理问题
        }
        let matchSongName = [...messageText.matchAll(/^点歌(.*)/g)]   //匹配点歌信息
        if(matchSongName.length > 0){   //匹配到点歌信息
            let songName = matchSongName[0][1]
            console.log(`点歌${songName}`)  //打印需要点的歌名
            playSong(songName)  //执行点歌函数
        }
        //message.innerHTML = `${message.innerText} <span style="color:red;">[脚本已回复]</span>`
    }
})
setInterval(() => {     //30秒发送一次消息防止房间自动关闭
    sendMessage(`欢迎使用 DRRR BOT 智能脚本\n目前脚本有如下功能:\n  1.智能Ai聊天(格式: @我+聊天内容)\n  2.点歌功能(格式: 点歌+歌曲名称)\n${new Date().toLocaleString()}`)
},120000)
function initTalks() {   //取得页面刚打开页面的talk数
    $.ajaxSettings. async = false   //同步请求
    $.getJSON('/json.php?fast=1', function(data){
        talksInitNum = data.talks.length
    })
    $.ajaxSettings. async = true    //取消同步请求
}
function getSelfName() {    //获取机器人名字
    if (!localStorage.getItem('selfName')) {
        $.ajaxSettings. async = false   //同步请求
        $.getJSON("/lounge?api=json", function(data){
            localStorage.setItem('selfName', data.profile.name)
        })
    }
    $.ajaxSettings. async = true    //取消同步请求
    return localStorage.getItem('selfName')
}
function getReply(ask) {    //获取聊天回复
    $.ajaxSettings. async = false   //同步请求
    $.post(`${apiAdress}/?action=getReply`, { "ask": ask },
        function(data){
            if (data.code === 1) {
                sendMessage(data.data.reply)    //发送回复
            }else{
                sendMessage( data.message)      //发送错误信息
            }
        }, "json");
    $.ajaxSettings. async = true    //取消同步请求
}
function playSong(keyword) {    //播放歌曲
    $.ajaxSettings. async = false   //同步请求
    $.getJSON(`${apiAdress}/?action=getKeywodMusicUrl&keyword=${keyword.trim()}`, function(data){  //请求api获取歌曲列表
        if (data.code === 1) {
            let {songUrl,songName,singer} = data.data
            console.log(data.data.songUrl)   //打印歌曲列表的第一条歌曲信息
            sendMessage(`好的,让我们一起收听${singer}的${songName}`)   //发送准备播放信息
            setTimeout(()=> sendMusic(`${songName} - ${singer}`,songUrl),1000) //延迟一秒播放音乐
        }else{
            sendMessage(`ERROR: ${data.message}`)    //发送播放失败信息
        }
    })
    $.ajaxSettings. async = true    //取消同步请求
}
function sendMessage(message) {     //发送准备播放信息
    return $.post('/room/?ajax=1', { message: message, url: '', to:'' } )
}
function sendMusic(songName,songUrl) {  //发送音乐
    return $.post('/room/?ajax=1', { music: 'music', url: songUrl, name:songName} )
}
function request(url,body = [],method = 'GET') {    //封装fetch
    let params = body.length > 0 ? '?' + body.join('&') : ''
    if (method === 'GET') {
        return fetch(url + params)
    }else{
        return fetch(url,{
            method: method,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        })
    }
}
