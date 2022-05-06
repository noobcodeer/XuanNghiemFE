import axios from 'axios';
import {GETINFORMATIONWAREHOUSE} from 'config';
import getUserCookies from 'getUserCookies'

async function getinformationWarehouseAPI(cylinder_serials) {

    let data;
    var user_cookies=await getUserCookies();
    if(user_cookies) {
        let params={
            "cylinderSerial": cylinder_serials,
        };
    
        await axios.post(
            GETINFORMATIONWAREHOUSE,params, {
                headers: {
                    "Authorization" : "Bearer " + user_cookies.token,
                    "Content-Type": "application/json"
                }
            })
                .then(function(response) {
                    data = response;
                })
                .catch(function(err) {console.log(err);
                    data = err.response;
                });
    
    
            return data;
    }
    else {
        return "Expired Token API";
    }


}

export default getinformationWarehouseAPI;


