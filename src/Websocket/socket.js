const { delay } = require("../Utils/delay");

class SocketClass{

    ws;
    status;
    screen;
    intv;
    newNoti;
    setLoginState;
    handler;

    constructor(){
        this.status = -1;
        this.intv = -1;
        this.lastNoti = -1;
        this.watch();
        this.setLoginState = () => {};
        this.handler = () => {};
    }

    get instance(){
        return this;
    }

    async connect(loggedIn, setLoginState){
        this.setLoginState = setLoginState;
        while(this.status == 0 || !loggedIn){
            await delay(50);
        }
        if(this.status == 1){
            return this.ws;
        }
        this.status = 0;
        this.ws = new WebSocket(`ws://api.bubble.jyhs.kr:8888/${encodeURIComponent(localStorage.getItem("token"))}`);
        this.ws.onopen = () => {
            this.watch();
            this.status = 1;
            console.log("open");
            this.ws.onmessage = this.ondata.bind(this);
            this.ws.onclose = async (e) => {
                
                this.status = -1;
                console.log("소켓 연결 해제됨?", e);
                if(e.code == 4999){
                    if(e.reason == "login_other_device"){
                        this.setLoginState(false);
                        clearInterval(this.intv);
                        return;
                    }
                }
                await delay(3000);
                this.connect(this.setLoginState);
            }
        }
    }

    ondata(data){
        let json = JSON.parse(data.data);
        console.log(json);
        switch(json.method){
            case "message": {
                this.handler(json);
            }
            case "notification": {
                this.newNoti = true;
                this.handler(json);
            }
        }
    }

    watch(){
        if(this.intv != -1){
            return;
        }
        this.intv = setInterval(() => {
            if(this.status == -1){
                console.log("connect close");
                this.connect(this.setLoginState);
            }else{
            }
        }, 3000)
    }

    setScreen(screen){
        console.log('screen set', screen)
        this.screen = screen;
        this.send(
            {
                "method": "screen",
                "data": {
                    "state": this.screen
                }
            }
        );
    }

    sethandler(handler){
        console.log('handler set',handler);
        this.handler = handler;
    }

    send(data){
        this.ws.send(
            JSON.stringify(
                {
                    data
                }
            )
        )
    }

}

module.exports = new SocketClass();