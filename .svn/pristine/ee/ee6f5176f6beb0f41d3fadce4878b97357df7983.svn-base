import {GETHISTORYLIST} from "config";
import axios from "axios";
import getUserCookies from "getUserCookies";




async function GetSearchAllHistoryList (cylinder_serial, page=1){
    let data;
    var user_cookies = await getUserCookies();
    if(user_cookies){
        let url = GETHISTORYLIST.replace("$cylinder_serial", cylinder_serial).replace('$page',page).replace("$limit",10);
        await axios.get(url, {headers:{
             "Authorization" : "Bearer " + user_cookies.token
        }}).then(function (response) {
            data = response;
        }).catch(function (err) {
            data = err
        })
        return data
    }else{
       return "Expired Token API";
    }
}
export default GetSearchAllHistoryList;