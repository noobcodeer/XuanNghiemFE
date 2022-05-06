import React from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import required from "required";
import showToast from "showToast";
import getinformationWarehouseAPI from "../../../../api/getInformationWarehouseAPI";
import getWarehouseApi from '../../../../api/getWarehouseApi';
import Constant from "Constants";
import { withNamespaces } from "react-i18next";
import { Select,Tabs, Row } from "antd";
import getUserCookies from 'getUserCookies';
import changeWarehouseApi from "../../../../api/changeWarehouseApi";
import ReactCustomLoading from "ReactCustomLoading";
import getAllManufacturer from "../../../../api/getAllManufacturer";
import { CYLINDERTYPE,GETLISTMANUFACTURE } from "../../../config/config";
import callApi from "../../../util/apiCaller";
import axios from "axios";

var fileReader;
const Option = Select.Option;

class importWarehouseTranfer extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      content: "",
      listProducts: [],
      error: "",
      typeCustomer: "",
      id:"",
      token:"",
      listWares:null,
      toWarehouseFullorEmpty:null,
      loading: false,
      file: null,
      cylindersNotInSystem: [],
      manufactureName: '',
      cylinderTypeName: '',
      number: 0,
      listWaresInTab:null,
      fromWarehouseFullorEmpty: '',
      listCylinderColor: [],
      cylinderColor: "",
      listCylinderValves: [],
      cylinderValves: "",
      isOnlyCylindersNIS: false,
    };
  }

