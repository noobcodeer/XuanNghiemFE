import React from "react";
import PropType from "prop-types";
import Constants from "Constants";
import showToast from "showToast";
import AddUserPopupContainer from "../user/AddUserPopupContainer";
import getUserCookies from "getUserCookies";
import callApi from '../../../util/apiCaller';
import { ADDCUSTOMER,UPDATEUSERURL } from '../../../config/config';
import { withNamespaces } from 'react-i18next';
import { Modal, Button, Input, Row, Col, Select } from "antd";

const { Option } = Select;

class EditDA extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            customerCode: "",
            invoiceName: "",
            area: "",
            invoiceAddress: "",
            lat: "",
            lng: "",
            listArea: [],
            errors: {
                password: "",
            },
            password: "",
            id:""
        };
    }

    handleOk = async (e) => {
        console.log(this.state)
        var { name, email, customerCode, invoiceName, area, invoiceAddress, lat, lng, password,id } = this.state
        var params = {}
        if (password === "") {
            params = {
                "LAT": lat,
                "LNG": lng,
                "agencyCode": "",
                "customerCode": customerCode,
                "groupCustomer": "02",
                "invoiceAddress": invoiceAddress,
                "invoiceName": invoiceName,
                "name": name,
                "target_id": id,
                "warehouseCode": "",
                "area": area
            }
        } else {
            params = {
                "LAT": lat,
                "LNG": lng,
                "agencyCode": "",
                "customerCode": customerCode,
                "groupCustomer": "02",
                "invoiceAddress": invoiceAddress,
                "invoiceName": invoiceName,
                "name": name,
                "target_id": id,
                "warehouseCode": "",
                "area": area,
                "new_password": password,
            }
        }

        if (name === "" || email === "" || customerCode === "" || invoiceName === "" || area === "" || area === "Option1" || invoiceAddress === "" || lat === "" || lng === "") {
            alert(this.props.t("INFOR_PROVIDER"))
        } else {
            await callApi("POST", UPDATEUSERURL, params, this.props.token).then(res => {
                console.log(res.data);
                if (res.data.updatedChild.updatedUser.id === id) {               
                    this.props.closeModalEdit()               
                    alert(this.props.t("EDIT_SUCCESS"))
                }
                else {
                    alert(this.props.t("EDIT_FAIL"))
                }
            });
        }
        this.setState({
            password:""
        })
    };

    handleCancel = e => {
        this.setState({
            password:""
        })
        this.props.closeModalEdit()
    };

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
    handleChange = (value) => {
        this.setState({
            area: value
        })
    }
    async componentWillReceiveProps(nextProps) {
        await this.setState({
            listArea: nextProps.area,
            name: nextProps.data.name,
            email: nextProps.data.email,
            customerCode: nextProps.data.customerCode,
            invoiceName: nextProps.data.invoiceName,
            area: nextProps.data.area.id,
            invoiceAddress: nextProps.data.invoiceAddress,
            lat: nextProps.data.LAT,
            lng: nextProps.data.LNG,
            id: nextProps.data.id,
        })
    }
    handleErrors = (e) => {
        let { name, value } = e.target;
        let message = "";
        let { newpassword } = this.state;
        var pattern = new RegExp(
            "^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶ" +
            "ẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợ" +
            "ụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s]+$"
        );
        var number = /^[0-9]+$/;

        newpassword = message === "" ? true : false;
        if (
            value &&
            value.length < 6 &&
            value.match(pattern) &&
            value.match(number)
        ) {
            messgae =
                this.props.t('PASS_REQUIRE');
            newpassword = false;
        } else if (value && value.match(number)) {
            message =
                this.props.t('PASS_REQUIRE');
            newpassword = true;
        } else if (value && value.match(pattern)) {
            message =
                this.props.t('PASS_REQUIRE');
            newpassword = true;
        } else if (value && value.length < 6) {
            message =
                this.props.t('PASS_REQUIRE');
            newpassword = true;
        }
        this.setState(
            {
                errors: { ...this.state.errors, [name]: message },
                newpassword,
            },
        );
    };
    render() {
        var { isShowEditModal } = this.props
        return (
            <div>
                <Modal
                    title={this.props.t("EDIT_ACCOUNT")}
                    visible={isShowEditModal}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            {this.props.t("CANCEL")}
                        </Button>,
                        <Button key="submit" type="primary" onClick={this.handleOk}>
                            {this.props.t("SAVE")}
                        </Button>,
                    ]}
                    width="80%"
                >
                    <Row gutter={60}>
                        <Col span={12}>
                            <label>Email đăng nhập</label>
                            <Input size="large" name="email" onChange={this.onChange} style={{ marginBottom: 10 }} value={this.state.email} disabled />
                        </Col>
                        <Col span={12}>
                            <label>Tên khách hàng</label>
                            <Input size="large" name="name" onChange={this.onChange} style={{ marginBottom: 10 }} value={this.state.name} />
                        </Col>
                    </Row>
                    <Row gutter={60}>
                        <Col span={12}>
                            <label>Mã khách hàng</label>
                            <Input size="large" name="customerCode" onChange={this.onChange} style={{ marginBottom: 10 }} value={this.state.customerCode} disabled />
                        </Col>
                        <Col span={12}>
                            <label>Tên xuất hoá đơn</label>
                            <Input size="large" name="invoiceName" onChange={this.onChange} style={{ marginBottom: 10 }} value={this.state.invoiceName} />
                        </Col>
                    </Row>
                    <Row gutter={60}>
                        <Col span={12}>
                            <Row >
                                <label>Khu vực</label>
                            </Row>

                            <Select size="large" style={{ width: "100%" }} onChange={this.handleChange} autoFocus={false} defaultValue={this.state.area}>
                                <Option value="Option1">Chọn</Option>
                                {this.state.listArea.map(x => {
                                    return <Option value={x.id}>{x.name}</Option>
                                })}
                            </Select>
                        </Col>
                        <Col span={12}>
                            <label>Địa chỉ xuất hoá đơn</label>
                            <Input size="large" name="invoiceAddress" onChange={this.onChange} style={{ marginBottom: 10 }} value={this.state.invoiceAddress} />
                        </Col>
                    </Row>
                    <Row gutter={60}>
                        <Col span={12}>
                            <label>Toạ độ LAT</label>
                            <Input size="large" name="lat" onChange={this.onChange} style={{ marginBottom: 10 }} value={this.state.lat} />
                        </Col>
                        <Col span={12}>
                            <label>Toạ độ LNG</label>
                            <Input size="large" name="lng" onChange={this.onChange} style={{ marginBottom: 10 }} value={this.state.lng} />
                        </Col>
                    </Row>
                    <div className="form-group">
                        <label>{this.props.t("PASSWORD")}</label>
                        <Input
                            size="large"
                            className="form-control"
                            type="password"
                            name="password"
                            id="password"
                            value={this.state.password}
                            onChange={this.onChange}
                            onBlur={this.handleErrors}
                            onKeyUp={this.handleErrors}
                        />
                        {this.state.errors.password === "" ? (
                            ""
                        ) : (
                            <div className="alert alert-danger">
                                {this.state.errors.password}
                            </div>
                        )}
                    </div>

                </Modal>
            </div>
        )
    }
}

export default withNamespaces()(EditDA);