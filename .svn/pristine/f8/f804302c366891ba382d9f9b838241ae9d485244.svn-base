import axios from 'axios';
import {GETINFORMATIONTRUCK} from 'config';
import getUserCookies from 'getUserCookies'


async function getInfomationFromTruckApi(cylinder_serials,isDriver) {
    console.log(isDriver)
    

    let data;
    var user_cookies=await getUserCookies();
    if(user_cookies) {
        let params={
            "cylinderSerial": cylinder_serials,
            "driver": isDriver
        };
    
        await axios.post(
            GETINFORMATIONTRUCK,params, {
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

export default getInfomationFromTruckApi;


