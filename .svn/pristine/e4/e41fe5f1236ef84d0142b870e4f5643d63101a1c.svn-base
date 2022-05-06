import React, { useState, useEffect } from 'react'
import "./statistical.scss";
import { Button, DatePicker, Select, Table, Typography, Checkbox, Tabs, Modal, Form,Pagination } from "antd";
import moment from "moment";
import getUserCookies from "getUserCookies";
import getWarehouseType from '../../../../api/getWarehouseType';
import getTypeCylinder from './../../../../api/getTypeCylinder';
import getStatisticWare from '../../../../api/getStatisticware';
import axios from 'axios';
import { SERVERAPI } from '../../../config/config';
import { GETLISTMANUFACTURE } from '../../../config/config';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
export default function khoxe() {
    const [wareHouses, setWareHouses] = useState([]); 
    const [cylinder, setCylinder] = useState([]);
    const [history,setHistory] = useState([]);
    const [historyExport,setHistoryExport] = useState([]);
    const [selectedWareHouse, setSelectedWareHouse] = useState({}); 
    const [listStatictis, setListStatictis] = useState({ createdCylinder: { cylinderTypes: [] }, inventoryCylinder: { cylinderTypes: [] }, exportCylinderFromTruck: {cylinderTypes: []},turnbackCylinderFromTruck: { cylinderTypes: [] }, turnbackCylinderFromCustomer: { cylinderTypes: [] }});
    const [userType, setUserType] = useState("");
    const [userRole, setUserRole] = useState("");
    const [loading, setLoading] = useState(false);
    const [getBranch, setBranch] = useState([]);
    const [getStation, setStation] = useState([]);
    const [typeExcel, setTypeExcel] = useState("");
    const [startTime, setStartTime] = useState(moment());
    const [endTime, setEndTime] = useState(moment());
    const [userRoleFixer, setUserRoleFixer] = useState("");
    const [createdCylinder, setCreatedCylinder] = useState([]);
    const [exportedCylinder, setExportedCylinder] = useState([]);
    const [turnbackCylinder, setTurnbackCylinder] = useState([]);
    const [inventoryCylinder, setInventoryCylinder] = useState([]);
    const [cylinderTypes, setCylinderTypes] = useState([]);
    const [columnCylinderTypes, setColumnCylinderTypes] = useState([]);
  
  
    const [selectedUserTypeStat, setSelectedUserTypeStat] = useState('');
    const [usersByType, setUsersByType] = useState([]);
    const [userStatistic, setUserStatistic] = useState('');
  
    const [target, setTarget] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [statisticalType, setStatisticalType] = useState('byItself');
    const [listManufacture, setListManufacture] = useState([]);
    const [currentPageTurnbackHistory,setCurrentPageTurnbackHistory] = useState(1);
    const [currentPageExportHistory,setCurrentPageExportHistory] = useState(1);

    useEffect(
        () => {
            getWarehouses();
            getListTypeCylinder();
            getListManufacture();
        },[]
    )
    function handleTime(dateMoment, dateString) {
        // console.log('dateMoment', dateMoment)
        // console.log('dateString', dateString)

        const start = dateMoment[0].startOf('day').toISOString()
        const end = dateMoment[1].endOf('day').toISOString()

        // console.log('dateMoment_startOf', start)
        // console.log('dateString-endOf', end)

        setStartTime(moment(start))
        setEndTime(moment(end))
        setStartDate(start)
        setEndDate(end)
    }
    function handleThisTime() {
        var el = document.getElementsByClassName("btn-history");
        el[0].classList.add("active");
        el[1].classList.remove("active");
        el[2].classList.remove("active");
        el[3].classList.remove("active");

        const now = moment()

        const start = now.startOf('day').toISOString()
        const end = now.endOf('day').toISOString()

        // console.log('dateMoment_startOf', start)
        // console.log('dateString-endOf', end)

        setStartTime(moment(start))
        setEndTime(moment(end))
        setStartDate(start)
        setEndDate(end)
    }
    function handleYesterday() {
        $(".btn-history").each(function (item, index) {
            if (item === 0) {
                $(this).removeClass("active");
            }
            if (item === 1) {
                $(this).addClass("active");
            }
            if (item === 2) {
                $(this).removeClass("active");
            }
            if (item === 3) {
                $(this).removeClass("active");
            }
        });
        const yesterday = moment().subtract(1, "days")

        const start = yesterday.startOf('day').toISOString()
        const end = yesterday.endOf('day').toISOString()

        setStartTime(moment(start))
        setEndTime(moment(end))
        setStartDate(start)
        setEndDate(end)
    }
    function handleThisWeek() {
        $(".btn-history").each(function (item, index) {
            if (item === 0) {
                $(this).removeClass("active");
            }
            if (item === 1) {
                $(this).removeClass("active");
            }
            if (item === 2) {
                $(this).addClass("active");
            }
            if (item === 3) {
                $(this).removeClass("active");
            }
        });

        const now = moment()

        const start = now.startOf("week").toISOString()
        const end = now.endOf("week").toISOString()

        setStartTime(moment(start))
        setEndTime(moment(end))
        setStartDate(start)
        setEndDate(end)
    }

    //Lấy ngày trong tháng
    function handleThisMonth() {
        $(".btn-history").each(function (item, index) {
            if (item === 0) {
                $(this).removeClass("active");
            }
            if (item === 1) {
                $(this).removeClass("active");
            }
            if (item === 2) {
                $(this).removeClass("active");
            }
            if (item === 3) {
                $(this).addClass("active");
            }
        });

        const now = moment()

        const start = now.startOf("month").toISOString()
        const end = now.endOf("month").toISOString()

        setStartTime(moment(start))
        setEndTime(moment(end))
        setStartDate(start)
        setEndDate(end)
    }
    async function getWarehouses() {
        const user_cookies = await getUserCookies();
        const id = user_cookies.user.id;
        let url = SERVERAPI+ 'warehouse/getWarehouseTruck?id=$id'.replace("$id",id); 
        const resultWarehouse = await axios.get(
            url,
            {
                headers: {
                    "Authorization": "Bearer " + user_cookies.token
                }
            }
            
        )
        if (resultWarehouse.status) {
            setWareHouses(resultWarehouse.data.data);
        }
    }
    async function getListTypeCylinder() {
        const user_cookies = await getUserCookies();
        const id = user_cookies.user.id;
        const result = await getTypeCylinder({ id })
        if (result.status) {
            setCylinder(result.data.data);
        }
    };
    async function getStatisticware() {
        if (startDate === "" || endDate === "") {
            alert("Vui lòng chọn ngày")
        } else if (selectedWareHouse === "") {
            alert("Vui lòng chọn kho")
        } 
        else {
            // const resultStatisticWare = await getStatisticWare({ target: selectedWareHouse, startDate, endDate, statisticalType: 'byItself' })
            let url = SERVERAPI + 'statistic/getWarehouseTruckStatistics?target=$target&startDate=$startDate&endDate=$endDate&statisticalType=$statisticalType'
            .replace("$startDate", startDate)
            .replace("$endDate", endDate)
            .replace("$statisticalType", statisticalType)
            .replace("$target", selectedWareHouse)
            var user_cookies = await getUserCookies();
            // let url = 'http://14.161.1.28:1342/statistic/getWarehouseTruckStatistics?target=6174d15021321903106f38e7&startDate=2021-10-22T17:00:00.000Z&endDate=2021-10-25T16:59:59.999Z&statisticalType=$statisticalType';
            const resultStatisticWare = await axios.get(
            url,
            {
                headers: {
                    "Authorization": "Bearer " + user_cookies.token
                }
            }
            
        )
            // console.log('data',resultStatisticWare);
            
            // console.log("data",resultStatisticWare);
            if (resultStatisticWare.status) {
                // console.log("data ne", resultStatisticWare);
                const newList = {...listStatictis};
                newList.turnbackCylinderFromCustomer.cylinderTypes = groupByManufacture(resultStatisticWare.data.data.turnbackCylinderFromCustomer.cylinderTypes,'manufactureId');
                newList.exportCylinderFromTruck.cylinderTypes = groupByManufacture(resultStatisticWare.data.data.exportCylinderFromTruck.cylinderTypes,'manufactureId');
                setListStatictis(newList);
            }
            let limit = 10;
            let urlHistory = SERVERAPI + 'statistic/turnbackByTruck?target=$target&startDate=$startDate&endDate=$endDate&statisticalType=byItself&page=$page&limit=$limit'
            .replace('$target',selectedWareHouse)
            .replace('$startDate',startDate)
            .replace('$endDate',endDate)
            .replace('$page',currentPageTurnbackHistory)
            .replace('$limit',limit)
            const history = await axios.get(
                urlHistory,
                {
                    headers: {
                        "Authorization": "Bearer " + user_cookies.token
                    }
                }
            )
            // console.log("history",history);
            if (history.status) {
                setHistory(history.data.data);
            }
            let urlHistoryExport = SERVERAPI + 'statistic/exportByTruck?target=$target&startDate=$startDate&endDate=$endDate&statisticalType=byItself&page=$page&limit=$limit'
            .replace('$target',selectedWareHouse)
            .replace('$startDate',startDate)
            .replace('$endDate',endDate)
            .replace('$page',currentPageExportHistory)
            .replace('$limit',limit)
            const historyExport = await axios.get(
                urlHistoryExport,
                {
                    headers: {
                        "Authorization": "Bearer " + user_cookies.token
                    }
                }
            )
            // console.log("history",history);
            if (historyExport.status) {
                setHistoryExport(historyExport.data.data);
            }
        }
    };
    function groupByManufacture(xs, key) {
        return xs.reduce((rv, x) => {
          let v = x[key];
          // console.log('v: ', v)
          // console.log('rv: ', rv)
          let elIndex = rv.findIndex((r) => { /* console.log('r.. ', r[key], key, r); */ return r && r[key] === v });
          // console.log('elIndex: ', elIndex)
          if (elIndex >= 0) {
            rv[elIndex][x.code] = x.number
            // el.values.push(x);
          } else {
            rv.push({
              key: rv.length,
              manufactureName: x.manufactureName,
              manufactureId: x.manufactureId,
              [x.code]: x.number
            });
            //rv.push(x)
          }
          return rv;
        }, [])
      }
    const getCurrentDateTime = (datetime) => {
        let formatDate = new Date(datetime).toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
        // return formatDate.getDate() + "/" + formatDate.getMonth() + "/" + formatDate.getFullYear() + " " +  formatDate.getUTCHours() + ":" + formatDate.getMinutes();    
        return formatDate;
    }  
    const renderCylinderNumber = (manufacture, cylinders, cylinderType,sum) => {
        for(let i = 0; i < cylinders.length; i++){
            if(cylinders[i].idCylinderType === cylinderType.id && cylinders[i].nameManufacture === manufacture.name)
            {
                sum.value += cylinders[i].number;
                return cylinders[i].number;
            }
        }
        return 0;
    }
    // const renderCylinderNumberWithDiffManu = (cylinders, cylinderType,sum) => {
    //     let count = 0;
    //     for(let i = 0; i < cylinders.length; i++){
    //         if(cylinders[i].idCylinderType === cylinderType.id && cylinders[i].nameManufacture !== "Xuân Nghiêm Gas")
    //         {
    //             count += cylinders[i].number;
    //         }
    //     }
    //     sum.value += count;
    //     return count;
    // }
    const getListManufacture = async () => {
        const user_cookies = await getUserCookies();
        let getListManu = await axios.post(GETLISTMANUFACTURE,{
            "isChildOf": user_cookies.user.isChildOf
        },{
            headers: {
                "Authorization": "Bearer " + user_cookies.token
        }})
        setListManufacture(getListManu.data.data);
    }
    const downloadExcelTurnbackTruck = async (historyId) => {
        const user_cookies = await getUserCookies();
        let url = SERVERAPI + 'report/getTurnbackTruckExcels?historyId=$historyId'
            .replace('$historyId',historyId)
            const report = await axios.get(
                url,
                {
                    headers: {
                        "Authorization": "Bearer " + user_cookies.token
                    },
                    responseType:'arraybuffer'
                    
                }
            )
            if (report.status) {
                    const url = window.URL.createObjectURL(new Blob([report.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    let filename = `Danh_sach_hoi_luu_${historyId}_.xlsx`;
                    link.setAttribute('download', filename); //or any other extension
                    document.body.appendChild(link);
                    link.click();
            }
    }
    const downloadExcelExport = async (historyId) => {
        const user_cookies = await getUserCookies();
        let url = SERVERAPI + 'report/getExportTruckExcels?historyId=$historyId'
            .replace('$historyId',historyId)
            const report = await axios.get(
                url,
                {
                    headers: {
                        "Authorization": "Bearer " + user_cookies.token
                    },
                    responseType:'arraybuffer'
                    
                }
            )
            if (report.status) {
                    const url = window.URL.createObjectURL(new Blob([report.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    let filename = `Danh_sach_xuat_hang_${historyId}_.xlsx`;
                    link.setAttribute('download', filename); //or any other extension
                    document.body.appendChild(link);
                    link.click();
            }
    }
    const handleChangePaginationInTurnbackHistory = async (page,pageSize) => {
        setCurrentPageTurnbackHistory(page);
        const user_cookies = await getUserCookies();
        let urlHistory = SERVERAPI + 'statistic/turnbackByTruck?target=$target&startDate=$startDate&endDate=$endDate&statisticalType=byItself&page=$page&limit=$limit'
            .replace('$target',selectedWareHouse)
            .replace('$startDate',startDate)
            .replace('$endDate',endDate)
            .replace('$page',page)
            .replace('$limit',10)
        const history = await axios.get(
                urlHistory,
                {
                    headers: {
                        "Authorization": "Bearer " + user_cookies.token
                    }
                }
            )
        if (history.status) {
            setHistory(history.data.data);
            }
    }
    const handleChangePaginationInExportHistory = async (page,pageSize) => {
        setCurrentPageExportHistory(page);
        const user_cookies = await getUserCookies();
        let urlExportHistory = SERVERAPI + 'statistic/exportByTruck?target=$target&startDate=$startDate&endDate=$endDate&statisticalType=byItself&page=$page&limit=$limit'
            .replace('$target',selectedWareHouse)
            .replace('$startDate',startDate)
            .replace('$endDate',endDate)
            .replace('$page',page)
            .replace('$limit',10)
        const history = await axios.get(
                urlExportHistory,
                {
                    headers: {
                        "Authorization": "Bearer " + user_cookies.token
                    }
                }
            )
        if (history.status) {
                setHistoryExport(history.data.data);
            }
    }
        return (
        <div className="section-statistical" style={{ minHeight: "90vh" }}>
            <div className="section-statistical__report">
                <h1>BÁO CÁO KHO XE</h1>
                <div className="section-statistical__report__title">
                    <div className="container-fluid">
                    <div className="row border rouded">
                            <div className="col-12 d-flex mt-3">
                                <h2>Thời gian</h2>
                                <button className="btn-history active" onClick={handleThisTime}>
                                    Hôm nay
                                </button>
                                <button className="btn-history" onClick={handleYesterday}>
                                    Hôm qua
                                </button>
                                <button className="btn-history" onClick={handleThisWeek}>
                                    Tuần này
                                </button>
                                <button className="btn-history" onClick={handleThisMonth}>
                                    Tháng này
                                </button>
                                <div className="RangePicker--custom">
                                    <RangePicker value={[startTime, endTime]} format={"DD/MM/YYYY"} onChange={handleTime} />
                                </div>
                            </div>
                            <div className="col-12 d-flex my-5" style={{justifyContent: 'space-between'}}>
                                    <button className="btn-see-report" onClick={() => getStatisticware()}>
                                        Xem báo cáo
                                    </button>
                                    <div>
                                        <h2 className="d-inline-block">Kho: </h2>
                                        <select value={selectedWareHouse} onChange={(e) => setSelectedWareHouse(e.target.value)} style={{display:'inline-block',width:'200px',height:'20px'}}>
                                            <option value="Chọn" >Chọn</option>
                                            { wareHouses.map(wareHouse => <option key={wareHouse.id} value={wareHouse.id}>{wareHouse.name}</option>)}
                                        </select>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div>
                {/* <div className="row mx-1">
                    <div className="col-6">
                        <table class="table table-bordered">
                            <thead class="thead-light">
                                <tr>
                                    <th scope="col" colSpan="5" style={{ textAlign: "center" }}>SỐ BÌNH GAS ĐÃ NẠP</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td></td>
                                    <td>Bình 12</td>
                                    <td>Bình 30</td>
                                    <td>Bình 45</td>
                                    <th scope="col" style={{ fontWeight: "700" }}>Tổng</th>
                                </tr>
                                <tr>
                                    <td>Gas Xuân Nghiêm</td>
                                    <td>10</td>
                                    <td>20</td>
                                    <td>40</td>
                                    <th scope="col" style={{ fontWeight: "700" }}>70</th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="col-6">
                        <table class="table table-bordered">
                            <thead class="thead-light">
                                <tr>
                                    <th scope="col" colSpan="5" style={{ textAlign: "center" }}>SỐ BÌNH ĐÃ BÁN</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td></td>
                                    <td>Bình 12</td>
                                    <td>Bình 30</td>
                                    <td>Bình 45</td>
                                    <th scope="col" style={{ fontWeight: "700" }}>Tổng</th>
                                </tr>
                                <tr>
                                    <td>Gas Xuân Nghiêm</td>
                                    <td>10</td>
                                    <td>20</td>
                                    <td>40</td>
                                    <th scope="col" style={{ fontWeight: "700" }}>70</th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div> */}
                <div className="row mx-1" style={{overflow:'scroll'}}>
                <div className="col-6">
                        <table class="table table-bordered" style={{width:'100%',marginLeft:'auto',marginRight:'auto'}}>
                            <thead class="thead-light">
                                <tr>
                                    <th scope="col" colSpan={2 + cylinder.length} style={{ textAlign: "center" }}>SỐ VỎ HỒI LƯU TỪ KHÁCH HÀNG VỀ XE TẢI</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Thương hiệu</td>
                                    {
                                    cylinder.map((item, index) => {
                                        return <td key={index}>{item.name}</td>
                                    })
                                    }
                                    {/* <td>Bình 12</td>
                                    <td>Bình 30</td>
                                    <td>Bình 45</td> */}
                                    <th scope="col" style={{ fontWeight: "700" }}>Tổng</th>
                                </tr>
                                {/* <tr>
                                    <td>Gas Xuân Nghiêm</td>
                                    <td>10</td>
                                    <td>20</td>
                                    <td>40</td>
                                    <th scope="col" style={{ fontWeight: "700" }}>70</th>
                                </tr> */}
                                {listStatictis.turnbackCylinderFromCustomer.cylinderTypes.map((item, index) => {
                                    let Sum = 0;
                                    // Sum = Sum + item.number;
                                    return <tr key={index}>
                                        <td>{item.manufactureName}</td>
                                        {/* <td>{item.number}</td> */}
                                        {cylinder.map(cylinder => {
                                            Sum += item[cylinder.code];
                                            return <td>{item[cylinder.code]}</td>
                                        })}
                                        <th scope="col" style={{ fontWeight: "700" }}>{Sum}</th>
                                    </tr>
                                })} 
                            </tbody>
                        </table>
                    </div>
                    <div className="col-6">
                        <table class="table table-bordered" style={{width:'100%',marginLeft:'auto',marginRight:'auto'}}>
                            <thead class="thead-light">
                                <tr>
                                    <th scope="col" colSpan={2 + cylinder.length} style={{ textAlign: "center" }}>THỐNG KÊ XUẤT HÀNG</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Thương hiệu</td>
                                    {
                                    cylinder.map((item, index) => {
                                        return <td key={index}>{item.name}</td>
                                    })
                                    }
                                    <th scope="col" style={{ fontWeight: "700" }}>Tổng</th>
                                </tr>
                                {listStatictis.exportCylinderFromTruck.cylinderTypes.map((item, index) => {
                                    let Sum = 0;
                                    return <tr key={index}>
                                        <td>{item.manufactureName}</td>
                                        {cylinder.map(cylinder => {
                                            Sum += item[cylinder.code];
                                            return <td>{item[cylinder.code]}</td>
                                        })}
                                        <th scope="col" style={{ fontWeight: "700" }}>{Sum}</th>
                                    </tr>
                                })} 
                            </tbody>
                        </table>
                    </div>
                    </div>
                    {/* change table */}
                    <div className="row mx-1">
                    <div className="col-6">
                        <table class="table table-bordered" style={{width:'100%',marginLeft:'auto',marginRight:'auto'}}>
                            <thead class="thead-light">
                                <tr>
                                    <th scope="col" colSpan={5} style={{ textAlign: "center" }}>LỊCH SỬ HỒI LƯU</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>Hồi lưu từ</th>
                                    <th>Xe</th>
                                    <th>Ngày giờ</th>
                                    <th>Số lượng</th>
                                    <th style={{ fontWeight: "700" }}>Tải excel</th>
                                </tr>
                                {history.map(item => 
                                <tr key={item.id}>
                                    <td>{item.from}</td>
                                    <td>{item.truck}</td>
                                    <td>{getCurrentDateTime(item.time)}</td>
                                    <td>{item.numberCylinders}</td>
                                    <td style={{cursor:'pointer',fontWeight: "700"}} onClick={() => downloadExcelTurnbackTruck(item.id)}>Tải xuống</td>
                                </tr>)}
                            </tbody>
                        </table>
                        <Pagination current={currentPageTurnbackHistory} total={200} onChange={(page, pageSize)=>handleChangePaginationInTurnbackHistory(page,pageSize)} />
                    </div>
                    <div className="col-6" >
                        <table class="table table-bordered" style={{width:'100%',marginLeft:'auto',marginRight:'auto'}}>
                            <thead class="thead-light">
                                <tr>
                                    <th scope="col" colSpan={5} style={{ textAlign: "center" }}>LỊCH SỬ XUẤT HÀNG</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>Xuất hàng từ</th>
                                    <th>Xe</th>
                                    <th>Ngày giờ</th>
                                    <th>Số lượng</th>
                                    <th style={{ fontWeight: "700" }}>Tải excel</th>
                                </tr>
                                {historyExport.map(item => 
                                <tr key={item.id}>
                                    <td>{item.from}</td>
                                    <td>{item.truck}</td>
                                    <td>{getCurrentDateTime(item.time)}</td>
                                    <td>{item.numberCylinders}</td>
                                    <td style={{cursor:'pointer',fontWeight: "700"}} onClick={() => downloadExcelExport(item.id)}>Tải xuống</td>
                                </tr>)}
                            </tbody>
                        </table>
                        <Pagination current={currentPageExportHistory} total={200} onChange={(page, pageSize)=>handleChangePaginationInExportHistory(page,pageSize)} />
                    </div>
                </div> 
            </div> 

        </div>
    )
}

