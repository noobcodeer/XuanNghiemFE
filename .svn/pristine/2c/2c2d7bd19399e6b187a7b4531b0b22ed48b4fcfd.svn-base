import React from "react";
import TypeCylinder from "./typeCylinderForm";
import getUserCookies from 'getUserCookies';
import {CYLINDERVALVE,CYLINDERCOLOR,CYLINDERTYPE} from "../../../config/config";
import callApi from '../../../util/apiCaller';
import showToast from "showToast";
class typeCylinder extends React.Component{
    constructor(props){
        super(props);
        this.state={
            isCreateMode:false,
            listCylinderType:[],
            listColor:[],
            listValve:[],
            data:[],
            userid:'',
            token:'',
        }
        this.handleClickCreateForm = this.handleClickCreateForm.bind(this);
        this.handleClickUpdateForm = this.handleClickUpdateForm.bind(this)
    }
   async handleClickCreateForm(){
        this.setState({
            isCreateMode:true,
            data:null
        });
        await this.getDataListColor(this.state.userid,this.state.token);
        await this.getDataListValve(this.state.userid,this.state.token);
    }
    async handleClickUpdateForm(value){
         this.setState({
            isCreateMode:false,
            data:value,
        });
        await this.getDataListColor(this.state.userid,this.state.token);
        await this.getDataListValve(this.state.userid,this.state.token);
    }
    async componentDidMount(){
        let use_cookies = await getUserCookies();
        let token = "Bearer "+use_cookies.token;
        let  id = use_cookies.user.id;
        await this.getAllData(id,token);
        this.setState({
            userid:id,
            token
        })
       
     }
     async getAllData(id,token){
         let api = CYLINDERTYPE+"?id="+id;
         await callApi("GET",api,'',token).then(res=>{
            if(res.status === 200){
                if(res.data.status === true){
                    this.setState({
                        listCylinderType:res.data.data
                    })
                }else{
                    showToast(res.data.message
                     ? res.data.message
                     : "Lỗi sai dữ liệu",
                     2000);
                }
            }else{
                showToast("Lấy dữ liệu không thành công")
            }
         })
     }
     async getDataListColor(id,token){       
         let api = CYLINDERCOLOR+"?id="+id;
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
                 showToast("Lỗi khi lấy danh sách màu sắc")
             }
         })
     }
     async getDataListValve(id,token){
         let api = CYLINDERVALVE+"?id="+id;
         await callApi("GET",api,'',token).then(res=>{
             //    console.log('res',res)
             if(res.data){
                 if(res.data.status === true){
                     this.setState({
                         listValve:res.data.data,
                     })
                 }else{
                     showToast(res.data.message
                     ? res.data.message
                     : "Lỗi sai dữ liệu",
                     2000)
                 }
             }else{
                 showToast("Lỗi khi lấy danh sách van")
             }
         })
      }
     async deleteTypeCylinder(id){
        let answer = window.confirm("Bạn muốn xóa!!!");
        let use_cookies = await getUserCookies();
        let token="Bearer "+use_cookies.token;
        let param={
            idCylinderType:id
        }
        if(answer){
            await callApi("DELETE",CYLINDERTYPE,param,token).then(res=>{
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
                    showToast("Xóa loại bình thất bại");
                    return false;
                }
            });
        }   
      }
    render(){
        return(
            <div className="main-content">
            <div className="card">
                <div className="card-title">
                    <div className="flexbox">
                        <h4>Loại bình</h4>
                        <div className="row">
                            <button 
                            onClick={this.handleClickCreateForm} 
                            style={{ marginLeft: '20px' }}
                            className="btn btn-sm btn-create" 
                            data-toggle="modal"
                             data-target="#create-typegascylinder"
                                >Tạo loại bình</button>
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
                                                <th className="w-120px text-center">Mã bình </th>
                                                <th className="w-120px text-center">Tên bình</th>
                                                <th className="w-120px text-center">Khối lượng</th>
                                                <th className="w-120px text-center">Màu sắc</th>
                                                <th className="w-120px text-center">Loại van</th>
                                                <th className="w-100px text-center">Thao Tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.listCylinderType.map((data,index)=>{
                                                return(
                                                    <tr key={index}>
                                                    <td scope="row" className="text-center">{index+1}</td>
                                                    <td scope="row" className="text-center">{data.code}</td>
                                                    <td scope="row" className="text-center">{data.name}</td>
                                                    <td scope="row" className="text-center">{data.mass}</td>
                                                    <td scope="row" className="text-center">{
                                                         (data.colors.map((todo)=>todo.name)).join(",")
                                                    }</td>
                                                    <td scope="row" className="text-center">{(data.valves.map((todo)=>todo.name)).join(",")}</td>
                                                    <td className="text-center table-actions">
                                                   
                                                        <a className="table-action hover-primary"  
                                                        // data-toggle="modal" 
                                                        // data-target="#view-report"
                                                            onClick={() => { this.deleteTypeCylinder(data.id) }}
                                                            >
                                                            <i className="ti-trash"></i> </a>
                                                    
                                                    <a className="table-action hover-primary" 
                                                    data-toggle="modal" 
                                                    data-target="#create-typegascylinder"
                                                    onClick={()=>this.handleClickUpdateForm(data)}
                                                    style={{display:'none'}}
                                                    ><i className="ti-pencil"></i></a>
                                                    </td>
                                                    </tr>
                                                );
                                            })}
                                            
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
           <TypeCylinder
             isCreateMode={this.state.isCreateMode}
            listValve={this.state.listValve}
            listColor={this.state.listColor}  
            data = {this.state.data}
           />
        </div>
        );
    }
}
export default typeCylinder;