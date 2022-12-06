import React,{Fragment,useContext, useState} from 'react';
import {Link} from 'react-router-dom';
import { Dropdown } from "react-bootstrap";
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";
import { ThemeContext } from "../../../context/ThemeContext";


import Donut from "../zenix/MyWallets/Donut";
import WalletTab from "../zenix/MyWallets/WalletTab";
import ContactSlider from "../zenix/Home/ContactSlider";
import SwiperSlider2 from "../zenix/MyWallets/SwiperSlider2";
import CurrentChart from "../zenix/Home/CurrentChart";
import ReactApexChart from "react-apexcharts";
import  lock from '../../../images/lock-closed.jpg';
import  unlock from '../../../images/lock-open.jpg';

class VisualOignonLock extends React.Component {
	constructor(props) {
		super(props);


		this.state = {
			series: this.props.series,
			options: {
				chart: {
					height: 390,
					type: 'radialBar',
				},
				plotOptions: {
					radialBar: {
						offsetY: 0,
						startAngle: 0,
						endAngle: 360,
						hollow: {
							margin: 5,
							size: '30%',
							background: 'transparent',
							image: this.props.image,
							imageWidth: 75,
							imageHeight: 75,
							imageClipped: false
						},
						track:{
							startAngle: 0,
							endAngle: 380,
						},
						dataLabels: {
							name: {
								show: false,
							},
							value: {
								show: false,
							}
						}
					}
				},
				colors: this.props.colors,
				labels: this.props.labels,
				legend: {
					show: false
					,
					floating: false,
					fontSize: '10px',
					position: 'right',
					offsetX: 0,
					offsetY: 28,
					labels: {
						useSeriesColors: true,
					},
					markers: {
						size: 0
					},
					formatter:this.props.formatter,
					itemMargin: {
						vertical: 1
					}
				},
				responsive: [{
					breakpoint: 1000,
					options: {
						legend: {
							show: false
						}
					}
				}]
			},


		};
}

	render() {
		return (
			<div >
				<ReactApexChart onclick={this.props.click} options={this.state.options} series={this.state.series} type="radialBar" width={300} height={300} />
			</div>
		);
	}
}

export default VisualOignonLock;