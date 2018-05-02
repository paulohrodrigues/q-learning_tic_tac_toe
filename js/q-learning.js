class Q_Learning{
    constructor(){
        this.desconto=0.5;
        this.aprendizado=0.5;

        this.patternGamerMap=[
            "tb11",
            "tb12",
            "tb13",
            "tb21",
            "tb22",
            "tb23",
            "tb31",
            "tb32",
            "tb33"
        ];
        this.a       = 0;
        this.Q       = {};
        this.s       = "000000000";
        this.memoria = "local";
        
        this.S=[];
        this.A=[];
    }


    convert(opcao,map){
        var cast;
        if(opcao=="game_for_ia"){
            cast="";
            for(let obj in map){
                if(map[obj]==-1)
                    cast+="0";
                else if(map[obj]=="X")
                    cast+="1";
                else
                    cast+="2";
            }
            return cast;
        }

        if(opcao=="ia_for_game"){
            cast=[];
            for(let obj of map){
                if(obj=="0")
                    cast.push(-1);
                else if(obj=="1")
                    cast.push("X");
                else
                    cast.push("O");
            }
            return cast;
        }
    }

    lembrar(){
        this.Q=JSON.parse(localStorage.getItem('memoria'));
    }
    guardarLembrancas(){
        localStorage.setItem('memoria', JSON.stringify(this.Q));
    }

    
    findMemory(map){
        var maior   = 0;
        var posicao = 0;
        var q;
        var QLocal;

        if(this.memoria=="local"){
            QLocal=this.Q;
        }else if(this.memoria=="fisica"){
            QLocal=JSON.parse(localStorage.getItem('memoria'));
        }


        if(QLocal[this.convert("game_for_ia",map)]!=undefined){
            q=QLocal[this.convert("game_for_ia",map)];
            for(let key in q){
                if(QLocal[this.convert("game_for_ia",map)][key]>=maior && map[this.patternGamerMap[key]]==-1){
                    maior   = QLocal[this.convert("game_for_ia",map)][key];
                    posicao = key;
                }
            }
            if(maior>0){
                // this.a=posicao;
                return posicao;
            }else{
                let aleatorio = Math.floor((Math.random() * 10));
                while(true){
                    if(map[this.patternGamerMap[aleatorio]]==-1){
                        break;
                    }
                    aleatorio = Math.floor((Math.random() * 10));
                }
                // this.a=aleatorio;
                return aleatorio;
            }
        }
        let aleatorio = Math.floor((Math.random() * 10));
        while(true){
            if(map[this.patternGamerMap[aleatorio]]==-1){
                break;
            }
            aleatorio = Math.floor((Math.random() * 10));
        }
        // this.a=aleatorio;
        return aleatorio;
    }


    setS(value){
        this.S.push(value);
        this.s=value;
    }
    setA(value){
        this.A.push(value);
        this.a=value;
    }


    play(map){

        var aleatorio = 4;
        while(true){
            if(map[this.patternGamerMap[aleatorio]]==-1){
                break;
            }else{
                aleatorio = Math.floor((Math.random() * 10));
            }
        }

        if(this.s=="000000000"){
            this.setA(aleatorio);
            this.setS(this.convert("game_for_ia",map));
            // console.log(this.patternGamerMap[aleatorio]);
            return this.patternGamerMap[aleatorio];
        }else{
                this.setS(this.convert("game_for_ia",map));
                var retorno = this.findMemory(map);
                this.setA(retorno);
                return this.patternGamerMap[retorno];
        }
    }

    maxJson(jsonArray){
        let maior=0;
        for(let obj in jsonArray){
            if(jsonArray[obj]>maior ){
                maior=jsonArray[obj];
            }
        }
        return maior;
    }


    result(ocorrido){
        
        var recompensa = 0;
        
        if(ocorrido=="win"){
            this.resultbBackPropagation();
            recompensa=100;
        }
        if(ocorrido=="empate"){
            recompensa=10;
            this.S=[];
            this.A=[];
        }
        if(ocorrido=="empate-simples"){
            recompensa=0;
        }
        if(ocorrido=="loser"){
            recompensa=-50;
            this.S=[];
            this.A=[];   
        }
     
        this.resultDirect(recompensa,this.s,this.a);

    }

    resultDirect(recompensa,s,a){
        this.Q[s]     = this.Q[s]==undefined ? {} : this.Q[s];
        var Qsxa      = this.Q[s][a]==undefined ? 0 : this.Q[s][a];
        var Qs        = this.Q[s]==undefined ? [0,0] : this.Q[s];
        this.Q[s][a]  = Qsxa+this.aprendizado*(recompensa+ this.desconto*this.maxJson(Qs)-Qsxa);
        console.log(this.Q);
    }

    resultbBackPropagation(){
        var recompensa=15;
        while(this.S!=0){
            this.resultDirect(recompensa,this.S[this.S.length-1],this.A[this.A.length-1]);
            recompensa-=3;
            this.S.pop();
            this.A.pop();
        }
    }

}