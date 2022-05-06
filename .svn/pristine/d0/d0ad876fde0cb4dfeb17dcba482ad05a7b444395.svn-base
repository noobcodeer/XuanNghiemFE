import axios from 'axios';
import { GETWAREHOUSETYPE } from 'config';
import getUserCookies from 'getUserCookies'

async function getWarehouseType({ id, userType }) {
    let data;

    var user_cookies = await getUserCookies();

    if (user_cookies) {
        let url = GETWAREHOUSETYPE
            .replace("$id", id)
            .replace("$userType", userType)

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

export default getWarehouseType;


