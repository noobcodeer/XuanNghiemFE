import axios from 'axios';
import { ADDWAREHOUSE } from 'config';
// import { ADDTRUCK } from 'config'
import getUserCookies from "getUserCookies";

async function addWarehouseAPI(data,token) {
    // , license_plate, load_capacity, userId) {


    let datas;
    
        await axios.post(
            // ADDTRUCK,
            ADDWAREHOUSE, data, {
            headers: {
                "Authorization": token
                /*"Authorization" : "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
            }
        })
            .then(function (response) {
                console.log(response);
                datas = response;
            })
            .catch(function (err) {
                console.log(err);
                datas = err.response;
            });


        return datas;
} 


export default addWarehouseAPI;


