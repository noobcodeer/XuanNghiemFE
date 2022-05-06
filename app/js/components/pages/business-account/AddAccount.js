import React from "react";
import PropType from "prop-types";
import Constants from "Constants";
import showToast from "showToast";
import AddUserPopupContainer from "../user/AddUserPopupContainer";
import getUserCookies from "getUserCookies";
import callApi from '../../../util/apiCaller';
import { ADDUSERURL } from '../../../config/config';
import { withNamespaces } from 'react-i18next';
import { Modal, Button, Input } from "antd";

class AddAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            phone: "",
            address: ""
        };
    }
 
    handleOk =async(e) => {
        var { name, address, email, phone } = this.state
        var params = {
            "email": email,
            "address": address,
            "isChildOf": this.props.id,
            "name": name,
            "password": "A123!@#",
            "phone": phone,
            "staffOf": this.props.id,
            "userRole": "Business",
            "userType": "Factory"
        }
        if (name === "" || address === "" || email === "" || phone === "") {
            alert(this.props.t("INFOR_PROVIDER"))
        } else {
            console.log(this.props.token)
            console.log(this.props.id)
            await callApi("POST", ADDUSERURL, params, this.props.token).then(res => {
                console.log(res.data);
                if (res.data.user) {               
                    this.props.closeModal()               
                    alert(this.props.t("ADD_SUCCESS"))
                }
                else {
                    //this.props.closeModal()
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
                    width={600}
                >
                    <Input size="large" placeholder={this.props.t("NAME")} name="name" onChange={this.onChange} style={{ marginBottom: 10 }} />
                    <Input size="large" placeholder={this.props.t("EMAIL")} name="email" onChange={this.onChange} style={{ marginBottom: 10 }} />
                    <Input size="large" placeholder={this.props.t("PHONE")} name="phone" onChange={this.onChange} style={{ marginBottom: 10 }} />
                    <Input size="large" placeholder={this.props.t("ADDRESS")} name="address" onChange={this.onChange} />
                </Modal>
            </div>
        )
    }
}

export default withNamespaces()(AddAccount);