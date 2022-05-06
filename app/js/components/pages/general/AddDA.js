import React from "react";
import PropType from "prop-types";
import Constants from "Constants";
import showToast from "showToast";
import AddUserPopupContainer from "../user/AddUserPopupContainer";
import getUserCookies from "getUserCookies";
import callApi from '../../../util/apiCaller';
import { ADDCUSTOMER } from '../../../config/config';
import { withNamespaces } from 'react-i18next';
import { Modal, Button, Input, Row, Col, Select } from "antd";

const { Option } = Select;

class AddDA extends React.Component {
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
            address: ""
        };
    }

    handleOk = async (e) => {
        var { name, email, customerCode, invoiceName, area, invoiceAddress, lat, lng, address } = this.state
        var params = {
            "LAT": lat,
            "LNG": lng,
            "createdBy": this.props.id,
            "customerCode": customerCode,
            "customerType": "Distribution_Agency",
            "email": email,
            // "groupCustomer": "02",
            "invoiceAddress": invoiceAddress,
            "invoiceName": invoiceName,
            "isChildOf": this.props.id,
            "listAgency": [],
            "name": name,
            "userRole": "SuperAdmin",
            "userType": "General",
            "area": area,
            "address": address
        }
        if (name === "" || email === "" || customerCode === "" || invoiceName === "" || area === "01" || area === "Option1" || invoiceAddress === "" || lat === "" || lng === "") {
            alert(this.props.t("INFOR_PROVIDER"))
        } else {
            await callApi("POST", ADDCUSTOMER, params, this.props.token).then(res => {
                console.log(res.data);
                if (res.data.success) {
                    this.props.closeModal()
                    alert(this.props.t("ADD_SUCCESS"),params)
                }
                else {
                    alert(res.data.message)
                }
            });
        }
    };

    handleCancel = e => {
        this.props.closeModal()
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
            listArea: nextProps.area
        })
    }
    render() {
        var { isShowAddModal } = this.props
        return (
            <div>
                <Modal
                    title={this.props.t("ADD_ACCOUNT")}
                    visible={isShowAddModal}
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
                            <Input size="large" name="email" onChange={this.onChange} style={{ marginBottom: 10 }} />
                        </Col>
                        <Col span={12}>
                            <label>Tên khách hàng</label>
                            <Input size="large" name="name" onChange={this.onChange} style={{ marginBottom: 10 }} />
                        </Col>
                    </Row>
                    <Row gutter={60}>
                        <Col span={12}>
                            <label>Mã khách hàng</label>
                            <Input size="large" name="customerCode" onChange={this.onChange} style={{ marginBottom: 10 }} />
                        </Col>
                        <Col span={12}>
                            <label>Tên xuất hoá đơn</label>
                            <Input size="large" name="invoiceName" onChange={this.onChange} style={{ marginBottom: 10 }} />
                        </Col>
                    </Row>
                    <Row gutter={60}>
                        <Col span={12}>
                            <Row >
                                <label>Khu vực</label>
                            </Row>

                            <Select size="large" style={{ width: "100%" }} defaultValue="Option1" onChange={this.handleChange} autoFocus={false}>
                                <Option value="Option1">Chọn</Option>
                                {this.state.listArea.map(x => {
                                    return <Option value={x.id}>{x.name}</Option>
                                })}
                            </Select>
                        </Col>
                        <Col span={12}>
                            <label>Địa chỉ xuất hoá đơn</label>
                            <Input size="large" name="invoiceAddress" onChange={this.onChange} style={{ marginBottom: 10 }} />
                        </Col>
                    </Row>
                    <Row gutter={60}>
                        <Col span={12}>
                            <label>Toạ độ LAT</label>
                            <Input size="large" name="lat" onChange={this.onChange} style={{ marginBottom: 10 }} />
                        </Col>
                        <Col span={12}>
                            <label>Toạ độ LNG</label>
                            <Input size="large" name="lng" onChange={this.onChange} style={{ marginBottom: 10 }} />
                        </Col>
                        <Col span={12}>
                            <label>Địa chỉ</label>
                            <Input size="large" name="address" onChange={this.onChange} style={{ marginBottom: 10 }} />
                        </Col>
                    </Row>

                </Modal>
            </div>
        )
    }
}

export default withNamespaces()(AddDA);