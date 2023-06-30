export function getRoute(route:string, dev:boolean){
    if(dev) {
        return "http://localhost:5173/" + route;
    } 
    return "http://outing-oracle-hqdxg.mongodbstitch.com/" + route;
}