import axios from 'axios';
import { EXCEL6MONTH } from 'config';
import getUserCookies from "getUserCookies";
import showToast from "showToast";
async function exportExcel6Month(from) {
    let data;
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        let params = {
            "from":from
            
        };


        await axios.post(
            EXCEL6MONTH, params, {
            headers: {
                "Authorization": "Bearer " + user_cookies.token
                /*"Authorization" : "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
            },
            responseType: 'blob'
        })
            .then(function (response) {
                data = response;
                const url = window.URL.createObjectURL(new Blob([response.data]));

                const link = document.createElement('a');
                link.href = url;
                //let disposition = response.headers['content-disposition']
                let filename = `Bao_Cao.xlsx`;
                link.setAttribute('download', filename); //or any other extension
                document.body.appendChild(link);
                link.click();
                //console.log(response);
                
                
              
            })
            .catch(function (err) {
                console.log(err);
                data = err.response;
            });


        return data;
    }
    else {
        return "Expired Token API";
    }
}

export default exportExcel6Month;


