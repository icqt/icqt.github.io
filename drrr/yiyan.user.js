// ==UserScript==
// @name         虎绿林文心一言机器人
// @namespace    https://hu60.cn/
// @version      1.0
// @description  把文心一言接入hu60wap6网站程序
// @author       老虎会游泳
// @match        https://yiyan.baidu.com/
// @icon         https://hu60.cn/favicon.ico
// @grant        none
// ==/UserScript==

document.hu60User = ''; // 虎绿林用户名
document.hu60Pwd = ''; // 虎绿林密码
document.hu60AdminUids = [24962]; // 机器人管理员uid，管理员可以发“@文心一言，刷新页面”来重启机器人
document.hu60Domain = 'https://hu60.cn'; // 如果要对接其他网站，请修改此处的域名（必须是https的否则连不上）
var script = document.createElement("script");
script.src = document.hu60Domain + '/tpl/jhin/js/chatgpt/yiyan.js?r=' + (new Date().getTime());
document.head.appendChild(script);