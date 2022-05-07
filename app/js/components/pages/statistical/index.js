import React, { Component, Fragment, useEffect, useState } from "react";
import { Button, DatePicker, Select, Table, Typography, Checkbox, Tabs, Modal, Form, Pagination } from "antd";
import ReactCustomLoading from "ReactCustomLoading";

import "./statistical.scss";

import moment from "moment";
import getUserCookies from "getUserCookies";

import getAllCylinderTypes from "../../../../api/getAllCylinderTypes";
import getChildUsersByType from "../../../../api/getChildUsersByType";
import getUserStatistic from "../../../../api/getUserStatistic";
import getStatisticWare from "../../../../api/getStatisticware";
import getStatisticWarehouseFull from "../../../../api/getStatisticWarehouseFull";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell, Line, ComposedChart,Label } from "recharts";
import getArea from "../../../../api/getArea";
import callApi from "../../../util/apiCaller";
import { GETTYPECUSTOMER } from "../../../config/config";
import { GETLISTMANUFACTURE } from '../../../config/config';

import { SERVERAPI } from "../../../config/config";
import Axios from "axios";
import showToast from './../../../helpers/showToast';

const { Option } = Select;
const { RangePicker } = DatePicker;


const data = [
  {
    name: "Tháng 1",
    'Bình 12': 1,
    'Bình 30': 5,
    'Bình 45': 3,
  },
  {
    name: "Tháng 2",
    'Bình 12': 3,
    'Bình 30': 9,
    'Bình 45': 2,
  },
  {
    name: "Tháng 3",
    'Bình 12': 2,
    'Bình 30': 8,
    'Bình 45': 1,
  },
  {
    name: "Tháng 4",
    'Bình 12': 7,
    'Bình 30': 3,
    'Bình 45': 1,
  },
  {
    name: "Tháng 5",
    'Bình 12': 8,
    'Bình 30': 4,
    'Bình 45': 1,
  },
  {
    name: "tháng 6",
    'Bình 12': 2,
    'Bình 30': 8,
    'Bình 45': 5,
  },
  {
    name: "Tháng 7",
    'Bình 12': 9,
    'Bình 30': 3,
    'Bình 45': 3,
  },
  {
    name: "Tháng 8",
    'Bình 12': 3,
    'Bình 30': 4,
    'Bình 45': 3,
  },
  {
    name: "Tháng 9",
    'Bình 12': 5,
    'Bình 30': 3,
    'Bình 45': 5,
  },
  {
    name: "Tháng 10",
    'Bình 12': 3,
    'Bình 30': 6,
    'Bình 45': 3,
  },
  {
    name: "Tháng 11",
    'Bình 12': 3,
    'Bình 30': 2,
    'Bình 45': 1,
  },
  {
    name: "Tháng 12",
    'Bình 12': 3,
    'Bình 30': 5,
    'Bình 45': 6,
  }
];

// quarter data
const quarterData = [
    {
      name: "Quý 1",
      'Bình 12': 1,
      'Bình 30': 5,
      'Bình 45': 3,
    },
    {
      name: "Quý 2",
      'Bình 12': 3,
      'Bình 30': 9,
      'Bình 45': 2,
    },
    {
      name: "Quý 3",
      'Bình 12': 2,
      'Bình 30': 8,
      'Bình 45': 1,
    },
    {
      name: "Quý 4",
      'Bình 12': 7,
      'Bình 30': 3,
      'Bình 45': 1,
    }
];


const type_excel_station = [
  {
    name: "Khai báo mới",
    key: "CREATE",
  },
  {
    name: "Xuất vỏ",
    key: "EXPORT_CELL",
  },
  {
    name: "Nhập vỏ",
    key: "IMPORT_CELL",
  },
  {
    name: "Xuất bình",
    key: "EXPORT",
  },
  {
    name: "Hồi lưu",
    key: "TURN_BACK",
  },
];

const type_excel_fixer = [
  {
    name: "Khai báo mới",
    key: "CREATE",
  },
  {
    name: "Xuất vỏ",
    key: "EXPORT_CELL",
  },
  {
    name: "Nhập vỏ",
    key: "IMPORT_CELL",
  },
];

