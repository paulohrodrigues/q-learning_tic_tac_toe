class Antecipador{

    constructor(){

    }   

    check(map){

        var mapTemp=map;

        for(let key in map){
            if(map[key]==-1){
                mapTemp[key]=1;
            }
        }


    }


}