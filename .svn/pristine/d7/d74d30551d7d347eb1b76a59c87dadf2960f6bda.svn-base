import axios from 'axios';
import {GETHISTORYDATE} from "config";
import getUserCookies from 'getUserCookies'


async function GetHistoryDate (cylinderId) {
    let data;
    var user_cookies = await getUserCookies();
    if(user_cookies){
        let url = GETHISTORYDATE.replace("$cylinderId", cylinderId);
        await axios.get(url,{
            headers: {
                 "Authorization": "Bearer " + user_cookies.token
            }
        }).then(function (response) {
            data = response.data
        }).catch(function (err) {
            data = err
        })
        return data
    }else{
        return "Expired Token API";
    }
}

export default GetHistoryDate