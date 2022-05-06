import React from "react";
import Constants from "Constants";
import showToast from "showToast";
import deleteUserAPI from "deleteUserAPI";
import getListBranchAPI from "./../../../../api/getListBranchAPI";
import getUserCookies from "getUserCookies";
import callApi from '../../../util/apiCaller';
import { GETTYPECUSTOMER, GETAREA } from '../../../config/config';
import { withNamespaces } from 'react-i18next';
import { Tooltip, Pagination } from "antd";
import AddDA from './AddDA'
import EditDA from './EditDA'

class General extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listUsers: [],
      listBrand: [],
      listUsersBackUp: [],
      listArea: [],
      user_type: "",
      userEdit: {},
      isCreateMode: true,
      isCreateThanhtra: true,
      customerId: '',
      isLoading: false,
      isNew: false,
      isShowAddModal: false,
      currentPage: 1, //page hiện tại
      minIndex: 0,
      maxIndex: 10,
      isShowEditModal: false,
      dataEdit: {}
    };
  }

  refresh() {
    this.forceUpdate(async () => {
      // await this.getAllUser();
      //this.setState({userEdit:{}});
      let user_cookies = await getUserCookies();
      let token = "Bearer " + user_cookies.token;
      let id = user_cookies.user.id;
      // this.setState({ user_type: user_cookies.user.userType });
      //this.getAllUser();
      await this.getDistributionAgencyCustomer(id, token);
    });
  }

  async deleteUser(id) {
    var answer = window.confirm("Bạn có chắc chắn muốn xóa");
    if (answer) {
      const user = await deleteUserAPI(id);

      //console.log('register',user);
      if (user) {
        if (user.status === Constants.HTTP_SUCCESS_BODY) {
          showToast("Xóa Thành Công!", 3000);
          this.refresh();
          return true;
        } else {
          showToast(
            user.data.message ? user.data.message : user.data.err_msg,
            2000
          );
          return false;
        }
      } else {
        showToast("Xảy ra lỗi trong quá trình xóa người dùng ");
        return false;
      }
    }
  }

  Xoa_Dau_VN(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
  }

  async getListBr(id) {
    // console.log(" vao getlistbr");
    // console.log("id ", id);
    this.setState({ isLoading: true })
    const dataApi = await getListBranchAPI(id);
    // console.log("data", dataApi.data.data);

    if (dataApi.data.success) {
      let temp = [];
      let i = 0;
      for (let item of dataApi.data.data) {
        temp.push({
          key: i,
          agencyId: item.id ? item.id : '',
          agencyCode: item.agencyCode ? item.agencyCode : '',
          agencyName: item.name ? item.name : '',
          email: item.email ? item.email : '',
          address: item.address ? item.address : '',
        });
        i++;
      }

      // this.setState({ listBrand: dataApi.data.data })
      this.setState({
        listBrand: temp,
        isLoading: false
      })
    }
    else {
      this.setState({
        listBrand: [],
        isLoading: false
      })
    }
  }

  async editUser(item) {
    await this.setState({
      isShowEditModal: true,
      dataEdit: item
    })
  }
  async componentDidMount() {
    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let id = user_cookies.user.id;
    this.setState({ user_type: user_cookies.user.userType });
    await this.setState({
      token,
      id: user_cookies.user.id
    })
    await this.getDistributionAgencyCustomer(id, token);
    await this.getArea(id, token);
  }

  async getArea(id, token) {
    await callApi("GET", GETAREA, "", token).then(res => {
      if (res.data) {
        if (res.data.success === true) {
          this.setState({
            listArea: res.data.data,
          });
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

  async getDistributionAgencyCustomer(id, token) {
    let reqListCustomer = {
      isChildOf: id,
      customerType: "Distribution_Agency"
    };
    let params = {
      reqListCustomer
    };
    await callApi("POST", GETTYPECUSTOMER, params, token).then(res => {
      if (res.data) {
        if (res.data.success === true) {
          this.setState({
            listUsers: res.data.data,
            listUsersBackUp: res.data.data
          });

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

  distributionAgency = async () => {
    this.setState({
      isShowAddModal: true
    })
  }

  closeModal = async () => {
    this.setState({
      isShowAddModal: false
    })
    this.getDistributionAgencyCustomer(this.state.id, this.state.token)
  }

  closeModalEdit = async () => {
    this.setState({
      isShowEditModal: false
    })
    this.getDistributionAgencyCustomer(this.state.id, this.state.token)
  }

  handleChangePage = (page) => {
    this.setState({
      currentPage: page,
      minIndex: (page - 1) * 10,
      maxIndex: page * 10
    });
  };
  render() {
    return (
      <div className="main-content">
        <div className="card">
          <div className="card-title">
            <div className="flexbox">
              <h4>{this.props.t("DISTRIBUTOR")}</h4>

              <div className="row">
                <button
                  onClick={this.distributionAgency}
                  style={{
                    marginLeft: "5px",
                    height: "40px",
                    width: "180px",
                    fontFamily: `"Times New Roman", Times, serif`,
                    fontSize: 18,
                    borderStyle: "solid"
                  }}
                  className="btn btn-sm btn-create"
                  data-toggle="modal"
                  data-target="#create-user"
                >
                  {this.props.t("CREATE_NEW_DISTRIBUTOR")}
                </button>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive-xl">
              <div className="dataTables_wrapper container-fluid dt-bootstrap4">
                <div className="row">
                  <div className="col-sm-12">
                    <table
                      className="table table-striped table-bordered seednet-table-keep-column-width"
                      cellSpacing="0"
                    >
                      <thead >
                        <tr className="table_head_distributionAgency" style={{ backgroundColor: "#432B6F" }}>
                          <th className="text-center w-60px align-middle">{this.props.t("ID_NUMBER")}</th>
                          <th className="w-150px text-center align-middle">{this.props.t("CUSTOMER_ID")}</th>
                          <th className="w-150px text-center align-middle">{this.props.t("LOGIN_ACCOUNT")} </th>
                          <th className="w-150px text-center align-middle">{this.props.t("CUSTOMER_DISTRIBUTOR")}</th>
                          <th className="w-150px text-center align-middle">{this.props.t("ADDRESS")}</th>
                          <th className="w-150px text-center align-middle">{this.props.t("AREA")}</th>
                          <th className="w-100px text-center align-middle">{this.props.t("ACTION")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.listUsers.map((store, index) => {
                          // console.log("abd", this.state.listUsers);
                          // if (store.area !== null)
                            return (
                              (index >= this.state.minIndex && index < this.state.maxIndex) ? (
                                <tr key={index}>
                                  <td scope="row" className="text-center">
                                    {index + 1}
                                  </td>
                                  <td scope="row" className="text-center">
                                    {store.customerCode}
                                  </td>
                                  {/*<td scope="row" className="text-center">{store.id}</td>*/}
                                  <td scope="row" className="text-center">
                                    {store.email}
                                  </td>
                                  <td scope="row" className="text-center">
                                    {store.name}
                                  </td>
                                  <td scope="row" className="text-center">
                                    {store.invoiceAddress}
                                  </td>
                                  <td scope="row" className="text-center">
                                    {
                                      store.area === null ? "Chưa có dữ liệu" : store.area.name
                                    }
                                  </td>
                                  <td className="text-center table-actions">
                                    <Tooltip title={this.props.t("EDIT_INFO")}>
                                      <a
                                        className="table-action hover-primary"
                                        data-toggle="modal"
                                        data-target="#create-user"
                                        onClick={() => {
                                          this.editUser(store);
                                        }}
                                      >
                                        <i className="ti-pencil"></i>
                                      </a>
                                    </Tooltip>
                                    {this.state.user_type === "SuperAdmin" && (
                                      <Tooltip title={this.props.t("DELETE")}>
                                        <a
                                          className="table-action hover-primary"
                                          data-toggle="modal"
                                          data-target="#view-report"
                                          onClick={() => {
                                            this.deleteUser(store.id);
                                          }}
                                        >
                                          <i className="ti-trash"></i>
                                        </a>
                                      </Tooltip>
                                    )}
                                  </td>
                                </tr>
                              ) : ""

                            );
                        })}
                      </tbody>
                    </table>
                    {this.state.listUsers.length <= 0 ? (
                      <h4 style={{ display: "flex", justifyContent: "center" }} >{this.props.t("DATA_EMPTY")}</h4>
                    ) : (
                      <Pagination
                        simple
                        pageSize={10}
                        current={this.state.currentPage}
                        total={this.state.listUsers.length}
                        onChange={this.handleChangePage}
                        style={{ display: "flex", justifyContent: "center" }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AddDA
          isShowAddModal={this.state.isShowAddModal}
          closeModal={this.closeModal}
          token={this.state.token}
          id={this.state.id}
          area={this.state.listArea}
        />
        <EditDA
          isShowEditModal={this.state.isShowEditModal}
          closeModalEdit={this.closeModalEdit}
          token={this.state.token}
          id={this.state.id}
          data={this.state.dataEdit}
          area={this.state.listArea}
        />
      </div>
    );
  }
}

export default withNamespaces()(General);