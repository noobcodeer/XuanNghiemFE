import React from "react";
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';
import required from 'required';
import isUppercase from 'isUppercase';
import callApi from './../../../util/apiCaller';
import showToast from "showToast";
import {CYLINDERVALVE} from "./../../../config/config";
import getUserCookies from 'getUserCookies';
//
class FormVavle extends React.Component{
    constructor(props){
        super(props);
        this.state={
            id:"",
            name:"",
            code:"",
        }
        this.onSubmit = this.onSubmit.bind(this);
    }
    componentWillReceiveProps(nextprops){
        if(nextprops && nextprops.listValve && nextprops.listValve!==null){
            this.setState({
                id:nextprops.listValve.id,
                name:nextprops.listValve.name,
                code:nextprops.listValve.code,
            })
        }else{
            this.setState({
                name:"",
                code:"",
            })
        }
    }
    onChange=(event)=>{
        let target = event.target;
        let name = target.name;
        let value = target.value;
        this.setState({
            [name]:value,
        })
    }
   async onSubmit(event){
        event.preventDefault();
        let use_cookies = await getUserCookies();
        let token="Bearer "+use_cookies.token;
        const {id,name,code} = this.state;
        if(this.props.isCreateMode){
            if(code !== '' && name !== ''){
                let param={
                    name,
                    code,
                }
                // alert(JSON.stringify(param,null,2))
                await callApi("POST",CYLINDERVALVE,param,token).then(res=>{
                    // console.log("res",res);
                    if(res.status === 200){
                        showToast(res.data.message);
                        const modal = $("#create-valve");
                        modal.modal('hide');
                    }else{
                        showToast("tạo loại van không thành công");
                        return false;
                    }
                })
            }else{
                if(code === ''){
                    showToast("Hãy nhập mã loại van");
                }else{
                    showToast("Hãy nhập tên loại van");
                }
            }
        }else{
            let api =CYLINDERVALVE+"?idCylinderValVes="+id
            let param={
                name,
                // code,
            }
            await callApi("PUT",api,param,token).then(res=>{
                // console.log("Res",res);
                if(res.status === 200){
                    if(res.data.success === true){
                        showToast(res.data.message);
                        const modal = $("#create-valve");
                        modal.modal('hide');
                    }else{
                        showToast(res.data.message);
                        const modal = $("#create-typegascylinder");
                        modal.modal('hide');
                    }
                }else{
                    showToast("Cập nhật loại van thất bại");
                }
            })
            // alert(JSON.stringify(param,null,2))
        }
    }
    render(){
        const{code,name} =this.state;
        return(
            <div className="modal fade" id="create-valve" tabIndex="-1">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {this.props.isCreateMode ? "Tạo van ": "Chỉnh sửa van"}
                        </h5>
                        <button type="button" className="close" data-dismiss="modal">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div className="modal-body">
                        <Form 
                        // ref={c => {
                        //     this.form = c
                        // }}
                            className="card" 
                            onSubmit={this.onSubmit}
                             >
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Mã van</label>
                                            <Input className="form-control"
                                                // disabled={this.props.check}
                                                type="text" name="code" id="code"
                                                onChange={this.onChange} 
                                                value={code}
                                               disabled={this.props.isCreateMode? false:true} 
                                                // validations={[required, isUppercase]}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Tên van</label>
                                            <Input className="form-control" type="text" name="name"
                                                id="name" 
                                                onChange={this.onChange} 
                                                value={name} 
                                                // validations={[required, isUppercase]} 
                                                />
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <footer className="card-footer text-center">
                                <Button className="btn btn-primary" id="button">
                                  Lưu
              </Button>
                                <button
                                    className="btn btn-secondary"
                                    type="reset"
                                    data-dismiss="modal"
                                    style={{ marginLeft: "10px" }}
                                >
                                  Đóng
              </button>
                            </footer>
                        </Form>
                    </div>
                </div>
            </div>
            
        </div>
        )
    }
}
export default FormVavle;