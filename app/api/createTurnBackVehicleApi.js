import axios from 'axios';
import {TURNBACKFROMTRUCK} from 'config';
import getUserCookies from 'getUserCookies'

async function createTurnBackVehicleApi(cylinders,toWarehouseFullorEmpty,isDriver,cylindersNotInSystem  = [], isOnlyCylindersNIS, createdAt = '') {
    console.log(isDriver)

    let data;
    var user_cookies=await getUserCookies();
    if(user_cookies) {
        let params={
            "cylinders": cylinders,
            "toWarehouseFullorEmpty":toWarehouseFullorEmpty,
            "driver":isDriver,
            "cylindersNotInSystem":cylindersNotInSystem,
            "isOnlyCylindersNIS" : isOnlyCylindersNIS,
            "createdAt": createdAt,
        };
    
        await axios.post(
            TURNBACKFROMTRUCK,params, {
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

export default createTurnBackVehicleApi;


