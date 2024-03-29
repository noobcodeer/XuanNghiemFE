import React from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import required from "required";
import showToast from "showToast";
import getInfomationFromTruckApi from "../../../../api/getInfomationFromTruckApi";
import getWarehouseApi from '../../../../api/getWarehouseApi';
import Constant from "Constants";
import { withNamespaces } from "react-i18next";
import { Select,Tabs, Row, /* DatePicker, */ Checkbox } from "antd";
import getUserCookies from 'getUserCookies';
import createTurnBackVehicleApi from "../../../../api/createTurnBackVehicleApi";
import ReactCustomLoading from "ReactCustomLoading";
import { NAMEDRIVE } from "./../../../config/config";
import callApi from "./../../../util/apiCaller";
import axios from "axios";
import { GETLISTMANUFACTURE,CYLINDERTYPE } from "./../../../config/config";
import DatePicker from "react-datepicker";
import moment from "moment";


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
      listDriver:[],
      isDriver:null,
      cylindersNotInSystem: [],
      listAllManufacturer: [],
      manufactureName: '',
      cylinderTypeName: '',
      listTypeCylinder: [],
      number: 0,
      listCylinderColors: [],
      cylinderColor: '',
      listCylinderValves: [],
      cylinderValves: '',
      isOnlyCylindersNIS: false,
      checked: false,
      returnDate: moment()
    };
  }

