import React from 'react';
import PropType from "prop-types";
import Constants from "Constants";
import showToast from "showToast";

import getUserCookies from 'getUserCookies';
import { withNamespaces } from 'react-i18next';
import getWarehouseApi from '../../../../api/getWarehouseApi';
import FormWarehouseEmpty from './FormWarehouseEmpty';


class ShellStore extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listWares: [],
            user_type: '',
            userType:'',
            warehouseEdit: {
                email: "",
                name: "",
                address: "",
                phone: "",
            },
            isCreateMode: true,
            check: false,
        };
    }
    async componentDidMount() {
        let user_cookies = await getUserCookies();
        let token = "Bearer " + user_cookies.token;
        let id = user_cookies.user.id;
        this.setState({ user_type: user_cookies.user.userType });
        this.getAllWareHouseEmpty(id, token);
    }
    refresh() {
        this.forceUpdate(async () => {
        let user_cookies = await getUserCookies();
        let token = "Bearer " + user_cookies.token;
        let id = user_cookies.user.id;
        this.getAllWareHouseEmpty(id, token);
        });
    };
    async getAllWareHouseEmpty(id, token) {
        let prams = {
            id: id,
            userType:'Warehouse_EMPTY',
        };
        const data = await getWarehouseApi(prams,token);
        this.setState({
            listWares:data
        })
    }
    addWareHouseEmpty = async () => {
        await this.setState({
            isCreateMode: true,
            check: false,
            userType:'Warehouse_EMPTY',
        })
        await this.setState({
            warehouseEdit: null
        })
    }
    render() {
        return (
            <div className="main-content">
                <div className="card">
                    <div className="card-title">
                        <div className="flexbox">
                            <h4>{this.props.t('WAREHOUSEEMPTY')}</h4>
                            <div className="row">
                                <button onClick={this.addWareHouseEmpty} style={{ marginLeft: '20px' }} className="btn btn-sm btn-create" data-toggle="modal"
                                    data-target="#create-warehouse-empty"> {this.props.t('CREATE_WAREHOUSE_EMPTY')}
                                </button>
                                {/*   <button style={{marginLeft:'20px'}} className="btn btn-sm btn-primary" data-toggle="modal"
                                        data-target="#create-location-store">Tạo mới
                                </button>*/}
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
                                            cellSpacing="0">
                                            <thead className="table__head">
                                                <tr>
                                                    <th className="text-center w-50px align-middle">{this.props.t('ID_NUMBER')}</th>
                                                    <th className="w-120px text-center align-middle">{this.props.t('EMAIL')}</th>
                                                    <th className="w-120px text-center align-middle">{this.props.t('NAME_WARE')}</th>
                                                    <th className="w-120px text-center align-middle">{this.props.t('CODE_WARE')}</th>
                                                    <th className="w-100px text-center align-middle">{this.props.t('ADDRESS')}</th>
                                                    {/* <th className="w-100px text-center align-middle">{this.props.t('ACTION')}</th> */}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.listWares.map((store, index) => {
                                                    return (<tr key={index}>
                                                        <td scope="row" className="text-center">{index + 1}</td>

                                                        {/*<td scope="row" className="text-center">{store.id}</td>*/}
                                                        <td scope="row" className="text-center">{store.email}</td>
                                                        <td scope="row" className="text-center">{store.name}</td>
                                                        <td scope="row" className="text-center">{store.code}</td>
                                                        <td scope="row" className="text-center">{store.address}</td>

                                                        {/* <td className="text-center table-actions">
                                                            {this.state.user_type === 'Factory' && (

                                                                <a className="table-action hover-primary" data-toggle="modal" data-target="#view-report"
                                                                    onClick={() => { this.deleteUser(store.id) }}>
                                                                    <i className="ti-trash"></i></a>

                                                            )
                                                            }
                                                            <a className="table-action hover-primary" data-toggle="modal" data-target="#create-user"
                                                                onClick={() => { this.editUser(store) }}>
                                                                <i className="ti-pencil"></i></a>
                                                        </td> */}

                                                    </tr>)


                                                })}

                                            </tbody>
                                        </table>

                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <FormWarehouseEmpty isCreateMode={this.state.isCreateMode}
                    warehouseEdit={this.state.warehouseEdit}
                    listWares={this.state.listWares}
                    check={this.state.check}
                    userType={this.state.userType}
                    refresh={()=>this.refresh()}
                />

            </div>
        );
    }
}



export default withNamespaces()(ShellStore);
