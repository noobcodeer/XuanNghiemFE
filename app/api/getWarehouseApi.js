import axios from 'axios';
import { GETWAREHOUSE} from 'config';

async function getWarehouseApi(prams,token){
    let data;
    await axios.get(
        GETWAREHOUSE,{params:prams,headers: {
            "Authorization": token
           
        }}
          
    )
        .then(function (response) {
           data=response.data.data;
        })
        .catch(function (err) {
            data=err.data.data;
        });
       return data;
}
export default getWarehouseApi;