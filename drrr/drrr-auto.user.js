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
// @version     2.02
// @author      QQ:121610059
// @update      2023-05-29 14:02:31
// @supportURL  https://greasyfork.org/zh-CN/scripts/414535-drrr-com%E6%99%BA%E8%83%BD%E8%84%9A%E6%9C%AC-%E8%87%AA%E5%8A%A8%E5%AF%B9%E8%AF%9D-%E8%87%AA%E5%8A%A8%E7%82%B9%E6%AD%8C
// ==/UserScript==

(function () {
    'use strict'

    // 进入房间之后执行
    if (!location.pathname.includes('room')) return

    // 引入layer.js
    loadScript('https://cdn.bootcdn.net/ajax/libs/layer/3.5.1/layer.min.js','layer')

    // 设置默认欢迎文本
    const welcome_text = '欢迎{username}进入聊天室'

    // 设置定时发送默认间隔时间
    const  interval_time = 60

    // 设置定时发送的文本
    const timer_str = '你好,现在时间是{time}'

    // 添加样式
    GM_addStyle(`
        #drrr-auto-panel{
            text-align: center;
            font-weight: bold;
            line-height: 0px;
        }
        #drrr-auto-content{
            padding: 15px 0;
            display: flex;
            align-content: center;
            justify-content: center;
            flex-wrap: wrap;
        }
        #drrr-auto-content .items{
            display: flex;
            align-items: center;
            padding: 5px;
        }
        #drrr-auto-content a{
            color: #aaa;
        }
        #drrr-auto-content input[type=checkbox]{
            margin: auto;
            margin-right: 3px;
        }
        
       #drrr-auto-content input[type=checkbox]{
            outline: none;
            appearance: none;
            position: relative;
            width: 2.6rem;
            height: 1.52rem;
            border-radius: 50px;
            border: 1px solid #ccc;
            background-color: #ccc;
       }
       #drrr-auto-content input[type=checkbox]::after{
            content: '';
            display: inline-block;
            width: 1.4rem;
            height: 1.4rem;
            border-radius: 50%;
            background-color: #fff;
            box-shadow: 0 0 0 2px #999;
            transition: left 0.1s linear;
            position: absolute;
            top: 0;
            left: 0;
       }
       #drrr-auto-content input[type=checkbox]:checked{
            background-color: #32ba58;
       }
       #drrr-auto-content input[type=checkbox]:checked:after{
            position: absolute;
            top: 0;
            left: 50%;
       }
       .layui-layer-content{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
       }
       .layui-layer-content button{
            color: #262629;
            margin: 5px auto;
            background-color: #fff;
            border-radius: 9px;
            padding: 5px;
       }
       
    `)

    // **添加drr-auto面板元素
    const message_box_effect_wraper = document.querySelector('.message_box_effect_wraper')
    const drrr_auto_panel = GM_addElement(message_box_effect_wraper, 'div', {id: 'drrr-auto-panel'})
    drrr_auto_panel.innerHTML = `
    <div id="drrr-auto-content" class="layui-form">
        <div class="items"><input type="checkbox" id="song_checkbox" class="switch"><span>点歌功能</span></div>
        <div class="items"><input type="checkbox" id="auto_song_checkbox" class="simple-2"><span>自动点歌</span></div>
        <div class="items"><input type="checkbox" id="chat_checkbox" class="simple-2"><span>AI聊天</span></div>
        <div class="items"><input type="checkbox" id="welcome_checkbox" class="simple-2"><span>欢迎加入</span></div>
        <div class="items"><input type="checkbox" id="timer_checkbox" class="simple-2"><span>定时发送</span></div>
        <div class="items"><span id="config">配置更多</span></div>
    </div>`

    // **把首次加载完成后的talks数量写到本地
    GM_setValue('FirstTalksNum', getFirstTalksNum())
    // 点歌checkbox
    const song_checkbox = document.querySelector('#song_checkbox')
    // 自动点歌checkbox
    const auto_song_checkbox = document.querySelector('#auto_song_checkbox')
    // 聊天checkbox
    const chat_checkbox = document.querySelector('#chat_checkbox')
    // 欢迎加入checkbox
    const welcome_checkbox = document.querySelector('#welcome_checkbox')
    // 定时checkbox
    const timer_checkbox = document.querySelector('#timer_checkbox')
    // 设置文本
    const set_text = drrr_auto_panel.querySelector('span a')
    // 设置checkbox选中状态
    GM_getValue('song_checkbox', false)  ?  song_checkbox.checked = true : song_checkbox.checked = false
    GM_getValue('chat_checkbox', false)  ?  chat_checkbox.checked = true : chat_checkbox.checked = false
    GM_getValue('welcome_checkbox', false)  ?  welcome_checkbox.checked = true : welcome_checkbox.checked = false
    GM_getValue('timer_checkbox', false)  ?  timer_checkbox.checked = true : timer_checkbox.checked = false

    // **点击事件绑定
    document.addEventListener('click', function (e) {
        // checkbox点击事件绑定
        if(e.target.tagName === 'INPUT' && e.target.type === 'checkbox'){
            let checked = e.target.checked
            let tip = e.target.nextElementSibling.innerText
            GM_setValue(e.target.id, e.target.checked)
            checked ? layer.msg(`${tip}已开启`) : layer.msg(`${tip}已关闭`)
        }
        // tip点击事件绑定
        if(e.target.tagName === 'SPAN'){
            switch (e.target.innerText) {
                case '点歌功能':
                    layer.tips('让聊天室支持点歌功能 格式: 点歌+歌曲名', e.target, {tips: 3})
                    break
                case '自动点歌':
                    layer.tips('让聊天室没有音乐播放时自动播放随机音乐', e.target, {tips: 3})
                    break
                case 'AI聊天':
                    layer.tips('简单聊天功能 格式: @BOT+想说的话', e.target, {tips: 3})
                    break
                case '欢迎加入':
                    layer.tips('有人进入房间时欢迎加入', e.target, {tips: 3})
                    break
                case '定时发送':
                    layer.tips('设置定时发送信息', e.target, {tips: 3})
                    break
            }
        }
        // 全局配置事件
        if (e.target.id === 'config') {
            layer.open({
                type: 1,
                title: '更多配置',
                area: ['200px', '250px'],
                id: 'config_layer',
                content: `
                <button id="welcome_text">设置欢迎文本</button>
                <button id="timer_num">设置定时间隔</button>
                <button id="timer_text">设置定时文本</button>`
            });
        }
        // 配置项点击事件绑定
        if (e.target.parentNode.id === 'config_layer'){
            switch (e.target.innerText){
                case '设置欢迎文本':
                    layer.prompt({title: e.target.innerText, value: GM_getValue('welcome_text',welcome_text), formType: 2, btn: ['保存', '退出'],
                    },function (text,index) {
                        GM_setValue('welcome_text', text)
                        layer.close(index)
                        layer.msg('保存成功')
                    })
                    break
                case '设置定时间隔':
                    layer.prompt({title: `${e.target.innerText}(单位:秒)`, formType: 0, value: GM_getValue('interval_time',interval_time)}, function(time, index){
                        if(isNaN(+time)){
                            return layer.msg('只能输入数字(10-240)')
                        }
                        if (time < 10 || time > 240){
                            return layer.msg('间隔时间只能在10-240之间')
                        }
                        GM_setValue('interval_time', time)
                        layer.close(index)
                        layer.msg('保存成功')
                    })
                    break
                case '设置定时文本':
                    layer.prompt({title: e.target.innerText, value: GM_getValue('timer_str',timer_str), formType: 2, btn: ['保存', '退出'],
                    },function (text,index) {
                        GM_setValue('timer_str', text)
                        layer.close(index)
                        layer.msg('保存成功')
                    })
                    break
            }
        }
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
                // 点歌功能
                if (song_checkbox.checked && content.includes('点歌') && content.length > 2){
                    let song_name = content.replace('点歌','').trim()
                    song(song_name)
                }
                // 聊天功能
                if (chat_checkbox.checked && content.includes(`@${profile.name}`) && content.length > 1){
                    let ask_content = content.replace(`@${profile.name}`,'').trim()
                    chat(username,ask_content)
                }

            }

            // 收到用户加入信息
            if (class_list.includes('join')){
                let username = e.target.querySelector('span [class=name]').innerText.trim()
                if (welcome_checkbox.checked){
                    let new_str = replaceStr(GM_getValue('welcome_text',welcome_text), username)
                    sendMessage(new_str)
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
                'url': 'https://api.533526.top/drrrAuto/?action=getRandomMusicName',
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
    let intervalSendTimer = setInterval(intervalSendFn, GM_getValue('interval_time', interval_time) * 1000)
    function intervalSendFn() {
        let time = GM_getValue('interval_time', interval_time)
        console.log(`当前定时间隔为${time}秒`)
        let new_timer_str = replaceStr(GM_getValue('timer_str', timer_str))
        timer_checkbox.checked && sendMessage(`${new_timer_str}`).then(() => {console.log(`定时发送消息成功 => ${new_timer_str}`)})
        clearInterval(intervalSendTimer)
        if (time !== interval_time) intervalSendTimer = setInterval(intervalSendFn, time * 1000)
    }

    // 替换文本中的自定义变量
    function replaceStr(str,username) {
        let new_str = str.replace('{time}', new Date().toLocaleString())
        if (username) new_str = new_str.replace('{username}', username)
        return new_str
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
})();
