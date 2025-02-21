import React, { useState } from 'react'
import { connect, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'
import { loadingToggleAction,loginAction,
} from '../../store/actions/AuthActions';

//
import logo from '../../icons/brand-logo.png'
import textlogo from '../../images/logo-text.png'
import login from "../../images/bg-login2.png";
import loginbg from "../../images/bg-login.jpg";

function Login (props) {
    const [email, setEmail] = useState('demo@example.com');
    let errorsObj = { email: '', password: '' };
    const [errors, setErrors] = useState(errorsObj);
    const [password, setPassword] = useState('123456');
    const dispatch = useDispatch();

    function onLogin(e) {
        e.preventDefault();
        let error = false;
        const errorObj = { ...errorsObj };
        if (email === '') {
            errorObj.email = 'Email is Required';
            error = true;
        }
        if (password === '') {
            errorObj.password = 'Password is Required';
            error = true;
        }
        setErrors(errorObj);
        if (error) {
			return ;
		}
		dispatch(loadingToggleAction(true));	
        dispatch(loginAction(email, password, props.history));
    }

  return (
        <div className="login-main-page">{/*<div className="login-main-page" style={{backgroundImage:"url("+ loginbg +")"}}>*/}
            <div className="login-wrapper">
                {/*<div className="login-aside-left" style={{backgroundImage:"url("+ login +")"}}>*/}
                <div className="login-aside-left" >
                    <Link to="/dashboard" className="login-logo">
                        <img style={{width:"50%"}} className="brand-logo" src={logo} alt="" />
                      </Link>
                    <div className="login-description">
                        <h2 className="text-black  mb-2">Welcome to <b>DeaNa</b>, the crypto wallet <b className="text-primary">for all</b>.</h2>
                        
                        <div className="fs-15 text-dark">Benefit all the blockchain power <strong>serenly</strong>.</div>
                        <div className="fs-15 text-dark">Manage your digital assets as quickly as <strong>easily</strong>.</div>
                        <div className="fs-15 text-dark">Keep them <strong>safe</strong>.</div>
                        <div className="fs-15 text-dark"><strong>Learn</strong> about blockchain and cryptos through courses and tips.</div>
                        
                        {/*<ul className="social-icons mt-4">
                            <li><Link to={"#"}><i className="fa fa-facebook"></i></Link></li>
                            <li><Link to={"#"}><i className="fa fa-twitter"></i></Link></li>
                            <li><Link to={"#"}><i className="fa fa-linkedin"></i></Link></li>
                        </ul>
                        <div className="mt-5">
                            <Link to={"#"} className="text-black mr-4">Privacy Policy</Link>
                            <Link to={"#"} className="text-black mr-4">Contact</Link>
                            <Link to={"#"} className="text-black">© 2022 DexignZone</Link>
                        </div>*/}
                    </div>
                </div>
                <div className="login-aside-right">
                    <div className="row m-0 justify-content-center h-100 align-items-center">
                      <div className="col-xl-7 col-xxl-7">
                        <div className="authincation-content">
                          <div className="row no-gutters">
                            <div className="col-xl-12">
                              <div className="auth-form-1">
                                {/*<div className="mb-4">
                                    <h3 className="text-primary mb-1">Welcome to DeaNa</h3>
                                    <p className="">Are you new here?</p>
                                </div>*/}
                                {props.errorMessage && (
                                    <div className='bg-red-300 text-red-900 border border-red-900 p-1 my-2'>
                                        {props.errorMessage}
                                    </div>
                                )}
                                {props.successMessage && (
                                    <div className='bg-green-300 text-green-900 border border-green-900 p-1 my-2'>
                                        {props.successMessage}
                                    </div>
                                )}

                                  <Link   className="btn btn-primary btn-block text-white" to="./page-register">
                                      Create my wallet
                                  </Link>
                                    <br/>
                                <form onSubmit={onLogin}>

                                  <div className="text-center">
                                    <button
                                          type="submit"
                                          className="btn btn-outline-primary btn-block"
                                      >
                                         I already have one
                                      </button>

                                  </div>
                                </form>
                                <div className="new-account mt-2 warn">
                                  <div className="text-center"><br/>

                                    <Link className="text-danger" to="./help">
                                        Help me recover my wallet!
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        </div>
            
    )
}

const mapStateToProps = (state) => {
    return {
        errorMessage: state.auth.errorMessage,
        successMessage: state.auth.successMessage,
        showLoading: state.auth.showLoading,
    };
};
export default connect(mapStateToProps)(Login);