import React from 'react';
import PropType from 'prop-types';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Select from 'react-validation/build/select';
import Button from 'react-validation/build/button';
import required from 'required';
import Constant from "Constants";
import {withNamespaces} from 'react-i18next';
import moment from 'moment';
import ExportJsonExcel from 'js-export-excel';
var fileReader;
class EditProductPopup extends React.Component {

    constructor(props) {
        super(props);
        this.form = null;
        this.state = {
            color:  typeof this.props.productDetail!=='undefined'?this.props.productDetail.color:"",
            weight: 0,
            checkedDate: '',
            status: '',
            emptyOrFull: '',
            currentImportPrice: 0,
            store: "",
            image: "",
            valve:typeof this.props.productDetail!=='undefined'?this.props.productDetail.valve:"",
            cylinderType:"",
            listColor:[],
            listValve:[],
            historyCylinder: []
        };

    }


    fileChangedHandler = (event) => {
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (e) => {
                this.setState({image: e.target.result});
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    };


    async submit(event) {

        event.preventDefault();
        // if (this.state.position.length === 0) {
        //     showToast('Chưa chọn vị trí!', 3000);
        //     return;
        // }
        let data = this.form.getValues();
        // let updateGeneral=null,updateAgency=null;
        // if(data.general===null||data.general==="")
        // {
        //     updateGeneral=null;
        // }
        // else
        // {
        //     updateGeneral=this.props.listGeneralUser[parseInt(data.general)].id;
        // }
        // if(data.agency===null||data.agency==="")
        // {
        //     updateAgency=null;
        // }
        // else
        // {
        //     updateAgency=this.props.listAgencyUser[parseInt(data.agency)].id;
        // }
        // console.log('data', data)

        await this.props.editProduct(data.serial, this.state.color, data.checkedDate, parseFloat(data.weight), Constant.PLACESTATUS_ENUM[parseInt(data.status)].key, Constant.STATUS_ENUM[parseInt(data.emptyOrFull)].key
            , parseInt(data.currentImportPrice[0]), this.state.store.manufacture.id, this.state.image,this.state.cylinderType, this.state.valve);
        const modal = $("#edit-product");
        modal.modal('hide');
        return;
    }

    componentWillReceiveProps(nextprops) {
        if (nextprops.store !== this.props.store && nextprops.store !== "") {
            this.setState({store: nextprops.store})
        }
        if(nextprops.productDetail!==""){
            this.setState({
                cylinderType:nextprops.productDetail.cylinderType?nextprops.productDetail.cylinderType.id:'',  
                color: nextprops.productDetail?nextprops.productDetail.color:"",
                valve:nextprops.productDetail?nextprops.productDetail.valve:"",
            })
        }
    }


    componentWillMount() {
        this.props.store;
    }
    
    selectOptionHandler=(e)=>{
        let target = e.target;
        let name = target.name;
        let value = target.value;
        if(name === 'cylinderType'){
            if(value !==''){
               this.props.listTypeCylinder.map(todo=>{
                    if(todo.id === value){
                        this.setState({
                            listValve:todo.valves,
                            listColor:todo.colors,
                        })
                    }
                })
            }else{
                this.setState({
                    listValve:[],
                    listColor:[],
                })
            }  
        }
        this.setState({
            [name]: value
        });
    }
    // handleExportExcelFile = () => {
    //     let viTriHienTai = [];
    //     let trangThai = [];
    //     if(this.props.productDetail.placeStatus !== undefined) {
    //         viTriHienTai = Constant.PLACESTATUS_ENUM.filter(o => o.key === this.props.productDetail.placeStatus)
    //     }
    //     if(this.props.productDetail.status !== undefined) {
    //         trangThai = Constant.STATUS_ENUM.filter(o => o.key === this.props.productDetail.status)
    //     }
    //     let dataTable = [{
    //         mb: this.props.store.serial,
    //         lb: this.props.store.cylinderType.name,
    //         ms: this.props.store.color,
    //         lv: this.props.store.valve,
    //         cn: this.props.store.weight,
    //         nkd: moment(this.props.store.checkedDate).format("DD/MM/YYYY"),
    //         th: this.props.store.manufacture.name,
    //         vtht: viTriHienTai[0].value,
    //         tt: trangThai[0].value}]
    //         let option = {};
    //         option.fileName = "Thông tin sản phẩm " + this.props.store.serial;
    //         option.datas = [
    //             {
    //                 sheetData: dataTable,
    //                 sheetName: 'Thông tin sản phẩm',
    //                 sheetFilter:['mb','lb','ms', 'lv', 'cn', 'nkd', 'th', 'vtht', 'tt'],
    //                 sheetHeader:['Mã bình ','Loại bình','Màu sắc', 'Loại van', 'Cân nặng', 'Ngày kiểm định', 'Thương hiệu', 'Vị trí hiện tại', 'Trạng thái'],
    //                 columnWidths:[5,4,4,4,4,8,8,8,5]
    //             }
    //         ];
            

    //             let toExcel = new ExportJsonExcel(option); 
    //             toExcel.saveExcel();
    // }
    render() {
        let countEXPORT = 0;
        let countTURN_BACK = 0;
        let countIMPORT = 0;
        let countSALE = 0;
        let countGIVE_BACK = 0;
        let countTURN_BACK_NOT_IN_SYSTEM = 0;
        let countEXPORT_TO_WAREHOUSE = 0;
        let countIMPORT_TO_WAREHOUSE = 0;
        return (
            <div className="modal fade" id="edit-product" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            {this.props.modalStatus === 1 ? (<h5>Thông tin sản phẩm</h5>) : (<h5 className="modal-title">{this.props.t('UPDATE_PRODUCT')}</h5>)}
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <Form ref={c => {
                                this.form = c
                            }} className="card" onSubmit={(event) => this.submit(event)}>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>{this.props.t('CYLINDER_CODE')}</label>
                                                <Input disabled={true} className="form-control"
                                                       value={this.props.productDetail.serial}
                                                       type="text" name="serial"
                                                       validations={this.state.store.factory !== this.props.parentRoot ? "" : [required]}/>
                                            </div>
                                            <div className="form-group">
                                                <label>{this.props.t('CYLINDER_TYPE')}</label>
                                                {/* <Input className="form-control" type="text" name="cylinderType" id="cylinderType"
                                                       disabled={this.state.store.factory !== this.props.parentRoot}
                                                       value={this.props.productDetail.cylinderType}
                                                       validations={this.state.store.factory !== this.props.parentRoot ? "" : [required]}/> */}
                                                <Select className="form-control"
                                                    name="cylinderType"
                                                    id="cylinderType"
                                                    disabled={this.props.modalStatus === 1 ? true : false}
                                                    value={this.state.cylinderType}
                                                    onChange={this.selectOptionHandler}
                                                    validations={this.state.store.factory !== this.props.parentRoot ? "" : [required]}>
                                                    {this.props.listTypeCylinder.map((data,index)=>(
                                                        <option value={data.id} key={index}>{data.name}</option>
                                                    ))}
                                                </Select>
                                            </div>
                                            <div className="form-group">
                                                <label>{this.props.t('COLOR')}</label>
                                             
                                                {/* <Input className="form-control" type="text" name="color" id="color"
                                                       disabled={this.state.store.factory !== this.props.parentRoot}
                                                       value={this.props.productDetail.color}
                                                       validations={this.state.store.factory !== this.props.parentRoot ? "" : [required]}/> */}
                                                <Select className="form-control"
                                                    name="color"
                                                    id="color"
                                                    disabled={this.props.modalStatus === 1 ? true : false}
                                                    value={this.state.color}
                                                    onChange={this.selectOptionHandler}
                                                    validations={this.state.store.factory !== this.props.parentRoot ? "" : [required]}>
                                                    <option value="">{this.props.modalStatus === 1 ? this.props.store.color : this.props.t('CHOOSE')}</option>
                                                    {this.state.listColor.length!==0?this.state.listColor.map((data,index)=>(
                                                        <option value={data.name} key={index}>{data.name}</option>
                                                    )):this.props.listTypeCylinder.map(todo=>{
                                                        if(todo.id === this.state.cylinderType){
                                                            return(
                                                                todo.colors.map((data,index)=>(
                                                                    <option value={data.name} key={index}>{data.name}</option>
                                                                ))
                                                            )
                                                        }
                                                    }   
                                                    )}
                                                </Select>
                                            </div>
                                            <div className="form-group">
                                                <label>{this.props.t('TYPE_VALVE')}</label>
                                                {/* <Input className="form-control" type="text" name="color" id="color"
                                                       disabled={this.state.store.factory !== this.props.parentRoot}
                                                       value={this.props.productDetail.color}
                                                       validations={this.state.store.factory !== this.props.parentRoot ? "" : [required]}/> */}
                                                <Select className="form-control"
                                                    name="valve"
                                                    id="valve"
                                                    disabled={this.props.modalStatus === 1 ? true : false}
                                                    value={this.state.valve}
                                                    onChange={this.selectOptionHandler}
                                                    validations={this.state.store.factory !== this.props.parentRoot ? "" : [required]}>
                                                    <option value="">{this.props.modalStatus === 1 ? this.props.store.valve : this.props.t('CHOOSE')}</option>
                                                    {this.state.listValve.length!==0?this.state.listValve.map((data,index)=>(
                                                        
                                                        <option value={data.name} key={index}>{data.name}</option>
                                                    )):this.props.listTypeCylinder.map(todo=>{
                                                        if(todo.id === this.state.cylinderType){
                                                            return(
                                                                todo.valves.map((data,index)=>(
                                                                    <option value={data.name} key={index}>{data.name}</option>
                                                                ))
                                                            )
                                                        }
                                                    }   
                                                    )}
                                                </Select>
                                            </div>
                                            <div className="form-group">
                                                <label>{this.props.t('WEIGHT')}</label>
                                                <Input className="form-control" type="number" name="weight" id="weight"
                                                       value={this.props.productDetail.weight}
                                                       disabled={this.state.store.factory !== this.props.parentRoot}
                                                       onKeyDown={ e => (e.keyCode === 69 || e.keyCode === 107 || e.keyCode === 109 || e.keyCode === 190) && e.preventDefault() }
                                                       validations={this.state.store.factory !== this.props.parentRoot ? "" : [required]}/>
                                            </div>
                                            {/*<div className="form-group">
                                                <label>Giá bán</label>
                                                <Input className="form-control" type="number" name="currentImportPrice"
                                                       id="currentImportPrice"
                                                       disabled={this.state.store.factory !== this.props.parentRoot}
                                                       value={this.props.productDetail.currentSalePrice}
                                                       validations={this.state.store.factory !== this.props.parentRoot ? "" : [required]}/>
                                            </div>*/}
                                        </div>
                                        {/* modal info productDetail */}
                                        {this.props.modalStatus === 1 ? (
                                        <div className="col-md-6">
                                            <div className="row d-flex flex-column">
                                                <div className="font-weight-bold text-muted">Vòng đời</div>
                                                <div className="border border-secondary p-3">
                                                    <div className="mt-auto pl-3 d-block" >
                                                    {this.handleShowLifeCycle}
                                                        <ul className="life_cycle_cylinder" style={{"overflow" : "auto", "height": "300px", 'display': "flex"}}>
                                                        <li>Ngày khởi tạo: <span>{
                                                            this.props.productDetail.createdAt ?
                                                            moment(this.props.productDetail.createdAt).format("DD/MM/YYYY")  : 
                                                            ""}</span>
                                                        </li>
                                                        {this.props.historyCylinderArr.map((data, index) => {
                                                            switch (data.type) {
                                                                case "EXPORT":
                                                                countEXPORT += 1;
                                                                break;
                                                                case "IMPORT":
                                                                countIMPORT += 1;
                                                                break;
                                                                case "TURN_BACK":
                                                                countTURN_BACK += 1;
                                                                break;
                                                                case "EXPORT_TO_WAREHOUSE":
                                                                countEXPORT_TO_WAREHOUSE += 1;
                                                                break;
                                                                case "IMPORT_TO_WAREHOUSE":
                                                                countIMPORT_TO_WAREHOUSE += 1;
                                                                break;
                                                                case "TURN_BACK_NOT_IN_SYSTEM":
                                                                countTURN_BACK_NOT_IN_SYSTEM += 1;
                                                                break;
                                                                case "GIVE_BACK":
                                                                countGIVE_BACK += 1;
                                                                break;
                                                                case "SALE":
                                                                countSALE += 1;
                                                            }
                                                            return(
                                                            <li key={index}>{
                                                                data.type === "EXPORT" ? `Ngày bán ra lần thứ ${countEXPORT}: `: 
                                                                data.type === "IMPORT" ? `Ngày thu hồi lần thứ ${countIMPORT}: ` : 
                                                                data.type === "TURN_BACK" ? `Ngày hồi lưu lần thứ ${countTURN_BACK}: `:  
                                                                data.type === "EXPORT_TO_WAREHOUSE" ? `Ngày xuất kho lần thứ ${countEXPORT_TO_WAREHOUSE}: ` : 
                                                                data.type === "IMPORT_TO_WAREHOUSE" ? `Ngày nhập kho lần thứ ${countIMPORT_TO_WAREHOUSE}: ` : 
                                                                data.type === "TURN_BACK_NOT_IN_SYSTEM" ? `Hồi lưu ngoài hệ thống lần thứ ${countTURN_BACK_NOT_IN_SYSTEM}: ` : 
                                                                data.type === "GIVE_BACK" ? `Trả lại lần thứ ${countGIVE_BACK}: ` :
                                                                data.type === "SALE" ? `Bán lần thứ ${countSALE}: ` : data.type
                                                            }
                                                            <b>{moment(data.createdAt).format("DD/MM/YYYY")}</b></li>
                                                        )})}
                                                        
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div> 
                                        </div>
                                        ) : ""}

                                        {/*<div className="col-md-6">
                                            <div>Hình ảnh</div>
                                            <input type="file" name="logo" data-provide="dropify"
                                                   disabled={this.state.store.factory !== this.props.parentRoot}
                                                   onChange={(event) => this.fileChangedHandler(event)}
                                                   validations={this.state.store.factory !== this.props.parentRoot ? "" : [required]}/>
                                        </div>*/}
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">

                                            <div className="form-group">
                                                <label>{this.props.t('VERIFY_DATE')}</label>
                                                <div className="input-group"
                                                    style={{display:"flex", flexWrap: "nowrap"}}
                                                >
                                                    <Input ref={this.expiration_dateRef} type="text"
                                                           className="form-control"
                                                           value={this.props.productDetail.checkedDate}
                                                           name="checkedDate" id="checkedDate"
                                                           data-date-format="dd/mm/yyyy"
                                                           disabled={this.state.store.factory !== this.props.parentRoot}
                                                           data-provide="datepicker"/>
                                                    <div className="input-group-append">
                                                                        <span className="input-group-text"><i
                                                                            className="fa fa-calendar"></i></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>{this.props.t('BRANCH')}</label>
                                                <Input className="form-control" type="text" name="currentImportPrice"
                                                       disabled={true} id="currentImportPrice"
                                                       value={this.state.store.hasOwnProperty("manufacture") ? this.state.store.manufacture.name : ""}/>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>{this.props.t('NOW_PLACE')}</label>
                                                <Select className="form-control"
                                                        name="status"
                                                        value=
                                                            {Constant.PLACESTATUS_ENUM.find(o => o.key === this.props.productDetail.placeStatus) !== undefined
                                                                ? Constant.PLACESTATUS_ENUM.findIndex(o => o.key === this.props.productDetail.placeStatus)
                                                                : ""}
                                                        disabled={true}>
                                                    <option value="">{this.props.t('CHOOSE')}</option>
                                                    {Constant.PLACESTATUS_ENUM.map((item, index) => <option
                                                        value={index} key={index}>{item.value}</option>)}
                                                </Select>
                                            </div>
                                            <div className="form-group">
                                                <label>{this.props.t('STATUS')}</label>
                                                <Select className="form-control"
                                                        name="emptyOrFull"
                                                        value=
                                                            {Constant.STATUS_ENUM.find(o => o.key === this.props.productDetail.status) !== undefined
                                                                ? Constant.STATUS_ENUM.findIndex(o => o.key === this.props.productDetail.status)
                                                                : ""}
                                                        disabled={true}>
                                                    <option value="">{this.props.t('CHOOSE')}</option>
                                                    {Constant.STATUS_ENUM.map((item, index) => <option value={index}
                                                                                                       key={index}>{item.value}</option>)}
                                                </Select>
                                            </div>
                                        </div>

                                        {/*<div className="col-md-6">*/}
                                        {/*</div>*/}
                                    </div>
                                </div>

                                <footer className="card-footer text-center">
                                    {this.props.modalStatus === 1 ? <div></div> : <Button type="submit" className="btn btn-primary">{this.props.t('SAVE')}</Button>}
                                    <button className="btn btn-secondary" type="reset" data-dismiss="modal"
                                            style={{marginLeft: "10px"}}>{this.props.t('CLOSE')}
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

EditProductPopup.propType = {
    addStore: PropType.func.isRequired,
    jobMetaData: PropType.object.isRequired,
    updateStoreImage: PropType.func.isRequired
};

export default withNamespaces()(EditProductPopup) ;
