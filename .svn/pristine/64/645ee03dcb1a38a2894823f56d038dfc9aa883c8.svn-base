import React from "react";
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';
import callApi from './../../../util/apiCaller';
import {CYLINDERCOLOR} from './../../../config/config';
import getUserCookies from 'getUserCookies';
import showToast from "showToast";
//
class FormColor extends React.Component{
    constructor(props){
        super(props);
        this.form = null;
        this.state={
            id:"",
            code:"",
            name:"",
        }
        this.onSubmit=this.onSubmit.bind(this);
    }

    componentWillReceiveProps(nextprops){
        if(nextprops && nextprops.listColor && nextprops.listColor!== null){
            this.setState({
                id:nextprops.listColor.id,
                code:nextprops.listColor.code,
                name:nextprops.listColor.name,
            })
        }else{
           this.setState({
               code:"",
               name:"",
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
        const {id,code,name} = this.state;
        if(this.props.isCreateMode){
            if(code !== '' && name !== ''){
                let param ={
                    code,
                    name,
                }
                // alert(JSON.stringify(param,null,2))
                await callApi("POST",CYLINDERCOLOR,param,token).then(res=>{
                    console.log("res",res)
                    if(res.status === 200){
                        showToast(res.data.message);
                        const modal = $("#create-color");
                        modal.modal('hide');
                    }else{
                        showToast("tạo không thành công")
                    }
                });
            }else{
                if(code === ''){
                    showToast("Hãy nhập mã màu sắc");
                }else{
                    showToast("Hãy nhập tên màu sắc");
                }
            } 
        }else{
            let api = CYLINDERCOLOR+"?idCylindercolor="+id;
            let param ={
                // code,
                name
            }
            await callApi("PUT",api,param,token).then(res=>{
                // console.log("Res",res);
                if(res.status === 200){
                    if(res.data.success === true){
                        showToast(res.data.message);
                        const modal = $("#create-color");
                        modal.modal('hide');
                    }else{
                        showToast(res.data.message);
                        const modal = $("#create-typegascylinder");
                        modal.modal('hide');
                    }
                }else{
                    showToast("Cập nhật thất bại");
                }
            })
            // alert(JSON.stringify(param,null,2))
        }
    }
    render(){
        const{code,name} = this.state;
        return(
            <div className="modal fade" id="create-color" tabIndex="-1">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {this.props.isCreateMode ? "Tạo màu sắc ": "Chỉnh sửa màu sắc"}
                        </h5>
                        <button type="button" className="close" data-dismiss="modal">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div className="modal-body">
                        <Form 
                        ref={c => {
                            this.form = c
                        }}
                            className="card" 
                            onSubmit={this.onSubmit}
                             >
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Mã màu</label>
                                            <Input className="form-control"
                                                // disabled={this.props.check}
                                                type="text" name="code" id="coder"
                                                onChange={this.onChange}
                                                value={code}
                                                disabled={this.props.isCreateMode? false:true} 
                                                // validations={[required, isUppercase]}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Tên màu</label>
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
export default FormColor;