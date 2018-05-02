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
    }


    convert(opcao,map){
        var cast;
        // console.log(map);
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
                this.a=posicao;
                return this.patternGamerMap[posicao];
            }else{
                let aleatorio = Math.floor((Math.random() * 10));
                while(true){
                    if(map[this.patternGamerMap[aleatorio]]==-1){
                        break;
                    }
                    aleatorio = Math.floor((Math.random() * 10));
                }
                this.a=aleatorio;
                return this.patternGamerMap[aleatorio];
            }
        }
        let aleatorio = Math.floor((Math.random() * 10));
        while(true){
            if(map[this.patternGamerMap[aleatorio]]==-1){
                break;
            }
            aleatorio = Math.floor((Math.random() * 10));
        }
        this.a=aleatorio;
        return this.patternGamerMap[aleatorio];
    }


    play(map){
        // console.log(this.Q);
        // console.log(this.s);

        var aleatorio = Math.floor((Math.random() * 10));
        while(true){
            if(map[this.patternGamerMap[aleatorio]]==-1){
                break;
            }else{
                aleatorio = Math.floor((Math.random() * 10));
            }
        }

        if(this.s=="000000000"){
            this.a=aleatorio;
            this.s=this.convert("game_for_ia",map);
            console.log(this.patternGamerMap[aleatorio]);
            return this.patternGamerMap[aleatorio];
        }else{
            this.s=this.convert("game_for_ia",map);
            // console.log(this.s);
            // if(aleatorio<=2){
            //     aleatorio = Math.floor((Math.random() * 10));
            //     while(true){
            //         if(map[this.patternGamerMap[aleatorio]]==-1){
            //             break;
            //         }
            //         aleatorio = Math.floor((Math.random() * 10));
            //     }
            //     this.a=aleatorio;
            //     console.log(this.patternGamerMap[aleatorio]);
            //     return this.patternGamerMap[aleatorio];
            // }else{
                var retorno = this.findMemory(map);
                console.log(retorno);
                return retorno;
            // }
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
        
        if(ocorrido=="win")
            recompensa=100;
        if(ocorrido=="empate")
            recompensa=10;
        if(ocorrido=="empate-simples")
            recompensa=0;
        if(ocorrido=="loser")   
            recompensa=-50;
        
        this.Q[this.s]          = this.Q[this.s]==undefined ? {} : this.Q[this.s];
        var Qsxa                = this.Q[this.s][this.a]==undefined ? 0 : this.Q[this.s][this.a];
        var Qs                  = this.Q[this.s]==undefined ? [0,0] : this.Q[this.s];
        this.Q[this.s][this.a]  = Qsxa+this.aprendizado*(recompensa+ this.desconto*this.maxJson(Qs)-Qsxa);
        console.log(this.Q);

    }


}