//   async submit(event) {
//   }

  async submitTextFile(event) {
    event.preventDefault();
    this.setState({ loading: true });
    let cylinders = [];
    let toWarehouseFullorEmpty = this.state.toWarehouseFullorEmpty;
    for(let idCylinder of this.state.listProducts){
        let id = idCylinder.id;
        cylinders.push(id)
    }

    const result = await changeWarehouseApi(
      cylinders,
      toWarehouseFullorEmpty,
      this.state.cylindersNotInSystem,
      this.state.fromWarehouseFullorEmpty,
      this.state.isOnlyCylindersNIS
    );
   
    if(result.status === 200 || result.status ===201){
        showToast(result.data,3000);
        this.fileInput.value = null;
        this.setState({
          loading: false,
          listProducts: [],
          listWares:null
        });
    }else{
        showToast(result.data.err_msg,3000);
        this.setState({ loading: false });
    }

  }
  async getListTypeCylinder(id, token) {
    let api = CYLINDERTYPE + "?id=" + id;
    await callApi("GET", api, '', token).then(res => {
      try {
        if (res.status === 200) {
          if (res.data.status === true) {
            this.setState({
              listTypeCylinder: res.data.data
            })
          } else {
            showToast(res.data.message
              ? res.data.message
              : "Lỗi sai dữ liệu của loại bình",
              2000)
          }
        } else {
          showToast("Lấy danh sách loại bình không thành công")
        }
      } catch (error) {
        showToast(error)
      }
    })
  };
  async componentDidMount() {
    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    
    let id = user_cookies.user.id;
    // console.log("promise",listManu);
    this.setState({
        id,
        token
    })
    this.setState({ user_type: user_cookies.user.userType });
    this.getListTypeCylinder(id,token);
    // get all manufacturer
    let manu = await axios.post(GETLISTMANUFACTURE,
    {'isChildOf': user_cookies.user.isChildOf },
    {
      headers: {
          "Authorization": "Bearer " + user_cookies.token
      }
  });
    this.setState({listAllManufacturer:manu.data.data})
    // getWarehouseApi(id,token,"Warehouse_EMPTY")
    // console.log("getWarehouseApi" ,getWarehouseApi);
    // get initial data
    this.getInitialWarehouse(id,token);
}
getInitialWarehouse = (id,token) => {
  let userType = 'Warehouse_EMPTY';
  this.getAllWareHouse(id, token,userType);
}
  handleFileUpload(event,isCheck) {
    this.setState({ loading: true });
    let that = this;
    let file = null;
    event.preventDefault();
    if (isCheck) {
      // console.log(this.fileInput.value)
      this.fileInput.value = null;
      this.setState({
        listWares:null,
        file,
        error: "",
        listProducts: [],
        loading: false,
      });
    }else{
      file = event.target.files[0];
      fileReader = new FileReader();
      fileReader.onload = async function (event) {
        // The file's text will be printed here
        let result = event.target.result;
        let array_id = result.split("\n");
        let cylinders_list = [];
  
        for (let i = 0; i < array_id.length; i++) {
          if (array_id[i].trim() !== "") {
            array_id[i].replace("\r", "").replace("\n", "");
            cylinders_list.push(array_id[i].trim());
          }
        }
     
        let resultSearch = await getinformationWarehouseAPI(
          cylinders_list,
        );
        cylinders_list = resultSearch.data;
        if (cylinders_list.length === 0) {
          showToast("Không tìm thấy bình có mã như tập tin");
        } else {
          if (resultSearch.status === 200) {
            if (resultSearch.data.hasOwnProperty("err_msg")) {
              showToast(resultSearch.data.err_msg);
              that.setState({
                error: resultSearch.data.err_msg,
                listProducts: [],
              });
              return;
            }
            showToast("Lấy dữ liệu thành công", 3000);
            that.setState({ loading: false, listProducts: cylinders_list, error: "" });
          //   that.props.getListProducts(cylinders_list);
          }
        }
      };
      fileReader.readAsText(file);
    }
  }
  async getAllWareHouse(id, token,userType) {
    let prams = {
        id: id,
        userType:userType,
    };

    const data = await getWarehouseApi(prams,token);
    this.setState({
        listWares:data,
        loading:false,
        toWarehouseFullorEmpty: data[0].id
    })
}
async getAllWareHouseInTab(id, token,userType) {
  let prams = {
      id: id,
      userType:userType,
  };

  const data = await getWarehouseApi(prams,token);
  // console.log("test data",data);
  this.setState({
      listWaresInTab:data,
      loading:false,
      fromWarehouseFullorEmpty: data[0].id
  })
}
  handleChangeTypeWarehouse = (value) => {
    this.setState({ loading: true });
   if(value === "Warehouse_EMPTY" || value === "Warehouse_FULL"){
    let {id,token}= this.state;
    let userType = value;
    this.getAllWareHouse(id, token,userType);
   }else{
       this.setState({
           listWares:null,
           loading:false
       })
   }
  };
  handleChangeTypeWarehouseInTab = (value) => {
    this.setState({ loading: true });
   if(value === "Warehouse_EMPTY" || value === "Warehouse_FULL"){
    let {id,token}= this.state;
    let userType = value;
    this.getAllWareHouseInTab(id, token,userType);
   }
   else{
       this.setState({
           listWaresInTab:null,
           loading:false,
       })
   }
   this.setState({fromWarehouseFullorEmpty: ''})
  };
  handleChangeWarehouse = (value)=>{
      this.setState({
        toWarehouseFullorEmpty:value
      });
  }
  handleChangeWarehouseInTab = (value) =>{
    this.setState({
      fromWarehouseFullorEmpty:value
    });
}
  handleAdd = () => {
    const manufactureNameId = ( this.state.cylindersNotInSystem.length > 0 )?this.state.cylindersNotInSystem[this.state.cylindersNotInSystem.length - 1].manufactureNameId + 1:0;
    const cylindersNotInSystem = [...this.state.cylindersNotInSystem];
    // get id ++
    let selectedCylinderType = this.state.listTypeCylinder.find(type => (type.name === this.state.cylinderTypeName));
    let selectedManufacture = this.state.listAllManufacturer.find(manu => (manu.name === this.state.manufactureName) );
    const created = {manufacture: selectedManufacture.id,manufactureName: this.state.manufactureName, cylinderType: selectedCylinderType.id , cylinderTypeName: this.state.cylinderTypeName, cylinderColor: this.state.cylinderColor, cylinderValves: this.state.cylinderValves , number: this.state. number, manufactureNameId};
    // push
    cylindersNotInSystem.push(created);
    this.setState({cylindersNotInSystem});
  }
  handleChangeCylinderType = (e) => {
    this.setState({cylinderTypeName: e.target.value});
    let selectedCylinderType = this.state.listTypeCylinder.find(type => type.name === e.target.value);
    // hanlde null
    if(selectedCylinderType === undefined)
      this.setState({listCylinderColor: [],listCylinderValves: []});
    else 
      this.setState({listCylinderColor: selectedCylinderType.colors,listCylinderValves: selectedCylinderType.valves});
  }
  render() {
      
    return (
      <div className="modal fade" id="warehouse-transfer" tabIndex="-1">
        <ReactCustomLoading isLoading={this.state.loading} />
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{this.props.t("WAREHOUSE_TRANFER")}</h5>
              <button type="button" className="close" data-dismiss="modal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Form
                ref={(c) => {
                  this.form = c;
                }}
                className="card"
                onSubmit={(event) => this.submitTextFile(event)}
              >
                <div className="card-body custom-scroll-table">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>{this.props.t("INPUT_INF")}</label>
                        <div style={{ display: "flex" }}>
                          <input
                            accept=".txt"
                            className="form-control"
                            type="file"
                            name="upload_file"
                            ref={(input) => {
                              this.fileInput = input;
                            }}
                            onChange={(event) => this.handleFileUpload(event)}
                            validations={[required]}
                          />
                          <input
                            type="reset"
                            onClick={() => {
                              this.setState({ error: "" });
                            }}
                          />
                        </div>
                      </div>
                      {this.state.error !== "" ? (
                        <div>
                          <label style={{ color: "red" }}>
                            {this.state.error}
                          </label>
                        </div>
                      ) : null}
                    </div>
                    <div className="col-md-3">
                    <div className="form-group">
                    <label>{this.props.t("CHOSEWAREHOUSE")}</label>
                          <Select defaultValue="Warehouse_EMPTY"
                            style={{ width: "100%" }}
                            onChange={this.handleChangeTypeWarehouse}
                            defaultValue={['Warehouse_EMPTY']}
                          >
                            
                            <Option value="Warehouse_EMPTY">
                                {this.props.t("SHELLSTORE")}
                            </Option>
                            <Option value="Warehouse_FULL">
                            {this.props.t("PRODUCTWAREHOUSE")}
                            </Option>
                          </Select>
                      </div>
                    </div>
                   {/* {this.state.listWares && ( */}
                        <div className="col-md-3">
                        <div className="form-group">
                        <label>{this.props.t("CHOSENAMEWAREHOUSE")}</label>
                              <Select
                                style={{ width: "100%" }}
                                placeholder="Chọn kho trực thuộc"
                                onChange={this.handleChangeWarehouse}
                                defaultValue="61333abfd18211173c89d834"
                                value={this.state.toWarehouseFullorEmpty}
                              >
                                {this.state.listWares?this.state.listWares.map((data,i)=>(
                                    <Option value={data.id} key ={i} >
                                        {data.name}
                                    </Option> 
                                )):
                                <Option value="61333abfd18211173c89d834" >
                                  Kho Vỏ
                                </Option> 
                                }
                              </Select>
                          </div>
                        </div>
                   {/* )} */}
                    {/* tabs */}
                    <div style={{width:'100%'}}>
                    <Tabs defaultActiveKey="1" size="small" style={{ marginBottom: 32 }}>
                      <Tabs.TabPane tab="Bình" key="1">
                        <table
                        className="table table-striped table-bordered seednet-table-keep-column-width"
                        cellSpacing="0"
                      >
                        <thead className="table__head">
                          <tr>
                            <th className="text-center w-70px align-middle">
                              {this.props.t("ID_NUMBER")}
                            </th>
                            {/*<th className="w-120px text-center align-middle">Id</th>*/}
                            <th className="w-120px text-center align-middle">
                              {this.props.t("CYLINDER_CODE")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.listProducts.map((store, index) => {
                            return (
                              <tr>
                                <td scope="row" className="text-center" key={index}>
                                  {index + 1}
                                </td>

                                {/*<td scope="row" className="text-center">{store.id}</td>*/}
                                <td scope="row" className="text-center">
                                  {store.serial}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                       </table>
                      </Tabs.TabPane>
                      <Tabs.TabPane tab="Chọn Bình" key="2">
                        <Row>
                          <input type="checkbox" name="chibinhtap" value={this.state.isOnlyCylindersNIS} onClick={() => this.setState({isOnlyCylindersNIS: !this.state.isOnlyCylindersNIS})} />
                          <label htmlFor="chibinhtap" className="ml-2"> Chỉ bình tạp</label>
                        </Row>
                        <Row>
                          <label className="mr-3">
                            Thương hiệu:
                            <select name="manufacter" value={this.state.manufactureName} onChange={(e) => this.setState({manufactureName: e.target.value})} className="ml-2">
                              <option value=''>Vui lòng chọn</option>
                              {
                              this.state.listAllManufacturer&&this.state.listAllManufacturer.map((data, index) => (
                                    <option key={index} value={data.name}>{data.name}</option>
                              ))
                              }
                            </select>
                          </label>
                          <label className="mr-3">
                            Loại bình:
                            <select name="valve" value={this.state.cylinderTypeName} onChange={(e) => this.handleChangeCylinderType(e)} className="ml-2">
                              <option value="">Vui lòng chọn</option>
                              { 
                              
                              this.state.listTypeCylinder&&this.state.listTypeCylinder.map((data, index) => (
                                    <option key={index} value={data.name}>{data.name}</option>
                              ))
                              }
                            </select>
                          </label>  
                          {/* {console.log(this.state.listTypeCylinder,"type")} */}
                          {/* Color */}
                          {/* <label className="mr-3">
                            Màu:
                            <select name="color" value={this.state.cylinderColor} onChange={(e) => this.setState({cylinderColor: e.target.value})} className="ml-2">
                              <option value="">Vui lòng chọn</option>
                              { 
                              
                              this.state.listCylinderColor&&this.state.listCylinderColor.map((data, index) => (
                                    <option key={index} value={data.name}>{data.name}</option>
                              ))
                              }
                            </select>
                          </label> */}
                          {/* Loại van */}
                          {/* <label className="mr-3">
                            Loại van:
                            <select name="valves" value={this.state.cylinderValves} onChange={(e) => this.setState({cylinderValves: e.target.value})} className="ml-2">
                              <option value="">Vui lòng chọn</option>
                              { 
                              
                              this.state.listCylinderValves&&this.state.listCylinderValves.map((data, index) => (
                                    <option key={index} value={data.name}>{data.name}</option>
                              ))
                              }
                            </select>
                          </label> */}
                          {/* Count */}
                          <label value={this.state. number} className="mr-3">
                            Số lượng:
                            <input type="number" onChange={(e) => this.setState({ number: e.target.value})} className="ml-2"></input>
                          </label>
                          {/* Add */}
                          <button className="btn btn-danger" type="button" onClick={this.handleAdd}>Thêm</button>
                          {/* chọn kho */}
                          <label className="ml-2">
                            Chọn kho: 
                            <select className="ml-2" onChange={(e) => this.handleChangeTypeWarehouseInTab(e.target.value)} >
                            <option value=''>
                              Chọn kho ...
                            </option>
                            <option value="Warehouse_EMPTY">
                                {this.props.t("SHELLSTORE")}
                            </option>
                            <option value="Warehouse_FULL">
                            {this.props.t("PRODUCTWAREHOUSE")}
                            </option>
                            </select>
                          </label>
                          {this.state.listWaresInTab && 
                        <div className="col-md-3">
                        <div className="form-group">
                        <label>{this.props.t("CHOSENAMEWAREHOUSE")}</label>
                              <select
                                // style={{ width: "100%" }}
                                placeholder="Chọn kho trực thuộc"
                                value={this.state.fromWarehouseFullorEmpty}
                                onChange={(e) => this.handleChangeWarehouseInTab(e.target.value)}
                              >
                                {/* <option value="">Vui lòng chọn kho</option> */}
                                {this.state.listWaresInTab?this.state.listWaresInTab.map((data,i)=>(
                                    <option value={data.id} key ={i}>
                                        {data.name}
                                    </option> 
                                )):null
                                // <option value="61333abfd18211173c89d834" selected="selected">
                                //   Kho Vỏ
                                // </option>
                                }
                              </select>
                          </div>
                        </div>
                   }
                        </Row>
                        <Row>
                          <table class="table">
                            <thead>
                              <tr>
                                <th scope="col">Thương hiệu</th>
                                <th scope="col">Loại bình</th>
                                {/* <th scope="col">Màu sắc</th> */}
                                {/* <th scope="col">Loại van</th> */}
                                <th scope="col">Số lượng</th>
                                <th scope="col">Thao tác</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.cylindersNotInSystem && this.state.cylindersNotInSystem.map((item, index) => {
                                return <tr key={index}>
                                  <td>{item.manufactureName}</td>
                                  <td>{item.cylinderTypeName}</td>
                                  {/* <td>{item.cylinderColor}</td> */}
                                  {/* <td>{item.cylinderValves}</td> */}
                                  <td>{item.number}</td>
                                  <td><button className="btn btn-danger" type="button" onClick={() => {
                                    let cylindersNotInSystemTemp = this.state.cylindersNotInSystem;
                                    this.setState({
                                      cylindersNotInSystem: cylindersNotInSystemTemp.filter(product => product.manufactureNameId !== item.manufactureNameId)
                                    })
                                  }}>Xóa</button> </td>
                                </tr>
                              })}
                            </tbody>
                          </table>
                        </Row>
                      </Tabs.TabPane>
                    </Tabs> 
                    </div>
                  </div>
                </div>
                <footer className="card-footer text-center">
                  <button
                    className="btn btn-primary"
                    disabled={(
                      typeof this.state.listProducts === "undefined" ||
                      this.state.listProducts.length === 0           ||
                      typeof this.state.listWares === "undefined"    ||
                      !this.state.toWarehouseFullorEmpty ) &&
                      !this.state.isOnlyCylindersNIS
                    //   this.state.listWares.length === 0
                    }
                    onClick={() => {
                      const modal = $("#warehouse-transfer");
                      modal.modal("hide");
                    }}
                    type="submit"
                  >
                    {this.props.t("SAVE")}
                  </button>
                  <button
                    className="btn btn-secondary"
                    type="reset"
                    data-dismiss="modal"
                    style={{ marginLeft: "10px" }}
                    onClick={(event) => this.handleFileUpload(event, true)}
                  >
                    {this.props.t("CLOSE")}
                  </button>
                  {/* {   console.log("test ware house",this.state.toWarehouseFullorEmpty)}  */}
                </footer>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withNamespaces()(importWarehouseTranfer);
