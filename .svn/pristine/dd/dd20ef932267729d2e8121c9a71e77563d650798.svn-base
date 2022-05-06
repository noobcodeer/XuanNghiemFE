import axios from 'axios';
import {GETCUSTOMERSBYTYPEANDAREA} from 'config';
import getUserCookies from 'getUserCookies'
import Constant from 'Constants'

async function getCustomersByTypeAndArea(customerType, area) {
    let data;
    var user_cookies = await getUserCookies();

    if (user_cookies) {
        let url = GETCUSTOMERSBYTYPEANDAREA
            .replace("$customerType", customerType)
            .replace("$area", area)

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
                console.log("DATA", data)
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

export default getCustomersByTypeAndArea;


