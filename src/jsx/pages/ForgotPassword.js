import React from "react";
import { Link } from "react-router-dom";
// image
import logo from "../../images/logo-full.png";
import {Alert, Button, Card, Col, Row} from "react-bootstrap";
import {useEth} from "../components/EthContext";
const ForgotPassword = ({ history }) => {
  const onSubmit = (e) => {
    e.preventDefault();
    history.push("/dashboard");
  };
  const { state: { accounts } } = useEth();
  return (
    <div className="authincation h-100 p-meddle">
      <div className="container h-100">
        {" "}
        <div className="row justify-content-center h-100 align-items-center">
          <div className="col-md-12">

                  <Card.Body>
                    <Row>
                      <Col xl={12}>
                        <Alert
                            variant="info"
                            className="alert alert-warning notification"
                        >

<div>
                            <p className="notificaiton-title mb-2">Your guardians are protecting your account</p>
                            <p>
                              Send this link to one of them so they can enable the recovery process
                            </p>
                            <p>
                              <Alert
                                  variant="light"
                                  className="solid alert-rounded"
                              >
                                {accounts && accounts[0] && <a target="_blank"
                                   href={"http://localhost:3000/page-social-recovery-unlock?user=" + accounts[0]}>{"http://localhost:3000/page-social-recovery-unlock?user=" + accounts[0]}</a>}

                              </Alert>
                            </p>
                            <p>
                            </p>
                          </div>

                        </Alert>

                      </Col>
                    </Row>

                  </Card.Body>
                </div>
              </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
