import axios from 'axios';
import { GETSTATISTICWAREHOUSEFULL } from 'config';
import getUserCookies from 'getUserCookies'

async function getStatisticWarehouseFull({ target, startDate, endDate, statisticalType }) {
    let data;

    var user_cookies = await getUserCookies();

    if (user_cookies) {
        let url = GETSTATISTICWAREHOUSEFULL
            .replace("$target", target)
            .replace("$startDate", startDate)
            .replace("$endDate", endDate)
            .replace("$statisticalType", statisticalType)

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

export default getStatisticWarehouseFull;


