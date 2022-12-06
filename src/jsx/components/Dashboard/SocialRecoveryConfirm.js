import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import {confirmGuardian, getUserFromGuardian} from "../../../services/SocialRecoveryContract";
import * as queryString from "query-string";
import {useEth} from "../EthContext";

function SocialRecoveryConfirm() {

   const { state: { accounts } } = useEth();

   const [user,setUser] = useState();
   const [confirmed,setConfirmed]= useState();

   useEffect(() => {
      if(accounts) {
         console.log(accounts);
         setUser(getUserFromGuardian(accounts[0]))
      }

   }, [accounts]);

   const confirm = ()=>{
      confirmGuardian(user, accounts[0]);
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

                            <i className="fa fa-lock text-warning"/>{" "}
                            <span style={{fontSize:"45%"}}>{user}</span><br/>
                              ask you to be his Guardian
                         </h4>
                         <p><small>Currently connected with : {accounts[0]}</small></p>
                         <p>
                            His secret will be protect by you and others trusted people.
                         </p>
                         <div>
                            <button className="btn btn-success" onClick={confirm}>
                               Accept to protect his account
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
                                   No pending guardian confirmation
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
                                   <i className="fa fa-lock text-success"/>{" "}
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
