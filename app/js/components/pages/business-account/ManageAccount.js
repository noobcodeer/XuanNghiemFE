import React from "react";
import PropType from "prop-types";
import Constants from "Constants";
import showToast from "showToast";
import AddUserPopupContainer from "../user/AddUserPopupContainer";
import getUserCookies from "getUserCookies";
import callApi from '../../../util/apiCaller';
import { GETALLBUSINESSACCOUNT, GETALLUSERURL } from '../../../config/config';
import { withNamespaces } from 'react-i18next';
import { Tooltip, Pagination } from "antd";
import AddAccount from './AddAccount'
import EditAccount from './EditAccount'

class ManageAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectToSearch: 0, //chọn mục để tìm kiếm
            dataSearch: "",// dữ liệu tìm kiếm, tuỳ thuộc vào mục tìm kiếm để nhập dữ liệu
            listAccount: [

            ], //danh sách tài khoản(dùng để hiển thị)
            listAccountFilter: [], //danh sách tất cả tài khoản, chỉ thay đổi khi gọi api,
            isShowAddModal: false, //đóng mở form thêm mới tài khoản
            token: "", //token của tài khoản đang đăng nhập
            id: "",//id của tài khoản đang đăng nhập
            isShowAddModalEdit: false,//đóng mở form sửa thông tin tài khoản
            dataEdit: {}, //dữ liệu của tài khoản cần sửa
            currentPage: 1, //page hiện tại
            minIndex: 0,
            maxIndex: 10
        };
    }

    refresh() {
        this.forceUpdate(async () => {
            // await this.getAllUser();
            //this.setState({userEdit:{}});
            let user_cookies = await getUserCookies();
            let token = "Bearer " + user_cookies.token;
            let id = user_cookies.user.id;
            this.setState({ user_type: user_cookies.user.userType });
            //this.getAllUser();
            await this.getRestaurantCustomer(id, token);
        });
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

    onSubmit = async (event) => {
        event.preventDefault();
        let { selectToSearch, dataSearch } = this.state
        if (dataSearch === "") {           
            alert(this.props.t("PLS_INPUT_SEARCH"))
            this.setState({
                listAccount: this.state.listAccountFilter
            })
        } else if (selectToSearch === 0) {
            alert(this.props.t("PLS_SELECT_SEARCH"))
        } else {
            //chọn 1: tên
            if (selectToSearch === "1") {
                const temp = this.state.listAccountFilter.filter(item => {
                    var name = this.Xoa_Dau_VN(item.name).toLowerCase();
                    var input = this.Xoa_Dau_VN(dataSearch).toLowerCase();
                    return name.includes(input);
                })
                if (temp.length == 0) {
                    alert(`${this.props.t("NOT_FOUND_NAME")}: ${dataSearch} `)
                } else {
                    this.setState({ 
                        listAccount: temp,
                        currentPage: 0
                     })
                }
            }
            //chọn 2: email
            if (selectToSearch === "2") {
                const temp = this.state.listAccountFilter.filter(item => {
                    var email = item.email
                    var input = dataSearch.toLowerCase();
                    return email.includes(input)
                });
                if (temp.length === 0)
                    alert(`${this.props.t("NOT_FOUND_EMAIL")}: ${dataSearch} `)
                else {
                    this.setState({ 
                        listAccount: temp,
                        currentPage: 0
                     })
                }
            }
            //chọn 3: sđt
            if (selectToSearch === "3") {
                const temp = this.state.listAccountFilter.filter(item => {
                    var sdt = item.phone
                    var input = dataSearch
                    return sdt.includes(input)
                });
                if (temp.length === 0)
                    alert(`${this.props.t("NOT_FOUND_PHONE")}: ${dataSearch} `)
                else {
                    this.setState({ 
                        listAccount: temp,
                        currentPage: 0
                     })
                }
            }
        }
    }

    onChange = async (event) => {
        var name = event.target.name;
        var value =
            event.target.type === "checkbox"
                ? event.target.checked
                : event.target.value;
        await this.setState({
            [name]: value,
        });
    };

    deleteAccount = async (id) => {
        let api = GETALLUSERURL + "/" + id;
        await callApi("DELETE", api, '', this.state.token).then(res => {
            if (res.data.id === id) {
                this.getListAccount(this.state.id, this.state.token)
                alert(this.props.t("DELETE_SUCCESS"))
            }
            else {
                alert(this.props.t("DELETE_FAIL"))
            }
        });
    }

    async getListAccount(id, token) {
        let api = GETALLBUSINESSACCOUNT + "?isChildOf=" + id;
        var params = {}
        await callApi("GET", api, params, token).then(res => {
            if (res.data) {
                if (res.data.success === true) {
                    var num
                    var decimal = (res.data.data.length / 10) % 1
                    if (decimal > 0) {
                        num = Math.floor(res.data.data.length / 10) + 1;
                    }

                    this.setState({
                        listAccount: res.data.data,
                        listAccountFilter: res.data.data,
                        numberOfPage: num
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
                alert(this.props.t("ERROR_GET_DATA"));
            }
        });
    }

    componentDidMount = async () => {
        let user_cookies = await getUserCookies();
        let token = "Bearer " + user_cookies.token;
        await this.getListAccount(user_cookies.user.id, token);
        await this.setState({
            token: token,
            id: user_cookies.user.id
        })
    }

    addAccount = async () => {
        this.setState({
            isShowAddModal: true
        })
    }

    editAccount = async (item) => {
        await this.setState({
            isShowAddModalEdit: true,
            dataEdit: item
        })
    }

    closeModal = async () => {
        this.setState({
            isShowAddModal: false
        })
        this.getListAccount(this.state.id, this.state.token)
    }
    closeModalEdit = async () => {
        this.setState({
            isShowAddModalEdit: false
        })
        this.getListAccount(this.state.id, this.state.token)
    }

    handleChangePage =  (page) => {
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
                            <h4>
                                {this.props.t("MANAGE_BUSINESS_ACCOUNT")}
                            </h4>
                            <form className="form-inline" onSubmit={this.onSubmit}>
                                <div className="form-group mb-2">
                                    <select className="custom-select mr-sm-2" name="selectToSearch" value={this.state.selectToSearch} onChange={this.onChange}>
                                        <option selected value={0}>{this.props.t("PLZ_CHOOSE")}</option>
                                        <option value={1}>{this.props.t("NAME")}</option>
                                        <option value={2}>{this.props.t("EMAIL")}</option>
                                        <option value={3}>{this.props.t("PHONE")}</option>
                                    </select>

                                </div>
                                <div className="form-group mx-sm-3 mb-2">
                                    <input type="text" className="form-control" placeholder={this.props.t("INPUT_VALUE")} onChange={this.onChange} name="dataSearch"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary mb-2"
                                >
                                    {this.props.t("SEARCH")}
                                </button>
                            </form>
                            <div className="row">
                                <button
                                    onClick={this.addAccount}
                                    style={{ marginLeft: "5px", height: "40px" }}
                                    className="btn btn-sm btn-create"
                                    data-toggle="modal"
                                    data-target="#create-user"
                                >
                                    {this.props.t("ADD_ACCOUNT")}
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
                                            <thead className="table__head">
                                                <tr>
                                                    <th className="text-center w-60px align-middle">{this.props.t("ID_NUMBER")}</th>
                                                    <th className="w-150px text-center align-middle">{this.props.t("NAME")}</th>
                                                    <th className="w-150px text-center align-middle">{this.props.t("EMAIL")}</th>
                                                    <th className="w-150px text-center align-middle">{this.props.t("PHONE")}</th>
                                                    <th className="w-100px text-center align-middle">{this.props.t("ACTION")}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.listAccount.map((store, index) => {
                                                    return (
                                                        (index >= this.state.minIndex && index < this.state.maxIndex) ? (
                                                            <tr key={index}>
                                                            <td scope="row" className="text-center">
                                                                {index + 1}
                                                            </td>
                                                            <td scope="row" className="text-center">
                                                                {store.name}
                                                            </td>
                                                            <td scope="row" className="text-center">
                                                                {store.email}
                                                            </td>
                                                            <td scope="row" className="text-center">
                                                                {store.phone}
                                                            </td>
                                                            <td className="text-center table-actions">
                                                                <Tooltip title={this.props.t("EDIT_INFO")}>
                                                                    <a
                                                                        className="table-action hover-primary"
                                                                        data-toggle="modal"
                                                                        data-target="#create-user"
                                                                        onClick={() => {
                                                                            this.editAccount(store);
                                                                        }}
                                                                    >
                                                                        <i className="ti-pencil"></i>
                                                                    </a>
                                                                </Tooltip>
                                                                <Tooltip title={this.props.t("DELETE")}>
                                                                    <a
                                                                        className="table-action hover-primary"
                                                                        data-toggle="modal"
                                                                        data-target="#view-report"
                                                                        onClick={() => {
                                                                            this.deleteAccount(store.id);
                                                                        }}
                                                                    >
                                                                        <i className="ti-trash"></i>
                                                                    </a>
                                                                </Tooltip>
                                                            </td>
                                                        </tr>
                                                        ) : ""   
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                        {this.state.listAccount.length <= 0 ? (
                                            <h4 style={{ display: "flex", justifyContent: "center" }} >{this.props.t("DATA_EMPTY")}</h4>
                                        ) : (
                                            <Pagination
                                            simple
                                            pageSize={10}
                                            current={this.state.currentPage}
                                            total={this.state.listAccount.length}
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
                <AddAccount
                    isShowAddModal={this.state.isShowAddModal}
                    closeModal={this.closeModal}
                    token={this.state.token}
                    id={this.state.id}
                />
                <EditAccount
                    isShowAddModalEdit={this.state.isShowAddModalEdit}
                    closeModalEdit={this.closeModalEdit}
                    token={this.state.token}
                    id={this.state.id}
                    data={this.state.dataEdit}
                />
            </div>
        );
    }
}

export default withNamespaces()(ManageAccount);