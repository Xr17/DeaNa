import React, {useEffect, useState} from 'react';
import Guardian from "./Guardian";
import contacts1 from "../../../images/contacts/Untitled-1.jpg";
import contacts2 from "../../../images/contacts/Untitled-2.jpg";
import contacts3 from "../../../images/contacts/Untitled-3.jpg";
import contacts4 from "../../../images/contacts/Untitled-4.jpg";
import notKnow from "../../../images/contacts/no-known.png";
import {
    getAccountStatus,
    getGuardians, getPending, getSecrets,
    secureSecret
} from "../../../services/SocialRecoveryContract";
import {Alert, Button, Card, Col, Modal, Row} from "react-bootstrap";
import {combineShares, generateShares} from "../../../services/ShamirUtils";
import {useEth} from "../EthContext";

const LOCK_COLOR = "#FF0000";
const UNLOCK_COLOR = "#00FF00";
const PENDING_COLOR = "#0000FF";


const {randomBytes} = require('crypto');


export const O_ADDRESS = "0x0000000000000000000000000000000000000000";

function SocialRecovery() {


   const { state: { contract, accounts } } = useEth();
  //  const [history, setHistory] = useState();

    const [showAddGuardan, setShowAddGuardan] = useState();
    const [showProtectAccount, setShowProtectAccount] = useState();
    const [guardians, setGuardians] = useState();
    const [name, setName] = useState();
    const [address, setAddress] = useState();
    const [type, setType] = useState();
    const [word1, setWord1] = useState();
    const [word2, setWord2] = useState();
    const [word3, setWord3] = useState();
    const [word4, setWord4] = useState();
    const [word5, setWord5] = useState();
    const [word6, setWord6] = useState();
    const [word7, setWord7] = useState();
    const [word8, setWord8] = useState();
    const [word9, setWord9] = useState();
    const [word10, setWord10] = useState();
    const [word11, setWord11] = useState();
    const [word12, setWord12] = useState();
    const [user, setUser] = useState();
    const [pendingSecure, setPendingSecure] = useState();
    const [pendingAddGuardian, setPendingAddGuardian] = useState();

    const [connectedUserAddress, setConnectedUserAddress] = useState();
    const [recoverUserAddress, setRecoverUserAddress] = useState();


    const retrieveGuardian =  (address) => {
        const guardian = contract.methods.getGuardian(address).call({from: accounts[0]});
        return guardian;
    }

    const reset =  async () => {
        await contract.methods.reset().send({from: accounts[0]});
        await retrieveUser();
    }

    const retrieveUser = async () => {
        var user = await contract.methods.getRecoverUser().call({from: accounts[0]});
        if(user.userAddress==O_ADDRESS){
            user = await contract.methods.getUser().call({from: accounts[0]});
        }

        var guardianObjects = [];
        for(var i in user.guardians){
            if(user.guardians[i] != O_ADDRESS){
                guardianObjects.push(await retrieveGuardian(user.guardians[i]));
            }
        }
        console.log(user);
        setGuardians(guardianObjects);
        setUser(user);
        setRecoverUserAddress(user.userAddress);
        setConnectedUserAddress(accounts[0]);
    }

    const addGuardian = async (name, address) => {
        setPendingAddGuardian({name:name,guardianAddress:address, guardianStatus:"-1"});
        await contract.methods.addGuardian(address, name).send({from: accounts[0]});
        setPendingAddGuardian(null);
        retrieveUser();

    }
    const secureSecret = async (shares, threashold) => {
        setPendingSecure(true);
        await contract.methods.lock(shares, threashold).send({from: accounts[0]});
        setPendingSecure(false);
        setShowProtectAccount(false);
        retrieveUser();
    }



    const revokeGuardian = async ( address) => {
        console.log(address);
        await contract.methods.revokeGuardian(address).send({from: accounts[0]});
        console.log(guardians);
        await retrieveUser();
    }

    useEffect(() => {

        if(contract){
            retrieveUser();
        }


    }, [accounts, contract]);


    const formatLegend = (seriesName, opts) =>{
        var legend = seriesName + ": ";

        switch (opts.w.globals.colors[opts.seriesIndex]) {
            case LOCK_COLOR:
                return legend + "LOCKED"
            case UNLOCK_COLOR:
                return legend + "UNLOCKED"
            case PENDING_COLOR:
                return legend + "PENDING..."
            default:
                return "UNDEFINED";
        }
    }





    const addGuardianOnStorage = (e) =>{
        addGuardian(name,address);
        setShowAddGuardan(false);

    }

    const getUnconfirmedGuardians=()=> {
        console.log(guardians);
        return guardians.filter(g => g.guardianStatus == "0").length;
    }


    const getUnlockedGuardiansCount = () =>{
        console.log(guardians);
        return guardians.filter(g => g.guardianStatus == "3").length;
    }

    const getAccountStatusFromContract = () => {
        return getAccountStatus(recoverUserAddress);
    }



    const unlockAccount = ()=>{
        var shares =    guardians.filter(g => g.guardianStatus == "3").map(g=>g.unlockedSecret);
console.log(shares);
        var secret = combineShares(shares);
;

        var words = secret.split("-");
           setWord1(words[0]);
           setWord2(words[1]);
           setWord3(words[2]);
           setWord4(words[3]);
           setWord5(words[4]);
           setWord6(words[5]);
           setWord7(words[6]);
           setWord8(words[7]);
           setWord9(words[8]);
           setWord10(words[9]);
           setWord11(words[10]);
           setWord12(words[11]);
           setShowProtectAccount(true);
           setType("unprotect");
    }
    const protectMyAccount = ()=> {
        var secret = word1 + "-" + word2 + "-" + word3 + "-" + word4 + "-" + word5 + "-" + word6 + "-" + word7 + "-" + word8 + "-" + word9 + "-" + word10 + "-" + word11 + "-" + word12;
        var threshold = Math.floor(guardians.length/2)+1;
        var shares = generateShares(secret, guardians.length, threshold);

        secureSecret(shares, threshold);
    }

    const secureMessages =() =>{
        return <Card.Body>
            <Row>
                <Col xl={12}>
                    <Alert
                        variant="primary"
                        className="alert alert-warning notification"
                    >
                        Your account is <b>PROTECTED</b> by your guardian !
                    </Alert></Col></Row></Card.Body>
    }


    const unlockMessages =()=> {
        if(!guardians){
            return (<div>not loaded</div>);
        }
        return <Card.Body>
            <Row>
                <Col xl={12}>
                    <Alert
                        variant="info"
                        className="alert alert-warning notification"
                    >

                        {getUnlockedGuardiansCount() < Math.floor(guardians.length/2)+1 && <div>
                            <p className="notificaiton-title mb-2">Your account is still protected by your guardians</p>
                            <p>
                                You should have at least {Math.floor(guardians.length/2)+1} guardians that unlock your secret using link bellow
                                ({Math.floor(guardians.length/2)+1 - getUnlockedGuardiansCount()} unlocks remaining)
                            </p>
                            <p>
                                <Alert
                                    variant="light"
                                    className="solid alert-rounded"
                                >
                                    <a target="_blank"
                                       href={"https://xr17.github.io/deana/page-social-recovery-unlock?user=" + connectedUserAddress}>{"https://xr17.github.io/deana/page-social-recovery-unlock?user=" + connectedUserAddress}</a>

                                </Alert>
                            </p>
                            <p>
                            </p>
                        </div>}

                        {getUnlockedGuardiansCount() >= Math.floor(guardians.length/2)+1 &&
                            <div>
                                <p className="notificaiton-title mb-2">Your account can now be unlocked</p>
                                <Button className="mr-2" variant="success"
                                        onClick={unlockAccount}>
                                    Unlock my account
                                </Button>
                            </div>
                        }
                    </Alert>

                </Col>
            </Row>

        </Card.Body>
    }

    const accountRecoveryMessage =()=> {

        return <Card.Body>
            <Row>
                <Col xl={12}>
                    <Alert
                        variant="info"
                        className="alert alert-warning notification"
                    >
                            <p className="notificaiton-title mb-2">This account <b>{accounts[0]}</b> is on recovery for account <b>{user.userAddress}</b> </p>


                    </Alert>

                </Col>
            </Row>

        </Card.Body>
    }

    const alertMessages =()=> {

        return <Card.Body>
            <Row>
                <Col xl={12}>
                    <Alert
                        variant="danger"
                        className="alert alert-warning notification"
                    >

                            {guardians.length < 3 && <div>
                            <p className="notificaiton-title mb-2"><strong>Warning</strong>, your account is not
                                yet protected by enough guardians</p>
                            <p> You need at least 3 guardians (<b>{3 - guardians.length} missings</b>) </p>
                            <p>
                                <Button className="mr-2" variant="info"
                                        onClick={() => setShowAddGuardan(true)}>
                                    Add a new guardian
                                </Button>
                            </p>
                        </div>
                        }

                        {getUnconfirmedGuardians() > 0 && <div>
                            <p className="notificaiton-title mb-2"><strong>Warning</strong>, your account is not
                                yet protected by your guardians</p>
                            <p>
                                Your guardians should accept to protect your account using the link bellow
                                ({getUnconfirmedGuardians()} confirmations remaining)
                            </p>
                            <p>
                                <Alert
                                    variant="light"
                                    className="solid alert-rounded"
                                >
                                    <a target="_blank"
                                       href="https://xr17.github.io/deana/page-social-recovery-confirm">https://xr17.github.io/deana/page-social-recovery-confirm</a>

                                </Alert>
                            </p>
                            {guardians.length < 5 &&                                  <Button className="mr-2" variant="info"
                                                                                              onClick={() => setShowAddGuardan(true)}>
                                Add a new guardian
                            </Button>}

                        </div>}

                        {guardians.length >= 3 && getUnconfirmedGuardians() == 0 &&
                            <div>
                                <p className="notificaiton-title mb-2"><strong>Warning</strong>, your account is
                                    not yet protected</p>
                                <p>But don't worry you just have to finalise your protection</p>
                                <Button className="mr-2" variant="info"
                                        onClick={() => setShowAddGuardan(true)}>
                                    Add a new guardian
                                </Button>
                                <Button className="mr-2" variant="success"
                                        onClick={() => {
                                            setType("protect");
                                            setShowProtectAccount(true);
                                        }}>
                                    Protect my account
                                </Button>
                            </div>
                        }

                    </Alert>

                </Col>
            </Row>

        </Card.Body>

    }

        /*[

        ]*/
        /*
         <VisualOignonLock click={() => {
                    alert("click")
                }} image={lock} formatter={this.formatLegend} series={[100, 100, 100]}
                                  colors={[LOCK_COLOR,UNLOCK_COLOR, UNLOCK_COLOR]}
                                  labels={guardians.map(g=>g.name)}></VisualOignonLock>
         */
        if(!guardians){
            return (<div>Loading...</div>);
        }
        
        return (

            <div>
                {
                    accounts[0] && user!=null && user.userAddress!=O_ADDRESS && user.userAddress != accounts[0] && accountRecoveryMessage()
                }
                {
                    (user==null || user.userAddress==O_ADDRESS || user.userAddress == accounts[0]) && <div>Social recovery for account {accounts[0]}</div>
                }
                {(user == null || user.userAddress==O_ADDRESS || user.accountStatus == "0") && alertMessages()}
                {(user != null && user.userAddress!=O_ADDRESS && user.accountStatus == "1" && user.userAddress == accounts[0]) && secureMessages()}
                {(user != null && user.userAddress!=O_ADDRESS && user.userAddress != accounts[0]) && unlockMessages()}

                <div className="row">
                    {
                        guardians && guardians.map(guardian => {
                            return <Guardian revoke={() => revokeGuardian(guardian.guardianAddress)} showRevoke={getAccountStatusFromContract()=='INIT'}guardian={guardian}></Guardian>
                        })

                    }
                    {
                        pendingAddGuardian && <Guardian revoke={() => {}} showRevoke={true} shadowGuardian={true} guardian={pendingAddGuardian}></Guardian>
                    }

                </div>

                <Modal className="modal fade" show={showAddGuardan} centered>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Send Message</h5>
                            <Button variant="" type="button" className="close" data-dismiss="modal"
                                    onClick={() => setShowAddGuardan(false)}>
                                <span>×</span>
                            </Button>
                        </div>
                        <div className="modal-body">
                            <form className="comment-form" onSubmit={(e) => {
                                e.preventDefault();
                                setShowAddGuardan(false);
                            }}>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <label htmlFor="author" className="text-black font-w600"> Name of your
                                                guardian <span className="required">*</span> </label>
                                            <input type="text" value={name}
                                                   onChange={e => setName(e.target.value)}
                                                   className="form-control"
                                                   defaultValue="" name="name" placeholder="name"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <label htmlFor="author" className="text-black font-w600"> Address of your
                                                guardian <span className="required">*</span> </label>
                                            <input type="text" value={address}
                                                   onChange={e => setAddress(e.target.value)}
                                                   className="form-control"
                                                   defaultValue="" name="address" placeholder="address"/>
                                        </div>
                                    </div>
                                </div>
                                <Button className="mr-2" variant="danger" onClick={addGuardianOnStorage}>
                                    Add guardian
                                </Button>
                            </form>
                        </div>
                    </div>
                </Modal>

                <Modal className="modal fade" show={showProtectAccount}
                       centered>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Protect my account</h5>


                            <Button variant="" type="button" className="close" data-dismiss="modal"
                                    onClick={() => setShowProtectAccount(false)}>
                                <span>×</span>
                            </Button>
                        </div>
                        <div className="modal-body">

                            {type == 'protect' && <Card.Body>
                                <Row>
                                    <Col xl={12}>
                                        <Alert
                                            variant="info"
                                            className="alert alert-warning notification"
                                        >
                                        Your words will be cut in {guardians.length}, encrypt and
                                            distribute to your guardian.
                                            If you lose access to your account, or these words you'll
                                            need {guardians.length / 2 + 1} to retrieve them
                                        </Alert>
                                    </Col>
                                </Row>
                            </Card.Body>}

                            <form className="comment-form" onSubmit={(e) => {
                                e.preventDefault();
                                showAddGuardan(false);
                            }}>
                                <div className="row">

                                    <input type="text"
                                           onChange={e => setWord1(e.target.value)}
                                           className="col-lg-4 form-control"
                                           value={word1}
                                           defaultValue="" name="Word1" placeholder="Word 1"/>
                                    <input type="text"
                                           onChange={e => setWord2(e.target.value)}
                                           className="col-lg-4 form-control"
                                           value={word2}
                                           defaultValue=""
                                           name="Word2"
                                           placeholder="Word 2"/>
                                    <input type="text"
                                           onChange={e => setWord3(e.target.value)}
                                           className="col-lg-4 form-control"
                                           value={word3}
                                           defaultValue="" name="Word3" placeholder="Word 3"/>
                                    <input type="text"
                                           onChange={e => setWord4(e.target.value)}
                                           className="col-lg-4 form-control"
                                           value={word4}
                                           defaultValue=""
                                           name="Word4"
                                           placeholder="Word 4"/>
                                    <input type="text"
                                           onChange={e => setWord5(e.target.value)}
                                           className="col-lg-4 form-control"
                                           value={word5}
                                           defaultValue="" name="Word5" placeholder="Word 5"/>
                                    <input type="text"
                                           onChange={e => setWord6(e.target.value)}
                                           className="col-lg-4 form-control"
                                           value={word6}
                                           defaultValue=""
                                           name="Word6"
                                           placeholder="Word 6"/>
                                    <input type="text"
                                           onChange={e => setWord7(e.target.value)}
                                           className="col-lg-4 form-control"
                                           value={word7}
                                           defaultValue="" name="Word7" placeholder="Word 7"/>
                                    <input type="text"
                                           onChange={e => setWord8(e.target.value)}
                                           className="col-lg-4 form-control"
                                           value={word8}
                                           defaultValue=""
                                           name="Word8"
                                           placeholder="Word 8"/>
                                    <input type="text"
                                           onChange={e => setWord9(e.target.value)}
                                           className="col-lg-4 form-control"
                                           value={word9}
                                           defaultValue="" name="Word9" placeholder="Word 9"/>
                                    <input type="text"
                                           onChange={e => setWord10(e.target.value)}
                                           className="col-lg-4 form-control"
                                           value={word10}
                                           defaultValue=""
                                           name="Word10"
                                           placeholder="Word 10"/>
                                    <input type="text"
                                           onChange={e => setWord11(e.target.value)}
                                           className="col-lg-4 form-control"
                                           value={word11}
                                           defaultValue="" name="Word11" placeholder="Word 11"/>
                                    <input type="text"
                                           onChange={e => setWord12(e.target.value)}
                                           className="col-lg-4 form-control"
                                           value={word12}
                                           defaultValue=""
                                           name="Word12"
                                           placeholder="Word 12"/>
                                </div>

<br/>
                                {type == 'protect' && !pendingSecure &&  <Button className="mr-2" variant="success" onClick={protectMyAccount}>
                                    Protect my account
                                </Button>}
                                {type == 'protect' && pendingSecure &&  <Button className="mr-2" variant="success" onClick={protectMyAccount}>
                                    <i className="fa fa-spinner fa-spin text-info"/>{" "}
                                </Button>}

                            </form>
                        </div>
                    </div>
                </Modal>

                <Button className="mr-2" variant="danger"
                        onClick={reset}>
                    Reset my social recovery
                </Button>
            </div>
        );
}

export default SocialRecovery;