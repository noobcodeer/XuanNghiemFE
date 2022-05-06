import axios from "axios";
import {GETALLHISTORYLIST} from "config";
import getUserCookies from "getUserCookies";

async function getAllHistoryList(cylinder_serial, allItem){
    let data;
    var user_cookies = await getUserCookies();
    if(user_cookies){
        let url = GETALLHISTORYLIST.replace("$cylinder_serial", cylinder_serial).replace("$limit", allItem)
        await axios.get(url, {
            headers: {
                "Authorization": "Bearer " + user_cookies.token
            }
        }).then(function (response){
            data = response.data
        }).catch(function (err){
            data = err
        })
        return data;
    }else{
        return "Expired Token API";
    }
}

export default getAllHistoryList