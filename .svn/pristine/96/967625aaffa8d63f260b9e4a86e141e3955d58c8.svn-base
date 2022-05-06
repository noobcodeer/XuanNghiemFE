import axios from 'axios';
import { CYLINDERTYPES } from 'config';
import getUserCookies from 'getUserCookies'

async function getAllCylinderTypes(id) {
    let data;

    var user_cookies = await getUserCookies();

    if (user_cookies) {
        let url = CYLINDERTYPES.replace("$id", id)

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
                console.log("getdata", data)
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

export default getAllCylinderTypes;
