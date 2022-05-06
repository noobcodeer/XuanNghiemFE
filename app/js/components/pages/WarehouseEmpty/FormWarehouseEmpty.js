import React from "react";
import PropType from "prop-types";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from "react-validation/build/select";
import Button from "react-validation/build/button";
import required from "required";
import specialCharacters from "./../../../validate/specialCharacters ";
import getUserCookies from "./../../../helpers/getUserCookies";
import { withNamespaces } from 'react-i18next';
import addWarehouseAPI from "../../../../api/addWarehouseAPI";
import showToast from "showToast";

class FormWarehouseEmpty extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      visible: false,
      email: "",
      nameware: "",
      address: "",
      phone:"",
      userType: null,
      id: "",
      formValid: false,
      newpassword: false,
      newcode: false,
      codeware:"",
      listWares:[],
    };
  }
  onChange = (e) => {
    let target = e.target;
    let name = target.name;
    let value = target.value;
    console.log(name,value);
    this.setState({
      [name]: value,
    });
  };
  //cmt
  async submit(event) {
    event.preventDefault();
    var user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let { userType,codeware,nameware} = this.state;
    let codeUpCase = codeware.trim().toUpperCase();
    if(this.props.isCreateMode){
        let data = {
            code: codeUpCase,
            name: nameware,
            userType: userType // userType isIn: ["Warehouse_EMPTY", "Warehouse_FULL"]
        }
        let {listWares} = this.state;
        let doubleCode = listWares.some((item)=>{
          return item.code === data.code
        })
        if(doubleCode){
          alert(`${this.props.t("CODE_ALREALY_EXITS")}`)
          showToast(`${this.props.t("ADD_FAILURE")}`,1000);
          const modal = $("#create-warehouse-empty");
                      modal.modal("hide");
                      showToast(`${this.props.t("ADD_FAILURE")}`,1000);
        }else{
          let result = await addWarehouseAPI(data,token);
          if(result && result.status === 201){
              alert(this.props.t("CREATE_SUCCESS"));
              const modal = $("#create-warehouse-empty");
                      this.props.refresh();
                      modal.modal("hide");
                      showToast(`${this.props.t("ADD_SUCCESS")}`,1000);
          }else{
              alert(this.props.t("CREATE_FAILD"));
              const modal = $("#create-warehouse-empty");
                      modal.modal("hide");
                      showToast(`${this.props.t("ADD_FAILURE")}`,1000);
          }
        }
        
    }
  }
  componentWillReceiveProps(nextProps) {
      console.log(nextProps);
    if (nextProps && nextProps.warehouseEdit && nextProps.isCreateMode === false) {
      this.setState({
        email: nextProps.userEdit.email,
        name: nextProps.userEdit.name,
        address: nextProps.userEdit.address,
        phone: nextProps.userEdit.phone,
        id: nextProps.userEdit.id,
        password: "",
      });
    } else {
      this.setState({
        nameware:"",
        codeware:"",
        userType:nextProps.userType,
        listWares:nextProps.listWares,
      });
    }
  }

  FormValidation = () => {
    this.setState({
      formValid: this.state.newpassword,
    });
  };
  goBack = () => {
    window.location.hash =
      window.location.lasthash[window.location.lasthash.length - 1];
    //blah blah blah
    window.location.lasthash.pop();
  };
  render() {
    //console.log(this.state.listUsers);
    let { nameware,codeware } = this.state;

    return (
      
      <div className="modal fade" id="create-warehouse-empty" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {this.props.isCreateMode
                  ? this.props.t("CREATE_WAREHOUSE_EMPTY")
                  : this.props.t("EDIT_DRIVER")}
              </h5>
              <button type="button" className="close" data-dismiss="modal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Form
                onSubmit={this.goBack}
                ref={(c) => {
                  this.form = c;
                }}
                className="card"
                onSubmit={(event) => this.submit(event)}
              >
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>{this.props.t("CODE_WARE")}</label>
                        <Input
                          //  disabled={this.props.isEditForm}
                          disabled={this.props.check}
                          className="form-control"
                          type="text"
                          name="codeware"
                          id="codeware"
                          onChange={this.onChange}
                          value={codeware}
                          validations={[required,specialCharacters]}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>{this.props.t("NAME_WARE")}</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="nameware"
                          id="nameware"
                          onChange={this.onChange}
                          value={nameware}
                          validations={[required]}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <footer className="card-footer text-center">
                  <Button className="btn btn-primary" id="button" type="submit">
                    {this.props.t("SAVE")}
                  </Button>
                  <button
                    className="btn btn-secondary"
                    type="reset"
                    data-dismiss="modal"
                    style={{ marginLeft: "10px" }}
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

export default withNamespaces()(FormWarehouseEmpty);
