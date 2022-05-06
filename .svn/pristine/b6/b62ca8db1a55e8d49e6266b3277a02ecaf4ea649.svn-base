import React, { useEffect, useState } from 'react'
import "./statistical.scss";
import { Button, DatePicker, Select, Table, Typography, Checkbox, Tabs, Modal, Form } from "antd";
import moment from "moment";
import getUserCookies from "getUserCookies";

import getWarehouseType from '../../../../api/getWarehouseType';
import getStatisticWarehouseFull from '../../../../api/getStatisticWarehouseFull';
import getTypeCylinder from '../../../../api/getTypeCylinder';

const { Option } = Select;
const { RangePicker } = DatePicker;
export default function khothanhpham() {
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

    const [cylinder, setCylinder] = useState([]);
    const [warehouse, setWarehouse] = useState([]);
    const [ware, setWare] = useState('');
    const [listStatictis, setListStatictis] = useState({ refillCylinder: { cylinderTypes: [] }, saleCylinder: { cylinderTypes: [] }, inventoryCylinder: { cylinderTypes: [] } });
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

        console.log('dateMoment_startOf', start)
        console.log('dateString-endOf', end)

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
    async function getWarehouse() {
        const user_cookies = await getUserCookies();
        const id = user_cookies.user.id;
        const resultWarehouse = await getWarehouseType({ id, userType: "Warehouse_FULL" })
        if (resultWarehouse.status) {
            setWarehouse(resultWarehouse.data.data);
        }
    }
    async function getStatisticware() {
        if (startDate == "" || endDate == "") {
            alert("Vui lòng chọn ngày")
        } else if (ware == "") {
            alert("Vui lòng chọn kho")
        } else {
            const resultStatisticWare = await getStatisticWarehouseFull({ target: ware, startDate, endDate, statisticalType })
            if (resultStatisticWare.status) {
                // console.log('resultStatisticWare', resultStatisticWare)
                // group 
                const newList = {...listStatictis};
                newList.refillCylinder.cylinderTypes = groupByManufacture(resultStatisticWare.data.data.refillCylinder.cylinderTypes,'manufactureId');
                newList.saleCylinder.cylinderTypes = groupByManufacture(resultStatisticWare.data.data.saleCylinder.cylinderTypes,'manufactureId');
                newList.inventoryCylinder.cylinderTypes = groupByManufacture(resultStatisticWare.data.data.inventoryCylinder.cylinderTypes,'manufactureId');
                setListStatictis(newList);
            }
        }

    }
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
    async function getListTypeCylinder() {
        const user_cookies = await getUserCookies();
        const id = user_cookies.user.id;
        const result = await getTypeCylinder({ id })
        if (result.status) {
            // console.log("loai binh", result.data.data);
            setCylinder(result.data.data);
        }
    };
    function onChange(value) {
        // console.log(`selected ${value}`);
        setWare(value);
    }
    useEffect(() => {
        getWarehouse();
        getListTypeCylinder();

    }, [])
    
    // console.log('listStatictis', listStatictis)

    return (
        <div className="section-statistical" style={{ minHeight: "90vh" }}>
            <div className="section-statistical__report">
                <h1>BÁO CÁO KHO THÀNH PHẨM</h1>
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
                            <div className="col-12 d-flex my-5">
                                <div className="row w-100 px-2" style={{ justifyContent: "space-between", alignItems: "center" }}>

                                    <button className="btn-see-report" onClick={() => { getStatisticware() }}>
                                        Xem báo cáo
                                    </button>

                                    <div className="row" style={{ alignItems: "center" }}>
                                        <h2>Kho:</h2>
                                        <Select
                                            showSearch
                                            style={{ width: 200 }}
                                            placeholder="Chọn"
                                            optionFilterProp="children"
                                            onChange={onChange}
                                        >
                                            {warehouse.map((kho, index) => {
                                                return <Option value={kho.id} key={index}>{kho.name}</Option>
                                            })}


                                        </Select>

                                    </div>


                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div>
                <div className="row mx-1">
                    <div className="col-6">
                        <table class="table table-bordered">
                            <thead class="thead-light">
                                <tr>
                                    <th scope="col" colSpan="5" style={{ textAlign: "center" }}>SỐ BÌNH GAS ĐÃ NẠP</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Thương hiệu</td>
                                    {cylinder.map((item, index) => {
                                        return <td key={index}>{item.name}</td>
                                    })}
                                    <th scope="col" style={{ fontWeight: "700" }}>Tổng</th>
                                </tr>
                                {listStatictis.refillCylinder.cylinderTypes.map((item, index) => {
                                    let Sum = 0;
                                    // Sum = Sum + item.number;
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
                    <div className="col-6">
                        <table class="table table-bordered">
                            <thead class="thead-light">
                                <tr>
                                    <th scope="col" colSpan="5" style={{ textAlign: "center" }}>SỐ BÌNH ĐÃ BÁN</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Thương hiệu</td>
                                    {cylinder.map((item, index) => {
                                        return <td key={index}>{item.name}</td>
                                    })}
                                    <th scope="col" style={{ fontWeight: "700" }}>Tổng</th>
                                </tr>
                                {listStatictis.saleCylinder.cylinderTypes.map((item, index) => {
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
                </div>
                <div className="row mx-1">
                    <div className="col-6">
                        <table class="table table-bordered">
                            <thead class="thead-light">
                                <tr>
                                    <th scope="col" colSpan="5" style={{ textAlign: "center" }}>SỐ BÌNH CÒN LẠI TẠI KHO</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Thương hiệu</td>
                                    {cylinder.map((item, index) => {
                                        return <td key={index}>{item.name}</td>
                                    })}
                                    <th scope="col" style={{ fontWeight: "700" }}>Tổng</th>
                                </tr>
                                {listStatictis.inventoryCylinder.cylinderTypes.map((item, index) => {
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

                </div>
            </div>

        </div>
    )
}

