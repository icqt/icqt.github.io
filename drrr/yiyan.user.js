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
document.hu60AdminUids = []; // 机器人管理员uid，管理员可以发“@文心一言，刷新页面”来重启机器人
document.hu60Domain = 'https://hu60.cn'; // 如果要对接其他网站，请修改此处的域名（必须是https的否则连不上）
var script = document.createElement("script");
script.src = 'https://icqt.github.io/drrr/yiyan.js?t=' + (new Date().getTime());
document.head.appendChild(script);

document.run = async function () {
    while (true) {
        try {
            // 访问你的网站获取要发给文心一言的内容
            // 网站必须是https的，否则连不上。
            // 此外网站还必须设置 Access-Control-Allow-Origin: * 头信息，否则也连不上。
            let response = await fetch('https://api.ataisoft.533526.top/drrrAuto/index.php?action=getAsk');

            // 假设获取到的信息是JSON，把它转换成JSON对象
            // 网站必须设置 content-type: application/json 头信息，否则转换会失败。
            let messages = await response.json();

            // 假设JSON结构是这样：
            // {"data": [
            //    {"uid":3, "text":"@文心一言，你好"},
            //    {"uid":2, "text":"@文心一言，我有一个问题"},
            //    {"uid":1, "text":"@文心一言，刷新页面"},
            // ]}
            let exceptionCount = 0;
            for (let i = 0; i < messages.data.length; i++) {
                console.log(messages.data[i])
                // 要发给文心一言的话，开头包含的“@机器人名称，”会被后续流程自动去除。
                let text = messages.data[i].text;
                console.log(text)
                // 用户id，可以是字符串，所以给出用户名也是可以的。
                let uid = messages.data[i].uid;
                console.log(uid)

                try {
                    // 从文心一言读取回复
                    let replyText = await readReply();
                    console.log(replyText)


                } catch (ex) {
                    exceptionCount++;  // 统计异常次数
                    console.error(ex); // 打印异常到控制台
                    await sleep(1000); // 异常后等久一点
                }
            }

            // 执行管理员命令（比如“刷新页面”）
            await runAdminCommand();

            // 异常太多，自动刷新页面
            if (exceptionCount > 0 && exceptionCount >= messages.data.length) {
                refreshPage();
                await sleep(5000); // 防止实际刷新前执行到后面的代码
            }

            // 限制拉取信息的速度，避免对自己的网站造成CC攻击
            await sleep(1000);
        } catch (ex) {
            console.error(ex);
            await sleep(1000);
        }
    }
}