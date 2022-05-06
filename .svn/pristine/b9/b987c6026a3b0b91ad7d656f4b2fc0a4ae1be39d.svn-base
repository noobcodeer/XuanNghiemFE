import axios from 'axios';
import {GETCHILDUSERSBYTYPE} from 'config';
import getUserCookies from 'getUserCookies'

async function getChildUsersByType(id, type) {
    let data;
    
    var user_cookies = await getUserCookies();
   
    if (user_cookies) {
        let url = GETCHILDUSERSBYTYPE
            .replace("$id", id)
            .replace("$type", type)

        await axios.get(
            url,            
            {
                headers: {
                    "Authorization": "Bearer " + user_cookies.token
                }
            }
        )
            .then(function (response) {
                data = response;
                console.log("DATA",data)
            })
            .catch(function (err) {
                data = err.response;
            });

        return data;
    }
    else {
        return "Expired Token API";
    }

}

export default getChildUsersByType;


