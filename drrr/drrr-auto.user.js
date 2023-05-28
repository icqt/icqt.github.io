// ==UserScript==
// @name        DRRR.COM智能脚本 - 自动对话 - 自动点歌
// @description 让DRRR.COM聊天室支持点歌、智能聊天功能
// @namespace   Violentmonkey Scripts
// @match       https://drrr.com/room/*
// @license     MIT
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addElement
// @version     2.01
// @author      QQ:121610059
// @update      2023-05-28 15:02:31
// @supportURL  https://greasyfork.org/zh-CN/scripts/414535-drrr-com%E6%99%BA%E8%83%BD%E8%84%9A%E6%9C%AC-%E8%87%AA%E5%8A%A8%E5%AF%B9%E8%AF%9D-%E8%87%AA%E5%8A%A8%E7%82%B9%E6%AD%8C
// ==/UserScript==

(function () {
    'use strict'
    // 添加样式
    GM_addStyle(`
        body{
            background-color: rgb(0,0,0,0.7);
            color: #000;
        }
        #talks{
            color: #fff;
        }
        #drrr-auto-panel{
            text-align: center;
            font-weight: bold;
            line-height: 0px;
        }
        #drrr-auto-content{
            padding: 15px 0;
        }
        #drrr-auto-content label{
            padding: 0 2px;
        }
        .bubble .tail-wrap .tail-mask{
            background: #4C4C4D url(data:image/png;base64,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) no-repeat;
        }
    `)

    // 把首次加载完成后的talks数量写到本地
    GM_setValue('FirstTalksNum', getFirstTalksNum())

    // 添加drr-auto面板元素
    let message_box_effect_wraper = document.querySelector('.message_box_effect_wraper')
    let drrr_auto_panel = GM_addElement(message_box_effect_wraper, 'div', {id: 'drrr-auto-panel'})

    // 添加drrr-auto面板子元素
    drrr_auto_panel.innerHTML = `
        <div id="drrr-auto-content">
            <label for="song_checkbox"><input type="checkbox" name="song_checkbox" id="song_checkbox"> 点歌功能</label>
            <label for="auto_song_checkbox"><input type="checkbox" name="auto_song_checkbox" id="auto_song_checkbox"> 自动点歌</label>
            <label for="chat_checkbox"><input type="checkbox" name="chatcheckboxn" id="chat_checkbox"> AI 聊天</label>
            <label for="timer_checkbox"><input type="checkbox" name="chat_checkbox" id="timer_checkbox"> 定时发送</label><span>(<a href="javascript:">设置</a>)</span>
        </div>`

    // 点歌checkbox
    let song_checkbox = document.querySelector('#song_checkbox')

    // 自动点歌checkbox
    let auto_song_checkbox = document.querySelector('#auto_song_checkbox')

    // 聊天checkbox
    let chat_checkbox = document.querySelector('#chat_checkbox')

    // 定时checkbox
    let timer_checkbox = document.querySelector('#timer_checkbox')

    // 设置文本
    let set_text = drrr_auto_panel.querySelector('span a')

    // 引入layer.js
    loadScript('https://cdn.bootcdn.net/ajax/libs/layer/3.5.1/layer.min.js','layer')

    // 设置checkbox选中状态
    GM_getValue('song_checkbox', false)  ?  song_checkbox.checked = true : song_checkbox.checked = false
    GM_getValue('chat_checkbox', false)  ?  chat_checkbox.checked = true : chat_checkbox.checked = false
    GM_getValue('timer_checkbox', false)  ?  timer_checkbox.checked = true : timer_checkbox.checked = false

    // checkbox点击事件
    drrr_auto_panel.addEventListener('click', function (e) {
        if(e.target.tagName === 'INPUT'){
            let checked = e.target.checked
            let tip = e.target.parentNode.innerText
            GM_setValue(e.target.id, e.target.checked)
            checked ? layer.msg(`${tip}已开启`) : layer.msg(`${tip}已关闭`)
        }
    })

    // 设置定时发送事件
    set_text.addEventListener('click', function (e) {
        let interval_time = GM_getValue('interval_time', 30)
        layer.prompt({
            title: '设置定时发送文本',
            formType: 2,
            btn: ['保存', '间隔', '退出'],
            btn2: function(){
                layer.prompt({title: '设置间隔时间(秒)', formType: 0, value: interval_time}, function(time, index){
                    time = +time
                    if(isNaN(time)){
                        return layer.msg('只能输入数字(30-240)')
                    }
                    if (time < 10 || time > 240){
                        return layer.msg('间隔时间只能在30-240之间')
                    }
                    GM_setValue('interval_time', time)
                    layer.close(index)
                    layer.msg('保存成功')
                    setTimeout(() => location.reload(), 2000)
                })
            },
            value: GM_getValue('timer_str','{time}')
        }, function(text, index){
            GM_setValue('timer_str', text)
            layer.close(index)
            layer.msg('保存成功')
        })
    })

    // 监听dom元素获取最新消息
    document.addEventListener('DOMNodeInserted', function (e) {
        // 获取所有talk元素的数量
        let talk_num = document.querySelectorAll('.talk').length
        if(talk_num > GM_getValue('FirstTalksNum',false)){
            let class_list = e.target.classList instanceof DOMTokenList ?  [...e.target.classList] : []
            if (e.target.tagName === 'DL' || class_list.includes('me')){
                let username = e.target.tagName === 'DL' ? e.target.querySelector('dt .select-text').innerText.trim() : e.target.querySelector('[class=name]').innerText.trim()
                let content = e.target.tagName === 'DL' ? e.target.querySelector('dd .select-text').innerText.trim() : e.target.lastChild.textContent.trim()
                if (username === profile.name) return
                console.log(`收到消息 => ${username} : ${content}`)

                if (song_checkbox.checked && content.includes('点歌') && content.length > 2){
                    let song_name = content.replace('点歌','').trim()
                    song(song_name)
                }

                if (chat_checkbox.checked && content.includes(`@${profile.name}`) && content.length > 1){
                    let ask_content = content.replace(`@${profile.name}`,'').trim()
                    chat(username,ask_content)
                }

            }
        }
    })

    // 定时检测播放状态
    let geting = false
    let palyer_timer = setInterval(function () {
        if(auto_song_checkbox.checked && Player.isPausing && geting === false){
            geting = true
            sendMessage('开始播放随机歌曲')
            $.ajax({
                'url': 'https://api.533526.top/drrrAuto/dev/?action=getRandomMusicName',
                'type': 'get',
                'dataType': 'json',
                'async': false,
                success: function (res) {
                    if (res.code === 1){
                        song(res.data.songName).then(() => {
                            setTimeout(() => geting = false, 3000)
                        })
                    }
                }
            })
        }
    },3000)

    // 定时发送消息
    let default_timer_str = getDefaultTimerStr()
    setInterval(function () {
        // 获取存储的定时文本
        let timer_str = GM_getValue('timer_str', default_timer_str)
        let new_timer_str = timer_str.replace('{time}', new Date().toLocaleString())
        timer_checkbox.checked && sendMessage(`${new_timer_str}`).then(() => {console.log(`定时发送消息成功 => ${new_timer_str}`)})
    },1000 * GM_getValue('interval_time', 30))

    // 获取默认定时信息
    function getDefaultTimerStr() {
        let flag = '/me {time}'
        $.ajax({
            'url': 'https://api.533526.top/drrrAuto/?action=getDefaultTimerStr',
            'type': 'get',
            'dataType': 'json',
            'async': false,
            success: function (res) {
                if (res.code === 1){
                    flag = res.message
                }
            }
        })
        return flag
    }

    // 点歌功能
    function song(keyword) {
        let ajax = $.ajax({
            'url': `https://api.533526.top/drrrAuto/?action=getKeywodMusicUrl&keyword=${keyword}`,
            'type': 'get',
            'dataType': 'json',
            success: function (res) {
                if (res.code === 1){
                    let {songName = songName, singer = singer, songUrl = songUrl} = res.data
                    sendMessage(`接下来让我们一起欣赏${singer}演唱的歌曲《${songName}》`)
                    let data = {name : `${songName} - ${singer}`, url : songUrl}
                    sendMessage(data).then(() => {
                        layer.msg(`点播歌曲《${data.name}》`)
                        console.log(`点播歌曲成功 => ${data.name}`)
                    })
                }else{
                    console.log('提示信息 => 获取歌曲信息失败')
                }
            }
        })
        return ajax
    }

    // 聊天功能
    function chat(form, content) {
        let ajax = $.ajax({
            'url': 'https://api.533526.top/drrrAuto/?action=getReply',
            'type': 'post',
            'data': {
                ask:content,
                form: `${profile.room_id}_${form}`,
                fromName: form
            },
            'dataType': 'json',
            success: function (res) {
                if (res.code === 1){
                    let {reply = reply, fromName =fromName} = res.data
                    console.log(`收到回复 => ${fromName} : ${reply}`)
                    sendMessage(`@${fromName} ${reply}`)
                }else{
                    layer.msg(res.message)

                }
            }
        })
        return ajax
    }

    // 加载script
    function loadScript(url,name) {
        let script = document.createElement("script")
        script.src = url
        script.id = name
        document.body.appendChild(script)
        return script
    }

    //取得聊天室首次打开的talks数量
    function getFirstTalksNum() {
        let flag = 0
        $.ajax({
            method: "post",
            url: '/json.php?fast=1',
            async: false,
            dataType: 'json',
            success(res) {
                flag = res.talks.length
            }
        })
        return flag
    }

    // 发送消息
    function sendMessage(content) {
        if(content === undefined) return false
        let data = typeof content === 'string' ? {message: content, url: '', to: ''} : {music: 'music', url: content.url, name: content.name}
        let ajax = $.ajax({
            method: "post",
            url: '/room/?ajax=1',
            async: false,
            data: data
        })
        return ajax
    }

    //console.log(GM_info)
})();
