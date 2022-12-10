import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import {confirmGuardian, getUserFromGuardian} from "../../../services/SocialRecoveryContract";
import * as queryString from "query-string";
import {useEth} from "../EthContext";
import {O_ADDRESS} from "./SocialRecovery";

function SocialRecoveryConfirm() {

   const { state: { accounts, contract } } = useEth();

   const [user,setUser] = useState();
   const [guardian,setGuardian] = useState();
   const [confirmed,setConfirmed]= useState();
   const [pendingConfirm,setPendingConfirm]= useState();

   const retrieveUser = async () => {
      try {
         const user = await contract.methods.getProtectedUser().call({from: accounts[0]});
         const guardian = await contract.methods.getGuardian().call({from: accounts[0]});
         setUser(user);
         setGuardian(guardian);
      } catch(e){
         setUser(null);
      }
   }

   useEffect(() => {
      if(accounts) {
         setUser(getUserFromGuardian(accounts[0]))
         if(contract){
            retrieveUser();
         }
      }


   }, [accounts, contract]);



   const confirm = async()=>{
      setPendingConfirm(true);
      await contract.methods.confirmGuardian().send({from: accounts[0]});
      setConfirmed(true);
      setPendingConfirm(false);
   }


      return (
          <div>
          {
             !pendingConfirm && !confirmed && user!=null && user.userAddress!=O_ADDRESS && guardian && guardian.guardianStatus=="0" &&
              <div className="authincation h-100 p-meddle">
             <div className="container h-100">
                <div className="row justify-content-center h-100 align-items-center ">
                   <div className="col-md-5">
                      <div className="form-input-content text-center error-page">
                         <h1 className="error-text font-weight-bold"></h1>

                         <h4>

                            <i className="fa fa-lock text-warning"/>{" "}
                            <span style={{fontSize:"45%"}}>{user.userAddress}</span><br/>
                              ask you to be his Guardian
                         </h4>
                         <p><small>Currently connected with : {accounts[0]}</small></p>
                         <p>
                            His secret will be protect by you and others trusted people.
                         </p>
                         <div>
                            <button className="btn btn-success" onClick={()=>confirm()}>
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
                 !pendingConfirm && !confirmed && user!=null && user.userAddress!=O_ADDRESS && guardian && guardian.guardianStatus!="0" &&
                 <div className="authincation h-100 p-meddle">
                    <div className="container h-100">
                       <div className="row justify-content-center h-100 align-items-center ">
                          <div className="col-md-5">
                             <div className="form-input-content text-center error-page">
                                <h1 className="error-text font-weight-bold"></h1>

                                <h4>

                                   <i className="fa fa-lock text-success"/>{" "}
                                   <span style={{fontSize:"45%"}}>{user.userAddress}</span><br/>
                                   asked you to be his Guardian
                                </h4>
                                <p><small>Currently connected with : {accounts[0]}</small></p>
                                <p class="text-success">
                                 You already confirmed this request
                                </p>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
             }
             {
                 pendingConfirm &&
                 <div className="authincation h-100 p-meddle">
                    <div className="container h-100">
                       <div className="row justify-content-center h-100 align-items-center ">
                          <div className="col-md-5">
                             <div className="form-input-content text-center error-page">
                                <h1 className="error-text font-weight-bold"></h1>
                                <h4>
                                   <i className="fa fa-spinner fa-spin text-info"/>{" "}
                                   Confirmation...
                                </h4>
                                <p><small>Currently connected with : {accounts && accounts[0]}</small></p>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
             }
             {
                !pendingConfirm && (user==null || user.userAddress==O_ADDRESS) &&
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
              !pendingConfirm && confirmed &&
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
