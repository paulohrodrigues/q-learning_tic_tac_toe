class Jogo {

    constructor(socket){
        this.map={
            tb11:-1,
            tb12:-1,
            tb13:-1,
            tb21:-1,
            tb22:-1,
            tb23:-1,
            tb31:-1,
            tb32:-1,
            tb33:-1
        }
        this.vitorias=0;
        document.getElementById("vitorias").innerHTML=this.vitorias;
        this.console=true;
        this.idGame=-1;
        this.status=false;
        this.user=(new Date()).getTime();
        this.round=0;
        this.socket=socket;
        this.simbolo="X";
        this.userAdversario = -1; 
        this.q_Learning=null;
    }


    setConsole(value){
        if(value===true || value===false){
            this.console=value;
        }else{
            if(this.console===true)
                alert("Parametro de console invalido, deve ser true ou false");
        }
    }

    lembrar(){
        this.q_Learning.lembrar();
    }

    guardarLembrancas(){
        this.q_Learning.guardarLembrancas();
    }

    startQ_Learning(){
        this.setConsole(false);
        this.q_Learning = new Q_Learning();
    }

    play(type=false){
        if(type==true)
            this.startQ_Learning();
        this.init();
        this.look();
        this.actionEvent();
        document.getElementById("clear").style="visibility: hidden;";
    }
    look(){
        var self=this;
        this.socket.on('send message', function(msg){
            switch(msg.option){
                case"init":{
                    self.lookInit(msg);        
                    break;
                }
                case"res":{
                    self.lookRes(msg);
                    break;
                }
                case"game_over":{
                    self.lookGameOver(msg);
                    break;
                }
                case"game":{
                    self.lookGame(msg);
                    break;
                }
                case"empate":{
                    self.lookEmpate(msg);
                    break;
                }
            }
        });
    }

    init(){
        this.socket.emit('send message',{option:"init",user:this.user});
    }

    lookInit(msg){
        if(msg.user!=this.user){
            if(this.status==false){
                
                this.status=true;
                this.idGame=msg.idGame;
                this.simbolo="X";
                this.round=1;
                this.userAdversario=msg.user;
                if(this.console===true)
                    alert("Sua Vez!");
                this.socket.emit('send message',{option:"res",user:this.user,userAdversario:msg.user,idGame:this.idGame});
                // console.log(this.map);
                var self=this;
                setTimeout(()=>{
                    if(self.q_Learning!=null){
                        // console.log(self.q_Learning.play(self.map));
                        document.getElementById(self.q_Learning.play(self.map)).click();
                    }
                },1);
            }
        }
    }


    lookRes(msg){
        if(this.user==msg.userAdversario && this.status==false){
            this.status=true;
            this.idGame=msg.idGame;
            this.simbolo="O";
            this.round=0;
            this.userAdversario=msg.user;
        }
    }


    reset(){
        this.map={
            tb11:-1,
            tb12:-1,
            tb13:-1,
            tb21:-1,
            tb22:-1,
            tb23:-1,
            tb31:-1,
            tb32:-1,
            tb33:-1
        }
        for(let key in this.map){
            document.getElementById(key).innerHTML="";
        }
    }


    lookGameOver(msg){
        var self=this;
        if(msg.userAdversario==this.user){
            this.round=1;
            this.map[msg.idMap]=(this.simbolo=="O")?"X":"O";
            document.getElementById(msg.idMap).innerHTML=this.map[msg.idMap];

            if(this.console===true)
                alert("Você Perdeu!");
            
            
            if(this.console===true)
                alert("Você começa!");

            setTimeout(()=>{
                if(self.q_Learning!=null){
                    this.q_Learning.result("loser");
                    document.getElementById(self.q_Learning.play(self.map)).click();
                }
            },1);
            this.reset();
        }
    }

    lookEmpate(msg){
        if(msg.userAdversario==this.user){
            this.q_Learning.result("empate");
            this.reset();
        }
    }


    lookGame(msg){
        var self=this;
        if(msg.userAdversario==this.user){
            
            this.round=1;
            this.map[msg.idMap]=(this.simbolo=="O")?"X":"O";
            document.getElementById(msg.idMap).innerHTML=this.map[msg.idMap];

            setTimeout(()=>{
                if(self.q_Learning!=null){
                    self.q_Learning.result("empate-simples");
                    document.getElementById(self.q_Learning.play(self.map)).click();
                }
            },1);
        }
    }

    actionEvent(){
        var self=this;
        for(let i=1;i<=3;i++){
            for(let j=1;j<=3;j++){
                document.getElementById("tb"+i+""+j).addEventListener("click",(result)=>{
                    if(self.round==1){
                        self.check(result.toElement.id);
                    }else{
                        if(self.console===true)
                            alert("Não é sua vez");
                    }      
                });
            }
        }
    }

    check(id){
        if(this.map[id]==-1){
            this.map[id]=this.simbolo;
            document.getElementById(id).innerHTML=this.simbolo;
            this.round=0;
            if(this.checkEndGame(id)==true){
                if(this.console===true)
                    alert("Você Venceu!");
                    this.vitorias++;
                    document.getElementById("vitorias").innerHTML=this.vitorias;
                if(this.q_Learning!=null){
                    this.q_Learning.result("win");
                }
                // this.socket.emit('send message',{option:"game",userAdversario:this.userAdversario,idMap:id});
                this.socket.emit('send message',{option:"game_over",userAdversario:this.userAdversario,idMap:id});
                this.reset();
            }else{

                let bol=true;
                for (let a in this.map){
                    if(this.map[a]==-1)
                        bol=false;
                }
                if(bol==true){
                    this.round=1;
                    this.socket.emit('send message',{option:"empate",userAdversario:this.userAdversario});
                    if(this.console===true){
                        alert("Empatou!");
                        alert("Você Começa");
                    }
                    var self=this;
                    setTimeout(()=>{
                        if(self.q_Learning!=null){
                            self.q_Learning.result("empate");
                            self.reset();
                            document.getElementById(self.q_Learning.play(self.map)).click();
                        }
                    },1);
                }else{
                    this.socket.emit('send message',{option:"game",userAdversario:this.userAdversario,idMap:id});
                }
            }
        }else{
            if(this.console===true)
                alert("Esse lugar já está marcado");
        }
    }


    checkEndGame(){
        for(let i=1;i<=3;i++){
            if( this.map["tb1"+i]==this.simbolo && this.map["tb2"+i]==this.simbolo && this.map["tb3"+i]==this.simbolo ) return true;
            if( this.map["tb"+i+"1"]==this.simbolo && this.map["tb"+i+"2"]==this.simbolo && this.map["tb"+i+"3"]==this.simbolo ) return true;
        }
        if( this.map["tb11"]==this.simbolo && this.map["tb22"]==this.simbolo && this.map["tb33"]==this.simbolo ) return true;
        if( this.map["tb13"]==this.simbolo && this.map["tb22"]==this.simbolo && this.map["tb31"]==this.simbolo ) return true;
        return false;
    }
}