//   async submit(event) {
//   }


  async submitTextFile(event) {
    event.preventDefault();
    this.setState({ loading: true });
    let cylinders = [];
    let isDriver = this.state.isDriver;
    let toWarehouseFullorEmpty = this.state.toWarehouseFullorEmpty;
    for(let idCylinder of this.state.listProducts){
        let id = idCylinder.id;
        cylinders.push(id)
    }
    // console.log(cylinders,this.state.toWarehouseFullorEmpty,this.state.isDriver)
    const result = await createTurnBackVehicleApi(
      cylinders,
      toWarehouseFullorEmpty,
      isDriver,
      this.state.cylindersNotInSystem,
      this.state.isOnlyCylindersNIS,
      this.state.checked ? this.state.returnDate : '',
    );
  //  console.log("isOnlyInis:", this.state.isOnlyCylindersNIS);
    if(result.status === 200 || result.status ===201){
     
        showToast(result.data,3000);
        this.fileInput.value = null;
        this.setState({
          loading: false,
          listProducts: [],
        });
    }else{
        showToast("đã gặp vấn đề trong quá trình chuyển kho vui lòng kiểm tra lại",3000);
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
  handleAdd = () => {
    const manufactureNameId = ( this.state.cylindersNotInSystem.length > 0 )?this.state.cylindersNotInSystem[this.state.cylindersNotInSystem.length - 1].manufactureNameId + 1:0;
    const cylindersNotInSystem = [...this.state.cylindersNotInSystem];
    // get id ++
    let selectedCylinderType = this.state.listTypeCylinder.find(type => (type.name === this.state.cylinderTypeName));
    let selectedManufacture = this.state.listAllManufacturer.find(manu => (manu.name === this.state.manufactureName) );
    const created = {manufacture: selectedManufacture.id,manufactureName: this.state.manufactureName, cylinderType: selectedCylinderType.id , cylinderTypeName: this.state.cylinderTypeName, cylinderColor: this.state.cylinderColor, cylinderValves: this.state.cylinderValves, number: this.state. number, manufactureNameId};
    // push
    cylindersNotInSystem.push(created);
    this.setState({cylindersNotInSystem});
  }
  async getAllWareHouse(id, token,userType) {
    let prams = {
        id: id,
        userType:userType,
    };

    const data = await getWarehouseApi(prams,token);
    this.setState({
        listWares:data,
        loading:false
    })
}
  async componentDidMount() {
    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let id = user_cookies.user.id;
    let params = {
      id: user_cookies.user.id,
    };
    this.setState({
        id,
        token
    })
    this.setState({ user_type: user_cookies.user.userType });

    this.getAllWareHouse(id, token,"Warehouse_EMPTY");

    await callApi("POST", NAMEDRIVE, params, token).then((res) => {
      if (res.data.data <= 0) {
        this.setState({
          listDriver: [
            {
              name: "Bạn chưa có tài xế",
              id: "null",
            },
          ],
        });
      } else {
        //console.log(user_cookie.user.id+""+res.data.data);
        this.setState(
          {
            listDriver: res.data.data,
          }
        );
      }
    });
    // get all manufacturer
    let manu = await axios.post(GETLISTMANUFACTURE,
      {'isChildOf': user_cookies.user.isChildOf },
      {
        headers: {
            "Authorization": "Bearer " + user_cookies.token
        }
    });
      this.setState({listAllManufacturer:manu.data.data});
      this.getListTypeCylinder(id,token);
}

  handleFileUpload(event,isCheck) {
    this.setState({ loading: true });
    let isDriver = this.state.isDriver;
    let that = this;
    let file = null;
    event.preventDefault();
    if (isCheck) {
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
     
        let resultSearch = await getInfomationFromTruckApi(
          cylinders_list,
          isDriver
        );
        cylinders_list = resultSearch.data;
        if (cylinders_list.length === 0) {
          showToast("Không tìm thấy bình có mã như tập tin");
          that.setState({ loading: false,});
        } else {
          if (resultSearch.status === 200) {
            if (resultSearch.data.hasOwnProperty("err_msg")) {
              showToast(resultSearch.data.err_msg);
              that.setState({
                error: resultSearch.data.err_msg,
                listProducts: [],
              });
              that.setState({ loading: false});
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
        loading:false
    })
}
  handleChageSelectDriver = (value) => {
    this.setState({
      isDriver:value
    })
  };
  handleChangeWarehouse = (value)=>{
      this.setState({
        toWarehouseFullorEmpty:value
      });
  }
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
  handleChangeCylinderType = (e) => {
    this.setState({cylinderTypeName: e.target.value});
    let selectedCylinderType = this.state.listTypeCylinder.find(type => type.name === e.target.value);
    if(selectedCylinderType === undefined)
      this.setState({listCylinderColors: [],listCylinderValves: []});
    else
      this.setState({listCylinderColors: selectedCylinderType.colors, listCylinderValves: selectedCylinderType.valves});
  }

  onChangeSelectDate = (e) => {
		// console.log('select: ', e.target.checked, this.state.returnDate)
    if (e.target.checked === false) {
      this.setState({ returnDate: moment() })
    }
		this.setState({
			checked: e.target.checked,
		});
	};

  onChangeReturnDate = (date) => {
		// console.log('ngày', date)
		this.setState({
			returnDate: date.endOf('day'),
		});
	};

  render() {
    // console.log(this.state.listWares)
    // console.log(
    //   'BINH_TAP',
    //   this.state.listProducts.length,
    //   this.state.listProducts,
    //   this.state.isOnlyCylindersNIS,
    //   this.state.cylindersNotInSystem
    // )


    return (
      <div className="modal fade" id="return-vehicle" tabIndex="-1">
        <ReactCustomLoading isLoading={this.state.loading} />
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{this.props.t("RETURN_VEHICLE")} - Nhập file</h5>
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
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>{this.props.t("INPUT_INF")}</label>
                        <div style={{ display: "flex" }}>
                          <input
                          disabled={
                              typeof this.state.isDriver === "undefined" ||
                              !this.state.isDriver   
                            }
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
                              // console.log('RESET')
                              this.setState({ error: "", listProducts: [], isOnlyCylindersNIS: false });
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
                        {/* <label>{this.props.t("RETURN_DATE")}</label> */}
                        <Checkbox onChange={this.onChangeSelectDate}>{this.props.t("RETURN_DATE")}</Checkbox>
                        <DatePicker
                          disabled={!this.state.checked}
                          selected={this.state.returnDate}
                          onChange={this.onChangeReturnDate}
                        />
                      </div>
                    </div>

                    <div className="col-md-3">
                    <div className="form-group">
                    <label>{this.props.t("NAME_DRIVER")}</label>
                          <Select
                            style={{ width: "100%" }}
                            placeholder="chọn tài xế..."
                            onChange={this.handleChageSelectDriver}
                          >
                            <Option value=" ">
                                {" "}
                            </Option>
                           {this.state.listDriver?this.state.listDriver.map((dt,i)=>{
                             return(
                              <Option value={dt.id} key={i}>
                                  {dt.name}
                              </Option>
                           )}):null}
                          </Select>
                      </div>
                    </div>
                  
                        <div className="col-md-3">
                        <div className="form-group">
                        <label>{this.props.t("CHOSENAMEWAREHOUSE")}</label>
                              <Select
                                style={{ width: "100%" }}
                                placeholder="Chọn kho trực thuộc"
                                onChange={this.handleChangeWarehouse}
                                disabled={
                                  ( this.state.listProducts.length === 0 || !this.state.listProducts )
                                  && !this.state.isOnlyCylindersNIS
                                }
                              >
                                {this.state.listWares?this.state.listWares.map((data,i)=>(
                                    <Option value={data.id} key ={i}>
                                        {data.name}
                                    </Option> 
                                )):null}
                              </Select>
                          </div>
                        </div>
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
                            {/* color */}
                            {/* <label className="mr-3">
                              Màu sắc:
                              <select name="color" value={this.state.cylinderColor} onChange={(e) => this.setState({cylinderColor: e.target.value})} className="ml-2">
                                <option value="">Vui lòng chọn</option>
                                { 
                                
                                this.state.listCylinderColors&&this.state.listCylinderColors.map((data, index) => (
                                      <option key={index} value={data.name}>{data.name}</option>
                                ))
                                }
                              </select>
                            </label> */}
                            {/* valves */}
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
                            {/* count */}
                            <label value={this.state. number} className="mr-3">
                              Số lượng:
                              <input type="number" onChange={(e) => this.setState({ number: e.target.value})} className="ml-2"></input>
                            </label>
                            <button className="btn btn-danger" type="button" onClick={this.handleAdd}>Thêm</button>
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
                                    <td>{item. number}</td>
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
                    disabled={
                      (
                        !this.state.isOnlyCylindersNIS &&
                        this.state.listProducts.length === 0
                      )
                      ||
                      (
                        this.state.isOnlyCylindersNIS &&
                        this.state.cylindersNotInSystem.length === 0
                      )
                    }
                    onClick={() => {
                      const modal = $("#return-vehicle");
                      modal.modal("hide");
                    }}
                    data-target="#turn-back-vehicle"
                    data-toggle="modal"
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
