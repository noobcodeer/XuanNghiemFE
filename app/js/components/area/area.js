import React,{useState, useEffect } from 'react';
import getUserCookies from '../../helpers/getUserCookies';
import axios from 'axios';
import { Modal} from 'antd';
import i18n from './../../helpers/i18n';
import showToast from './../../helpers/showToast';
import { GETAREA, SERVERAPI } from '../../config/config';
import getArea from './../../../api/getArea';
import callApi from '../../util/apiCaller';
const Area = (props) => {
    // areas
    const [area,setArea] = useState([]);
    // modal
    // add
    const [showAddModal,setShowAddModal] = useState(false);
    const [areaCode,setAreaCode] = useState('');
    const [areaName,setAreaName] = useState('');
    // edit
    const [showEditModal,setShowEditModal] = useState(false);
    const [editObject,setEditObject] = useState({code:"",name:""});
    const [user_cookies,setCookies] = useState({});
    useEffect( () => {
    const getArea = async() => {
        let url = GETAREA;
        // get cookies
        let getCookies = await getUserCookies();
        setCookies(getCookies);
        // get area
        let data = await axios.get(
            url,
            {
                    headers: {
                        "Authorization": "Bearer " + getCookies.token
                    }
            }
        )
        console.log("dataArea: ", data);
        // set state
        setArea(data.data.data);
        
        }    
        getArea();
    },[])

    // Add new area
    const handleOk = async () => {
        if(areaCode === '' || areaName === '')
            showToast("Vui lòng nhập đầy đủ thông tin");
        else
        {
            let url = GETAREA;
            let params = {'name': areaName,'code': areaCode};
            try{
            let data = await axios.post(url,
                params,
                {
                    headers: {
                        "Authorization": "Bearer " + user_cookies.token
                    }
                }
            )
                
            }
            catch(ex){
                showToast("Tạo thất bại");
                return;
            }
            showToast("Tạo thành công");
            setShowAddModal(false);
        }
        }
        const handleCancel = () => {
            setShowAddModal(false);
        }
    // Edit
    const handleEditOk = async (id) => {
        let url = SERVERAPI + `area?id=${id}`
        let user_cookies = await getUserCookies();
        // console.log("use_cookies:", user_cookies.token);
        let params = {'name': editObject.name, 'code': editObject.code};
        await axios.put(url, params,
                {
                    headers: {
                        "Authorization": "Bearer " + user_cookies.token
                    }
                }
        ).then(res=>{    
                showToast("Cập nhật thành công"); 
                setShowEditModal(false);   
        }).catch(  err=>{
                showToast("Cập nhật thất bại");   
            } 
        )    
         
    }
    const handleEditCancel = () => {
        setShowEditModal(false);
    }
    const handleDeleteArea = async (id) => {
        let answer = window.confirm("Bạn muốn xóa!!!");
        let use_cookies = await getUserCookies();
        let token="Bearer "+use_cookies.token;
        let param={
            idArea:id
        }
        let url = SERVERAPI + `area?id=${id}`.replace("$id", id)
        if(answer){
            await callApi("DELETE",url,param,token).then(res=>{
                console.log("res",res);
                if(res.status === 200){
                    if(res.data.success === true){
                        showToast(res.data.message,2000);
                        return true;
                    }else{
                        showToast(res.data.message,2000);
                        return false;
                    }
                }else{
                    showToast("Xóa khu vực thất bại");
                    return false;
                }
            });
        } 
    }
        return ( 
            <div className="main-content">
                <div className="card">
                <div className="card-title">
                <div className="col-sm-12">
                    <div className="flexbox">
                        <h3>{i18n.t('MANAGE_AREA')}</h3>
                        <button className="btn btn-sm btn-create mr-2" onClick={() => setShowAddModal(true)}>{i18n.t('ADD_AREA')}</button>
                    </div>
                </div>
                
                </div>
                <div className="card-body"> 
                <div className="col-sm-12">
                    <table className="table table-striped table-bordered seednet-table-keep-column-width">
                        <thead className="table__head">
                            <th className="text-center w-60px align-middle">{i18n.t('ID_NUMBER')}</th>
                            <th className="text-center w-60px align-middle">{i18n.t('AREA_ID')}</th>
                            <th className="text-center w-60px align-middle">{i18n.t('AREA')}</th>
                            <th className="text-center w-60px align-middle">{i18n.t('Thao Tác')}</th>
                        </thead>
                        {area.map((areaMember,index) => 
                        <tr key={index}>
                            <td scope="row" className="text-center">{index + 1}</td>
                            <td scope="row" className="text-center">{areaMember.code}</td>
                            <td scope="row" className="text-center">{areaMember.name}</td>
                            <td scope="row" className="text-center table-actions">
                                <a className="table-action hover-primary" onClick={() => handleDeleteArea(areaMember.id)}>
                                    <i className="ti-trash"></i> 
                                </a>
                                <a className="table-action hover-primary" onClick={() => {
                                    setShowEditModal(true);
                                    setEditObject(areaMember);
                                }}>
                                    <i className="ti-pencil"></i>
                                </a>
                            </td>
                        </tr>)}
                    </table>
                </div>
                <Modal title={i18n.t('ADD_AREA')} visible={showAddModal} onOk={handleOk} onCancel={handleCancel} okText={i18n.t('ADD_AREA')} cancelText={i18n.t('CANCEL')}>
                    <form>
                        <label for="code">{i18n.t('AREA_ID')}:</label>
                        <input name="code" id="code" type="text" className="d-block" value={areaCode} onChange={(e) => setAreaCode(e.target.value)}></input> <br></br>
                        <label for="name">{i18n.t('AREA_NAME')}:</label>
                        <input name="name" id="name" type="text" className="d-block" value={areaName} onChange={(e) => setAreaName(e.target.value)}></input>
                    </form>
                </Modal>
                {/* Update */}
                <Modal title={i18n.t('Chỉnh Sửa Khu Vực')} visible={showEditModal} onOk={() =>handleEditOk(editObject.id)} onCancel={handleEditCancel} okText={i18n.t('Chỉnh Sửa')} cancelText={i18n.t('Hủy')}>
                    <form>
                        <label for="code">{i18n.t('AREA_ID')}:</label>
                        <input name="code" id="code" type="text" className="d-block" value={editObject.code} onChange={(e) => setEditObject({...editObject, code:e.target.value})}></input> <br></br>
                        <label for="name">{i18n.t('AREA_NAME')}:</label>
                        <input name="name" id="name" type="text" className="d-block" value={editObject.name} onChange={(e) => setEditObject({...editObject, name: e.target.value})}></input>
                    </form>
                </Modal>
                </div>
                </div>
            </div>
     );
}
 

export default Area;