const getStore = [
  {
    id: '61333a52d18211173c89d82d',
    name: 'Kho Vỏ',
    type: 'Warehouse_EMPTY',
  },
  {
    id: '61333a52d18211173c89d82d',
    name: 'Kho Thành Phẩm',
    type: 'Warehouse_FULL',
  },
  {
    id: '61333a52d18211173c89d82d',
    name: 'Kho Xe',
    type: 'Warehouse_TRUCK',
  }
]
function Statistical() {
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
  const [inputTime,setInputTime] = useState("");

  const [waveHouse, setGetWaveHouse] = useState([]); // 
  const [waveHouseTruck, setGetWaveHouseTruck] = useState([]); //

  const [selectedUserTypeStat, setSelectedUserTypeStat] = useState('');
  const [usersByType, setUsersByType] = useState([]);
  const [userStatistic, setUserStatistic] = useState('');

  const [target, setTarget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statisticalType, setStatisticalType] = useState('byItself');

  const [listWareHouse, setListWareHouse] = useState([]);
  const [typeWareHouse, setTypeWareHouse] = useState("");
  const [selectedWareHouse, setSelectedWareHouse] = useState("");
  const [additionalUserStatistic, setAdditionalUserStatistic] = useState({});
  const [historyReturnCylinder,setHistoryReturnCylinder] = useState([]);
  const [historyExport,setHistoryExport] = useState([]);
  const [listUsers, setListUsers] = useState([]);
  const [listUsersGroupByArea, setListUsersGroupByArea] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [customerStatistics, setCustomerStatistics] = useState({});
  const [listManufacture, setListManufacture] = useState([]);

  const [monthDataForChart,setMonthDataForChart] = useState([]);
  const [preciousDataForChart,setPreciousDataForChart]= useState([]);

  const [currentPageTurnbackHistory,setCurrentPageTurnbackHistory] = useState(1);
  const [currentPageExportHistory,setCurrentPageExportHistory] = useState(1);

  const columns_khaibaobinhmoi = [
    {
      title: "SỐ VỎ KHAI BÁO MỚI",
      children: [
        { title: "Thương hiệu", dataIndex: "manufactureName", key: "manufactureId" },
        {
          title: "Loại bình", dataIndex: "cylinderType", key: "cylinderType",
          children: columnCylinderTypes
        },
        // { title: "Số lượng", dataIndex: "number" },
      ],
    },
  ];
  const columns_binhdaxuat = [
    {
      title: "SỐ BÌNH ĐÃ XUẤT",
      children: [
        { title: "Thương hiệu", dataIndex: "manufactureName", key: "manufactureId" },
        {
          title: "Loại bình", dataIndex: "cylinderType", key: "cylinderType",
          children: columnCylinderTypes
        },
        // { title: "Số lượng", dataIndex: "number" },
      ],
    },
  ];
  const columns_binhhoiluu = [
    {
      title: "SỐ BÌNH HỒI LƯU",
      children: [
        { title: "Thương hiệu", dataIndex: "manufactureName", key: "manufactureId" },
        {
          title: "Loại bình", dataIndex: "cylinderType", key: "cylinderType",
          children: columnCylinderTypes
        },
        // { title: "Số lượng", dataIndex: "number" },
      ],
    },
  ];
  const columns_binhtonkho = [
    {
      title: "SỐ BÌNH TỒN KHO",
      children: [
        { title: "Thương hiệu", dataIndex: "manufactureName", key: "manufactureId" },
        {
          title: "Loại bình", dataIndex: "cylinderType", key: "cylinderType",
          children: columnCylinderTypes
        },
        // { title: "Số lượng", dataIndex: "number" },
      ],
    },
  ];

  async function getUser() {
    //Phân quyền
    let user_cookies = await getUserCookies();
    if (user_cookies) {
      setUserType(user_cookies.user.userType);
      setUserRole(user_cookies.user.userRole);
    }
    // // Lấy danh sách chi nhánh
    // if (user_cookies.user.userRole === "SuperAdmin" && user_cookies.user.userType === "Factory") {
    //   let resultBranch = await getAllBranch(user_cookies.user.id);
    //   if (resultBranch.data) {
    //     setBranch(resultBranch.data.data);
    //   }
    // }

    // // Lấy danh sách trạm
    // if (user_cookies.user.userRole === "SuperAdmin" && user_cookies.user.userType === "Region") {
    //   let resultStation = await getAllStation(user_cookies.user.id);
    //   if (resultStation.data) {
    //     setStation(resultStation.data.data);
    //   }
    // }
  }

  async function getCylinderTypes() {
    const user_cookies = await getUserCookies();
    const id = user_cookies.user.id;

    const resultCylinderTypes = await getAllCylinderTypes(id)
    if (resultCylinderTypes.status) {
      setCylinderTypes(resultCylinderTypes.data.data);
    }
  }


  async function handleChangeExcel(value) {
    setTypeExcel(value);
  }

  //Lấy danh sách trạm
  async function handleChangeBranch(value, name) {
    // console.log('handleChangeBranch', value, name)
    // setNameStation("");
    // setNameBranch(name.props.name.name ? name.props.name.name : name.props.name);
    // setUserTypeFixer(name.props.name.userType);
    // setUserRoleFixer(name.props.name.userRole);
    // await setStationDashboard([]);
    // await setListChart([]);
    // await setListQuarterChart([]);
    // await setIdBranch(value);

    // if (value !== "all") {
    //   let resultStation = await getAllStation(value);
    //   if (resultStation.data.success === true) {
    //     setStation(resultStation.data.data);
    //   } else {
    //     setStation([]);
    //   }
    // }
  }

  async function handleChangeStation(value) {
    // console.log('handleChangeBranch', value)
    // if (value === "all") {
    //   await setNameStation("Tất cả");
    //   await setIdStation("all");
    // } else {
    //   await setNameStation(value.name);
    //   await setIdStation(value.id);
    // }

    // await setListChart([]);
    // await setListQuarterChart([]);
    // await setStationDashboard([]);
    // await setIdBranch(null);
  }

  async function handleChangeUserStat(value) {
    // console.log('handleChangeBranch', value)

    // const startDate = '2021-09-01T01:23:44.288Z'
    // const endDate = '2021-09-04T19:23:44.288Z'
    // const statisticalType = 'byItself'

    // const userStatistic = await getUserStatistic({target: value, startDate, endDate, statisticalType})
    // console.log('userStatistic', userStatistic)
    // if (userStatistic.data.status) {
    //   setUserStatistic(userStatistic.data.data);
    // }

    setTarget(value)
  }
  const handleChangeArea = (value) => {
    let usersGroupByArea = listUsers.filter(user => {
      return (user.area&& user.area.id === value);
    });
    setListUsersGroupByArea(usersGroupByArea);
  }
  async function handleGetWareHouse(idWave, type) { ///
    setGetWaveHouse([])
    const user_cookies = await getUserCookies();
    const id = user_cookies.user.id;
    let url = SERVERAPI+ `warehouse/getWarehouse?id=${idWave}&userType=${type}`.replace("$id", id).replace("$userType", type)
    const resultWarehouse = await Axios.get(
        url,
        {
            headers: {
                "Authorization": "Bearer " + user_cookies.token
            }
        }
    )
    // console.log('resultWarehouse:',  resultWarehouse);
    if (resultWarehouse.status) {
      setGetWaveHouse(resultWarehouse.data.data);
    }
}
  async function handleGetWareHouseTruck() { ///
    setGetWaveHouseTruck([])
    const user_cookies = await getUserCookies();
    const id = user_cookies.user.id;
    let url = SERVERAPI+ 'warehouse/getWarehouseTruck?id=$id'.replace("$id",id); 
    const resultWareHouseTruck = await Axios.get(
        url,
        {
            headers: {
                "Authorization": "Bearer " + user_cookies.token
            }
        }
    )
    // console.log('resultWareHouseTruck:',  resultWareHouseTruck);
    if (resultWareHouseTruck.status) {
      setGetWaveHouseTruck(resultWareHouseTruck.data.data);
    }
}
async function getListWareHouseTruck(id) { 
  const user_cookies = await getUserCookies();
  let url = SERVERAPI+ 'warehouse/getWarehouseTruck?id=$id'.replace("$id",id); 
  const resultWareHouseTruck = await Axios.get(
      url,
      {
          headers: {
              "Authorization": "Bearer " + user_cookies.token
          }
      }
  )
  // console.log('resultWareHouseTruck:',  resultWareHouseTruck);
  if (resultWareHouseTruck.status) {
    setListWareHouse(resultWareHouseTruck.data.data);
  }
}
async function getListWareHouseFullOrEmpty(idWareHouse,typeWareHouse) { 
  const user_cookies = await getUserCookies();
  let url = SERVERAPI+ `warehouse/getWarehouse?id=$idWareHouse&userType=$typeWareHouse`.replace("$idWareHouse", idWareHouse).replace("$typeWareHouse", typeWareHouse)
  const resultWarehouse = await Axios.get(
      url,
      {
          headers: {
              "Authorization": "Bearer " + user_cookies.token
          }
      }
  )
  // console.log('resultWarehouse:',  resultWarehouse);
  if (resultWarehouse.status) {
    setListWareHouse(resultWarehouse.data.data);
  }
}
  async function handleChangeType(value) {
    setUsersByType([])
    const user_cookies = await getUserCookies();
    let id = user_cookies.user.id;
    if(userRole === "Business" && userType === "Factory"){
    id = user_cookies.user.parentRoot;
  }
    setSelectedUserTypeStat(value)
    let childUsers;
    if(value === "warehouse"){
      childUsers = await getChildUsersByType(id, value);
    }
    else {
      childUsers = await getArea('');
      await getCustomerByType(id,user_cookies.token,value);
    }
    // console.log('childUsers', childUsers)
    if (childUsers.data.success) {
      setUsersByType(childUsers.data.data);
    }
  }

  const getCustomerByType = async (id, token, type) => {
    let reqListCustomer = {
        isChildOf: id,
        customerType: type
    };
    let params = {
        reqListCustomer
    };
    await Axios({method: "POST", url: GETTYPECUSTOMER, data: params, headers: {'Authorization':"Bearer " + token}}).then(res => {
        if (res.data) {
            if (res.data.success === true) {
                setListUsers(res.data.data);
            }
            else {
                showToast(
                    res.data.message
                        ? res.data.message
                        : res.data.err_msg,
                    2000
                );
                return false;
            }
        }
        else {
            showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
        }
    });
}
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

  async function handleSeeDashboard() {
    if((selectedWareHouse === ""  && selectedCustomer === "") || startDate === "" || endDate === ""){
      showToast("Vui lòng chọn đầy đủ thông tin");
      return
    }
    setLoading(true)
    // const startDate = '2021-09-01T01:23:44.288Z'
    // const endDate = '2021-09-04T19:23:44.288Z'
    // const statisticalType = 'byItself'
    // handle customer statistic
    if(selectedCustomer !== "" && selectedWareHouse === ""){
      await getCustomerStatistics();
      return;
    }
    // handle warehouse statistic
    if(typeWareHouse === "Warehouse_EMPTY"){
      const resultStatisticWare = await getStatisticWare({ target: selectedWareHouse, startDate, endDate, statisticalType });
      resultStatisticWare.data.data.createdCylinder.cylinderTypes = groupByManufacture(resultStatisticWare.data.data.createdCylinder.cylinderTypes,'manufactureId');
      resultStatisticWare.data.data.inventoryCylinder.cylinderTypes = groupByManufacture(resultStatisticWare.data.data.inventoryCylinder.cylinderTypes,'manufactureId');
      resultStatisticWare.data.data.turnbackCylinderFromTruck.cylinderTypes = groupByManufacture(resultStatisticWare.data.data.turnbackCylinderFromTruck.cylinderTypes,'manufactureId');
      setAdditionalUserStatistic(resultStatisticWare.data.data);
    }
    else if(typeWareHouse === "Warehouse_FULL"){
      const resultStatisticWare = await getStatisticWarehouseFull({ target: selectedWareHouse, startDate, endDate, statisticalType });
      resultStatisticWare.data.data.refillCylinder.cylinderTypes = groupByManufacture(resultStatisticWare.data.data.refillCylinder.cylinderTypes,'manufactureId');
      resultStatisticWare.data.data.saleCylinder.cylinderTypes = groupByManufacture(resultStatisticWare.data.data.saleCylinder.cylinderTypes,'manufactureId');
      resultStatisticWare.data.data.inventoryCylinder.cylinderTypes = groupByManufacture(resultStatisticWare.data.data.inventoryCylinder.cylinderTypes,'manufactureId');
      setAdditionalUserStatistic(resultStatisticWare.data.data);
      // get data for chart
      getMonthDataForChart();
      getPreciousDataForChart();
    }
    else if(typeWareHouse === "Warehouse_TRUCK"){
      await getWarehouseTruckStatistics({ target: selectedWareHouse, startDate, endDate, statisticalType });
    }
    const userStatistic = await getUserStatistic({ target, startDate, endDate, statisticalType })
    // console.log('userStatistic', userStatistic)
    if (userStatistic.data.status) {
      setUserStatistic(userStatistic.data.data);
    } else {
      setLoading(false)
    }
  }
  const getCustomerStatistics = async () => {
    let url = SERVERAPI + 'statistic/geCustomerStatistics?target=$target&startDate=$startDate&endDate=$endDate&statisticalType=$statisticalType'
    .replace("$startDate", startDate)
    .replace("$endDate", endDate)
    .replace("$statisticalType", statisticalType)
    .replace("$target", selectedCustomer)
    var user_cookies = await getUserCookies();
    const resultStatisticCustomer = await Axios.get(
    url,
    {
    headers: {
    "Authorization": "Bearer " + user_cookies.token
    }
    }
          
    )
    if (resultStatisticCustomer.status) {
      setLoading(false);
      setCustomerStatistics(resultStatisticCustomer.data.data);
  }
  }
  const getWarehouseTruckStatistics = async ({target: selectedWareHouse,startDate,endDate,statisticalType}) => {
    let url = SERVERAPI + 'statistic/getWarehouseTruckStatistics?target=$target&startDate=$startDate&endDate=$endDate&statisticalType=$statisticalType'
          .replace("$startDate", startDate)
          .replace("$endDate", endDate)
          .replace("$statisticalType", statisticalType)
          .replace("$target", selectedWareHouse)
    var user_cookies = await getUserCookies();
    const resultStatisticWare = await Axios.get(
    url,
    {
    headers: {
    "Authorization": "Bearer " + user_cookies.token
    }
    }
          
    )
    if (resultStatisticWare.status) {

        resultStatisticWare.data.data.turnbackCylinderFromCustomer.cylinderTypes = groupByManufacture(resultStatisticWare.data.data.turnbackCylinderFromCustomer.cylinderTypes,'manufactureId');
        resultStatisticWare.data.data.exportCylinderFromTruck.cylinderTypes = groupByManufacture(resultStatisticWare.data.data.exportCylinderFromTruck.cylinderTypes,'manufactureId');
        setAdditionalUserStatistic(resultStatisticWare.data.data);
    }
    let limit = 10;
    let urlHistory = SERVERAPI + 'statistic/turnbackByTruck?target=$target&startDate=$startDate&endDate=$endDate&statisticalType=byItself&page=$page&limit=$limit'
            .replace('$target',selectedWareHouse)
            .replace('$target',selectedWareHouse)
            .replace('$startDate',startDate)
            .replace('$endDate',endDate)
            .replace('$page',currentPageTurnbackHistory)
            .replace('$limit',limit);
            const history = await Axios.get(
                urlHistory,
                {
                    headers: {
                        "Authorization": "Bearer " + user_cookies.token
                    }
                }
            )
            if (history.status) {
                setHistoryReturnCylinder(history.data.data);
            }
            let urlHistoryExport = SERVERAPI + 'statistic/exportByTruck?target=$target&startDate=$startDate&endDate=$endDate&statisticalType=byItself&page=$page&limit=$limit'
                        .replace('$target',selectedWareHouse)
                        .replace('$startDate',startDate)
                        .replace('$endDate',endDate)
                        .replace('page',currentPageExportHistory)
                        .replace('$limit',limit)
                        const historyExport = await Axios.get(
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
  // Nhóm lại theo thương hiệu
  // groupByManufacture
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

  useEffect(() => {
    getUser();
  }, [setUserRole, setUserType, setBranch, setStation]);

  useEffect(() => {
    getCylinderTypes();
    getListManufacture();
  }, [])

  useEffect(() => {
    if (cylinderTypes.length > 0) {
      const data = []
      for (let i = 0; i < cylinderTypes.length; i++) {
        data.push({
          title: cylinderTypes[i].name,
          // title: cylinderTypes[i].code,
          dataIndex: cylinderTypes[i].code,
          key: cylinderTypes[i].code,
        });
      }
      setColumnCylinderTypes(data)
    }
  }, [cylinderTypes])

  useEffect(() => {
    if (userStatistic) {
      // Thay đổi dữ liệu cho phù hợp columns_khaibaobinhmoi
      // const createdCylinder = userStatistic.createdCylinder.cylinderTypes.map((cylStat, index) => {
      //   return {
      //     key: index,
      //     manufacture: cylStat.manufactureName,
      //     [cylStat.code]: cylStat.number
      //   }
      // })      
      const group_createdCylinder = groupByManufacture(userStatistic.createdCylinder.cylinderTypes, 'manufactureId')
      // console.log('group_createdCylinder: ', group_createdCylinder)
      setCreatedCylinder(group_createdCylinder)

      // // Thay đổi dữ liệu cho phù hợp columns_binhdaxuat
      // const exportedCylinder = userStatistic.exportCylinder.cylinderTypes.map((cylStat, index) => {
      //   return {
      //     key: index,
      //     manufacture: cylStat.manufactureName,
      //     [cylStat.code]: cylStat.number
      //   }
      // })
      const group_exportedCylinder = groupByManufacture(userStatistic.exportCylinder.cylinderTypes, 'manufactureId')
      setExportedCylinder(group_exportedCylinder)

      // // Thay đổi dữ liệu cho phù hợp columns_binhhoiluu
      // const turnbackCylinder = userStatistic.turnbackCylinder.cylinderTypes.map((cylStat, index) => {
      //   return {
      //     key: index,
      //     manufacture: cylStat.manufactureName,
      //     [cylStat.code]: cylStat.number
      //   }
      // })
      const group_turnbackCylinder = groupByManufacture(userStatistic.turnbackCylinder.cylinderTypes, 'manufactureId')
      setTurnbackCylinder(group_turnbackCylinder)

      // // Thay đổi dữ liệu cho phù hợp columns_binhtonkho
      // const inventoryCylinder = userStatistic.inventoryCylinder.cylinderTypes.map((cylStat, index) => {
      //   return {
      //     key: index,
      //     manufacture: cylStat.manufactureName,
      //     [cylStat.code]: cylStat.number
      //   }
      // })
      const groupi_inventoryCylinder = groupByManufacture(userStatistic.inventoryCylinder.cylinderTypes, 'manufactureId')
      setInventoryCylinder(groupi_inventoryCylinder)
    }
    setLoading(false)
  }, [userStatistic])

  const getMonthDataForChart = async () => {
    let url = SERVERAPI + 'statistic/getExportChart?target=$target&statisticalType=$statisticalType&dataType=month&startDate=$startDate&endDate=$endDate'
      .replace("$startDate", startDate)
      .replace("$endDate", endDate)
      .replace("$statisticalType", statisticalType)
      .replace("$target", selectedWareHouse);
    let user_cookies = await getUserCookies();
    // console.log("result123",user_cookies);
    let result = await Axios.get(
      url,
      {
          headers: {
              "Authorization": "Bearer " + user_cookies.token
          }
      }
  )
    // console.log("test006",result.data.data)
    if(result.status === 200){
      let formartData = [];
      let tempMonth = {};
      for(let i = 0; i < result.data.data.length;i++){
        tempMonth = {};
        tempMonth.name = result.data.data[i].month + "/" + result.data.data[i].year;
        for(let j = 0; j < result.data.data[i].detail.length; j++){
           tempMonth[result.data.data[i].detail[j].name] = result.data.data[i].detail[j].statistic.numberExport;
        }
        formartData.push(tempMonth);
      }
      setMonthDataForChart(formartData);
      console.log("day la data thang",formartData)
    }
  }
//lay data theo qui
const getPreciousDataForChart = async () => {
  let url = SERVERAPI + 'statistic/getExportChart?target=$target&statisticalType=$statisticalType&dataType=quarter&startDate=$startDate&endDate=$endDate'
    .replace("$startDate", startDate)
    .replace("$endDate", endDate)
    .replace("$statisticalType", statisticalType)
    .replace("$target", selectedWareHouse);
  let user_cookies = await getUserCookies();
  // console.log("result123",user_cookies);
  let result = await Axios.get(
    url,
    {
        headers: {
            "Authorization": "Bearer " + user_cookies.token
        }
    }
)
  // console.log("test006",result.data.data)
  if(result.status === 200){
    let formartData = [];
    let tempQuarter = {};
    for(let i = 0; i < result.data.data.length;i++){
      tempQuarter = {};
      tempQuarter.name ="Quý "+ result.data.data[i].quarter + "/" + result.data.data[i].year;
      for(let j = 0; j < result.data.data[i].detail.length; j++){
        tempQuarter[result.data.data[i].detail[j].name] = result.data.data[i].detail[j].statistic.numberExport;
      }
      formartData.push(tempQuarter);
    }
    setPreciousDataForChart(formartData);
    // console.log("day la data quy ",formartData)
  }
}
  // Lấy ngày hiện tại
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

  // Lấy ngày hôm qua
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

  //Lấy ngày trong tuần
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
const handleThisYear=(year)=>{
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
        $(this).removeClass("active");
      }
    });

  const now = moment(year)
    
    const start = now.startOf("year").toISOString()
    const end = now.endOf("year").toISOString()

    setStartTime(moment(start))
    setEndTime(moment(end))
    setStartDate(start)
    setEndDate(end)
}
  const handleButtonListExcel = async () => {
    let user_cookies = await getUserCookies();
    let id = user_cookies.user.id;
    // await getListDriverExcelAPI(id);
  }

  const handleSelectTypeWareHouse = (value) => {
    if(value === "Warehouse_EMPTY"){
      getListWareHouseFullOrEmpty(target,"Warehouse_EMPTY");
      
    }
    else if(value === "Warehouse_FULL"){
      getListWareHouseFullOrEmpty(target,"Warehouse_FULL");
    }
    else if(value === "Warehouse_TRUCK"){
      getListWareHouseTruck(target);
    }
    setTypeWareHouse(value);
  }

  const handleSelectWareHouse = (value) => { 
    setSelectedWareHouse(value);
  }
  const handleSelectCustomer = (value) => { 
    setSelectedWareHouse('');
    setSelectedCustomer(value);
  }
  const getCurrentDateTime = (datetime) => {
    let formatDate = new Date(datetime).toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
            // return formatDate.getDate() + "/" + formatDate.getMonth() + "/" + formatDate.getFullYear() + " " +  formatDate.getUTCHours() + ":" + formatDate.getMinutes();    
    return formatDate;
  }  
  // const renderCylinderNumber = (cylinders, cylinderType) => {
  //     for(let i = 0; i < cylinders.length; i++){
  //         if(cylinders[i].nameCylinderType === cylinderType.title)
  //         return cylinders[i].number;
  //     }
  // }
  const renderCylinderNumber = (manufacture, cylinders, cylinderType,sum) => {
    for(let i = 0; i < cylinders.length; i++){
        if(cylinders[i].nameCylinderType === cylinderType.title && cylinders[i].nameManufacture === manufacture.name)
        {
            sum.value += cylinders[i].number;
            return cylinders[i].number;
        }
    }
    return 0;
}
  const renderCustomerStatistics = (label,listCylinders,total) => {
    // let sumOfXn = 0, sumOfOthers = 0;
    // for(let i = 0; i < listCylinders.length; i++){
    //   if(listCylinders[i].manufactureName === "Xuân Nghiêm Gas")
    //     sumOfXn += listCylinders[i].number;
    //   else 
    //     sumOfOthers += listCylinders[i].number;
    // }
    let sum = {value: 0};
    return (
    <React.Fragment>
      <td className="text-center">{label}</td>
      {listManufacture.map(manufacture => <td key={manufacture.id} className="text-center">{calculateNumber(manufacture.id,listCylinders,sum)}</td>)}
      {/* <td className="text-center">{sumOfXn}</td>
      <td className="text-center">{sumOfOthers}</td>
      <td className="text-center">{sumOfXn+sumOfOthers}</td> */}
      <td className="text-center">{sum.value}</td>
    </React.Fragment>
    )
  }
  const calculateNumber = (manufactureId, listCylinders, sum) => {
    let count = 0;
    for(let i = 0; i < listCylinders.length; i++){
      if(listCylinders[i].manufactureId === manufactureId)
      count += listCylinders[i].number;
    }
    sum.value += count;
    return count;
  }
  const getListManufacture = async () => {
            let url = SERVERAPI + 'manufactures';
            const user_cookies = await getUserCookies();
            // let getListManu = await Axios.get(GETLISTMANUFACTURE,{
            //     "isChildOf": user_cookies.user.isChildOf
            // },{
            //     headers: {
            //         "Authorization": "Bearer " + user_cookies.token
            // }})
            let getListManu = await Axios.get(url,{
                   headers: {
                       "Authorization": "Bearer " + user_cookies.token
            }})
            // console.log("listManu",getListManu);
            setListManufacture(getListManu.data.data);
         }
  const getRandomColor = () => {
              var letters = '0123456789ABCDEF'.split('');
              var color = '#';
              for (var j = 0; j < 6; j ++) {
                  color += letters[Math.floor(Math.random() * 16)];
              }
          return color;
  }
  const downloadExcelTurnbackTruck = async (historyId) => {
    const user_cookies = await getUserCookies();
    let url = SERVERAPI + 'report/getTurnbackTruckExcels?historyId=$historyId'
        .replace('$historyId',historyId)
        const report = await Axios.get(
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
        const report = await Axios.get(
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
          const history = await Axios.get(
                  urlHistory,
                  {
                      headers: {
                          "Authorization": "Bearer " + user_cookies.token
                      }
                  }
              )
          if (history.status) {
            setHistoryReturnCylinder(history.data.data);
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
          const history = await Axios.get(
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
    <div className="section-statistical" id="statistical">
      <ReactCustomLoading isLoading={loading} />
      <div className="section-statistical__report">
        <h1>BÁO CÁO THỐNG KÊ</h1>

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
                <button className="btn-history pr-2" onClick={handleThisMonth}>
                  Tháng này
                </button>
                <div className="RangePicker--custom">
                  <RangePicker value={[startTime, endTime]} format={"DD/MM/YYYY"} onChange={handleTime} />
                </div>
              </div>
              <div className="col-12 d-flex my-5">
                {/* <h5>Kiểu xuất excel</h5>
                <div className="select--custom">
                  <Select placeholder="Chọn" style={{ width: 120 }} onChange={handleChangeExcel}>
                    {(userRole === "SuperAdmin" && userType === "Fixer") ||
                      (userRoleFixer === "SuperAdmin" && userTypeFixer === "Fixer")
                      ? type_excel_fixer.map((value, index) => {
                        return (
                          <Option key={index} value={value.key}>
                            {value.name}
                          </Option>
                        );
                      })
                      :
                      type_excel_station.map((value, index) => {
                        return (
                          <Option key={index} value={value.key}>
                            {value.name}
                          </Option>
                        );
                      })
                    }
                  </Select>
                </div> */}
                {(userRole === "SuperAdmin" || userRole === "Business")&& userType === "Factory" ? (
                  <div className="d-flex mx-4">
                    <h5>Đối tượng</h5>
                    <div className="select--custom">
                      <Select placeholder="Chọn" style={{ minWidth: 150 }} onChange={(value, name) => handleChangeType(value, name)}>
                        <Option value="all" name="all">
                          <b>---Chọn---</b>
                        </Option>
                        <Option value="warehouse">
                          <b>Kho</b>
                        </Option>
                        <Option value="Distribution_Agency">
                          <b>Nhà phân phối</b>
                        </Option>
                        <Option value="Level_2_Agency">
                          <b>Đại lý cấp 2</b>
                        </Option>
                        <Option value="Level_1_Agency">
                          <b>Cửa hàng cấp 1</b>
                        </Option>
                        <Option value="Industry">
                          <b>Bộ phận công nghiệp</b>
                        </Option>
                      </Select>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                
                {usersByType.length !== 0 ? (
                  <div className="d-flex">
                    <h5>{selectedUserTypeStat === "warehouse" ? 'Kho':'KV'}</h5>
                    <div className="select--custom">
                      <Select showSearch  style={{ minWidth: 150 }} onChange={selectedUserTypeStat === "warehouse"?handleChangeUserStat:handleChangeArea}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        // console.log("log thu",option.props.children.toLowerCase())
                      }
                      filterSort={(optionA, optionB) =>
                        optionA.props.children
                          .toLowerCase()
                          .localeCompare(optionB.props.children.toLowerCase())
                      }>
                        {/* {userType === "Region" && userRole === "SuperAdmin" ? (
                          <Option value="all" name="all">
                            <b>Tất cả</b>
                          </Option>
                        ) : (
                          ""
                        )} */}
                        {usersByType
                          ? usersByType.map((value, index) => {
                            return (
                              <Option key={index} value={value.id}>
                                {value.name}
                              </Option>
                            );
                          })
                          : ""}
                      </Select>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {/* warehouse */}
                {usersByType.length !== 0 ? (
                  <div className="d-flex">
                    <h5>{selectedUserTypeStat === "warehouse" ?'Loại':'Chọn'}</h5>
                    {/* warehouse */}
                    {selectedUserTypeStat === "warehouse" && <div className="select--custom">
                    <Select showSearch placeholder="Chọn" style={{ minWidth: 150 }} onChange={handleSelectTypeWareHouse}>
                            { getStore.map((res, index) => { 
                                return (
                                  <Option key={index} value={res.type}>
                                    <b>{res.name}</b>
                                  </Option>
                                );        
                            })
                            }
                    </Select>
                    </div>}
                    <div className="select--custom">
                    <Select
                    optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.props.children.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              // console.log("Log thu tiep",option.props.children.props.children)
                            }
                            filterSort={(optionA, optionB) =>
                              optionA.children
                                .toLowerCase()
                                .localeCompare(optionB.children.toLowerCase())
                            }
                            showSearch
                     placeholder="Chọn" style={{ minWidth: 150 }} onChange={selectedUserTypeStat === "warehouse"?handleSelectWareHouse:handleSelectCustomer}>
                            { (selectedUserTypeStat === "warehouse"?listWareHouse:listUsersGroupByArea).map((res, index) => {
                                return (
                                  <Option key={index} value={res.id}>
                                    <b>{res.name}</b>
                                  </Option>
                                );        
                            })
                            }
                      </Select>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {/* user */}

                <div>
                  {/* <button className="btn-export" onClick={handleExportExcel}>
                    Xuất excel
                  </button> */}
                  <button className="btn-see-report mr-1" onClick={handleSeeDashboard} >
                    Xem báo cáo
                  </button>
                  <button className="btn btn-success" onClick={() => handleButtonListExcel()}>
                    Xuất file Excel
                  </button>
                  {/* {console.log("testware",selectedWareHouse)} */}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Các bảng báo cáo */}
        {/* update UI */}
        {/* <div className="section-statistical__report__body">
          <div className="container">
            <div className="section-statistical__report__body mt-2">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-4">
                    <Table columns={columns_khaibaobinhmoi} dataSource={createdCylinder} pagination={false} bordered loading={loading}/>
                  </div>
                  <div className="col-4">
                    <Table columns={columns_binhdaxuat} dataSource={exportedCylinder} pagination={false} bordered loading={loading}/>
                  </div> */}
                  {/* update UI */}
                  {/* <div className="col-4">
                    <Table columns={columns_binhtonkho} dataSource={newInventoryCylinder} pagination={false} bordered />
                  </div> */}
                  {/* update UI */}
                {/* </div>
                <div className="row"> */}
                  {/* update UI */}
                  {/* <div className="col-4">
                    <Table columns={columns_khaibaobinhmoi} dataSource={newCylinder} pagination={false} bordered />
                  </div> */}
                  {/* update UI */}
                  {/* <div className="col-4">
                    <Table columns={columns_binhhoiluu} dataSource={turnbackCylinder} pagination={false} bordered loading={loading}/>
                  </div>
                  <div className="col-4">
                    <Table columns={columns_binhtonkho} dataSource={inventoryCylinder} pagination={false} bordered loading={loading}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        {/* update UI */}
        {/* Kho Vo */}
        {typeWareHouse === "Warehouse_EMPTY" && 
<div>
            <div className="row mx-1">
                    <div className="col-6">
                        <table class="table table-bordered">
                            <thead class="thead-light">
                                <tr>
                                    <th scope="col" colSpan="5" style={{ textAlign: "center" }}>SỐ VỎ SỐ HÓA KHAI BÁO MỚI</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Thương hiệu</td>
                                    {/* {console.log("cogi",columnCylinderTypes)} */}
                                     {columnCylinderTypes.map((item, index) => {
                                        return <td key={index}>{item.title}</td>
                                    })} 
                                    <th scope="col" style={{ fontWeight: "700" }}>Tổng</th>
                                </tr>
                                {/* {console.log("cogi",createdCylinder)} */}
                                {createdCylinder.map((item, index) => {
                                    let Sum = 0;
                                    return <tr key={index}>
                                        <td>{item.manufactureName}</td> 
                                        {/* map */}
                                        {columnCylinderTypes.map(cylinder => { 
                                            Sum += item[cylinder.key];
                                            return <td>{item[cylinder.key]}</td>})}
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
                                    <th scope="col" colSpan="5" style={{ textAlign: "center" }}>SỐ VỎ HỒI LƯU TỪ XE TẢI</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Thương hiệu</td>
                                    {columnCylinderTypes.map((item, index) => {
                                        return <td key={index}>{item.title}</td>
                                    })}
                                    <th scope="col" style={{ fontWeight: "700" }}>Tổng</th>
                                </tr>
                                 {additionalUserStatistic.turnbackCylinderFromTruck&&additionalUserStatistic.turnbackCylinderFromTruck.cylinderTypes.map((item, index) => {
                                    let Sum = 0;
                                    return <tr key={index}>
                                        <td>{item.manufactureName}</td>
                                        {columnCylinderTypes.map(cylinder => {
                                            Sum += item[cylinder.key];
                                            return <td>{item[cylinder.key]}</td>
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
                                    <th scope="col" colSpan="5" style={{ textAlign: "center" }}>TỔNG SỐ VỎ TẠI KHO</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Thương hiệu</td>
                                    {columnCylinderTypes.map((item, index) => {
                                        return <td key={index}>{item.title}</td>
                                    })}
                                    <th scope="col" style={{ fontWeight: "700" }}>Tổng</th>
                                </tr>
  
                                
                                {additionalUserStatistic.inventoryCylinder && additionalUserStatistic.inventoryCylinder.cylinderTypes.map((item, index) => {
                                    let Sum = 0;
                                    return <tr key={index}>
                                        <td>{item.manufactureName}</td>
                                        {columnCylinderTypes.map(cylinder => {
                                            Sum += item[cylinder.key];
                                            return <td>{item[cylinder.key]}</td>
                                        })}
                                        <th scope="col" style={{ fontWeight: "700" }}>{Sum}</th>
                                    </tr>
                                })}
                            </tbody>
                        </table> 
                    </div>
            </div>
          </div>
        } 
        {/* Kho Vo */}
        {/* Kho Thanh Pham */}
        {typeWareHouse === "Warehouse_FULL" && <div>
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
                            {columnCylinderTypes.map((item, index) => {
                                return <td key={index}>{item.title}</td>
                            })}
                            <th scope="col" style={{ fontWeight: "700" }}>Tổng</th>
                        </tr>
                        {additionalUserStatistic.refillCylinder&&additionalUserStatistic.refillCylinder.cylinderTypes.map((item, index) => {
                            let Sum = 0;
                            return <tr key={index}>
                                <td>{item.manufactureName}</td>
                                {columnCylinderTypes.map(cylinder => {
                                    Sum += item[cylinder.key];
                                    return <td>{item[cylinder.key]}</td>
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
                            {columnCylinderTypes.map((item, index) => {
                                return <td key={index}>{item.title}</td>
                            })}
                            <th scope="col" style={{ fontWeight: "700" }}>Tổng</th>
                        </tr>
                        {additionalUserStatistic.saleCylinder&&additionalUserStatistic.saleCylinder.cylinderTypes.map((item, index) => {
                            let Sum = 0;
                            return <tr key={index}>
                                <td>{item.manufactureName}</td>
                                {columnCylinderTypes.map(cylinder => {
                                    Sum += item[cylinder.key];
                                    return <td>{item[cylinder.key]}</td>
                                })}
                                <th scope="col" style={{ fontWeight: "700" }}>{Sum}</th>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </div>
        <div>
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
                            {columnCylinderTypes.map((item, index) => {
                                return <td key={index}>{item.title}</td>
                            })}
                            <th scope="col" style={{ fontWeight: "700" }}>Tổng</th>
                        </tr>
                        {additionalUserStatistic.inventoryCylinder&&additionalUserStatistic.inventoryCylinder.cylinderTypes.map((item, index) => {
                            let Sum = 0;
                            return <tr key={index}>
                                <td>{item.manufactureName}</td>
                                {columnCylinderTypes.map(cylinder => {
                                    Sum += item[cylinder.key];
                                    return <td>{item[cylinder.key]}</td>
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
        }
        {/* Kho Thanh Pham */} 
        {/* Kho Xe */}
        {typeWareHouse === "Warehouse_TRUCK"&&<React.Fragment><div className="row mx-1" style={{overflow:'scroll'}}>
                <div className="col-6">
                        <table class="table table-bordered" style={{width:'100%',marginLeft:'auto',marginRight:'auto'}}>
                            <thead class="thead-light">
                                <tr>
                                    <th scope="col" colSpan={2 + columnCylinderTypes.length} style={{ textAlign: "center" }}>SỐ VỎ HỒI LƯU TỪ KHÁCH HÀNG VỀ XE TẢI</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Thương hiệu</td>
                                    {
                                    columnCylinderTypes.map((item, index) => {
                                        return <td key={index}>{item.title}</td>
                                    })
                                    }
                                    <th scope="col" style={{ fontWeight: "700" }}>Tổng</th>
                                </tr>
                                {additionalUserStatistic.turnbackCylinderFromCustomer&&additionalUserStatistic.turnbackCylinderFromCustomer.cylinderTypes.map((item, index) => {
                                    let Sum = 0;
                                    return <tr key={index}>
                                        <td>{item.manufactureName}</td>
                                        {columnCylinderTypes.map(cylinder => {
                                            Sum += item[cylinder.key];
                                            return <td>{item[cylinder.key]}</td>
                                        })}
                                        <th scope="col" style={{ fontWeight: "700" }}>{Sum}</th>
                                    </tr>
                                })} 
                            </tbody>
                        </table>
                    </div>
                    {/* Thống kê xuất hàng */}
                    <div className="col-6">
                        <table class="table table-bordered" style={{width:'100%',marginLeft:'auto',marginRight:'auto'}}>
                            <thead class="thead-light">
                                <tr>
                                    <th scope="col" colSpan={2 + columnCylinderTypes.length} style={{ textAlign: "center" }}>THỐNG KÊ XUẤT HÀNG</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Thương hiệu</td>
                                    {
                                    columnCylinderTypes.map((item, index) => {
                                        return <td key={index}>{item.title}</td>
                                    })
                                    }
                                    <th scope="col" style={{ fontWeight: "700" }}>Tổng</th>
                                </tr>
                                {additionalUserStatistic.exportCylinderFromTruck&&additionalUserStatistic.exportCylinderFromTruck.cylinderTypes.map((item, index) => {
                                    let Sum = 0;
                                    return <tr key={index}>
                                        <td>{item.manufactureName}</td>
                                        {columnCylinderTypes.map(cylinder => {
                                            Sum += item[cylinder.key];
                                            return <td>{item[cylinder.key]}</td>
                                        })}
                                        <th scope="col" style={{ fontWeight: "700" }}>{Sum}</th>
                                    </tr>
                                })} 
                            </tbody>
                        </table>
                    </div>
                    </div>
                    <div className="row mx-1" >
                    {/* <div className="col-12">
                        <table class="table table-bordered">
                            <thead class="thead-light">
                                <tr>
                                <th scope="col" colSpan={4 + listManufacture.length*columnCylinderTypes.length} style={{ textAlign: "center" }}>LỊCH SỬ HỒI LƯU VỎ</th>
                                </tr>
                                <tr>
                                    <th scope="col" style={{ textAlign: "center", verticalAlign: "middle" }}>BIỂN SỐ XE</th>
                                    <th scope="col" style={{ textAlign: "center", verticalAlign: "middle" }}>TÊN TÀI XẾ</th>
                                    <th scope="col" style={{ textAlign: "center", verticalAlign: "middle" }}>NGÀY GIỜ</th> */}
                                    {/* <th scope="col" style={{ textAlign: "center", verticalAlign: "middle" }}>
                                        <table >
                                            <tr>
                                                <th scope="col" colSpan="3" style={{ textAlign: "center" }} style={{border:'none'}}>VỎ XUÂN NGHIÊM GAS</th>
                                            </tr>
                                            <tr style={{border:'none'}}>
                                                {
                                                columnCylinderTypes.map((item, index) => {
                                                return <td key={index} style={{border:'none',fontWeight:'normal'}}>{item.title}</td>
                                                })
                                                }
                                            </tr>
                                        </table>
                                    </th> */}
                                    {/* {listManufacture.map(manufacture => {
                                    return <th scope="col" style={{ textAlign: "center", verticalAlign: "middle" }} colSpan={columnCylinderTypes.length}>
                                        <table className="table table-bordered">
                                            <tr>
                                                <th scope="col" colSpan={columnCylinderTypes.length} style={{ textAlign: "center" }} style={{border:'none'}}>{manufacture.name}</th>
                                            </tr>
                                            <tr style={{border:'none'}}>
                                                {
                                                columnCylinderTypes.map((item, index) => {
                                                return <th key={index} style={{border:'none'}}>{item.title}</th>
                                                })
                                                }
                                            </tr>
                                        </table>
                                    </th>
                                    }
                                        )}
                                    <th scope="col" style={{ textAlign: "center", verticalAlign: "middle" }}>TỔNG</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historyReturnCylinder.map(item => 
                                {
                                let sum = {value: 0};
                                return (
                                <tr key={item.id}>
                                    <td className="text-center">{item.driver}</td>
                                    <td className="text-center">{item.license_plate}</td>
                                    <td className="text-center">{getCurrentDateTime(item.createdAt)}</td> */}
                                    {/* {columnCylinderTypes.map(cylinderItem=> <td>
                                    {
                                        renderCylinderNumber(item.cylinders,cylinderItem)
                                    }
                                    </td>)} 
                                    <td className="text-center">{item.numberOfCylinder}</td> */}
                                    {/* =)) */}
                                    {/* {
                                        listManufacture.map(manufacture => {
                                            return columnCylinderTypes.map(cylinderType => <td className="text-center">
                                                {renderCylinderNumber(manufacture, item.cylinders ,cylinderType, sum)}
                                            </td>)
                                        })
                                    }
                                    <td className="text-center">{sum.value}</td>
                                </tr>)})}
                            </tbody>
                        </table>
                    </div> */}
                {/* change table */}
                <div className="col-6" >
                        <table class="table table-bordered" style={{width:'100%',marginLeft:'auto',marginRight:'auto'}}>
                            <thead class="thead-light">
                                <tr>
                                    <th scope="col" colSpan={5} style={{ textAlign: "center" }}>LỊCH SỬ HỒI LƯU</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th className="text-center">Hồi lưu từ</th>
                                    <th className="text-center">Xe</th>
                                    <th className="text-center">Ngày giờ</th>
                                    <th className="text-center">Số lượng</th>
                                    <th style={{ fontWeight: "700" }} className="text-center">Tải excel</th>
                                </tr>
                                {historyReturnCylinder.map(item => 
                                <tr key={item.id}>
                                    <td className="text-center">{item.from}</td>
                                    <td className="text-center">{item.truck}</td>
                                    <td className="text-center">{getCurrentDateTime(item.time)}</td>
                                    <td className="text-center">{item.numberCylinders}</td>
                                    <td style={{cursor:'pointer'}} className="text-center" onClick={() => downloadExcelTurnbackTruck(item.id)}>Tải xuống</td>
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
                                    <th className="text-center">Xuất hàng từ</th>
                                    <th className="text-center">Xe</th>
                                    <th className="text-center">Ngày giờ</th>
                                    <th className="text-center">Số lượng</th>
                                    <th style={{ fontWeight: "700" }} className="text-center">Tải excel</th>
                                </tr>
                                {historyExport.map(item => 
                                <tr key={item.id}>
                                    <td className="text-center">{item.from}</td>
                                    <td className="text-center">{item.truck}</td>
                                    <td className="text-center">{getCurrentDateTime(item.time)}</td>
                                    <td className="text-center">{item.numberCylinders}</td>
                                    <td style={{cursor:'pointer'}} onClick={() => downloadExcelExport(item.id)} className="text-center">Tải xuống</td>
                                </tr>)}
                            </tbody>
                        </table>
                        <Pagination current={currentPageExportHistory} total={200} onChange={(page, pageSize)=>handleChangePaginationInExportHistory(page,pageSize)} />
                    </div>
                </div> 
                </React.Fragment>
                }
        {/* Kho Xe */}
        {/* User Statistic */}
        {(selectedCustomer !== "" && selectedWareHouse === "")&&<div className="col-12" style={{overflow:scroll}}>
                <table class="table table-bordered" style={{minWidth :'100%'}}>
                   <thead class="thead-light">
                        <tr>
                            <th scope="col" colSpan={2 + listManufacture.length} style={{ textAlign: "left" }}>Đại lý <span></span></th>
                        </tr>
                        <tr>
                            <th scope="col" colSpan="1" style={{ textAlign: "center" }}>Báo Cáo</th>
                            {listManufacture&&listManufacture.map((item,index) => {
                              return <th key={index} style={{ textAlign: "center" }}>{item.name}</th>
                            })}
                            <th scope="col" colSpan="1" style={{ textAlign: "center" }}>Tổng</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        {customerStatistics.inCylinder&&renderCustomerStatistics('Số Bình Đã Nhập',customerStatistics.inCylinder.cylinderTypes, customerStatistics.inCylinder.total)}
                        </tr>   
                        <tr>
                        {customerStatistics.saleCylinder&&renderCustomerStatistics('Số Bình Đã Bán',customerStatistics.saleCylinder.cylinderTypes, customerStatistics.saleCylinder.total)}
                        </tr>   
                        <tr>
                        {customerStatistics.inventoryCylinder&&renderCustomerStatistics('Số Bình Tồn Kho',customerStatistics.inventoryCylinder.cylinderTypes, customerStatistics.inventoryCylinder.total)}
                        </tr>   
                        <tr>
                        {customerStatistics.turnbackCylinder&&renderCustomerStatistics('Số Vỏ Hồi Lưu',customerStatistics.turnbackCylinder.cylinderTypes, customerStatistics.turnbackCylinder.total)}
                        </tr>                 
                    </tbody>
                </table>
            </div>}
         {/* User Statistic */}
      </div>
      {typeWareHouse === "Warehouse_FULL" &&
      <div className="chart">
          <ResponsiveContainer width="100%" height={400}>
          <BarChart
          data={monthDataForChart}
          >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {columnCylinderTypes.map((item, index) => {
                                return <Bar dataKey={item.title} barSize={60} key={index} stackId="a" fill={getRandomColor()} />
                                
          })}
          {/* <Bar dataKey="Bình 12" stackId="a" fill="#d115b2" />
          <Bar dataKey="Bình 30" stackId="a" fill="#4824d6" />
          <Bar dataKey="Bình 45" stackId="a" fill="#2c1a73" /> */}
        </BarChart>
        
        </ResponsiveContainer>
        <h3 className="text-center">Biểu Đồ Xuất Hàng Theo Tháng</h3>
        <div>
        {/* Quarter Chart */}
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
          data={preciousDataForChart}
          >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {columnCylinderTypes.map((item, index) => {
                                return <Bar dataKey={item.title} barSize={60} key={index} stackId="a" fill={getRandomColor()}/>
          })}
          {/* <Bar dataKey="Bình 12" stackId="a" fill="#d115b2" />
          <Bar dataKey="Bình 30" stackId="a" fill="#4824d6" />
          <Bar dataKey="Bình 45" stackId="a" fill="#2c1a73" />  */}
        </BarChart>
        </ResponsiveContainer>
        <h3 className="text-center">Biểu Đồ Xuất Hàng Theo Quý</h3>
        </div>
        {/* end quarter chart */}
        <div className="d-flex" style={{justifyContent: "right"}}>
          <input type="number" className="year_input" onInput={e => setInputTime(e.target.value)}  placeholder="Vui Lòng Nhập Vào Năm"/>
          <button className="btn btn-success mb-3 mr-3" onClick={()=>handleThisYear(inputTime)}>Chọn</button>
          <button className="btn btn-success mb-3 mr-3" onClick={handleSeeDashboard}>Thống kê</button>
        </div>
      </div>
}
      {/* end chart */}
      {/* {console.log("test 007",monthDataForChart)} */}
    </div>
  )
}

export default Statistical;
