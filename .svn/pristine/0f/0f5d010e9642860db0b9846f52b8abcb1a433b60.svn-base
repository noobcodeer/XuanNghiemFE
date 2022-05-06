import React from "react";
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';
import {Select} from 'antd';
import getUserCookies from 'getUserCookies';
import showToast from "showToast";
import callApi from '../../../util/apiCaller';
import {CYLINDERTYPE} from "../../../config/config";
// const {Select} = andt;
const {Option} = Select;
class typeCylinderForm extends React.Component{
    constructor(props){
        super(props);
       
        this.state={
            id:"",
            code:"",
            name:"",
            mass:"",
            color:[],
            valve:[],
            userId:"",
            listColor:[],
            listValve:[],
        }
        this.onSubmit=this.onSubmit.bind(this);
    }
    componentWillReceiveProps(nextprops){
        if(nextprops && nextprops.listValve && nextprops.listColor){
            this.setState({
                listColor:nextprops.listColor,
                listValve:nextprops.listValve,
            })
        }else{
            this.setState({
                listColor:[],
                listValve:[],
            })
        }
        if(nextprops && nextprops.data !== null && nextprops.data){
           this.setState({
            id:nextprops.data.id,
            code:nextprops.data.code,
            name:nextprops.data.name,
            mass:nextprops.data.mass,
            color:nextprops.data.length!==0?nextprops.data.colors.map(todo=>todo.id):[],
            valve:nextprops.data.length!==0?nextprops.data.valves.map(todo=>todo.id):[],
           })
        }else{
            this.setState({
                code:"",
                name:"",
                mass:"",
                color:[],
                valve:[],
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
    handleChangeColor=(value) =>{
        this.setState({
            color:value
        })
    }
    handleChangeValve=(value)=> {
        this.setState({
            valve:value,
        })
    }
    async onSubmit(event){
        event.preventDefault();
        let use_cookies = await getUserCookies();
        let token="Bearer "+use_cookies.token;
        const {id,code,name,mass,color,valve}=this.state;  
        if(this.props.isCreateMode){
            if(code !== '' && name !== '' && mass !== '' && color.length !== 0 && valve.length !== 0){
                try {
                    let param={
                        code,
                        name,
                        mass,
                        colors:color,
                        valves:valve,
                    }
                    await callApi("POST",CYLINDERTYPE,param,token).then(res=>{
                        if(res.status === 200){
                            if(res.data.status === true){
                                showToast(res.data.message);
                                const modal = $("#create-typegascylinder");
                                modal.modal('hide')
                            }else{
                                showToast(res.data.message);
                                const modal = $("#create-typegascylinder");
                                modal.modal('hide')
                            }
                        }else{
                            showToast("Tạo không thành công")
                        }
                    })
                } catch (error) {
                    showToast(error);
                }
            }else{
                if(code ===''){
                    showToast("Hãy nhập mã bình");
                }else if(name === ''){
                    showToast("Hãy nhập tên bình");
                }else if(mass === ''){
                    showToast("Hãy nhập trọng lượng bình");
                }else if(color.length === 0){
                    showToast("Hãy chọn màu sắc cho bình");
                }else{
                    showToast("Hãy chọn loại van cho bình");
                }
            }
        }else{
            try {
                let param={
                    idCylinderType:id,
                    code,
                    name,
                    mass,
                    colors:color,
                    valves:valve,
                }
                await callApi("PUT",CYLINDERTYPE,param,token).then(res=>{
                    if(res.status === 200){
                        if(res.data.status === true){
                            showToast(res.data.message);
                            const modal = $("#create-typegascylinder");
                            modal.modal('hide')
                        }else{
                            showToast(res.data.message);
                            const modal = $("#create-typegascylinder");
                            modal.modal('hide')
                        }
                    }else{
                        showToast("Cập nhật không thành công")
                    }
                })
                // alert(JSON.stringify(param,null,2))
            } catch (error) {
                showToast(error)
            }
        }
    }
    onReset=()=>{
        this.setState({
            code:"",
            name:"",
            mass:"",
            color:[],
            valve:[],
            listColor:[],
            listValve:[],
        })
    }
    render(){
        const{code,name,mass,color,valve,listColor,listValve} =this.state;
      
        const listSelectColor = [];
        for (let i = 0; i < (listColor).length; i++) {
            listSelectColor.push(<Option key={listColor[i].id}>{listColor[i].name}</Option>);
        }

        const listSelectValve=[];
        for(let j = 0; j < listValve.length;j++){
            listSelectValve .push(<Option key={listValve[j].id}>{listValve[j].name}</Option>)
        }
        
        return(
            <div className="modal fade" id="create-typegascylinder" tabIndex="-1">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {this.props.isCreateMode ? "Tạo loại bình ": "Chỉnh sửa loại bình"}
                        </h5>
                        <button type="button" className="close" data-dismiss="modal">
                            <span aria-hidden="true" onClick={this.onReset}>&times;</span>
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
                                            <label>Mã bình</label>
                                            <Input className="form-control"
                                                // disabled={this.props.check}
                                                type="text" name="code" id="code"
                                                onChange={this.onChange}
                                                value={code}
                                                // validations={[required, isUppercase]}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Tên bình</label>
                                            <Input className="form-control" type="text" name="name"
                                                id="name" 
                                                onChange={this.onChange} 
                                                value={name} 
                                                // validations={[required, isUppercase]} 
                                                />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Khối lượng</label>
                                            <Input className="form-control" type="number" min="0" step="0.1" name="mass"
                                                id="mass" 
                                                onChange={this.onChange} 
                                                value={mass} 
                                                // validations={[required, isUppercase]} 
                                                />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Màu sắc</label>
                                            <Select
                                            mode="multiple"
                                            style={{ width: '100%' }}
                                            placeholder="Chọn màu sắc"
                                            value={color}
                                            onChange={this.handleChangeColor}
                                        >
                                            {listSelectColor}
                                        </Select>   
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Loại van</label>
                                        <Select
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        placeholder="Chọn loại van"
                                        value={valve}
                                        onChange={this.handleChangeValve}
                                    >
                                        {listSelectValve}
                                    </Select>   
                                    </div>
                                </div>
                                </div>
                            </div>
                            <footer className="card-footer text-center">
                                <Button className="btn btn-primary" id="button" type="submit">
                                  Lưu
              </Button>
                                <button
                                onClick={this.onReset}
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
        );
    }
}
export default typeCylinderForm;