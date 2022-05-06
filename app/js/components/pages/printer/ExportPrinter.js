import React, { Component } from 'react';
import { Row, Col } from "antd";

export default class ExportPrinter extends React.Component {
    render() {
        return (
            <div className='print-source'>
                <div className="title">Công Ty TNHH DỊCH VỤ</div>
                <div className="title-second">THƯƠNG MẠI TỔNG HỢP XUÂN NGHIÊM</div>
                <div className="sub-title">BIEN BAN GIAO NHAN HANG</div>
                <div>
                    <Row>
                        <Col xs={6}><div>Ma KH: </div></Col>
                        <Col xs={6}><div>51702105</div></Col>
                        <Col xs={6}><div>Dia Chi: </div></Col>
                        <Col xs={6}><div>Tổ 3 Khu 10B Phường Quang Hanh, TP. Cẩm Phả, Tỉnh Quảng Ninh</div></Col>
                    </Row>
                    <Row>
                        <Col xs={6}><div>Ten KH: </div></Col>
                        <Col xs={6}><div>Huynh Van Hoai</div></Col>
                        <Col xs={6}><div>Ngay/Gio: </div></Col>
                        <Col xs={6}><div>08/08/2020</div></Col>
                    </Row>
                    <Row>
                        <Col xs={6}><div>Ma CN: </div></Col>
                        <Col xs={6}><div>123456</div></Col>
                        <Col xs={6}><div>NV Giao Hang: </div></Col>
                        <Col xs={6}><div>Long Vinh Phat</div></Col>
                    </Row>
                    <Row>
                        <Col xs={6}><div>Ten CN: </div></Col>
                        <Col xs={6}><div>Dat Viet Software</div></Col>
                        <Col xs={6}><div>So Xe: </div></Col>
                        <Col xs={6}><div>31340</div></Col>
                    </Row>
                </div>
                <div className="sub-title">---------------------------------------------------------------</div>
                <div className="sub-title">GIAO BINH RONG (EMPTY CYLINDER) </div>
                <div>
                    <Row>
                        <Col xs={5}><span>Binh day - 50Kg</span></Col>
                        <Col xs={14}></Col>
                        <Col xs={5}><span>So luong: 1 binh</span></Col>
                    </Row>
                </div>
                <div>
                    <Row>
                        <Col xs={6}><span>1. 50Kg</span></Col>
                        <Col xs={12}>DVS123456789</Col>
                        <Col xs={3}><span>35.5Kg</span></Col>
                        <Col xs={3}><span>35.5Kg</span></Col>
                    </Row>
                </div>
                <div>
                    <Row>
                        <Col xs={5}><span>Binh day - 50Kg</span></Col>
                        <Col xs={14}></Col>
                        <Col xs={5}><span>So luong: 1 binh</span></Col>
                    </Row>
                </div>
                <div>
                    <Row>
                        <Col xs={6}><span>1. 50Kg</span></Col>
                        <Col xs={12}>DVS123456789</Col>
                        <Col xs={3}><span>35.5Kg</span></Col>
                        <Col xs={3}><span>35.5Kg</span></Col>
                    </Row>
                </div>
                <div className="sub-title">---------------------------------------------------------------</div>
                <div className="sub-title">Da kiem tra an toan va thu [  ] bang binh xit xa phong</div>
                <div className="signature">
                    <Row>
                        <Col xs={6}><div>Cong Ty Xuan Nghiem Gas</div></Col>
                        <Col xs={12} />
                        <Col xs={6}><div>Dai Dien Khach Hang</div></Col>
                    </Row>
                </div>
                <div className="signature">
                    <Row>
                        <Col xs={6}><div>(Ky & Ghi Ro Ho Ten)</div></Col>
                        <Col xs={12} />
                        <Col xs={6}><div>(Ky & Ghi Ro Ho Ten)</div></Col>
                    </Row>
                </div>
            </div>
        );
    }
}