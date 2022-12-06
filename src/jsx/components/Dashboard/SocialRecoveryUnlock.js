import React,{useEffect, useState} from "react";
import { Link } from "react-router-dom";
import {confirmGuardian, getUserFromGuardian, unlockGuardian} from "../../../services/SocialRecoveryContract";
import * as queryString from "query-string";
import {useEth} from "../EthContext";

function SocialRecoveryConfirm(props) {
   const { state: { accounts } } = useEth();

   const [user,setUser] = useState();
   const [newUserAddress,setNewUserAddress] = useState();
   const [confirmed,setConfirmed]= useState();


   useEffect(() => {
      if(accounts) {
         console.log(accounts);
         setUser(getUserFromGuardian(accounts[0]))
         setNewUserAddress(queryString.parse(props.location.search).user);
      }

   }, [accounts]);

   const confirm = ()=>{
      unlockGuardian(newUserAddress, accounts[0]);
      setConfirmed(true);
   }


      return (
          <div>
          {
             !confirmed && user &&
          <div className="authincation h-100 p-meddle">
             <div className="container h-100">
                <div className="row justify-content-center h-100 align-items-center ">
                   <div className="col-md-5">
                      <div className="form-input-content text-center error-page">
                         <h1 className="error-text font-weight-bold"></h1>
                         <h4>
                            <i className="fa fa-unlock text-danger"/>{" "}
                            <span style={{fontSize:"45%"}}>{user}</span><br/> ask you to unlock the share you are protecting
                         </h4>
                         <p className="text-danger">
                            Are you really sure this link comes from your friend?<br/>
                            You should verify that <b>{newUserAddress}</b> is his new address
                         </p>
                         <div>
                            <button className="btn btn-danger" onClick={confirm}>
                               Accept to unlock his account
                            </button>

                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
          }
             {
                 !confirmed && !user &&
                 <div className="authincation h-100 p-meddle">
                    <div className="container h-100">
                       <div className="row justify-content-center h-100 align-items-center ">
                          <div className="col-md-5">
                             <div className="form-input-content text-center error-page">
                                <h1 className="error-text font-weight-bold"></h1>
                                <h4>
                                   <i className="fa fa-times-circle text-danger"/>{" "}
                                   You are not protecting anyone
                                </h4>
                                <p><small>Currently connected with : {accounts && accounts[0]}</small></p>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
             }
             {
                 confirmed &&
                 <div className="authincation h-100 p-meddle">
                    <div className="container h-100">
                       <div className="row justify-content-center h-100 align-items-center ">
                          <div className="col-md-5">
                             <div className="form-input-content text-center error-page">
                                <h1 className="error-text font-weight-bold"></h1>
                                <h4>
                                   <i className="fa fa-unlock text-success"/>{" "}
                                   Thanks !
                                </h4>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
             }
          </div>
   );
}
export default SocialRecoveryConfirm;
