import React from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Button from "react-validation/build/button";
import required from "required";
import Constants from "Constants";
import showToast from "showToast";
import createHistoryAPI from "createHistoryAPI";
import SelectMulti from "react-select";

import { NAMEDRIVE, GETDRIVERIMPORTCYLINDER } from "../../../config/config";
import callApi from "../../../util/apiCaller";
import getUserCookies from "../../../helpers/getUserCookies";
import { Select } from "antd";
import { withNamespaces } from "react-i18next";
import ReactCustomLoading from "ReactCustomLoading";

const Option = Select.Option;

class FinishXuanNghiemTurnBack extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      content: "",
      listProducts: [],
      AgencyResults: [],
      GeneralResults: [],
      typeUser: [],
      ListUserSubmit: "",
      ListUserSubmitID: "",
      nameDriver: "",
      idDriver: "",
      listDriver: [],
      user_type: "",
      user_role: "",
      loading: false,
      listTurnBack:[]
      //userTypeFixer:""
    };
  }

  async addHistory(
    driver,
    license_plate,
    cylinders,
    number_cylinder,
    idDriver,
    sign,
    fromId,
    cylinderImex,
    idImex,
    typeImex,
    flow
  ) {
    const { typeExportCylinder } = this.props;
    // console.log(this.state.ListUserSubmitID);
    // console.log('register:::: ', typeExportCylinder);
    this.setState({ isLoading: true });
    const user = await createHistoryAPI(
      driver,
      license_plate,
      cylinders,
      Constants.IMPORT_TYPE,
      this.state.ListUserSubmitID,
      "",
      "",
      fromId,
      "",
      number_cylinder,
      "",
      "",
      "",
      typeExportCylinder,
      "",
      idDriver,
      sign,
      cylinderImex,
      idImex,
      typeImex,
      flow
    );
    this.setState({ isLoading: false });
    if (user) {
      if (
        user.status === Constants.HTTP_SUCCESS_CREATED ||
        user.status === Constants.HTTP_SUCCESS_BODY
      ) {
        showToast("Nhập hàng thành công!", 3000);
        this.props.handleChangeTypeExportCylinderEmpty();
        const modal = $("#import-driver-type-cylinder-xuannghiem");
        modal.modal("hide");
        return true;
      } else {
        showToast(
          user.data.message ? user.data.message : user.data.err_msg,
          2000
        );
        return false;
      }
    } else {
      showToast("Xảy ra lỗi trong quá trình tạo bình ");
      return false;
    }

    //this.setState({registerSuccessful: false});
  }

  handleChangeGeneral = (langValue) => {
    this.setState({
      ListUserSubmit: langValue,
      ListUserSubmitID: langValue.id,
    });
  };

  handleChangeDriver = (value) => {
    this.setState({
      idDriver: value ? value : '',
    });
  };

  async componentDidMount() {
    let user_cookie = await getUserCookies();
    let token = "Bearer " + user_cookie.token;
    let params = {
      id: user_cookie.user.id,
      isChildOf: user_cookie.user.isChildOf,
    };
    await callApi("POST", GETDRIVERIMPORTCYLINDER, params, token).then(
      (res) => {
        if (res.data.data <= 0) {
          this.setState({
            listDriver: [
              {
                name: "Bạn chưa có tài xế",
                id: "",
              },
            ],
          });
        } else {
          //console.log(user_cookie.user.id+""+res.data.data);
          this.setState(
            {
              listDriver: res.data.data,
            }
            // , () => console.log(this.state.listDriver)
          );
        }
      }
    );

    this.setState({
      user_type: user_cookie.user.userType,
      user_role: user_cookie.user.userRole,
    });
  }

  async componentDidUpdate(prevProps) {
    if (
      // this.props.typeExportCylinder !== prevProps.typeExportCylinder
      // && this.props.typeExportCylinder === 'BUY'
      this.props.product_parse !== prevProps.product_parse
    ) {
      // console.log("did update", this.props.product_parse);
      let user_cookie = await getUserCookies();
      let token = "Bearer " + user_cookie.token;
      let params = {
        id: this.props.product_parse[0].histories[
          this.props.product_parse[0].histories.length - 1
        ].from.id,
      };
      await callApi("POST", NAMEDRIVE, params, token).then((res) => {
        console.log("NAMEDRIVE", res.data);
        if (res.data.data <= 0) {
          this.setState({
            listDriver: [
              {
                name: "Bạn chưa có tài xế",
                id: "",
              },
            ],
          });
        } else {
          this.setState(
            {
              listDriver: res.data.data,
            },
            () =>
              console.log("listDriver: res.data.data", this.state.listDriver)
          );
        }
      });
    }
    // else if (this.props.typeExportCylinder !== prevProps.typeExportCylinder) {
    //     let user_cookie = await getUserCookies();
    //     let token = "Bearer " + user_cookie.token;
    //     let params = {
    //         "id": user_cookie.user.id,
    //         "isChildOf": user_cookie.user.isChildOf
    //     }
    //     await callApi("POST", GETDRIVERIMPORTCYLINDER, params, token).then(res => {
    //         console.log('GETDRIVERIMPORTCYLINDER', res.data)
    //         if (res.data.data <= 0) {
    //             this.setState({
    //                 listDriver: [{
    //                     name: "Bạn chưa có tài xế",
    //                     id: 'null'
    //                 }]
    //             })
    //         }
    //         else {
    //             //console.log(user_cookie.user.id+""+res.data.data);
    //             this.setState({
    //                 listDriver: res.data.data
    //             }
    //                 // , () => console.log(this.state.listDriver)
    //             )
    //         }
    //     })

    //     this.setState({
    //         user_type: user_cookie.user.userType,
    //         user_role: user_cookie.user.userRole
    //     });
    // }
  }

  async submit(event) {
    this.setState({ loading: true });
    event.preventDefault();
    var cylinders = [];
    var cylinderImex = [];
    for (let i = 0; i < this.props.product_parse.length; i++) {
      cylinders.push(this.props.product_parse[i].id);
      cylinderImex.push({
        id: this.props.product_parse[i].id,
        status: "EMPTY",
        //emty
        condition: "NEW",
      });
    }
    let data = this.form.getValues();
    let sign = "Web signature";
    let idImex = Date.now();
    let typeImex = "IN";
    let flow = "IMPORT_CELL";
    let nameDrivers = "Kho nhập vỏ";
    let license_plate = "59"
    await this.addHistory(
      nameDrivers,
      license_plate,
      cylinders,
      data.number_cylinder,
      data.idDriver,
      sign,
      this.props.product_parse[0].histories[0].from.id,
      cylinderImex,
      idImex,
      typeImex,
      flow
    );
    await this.setState({ loading: false });
    return;
  }
  async componentWillReceiveProps(nextProps){
		if (nextProps && nextProps.product_parse.length>0) {
        let listTurnBack=[];
       
        nextProps.product_parse.map((item,index)=>{
          let lengthItem =item.histories.length;
          let from= item.histories[lengthItem-1].from.name
          let id= item.histories[lengthItem-1].from.id
          listTurnBack.push(
            {
              value:id,
              name:from,
              label:from
            }
          );
          this.setState({
            listTurnBack:listTurnBack,
            ListUserSubmit:id
          })
          // console.log("to",to);
          // console.log("to",item);

        }); 
      }
      
  }  
  render() {
    // console.log("hahaha",this.props);
    const nameExport =
      this.props.typeExportCylinder === Constants.RENT
        ? "Đối tác cho thuê"
        : this.props.typeExportCylinder === Constants.BUY
        ? "Đối tác bán đứt"
        : this.props.typeExportCylinder === Constants.RETURN_CYLINDER
        ? "Xuất Trả"
        : "Sửa chữa";
    return (
      <div
        className="modal fade"
        id="import-driver-type-cylinder-xuannghiem"
        tabIndex="-1"
      >
        <ReactCustomLoading isLoading={this.state.loading} />
        <div className="modal-dialog modal-xs">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
               xác nhận lưu thông tin!
              </h5>
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
                onSubmit={(event) =>
                  this.submit(event, this.props.typeExportCylinder)
                }
              >
                <div className="modal-body">
                    <p>Xác nhận lưu thông tin?</p>
                </div>
                <div className="modal-footer">
                    <Button className="btn btn-primary" type="submit">
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
                  </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withNamespaces()(FinishXuanNghiemTurnBack);
