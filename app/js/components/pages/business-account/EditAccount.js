import React from "react";
import PropType from "prop-types";
import Constants from "Constants";
import showToast from "showToast";
import AddUserPopupContainer from "../user/AddUserPopupContainer";
import getUserCookies from "getUserCookies";
import callApi from '../../../util/apiCaller';
import { UPDATEUSERURL } from '../../../config/config';
import { withNamespaces } from 'react-i18next';
import { Modal, Button, Input } from "antd";

class AddAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id:"",
            email:"",
            name: "",
            password: "",
            phone: "",
            address: "",
            errors: {
                password: "",
            },
            formValid: false,
            newpassword: false,
        };
    }
    async componentWillReceiveProps(nextProps) {
        await this.setState({
            name: nextProps.data.name,
            phone: nextProps.data.phone,
            address: nextProps.data.address,
            email: nextProps.data.email,
            id: nextProps.data.id,
        })
    }

    handleOk = async (e) => {
        var { name, address, password, phone, id } = this.state
        var params = {
            target_id: id,
            address: address,
            name: name,
            phone: phone,
            new_password: password
        }
        if (name === "" || address === "" || password === "" || phone === "") {
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

    handleErrors = (e) => {
        let { name, value } = e.target;
        let message = value === "" ? this.props.t("PLEASE_INPUT_HERE") : "";
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
        var { isShowAddModalEdit,data } = this.props
        var {name,phone,address,email} = this.state
        return (
            <div>
                <Modal
                    title={this.props.t('EDIT_ACCOUNT')}
                    visible={isShowAddModalEdit}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            {this.props.t("CANCEL")}
                        </Button>,
                        <Button key="submit" type="primary" onClick={this.handleOk} disabled={this.state.errors.password === "" ? false : true}>
                            {this.props.t("SAVE")}
                        </Button>,
                    ]}
                    width={600}
                >
                    <label>{this.props.t("EMAIL")}</label>
                    <Input size="large" placeholder={this.props.t("EMAIL")} name="email" style={{ marginBottom: 20 }} disabled  value={email}/>
                    <label>{this.props.t("NAME")}</label>
                    <Input size="large" placeholder={this.props.t("NAME")} name="name" onChange={this.onChange} style={{ marginBottom: 20 }} value={name}/>
                    <label>{this.props.t("PHONE")}</label>
                    <Input size="large" placeholder={this.props.t("PHONE")} name="phone" onChange={this.onChange} style={{ marginBottom: 20 }} value={phone}/>
                    <label>{this.props.t("ADDRESS")}</label>
                    <Input size="large" placeholder={this.props.t("ADDRESS")} name="address" onChange={this.onChange} style={{ marginBottom: 20 }} value={address}/>
                    <label>{this.props.t("PASSWORD")}</label>
                    <div className="form-group">
                        <Input
                            size="large"
                            placeholder={this.props.t("PASSWORD")}
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

export default withNamespaces()(AddAccount);