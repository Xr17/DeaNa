/// Menu
import MetisMenu from "metismenujs";
import React, { Component } from "react";
/// Scroll
import PerfectScrollbar from "react-perfect-scrollbar";
/// Link
import { Link } from "react-router-dom";
import profile from "../../../images/Untitled-1.jpg";


class MM extends Component {
  componentDidMount() {
    this.$el = this.el;
    this.mm = new MetisMenu(this.$el);
  }
  componentWillUnmount() {
  }
    render() {
        return (
            <div className="mm-wrapper">
                <ul className="metismenu" ref={(el) => (this.el = el)}>
                    {this.props.children}
                </ul>
            </div>
        );
    }
}

class SideBar extends Component {
  /// Open menu
  componentDidMount() {
    // sidebar open/close
    var btn = document.querySelector(".nav-control");
    var aaa = document.querySelector("#main-wrapper");
    function toggleFunc() {
      return aaa.classList.toggle("menu-toggle");
    }
    btn.addEventListener("click", toggleFunc);
		
		//sidebar icon Heart blast
		var handleheartBlast = document.querySelector('.heart');
		function heartBlast() {
			return handleheartBlast.classList.toggle("heart-blast");
		}
		handleheartBlast.addEventListener('click', heartBlast);
	
  }
  state = {
    loveEmoji: false,
  };
  render() {
    /// Path
    let path = window.location.pathname;
    path = path.split("/");
    path = path[path.length - 1];
    
    /// Active menu
    let dashBoard = [
        "",
        "dashboard-light",
		  "my-wallets",
		  "transactions",
		  "coin-details",
		  "portofolio",
		  "market-capital",
      ],
      app = [
        "app-profile",
        "app-calender",
        "email-compose",
        "email-inbox",
        "email-read",
        "ecom-product-grid",
        "ecom-product-list",
        "ecom-product-list",
        "ecom-product-order",
        "ecom-checkout",
        "ecom-invoice",
        "ecom-customers",
        "post-details",
        "ecom-product-detail",
      ],
      email = ["email-compose", "email-inbox", "email-read"],
      shop = [
        "ecom-product-grid",
        "ecom-product-list",
        "ecom-product-list",
        "ecom-product-order",
        "ecom-checkout",
        "ecom-invoice",
        "ecom-customers",
        "ecom-product-detail",
      ],
      charts = [
        "chart-rechart",
        "chart-flot",
        "chart-chartjs",
        "chart-chartist",
        "chart-sparkline",
        "chart-apexchart",
      ],
      bootstrap = [
        "ui-accordion",
        "ui-badge",
        "ui-alert",
        "ui-button",
        "ui-modal",
        "ui-button-group",
        "ui-list-group",
        
        "ui-card",
        "ui-carousel",
        "ui-dropdown",
        "ui-popover",
        "ui-progressbar",
        "ui-tab",
        "ui-typography",
        "ui-pagination",
        "ui-grid",
      ],
      plugins = [
        "uc-select2",
        "uc-nestable",
        "uc-sweetalert",
        "uc-toastr",
        "uc-noui-slider",
        "map-jqvmap",
        //"post",
        
      ],
        redux = [
            "todo",
            "form-redux",
            "form-redux-wizard", 
        ],
      widget = ["widget-basic"],
      forms = [
        "form-element",
        "form-wizard",
        "form-editor-summernote",
        "form-pickers",
        "form-validation-jquery",
      ],
      table = [
        "table-bootstrap-basic", 
        "table-datatable-basic",
        "table-sorting",
        "table-filtering",
      ],
      pages = [
        "page-register",
        "page-login",
        "page-lock-screen",
        "page-error-400",
        "page-error-403",
        "page-error-404",
        "page-error-500",
        "page-error-503",
      ],
      error = [
        "page-error-400",
        "page-error-403",
        "page-error-404",
        "page-error-500",
        "page-error-503",
      ];

    return (
      <div className="deznav">
        <PerfectScrollbar className="deznav-scroll">
			<div className="main-profile">
				<div className="image-bx">
					<img src={profile} alt="" />
					<Link to={"#"}><i className="fa fa-cog" aria-hidden="true"></i></Link>
				</div>	
				<h5 className="mb-0 fs-20 text-black "><span className="font-w400">Hello,</span> Julien Lampin</h5>
				<p className="mb-0 fs-14 font-w400">pro.julienlampin@mail.com</p>
			</div>
          <MM className="metismenu" id="menu">
			<li className="nav-label first">Wallet</li>

            <li><Link className={`${path === "" ? "" : ""}`} to="/my-wallets">			<i className="flaticon-092-money"></i><span className="nav-text">Wallet</span></Link></li>
                  {
                    //	<li><Link className={`${path === "dashboard" ? "mm-dashboard" : ""}`} to="/">Dashboard </Link></li>}
                  }
            <li><Link className={`${path === "transactions" ? "mm-active" : ""}`} to="/transactions"> 			<i className="flaticon-008-credit-card"></i><span className="nav-text">Transactions</span></Link></li>
                  {
                    //<li><Link className={`${path === "coin-details" ? "mm-active" : ""}`} to="/coin-details"> Coin Details</Link> </li>
                  }
            <li><Link className={`${path === "portofolio" ? "mm-active" : ""}`} to="/portofolio">			<i className="flaticon-063-picture"></i><span className="nav-text">Portofolio</span></Link></li>
            <li><Link className={`${path === "market-capital" ? "mm-active" : ""}`} to="/market-capital">			<i className="flaticon-091-shopping-cart"></i><span className="nav-text">Market Capital</span></Link></li>



            {}
			<li className="nav-label">Learning</li>
            <li className={`${app.includes(path) ? "mm-active" : ""}`}>
              <Link className="ai-icon" to="#" >
                <i className="flaticon-077-menu-1"></i>
                <span className="nav-text">Stacking</span>
              </Link>

            </li>
            <li className={`${charts.includes(path) ? "mm-active" : ""}`}>
              <Link className="ai-icon" to="#" >
                <i className="flaticon-061-puzzle"></i>
                <span className="nav-text">DEFI</span>
              </Link>

            </li>
			<li className="nav-label">Apps</li>
            <li>
            <Link className="ai-icon" >
              <i className="flaticon-003-diamond"></i>
              <span className="nav-text">Ternoa</span>
            </Link>
            </li>
            <li>
            <Link className="ai-icon"  >
              <i className="flaticon-007-equalizer"></i>
              <span className="nav-text">Snapshot</span>
            </Link>
            </li>
            <li>
            <Link className="ai-icon"  >
              <i className="flaticon-031-cloud"></i>
              <span className="nav-text">Opensea</span>
            </Link>
            </li>
            <li>
            <Link className="ai-icon" >
              <i className="flaticon-381-more"></i>
              <span className="nav-text">More...</span>
            </Link>
            </li>


          </MM>
			<div className="copyright">
				<p><strong>Alyra DeaNa team</strong> © 2022 All Rights Reserved</p>
				<p className="fs-12"> <span className="heart"></span></p>
			</div>
			</PerfectScrollbar>
      </div>
    );
  }
}

export default SideBar;
