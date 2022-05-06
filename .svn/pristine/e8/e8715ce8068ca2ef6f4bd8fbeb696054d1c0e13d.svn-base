import axios from 'axios';
import {CHANGEWAREHOUSE} from 'config';
import getUserCookies from 'getUserCookies'

async function changeWarehouseApi(cylinders,toWarehouseFullorEmpty,cylindersNotInSystem,fromWarehouseFullorEmpty,isOnlyCylindersNIS) {

    let data;
    var user_cookies=await getUserCookies();
    if(user_cookies) {
        let params={
            "cylinders": cylinders,
            "toWarehouseFullorEmpty":toWarehouseFullorEmpty,
            "cylindersNotInSystem":cylindersNotInSystem,
            "fromWarehouseFullorEmpty":fromWarehouseFullorEmpty,
            "isOnlyCylindersNIS": isOnlyCylindersNIS,
        };
    
        await axios.post(
            CHANGEWAREHOUSE,params, {
                headers: {
                    "Authorization" : "Bearer " + user_cookies.token,
                    "Content-Type": "application/json"
                }
            })
                .then(function(response) {
                    data = response;
                })
                .catch(function(err) {
                    console.log('CHANGEWAREHOUSE', err);
                    console.log(err.response.data);
                    console.log(err.response.status);
                    console.log(err.response.headers);
                    data = err.response;
                });
    
    
            return data;
    }
    else {
        return "Expired Token API";
    }


}

export default changeWarehouseApi;


