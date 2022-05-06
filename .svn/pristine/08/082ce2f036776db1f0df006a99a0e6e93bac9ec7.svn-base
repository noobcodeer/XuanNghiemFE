import React from "react";
import FormColor from "./formColor";
import getUserCookies from 'getUserCookies';
import {CYLINDERCOLOR} from './../../../config/config';
import callApi from './../../../util/apiCaller';
import showToast from "showToast";
//
class Color extends React.Component{
    constructor(props){
        super(props);
        this.state={
            isCreateMode:true,
            listColor:[],
            data:{},
        }
    }
    handleCreateColor= async()=>{
       await this.setState({
            isCreateMode:true,
            data:null
        })
    }
    handleUpdateColor=async(value)=>{
        await this.setState({
            isCreateMode:false,
            data:value,
        })
    }
    async componentDidMount(){
        let use_cookies = await getUserCookies();
        let token="Bearer "+use_cookies.token;
        // console.log("token",token)
        let id = use_cookies.user.id
        await this.getAllData(id,token);
    }
    async getAllData(id,token){       
// console.log("id",id)
         let api = CYLINDERCOLOR+"?id="+id;
        //  console.log("param",param)
         await callApi("GET",api,'',token).then(res=>{
             if(res.data){
                 if(res.data.status === true){
                     this.setState({
                        listColor:res.data.data,
                     })
                 }else{
                     showToast(res.data.message
                        ? res.data.message
                        : "Lỗi sai dữ liệu",
                        2000)
                 }
             }else{
                 showToast("Lỗi khi lấy dữ liệu")
             }
            //  console.log("res", res)
         })
    }
    async deleteColor(id){
        let answer = window.confirm("Bạn muốn xóa!!!");
        let use_cookies = await getUserCookies();
        let token="Bearer "+use_cookies.token;
        let api=CYLINDERCOLOR+"?idCylindercolor="+id;
        if(answer){
            await callApi("DELETE",api,"",token).then(res=>{
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
                    showToast("Xóa màu sắc thất bại");
                    return false;
                }
            });
        }   
    }
    render(){
        console.log("data",this.state.listColor);
        return(
            <div className="main-content">
            <div className="card">
                <div className="card-title">
                    <div className="flexbox">
                        <h4>Màu Sắc</h4>
                        <div className="row">
                            {/*<button
                                style={{ marginLeft: "20px" }}
                                className="btn btn-sm btn-success"
                                data-toggle="modal"
                                // onClick={() => this.handleButtonListExcel()}
                            >
                                {this.props.t('EXPORT_EXCEL')}
                            </button>*/}
                            <button onClick={this.handleCreateColor} style={{ marginLeft: '20px' }}
                                className="btn btn-sm btn-create" data-toggle="modal"
                                data-target="#create-color">Tạo màu sắc</button>
                        </div>
                    </div>
                </div>

                <div className="card-body">
                    <div className="table-responsive-xl">
                        <div className="dataTables_wrapper container-fluid dt-bootstrap4">
                            <div className="row">
                                <div className="col-sm-12">
                                    <table className="table table-striped table-bordered seednet-table-keep-column-width"
                                        cellSpacing="0" >
                                        <thead className="table__head">
                                            <tr>
                                                <th className="text-center w-70px">STT</th>
                                                <th className="w-120px text-center">Mã màu </th>
                                                <th className="w-120px text-center">Tên màu</th>
                                                <th className="w-100px text-center">Thao Tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/*listUsers.map((store, index) => {
                                                return (<tr key={index}>
                                                    <td scope="row" className="text-center">{index + 1}</td>
                                                    <td scope="row" className="text-center">{store.license_plate}</td>
                                                    <td scope="row" className="text-center">{store.load_capacity}</td>

                                                    <td className="text-center table-actions">
                                                        {this.state.user_type === 'Factory' && (
                                                            <a className="table-action hover-primary" data-toggle="modal" data-target="#view-report"
                                                                onClick={() => { this.deleteUser(store.id) }}>
                                                                <i className="ti-trash"></i> </a>
                                                        )}
                                                        <a className="table-action hover-primary" data-toggle="modal" data-target="#create-user"
                                                            onClick={() => { this.editUser(store) }}
                                                        ><i className="ti-pencil"></i></a>
                                                    </td>
                                                </tr>)
                                            })*/}
                                            {this.state.listColor.map((data,index)=>{
                                                return(
                                                    <tr key={index}>
                                                    <td scope="row" className="text-center">{index+1}</td>
                                                    <td scope="row" className="text-center">{data.code}</td>
                                                    <td scope="row" className="text-center">{data.name}</td>
                                                    <td className="text-center table-actions">
                                                   
                                                        <a className="table-action hover-primary"  
                                                        // data-toggle="modal" 
                                                        // data-target="#view-report"
                                                            onClick={() => { this.deleteColor(data.id) }}
                                                            >
                                                            <i className="ti-trash"></i> </a>
                                                    
                                                    <a className="table-action hover-primary" 
                                                    data-toggle="modal" 
                                                    data-target="#create-color"
                                                    onClick={()=>this.handleUpdateColor(data)}
                                                    ><i className="ti-pencil"></i></a>
                                                </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
           <FormColor
             isCreateMode={this.state.isCreateMode}
             listColor={this.state.data}
                // userEdit={this.state.userEdit}
                // listUsers={this.state.listUsers}
                // check={this.state.check}
           />
        </div>
        );
    }
}
export default Color;