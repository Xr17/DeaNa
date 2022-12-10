import React,{Fragment,useContext, useState} from 'react';
import {Badge, Dropdown} from "react-bootstrap";
import {Link} from "react-router-dom";
import profile from "../../../images/profile/port.jpg";
import PieChart from "../zenix/MyWallets/CoinChart";
import notKnow from "../../../images/contacts/no-known.png";

class Guardian extends React.Component {
    constructor(props) {
        super(props);
    }

    getVariant(status){
        switch(status){
            case "2":
                return "danger"
            case "1":
                return "info"
            case "0":
                return "warning";
            case "3":
                return "success";
            case "-1":
                return "default";
            default:
                return "default";
        }
    }

    getStatusLabel(status){
        switch(status){
            case "2":
                return "LOCKED"
            case "1":
                return "CONFIRMED"
            case "0":
                return "PENDING";
            case "3":
                return "UNLOCKED";
            case "-1":
                return "CREATION"
            default:
                return "default";
        }
    }
    render() {
        return (
            <div className="col-xl-3 col-xxl-4" style={{opacity:this.props.shadowGuardian?0.2:1}}>
                <div className="row">
                    <div className="col-xl-12 col-lg-6 col-sm-6">
                        <div className="card">
                            <div className="card-header border-0">
                                <h4 className="mb-0 text-black fs-20">{this.props.name}</h4>
                                {this.props.showRevoke && <Dropdown className="custom-dropdown mb-0 tbl-orders-style">
                                    <Dropdown.Toggle variant="" className="i-false btn sharp tp-btn" data-toggle="dropdown">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                            <path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                            <path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                        </svg>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="dropdown-menu dropdown-menu-right" alignRight={true}>
                                        <a onClick={this.props.revoke} className="dropdown-item text-danger" >Revoke</a>
                                    </Dropdown.Menu>
                                </Dropdown>}
                            </div>
                            <div className="card-body">
                                <div className="text-center">
                                    <div className="my-profile">
                                        <img src={notKnow} alt="" className="rounded"/>

                                    </div>
                                    <h4 className="mt-3 font-w600 text-black mb-0 name-text">{this.props.guardian.name}</h4>
                                    <small>{this.props.guardian.guardianAddress}</small>
                                    <br/>
                                    <Badge variant={this.getVariant(this.props.guardian.guardianStatus)}>{this.getStatusLabel(this.props.guardian.guardianStatus)}</Badge>


                                </div>
                               <ul className="portofolio-social">
                                    {this.props.guardian.guardianStatus == "0" && false && <li ><Link to={"#"}><i className="fa fa-unlock"> </i> Ask for unlock</Link></li>}

                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
            </div>);
    }
}

        export default Guardian;