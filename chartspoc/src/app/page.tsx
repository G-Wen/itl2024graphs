'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import React, { PureComponent } from 'react';
import "./globals.css";
var utc = require('dayjs/plugin/utc');
const dayjs = require('dayjs');
dayjs.extend(utc);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    var session = payload[0].payload;
    var tickdate = dayjs.unix(session.epoch_end);
    var datestring = dayjs(tickdate).utc().format('MMM D (HH:mm)');

    return (
      <div className="tooltip">
        <div className='tooltipDate'>{datestring}</div>
        <div className='tooltipLine'>
          <div id="rpcircle"></div>
          <div className='rp'>{`RP: ${session.rp} (+${session.rp_gain})`}</div>
        </div>
        <br/>
        <div className='tooltipLine'>
          <div id="epcircle"></div>
          <div className='ep'>{`EP: ${session.ep} (+${session.ep_gain})`}</div>
        </div>
        <br/>
        <div className='tooltipLine'>
          <div id="spcircle"></div>
          <div className='sp'>{`SP: ${session.sp} (+${session.sp_gain})`}</div>
        </div>
      </div>
    );
  }

  return null;
};

class CustomizedXAxisTick extends PureComponent {
  render() {
    const { x, y, stroke, payload } = this.props;
    var tickdate = dayjs.unix(payload.value)

    return (
      <g transform={`translate(${x},${y}) scale(0.75)`}>
        <text x={0} y={0} dy={15} textAnchor="middle">
          {dayjs(tickdate).utc().format('MMM D')}
        </text>
      </g>
    );
  }
}

class CustomizedYAxisTick extends PureComponent {
  render() {
    const { x, y, stroke, payload } = this.props;
    let points = payload.value
    let club = payload.value / 1000
    let fillcolour = ""
    switch (points) {
      case 525000:
        fillcolour = "rgb(238,8,144)"
        break;
      case 450000:
        fillcolour = "rgb(33,204,232)"
        break;
      case 375000:
        fillcolour = "rgb(195,195,195)"
        break;
      case 300000:
        fillcolour = "rgb(226,156,24)"
        break;
      case 225000:
        fillcolour = "rgb(102,201,85)"
        break;
      case 150000:
        fillcolour = "rgb(180,92,255)"
        break;
      case 75000:
        fillcolour = "rgb(201,133,94)"
        break;
    }

    let t600 = <g fill-rule="evenodd" clip-rule="evenodd" transform={`translate(${x}, ${y}) scale(0.3)`}><g transform="translate(-150,-30)">
      <text x="64" y="40" font-size="40" text-anchor="start" fill="black">{club+"k"}</text>
      <path d="M4.927 45.504c3-4.038 10.289-9.262 13.465-11.142 6.364-3.767 19.124-9.122 24.713-8.729-5.248 1.467-11.227 3.246-17.936 7-5.123 2.866-14.192 9.151-16.245 15.056-.73 2.1-.297 3.689 1.388 4.539 5.434 2.742 17.918-2.469 20.398-3.582 4.967-2.227 11.883-6.384 15.506-10.064l.047-.049.062-.063.188-.192c.236-.245.533-.562.852-.933 1.846-2.152 4.346-6.077-.787-7.759-2.402-.788-8.354.039-12.285 1.422-2.002.704-7.404 2.865-8.92 3.555 2.182-2.069 9.447-5.071 12.125-6.039 2.275-.822 9.428-2.863 11.721-2.871.621-.002 2.172.187 3.125.38l.062.013-.062-.013c-3.584-.728-5.242-.71-6.6-1.221-.928-.349-1.715-.944-2.881-2.193-2.752-2.948-6.451-7.704-9.264-9.964-4.896-3.934-7.454-4.177-13.083-3.568-1.904-2.67-5.372-3.423-7.915-2.305a6.206 6.206 0 0 0-.821.437c-1.407 1.626-1.672 3.807-.694 5.723.017-.011 4.802-3.15 7.982-3.297-.408.16-.792.311-1.157.456-.306.123-.599.241-.883.36a27.73 27.73 0 0 0-1.396.626c-.929.453-1.805.966-2.776 1.675-4.638 3.384-6.173 7.265-4.803 14.921.262 1.462.714 3.964 1.115 6.225.31 1.745.588 3.347.726 4.22-1.353 1.03-3.46 4.2-4.194 5.338-.151.811-.433 1.443-.789 2.062l.016-.024zm27.313-31.235c3.012 2.906 5.26 6.684 7.475 8.909.154.153.299.333.471.518.328.354.754.725 1.52.949-2.637-.033-3.775.396-4.902.584-1.074-.779-4.629-6.223-6.805-9.272-1.561-2.186-3.452-4.261-6.863-5.39-.605-.201-1.405-.174-2.014-.124-.198.016-.215-.14-.017-.18 1.266-.25 2.58-.263 3.981-.042 2.672.421 5.365 2.324 7.154 4.048z" fill="#ca0088"/>
      <path d="M11.781 7.22l-.024.016c-2.378 1.675-3.364 4.562-2.587 7.335-4.703 4.331-5.774 9.966-4.936 16.413.314 2.077 1.308 7.792 1.503 9.598.131 1.209.104 2.126-.038 2.885.733-1.138 2.841-4.308 4.194-5.338-.315-2.005-1.377-7.855-1.84-10.445-1.37-7.656.165-11.545 4.803-14.929 2.283-1.666 4.623-2.477 6.212-3.108-3.18.146-7.965 3.286-7.982 3.297-.977-1.917-.712-4.098.695-5.724z" fill="#33348e"/>
      <path d="M10.733 49.918c1.065 2.6 9.498 2.121 22.171-4.233 7.557-3.788 16.287-10.227 14.346-13.404-2.031-3.33-13.713.394-19.988 3.323-3.266 1.524-18.449 9.626-16.529 14.314z" fill="#33348e"/>
      <path d="M18.392 34.363c-3.176 1.879-10.465 7.104-13.465 11.142-.389.523-2.232 3.857-2.471 4.468-.411 1.055-.812 2.57-.384 3.77.748 2.094 4.005 2.73 5.967 2.789 4.032.121 11.084-1.734 14.957-3.07 7.349-2.533 16.193-6.935 22.474-11.33 2.682-1.876 12.662-9.159 10.449-13.9-.643-1.379-2.061-1.888-3.576-2.196-.953-.193-2.504-.382-3.125-.38-2.293.007-9.445 2.049-11.721 2.871-2.678.967-9.943 3.969-12.125 6.039 1.516-.69 6.918-2.851 8.92-3.555 3.932-1.383 9.883-2.209 12.285-1.422 6.445 2.112.854 7.76-.361 8.996-3.623 3.68-10.539 7.837-15.506 10.064-2.48 1.113-14.964 6.324-20.398 3.582-1.685-.85-2.119-2.439-1.388-4.539 2.053-5.905 11.122-12.19 16.245-15.056 6.709-3.754 12.688-5.533 17.936-7-5.589-.395-18.349 4.96-24.713 8.727z" fill="#33348e"/>
      <path d="M22.896 45.738c-2.125.85-3.871 1.036-5.781.246-.956-.396-2.298-1.502-2.328-1.532l-1.092.93.081.071.081.07.163.141c.112.097.226.194.343.292.277.233.573.469.914.719 2.592 1.898 5.486 1.416 8.205.311 4.281-1.742 5.208-6.18 3.802-8.913-2.638.735-7.844 2.862-9.299 4.205.201 2.875 2.862 3.745 4.911 3.46z" fill="#fff22d"/>
      </g>
    </g>

    let arrows = <g transform={`translate(${x}, ${y}) scale(0.024)`}><g transform="translate(-1700,-350)">
        <text x="600" y="450" font-size="500" text-anchor="start" fill="black">{club+"k"}</text>
        <path fill={fillcolour} d="m256.002 223.181-59.006 59.006v208.258h118.009V282.187z"/>
        <path fill={fillcolour} d="M83.82 142.927h118.012V301.92H83.82z" transform="rotate(-134.999 142.826 222.425)"/>
        <path fill={fillcolour} d="M364.938 134.747 256.2 26.008l-83.444 83.444L383.67 320.367l83.446-83.444-47.569-47.569c-4.209-4.209-4.209-11.031 0-15.24l-39.366-39.366c-4.21 4.207-11.034 4.207-15.243-.001z"/>
        <path d="m489.974 229.303-55.19-55.189c-4.209-4.209-11.033-4.209-15.24 0-4.209 4.209-4.209 11.033 0 15.24l47.569 47.569-83.446 83.444-210.913-210.913 83.444-83.444 108.738 108.738c4.209 4.209 11.033 4.209 15.24 0 4.209-4.209 4.209-11.033 0-15.24L263.82 3.149a10.734 10.734 0 0 0-7.818-3.147 10.736 10.736 0 0 0-7.818 3.147L22.028 229.303a10.771 10.771 0 0 0 0 15.24l98.686 98.686a10.741 10.741 0 0 0 7.62 3.157c2.757 0 5.516-1.052 7.62-3.157l39.488-39.489v197.483c0 5.952 4.825 10.777 10.777 10.777h139.563c5.952 0 10.777-4.825 10.777-10.777V303.74l39.488 39.489a10.741 10.741 0 0 0 7.62 3.157c2.757 0 5.516-1.052 7.62-3.157l98.686-98.686a10.771 10.771 0 0 0 3.157-7.62 10.766 10.766 0 0 0-3.156-7.62zM196.996 490.445V282.187L256 223.181l59.004 59.005v208.259H196.996zm-39.68-365.949 83.444 83.444-112.426 112.427-83.446-83.444 112.428-112.427z"/>
      </g>
    </g>

    if (points == 600000){
      return(t600)
    } else if (points == 525000){
      return(arrows)
    } else if (points == 0) {
      return(<g></g>)
    } else {
      return(arrows)
    }
  }
}

export default function Page() {
  let timeline = require('./timeline_compressed.json');
  let ytickcount = Math.min(1 + Math.ceil(Math.max(timeline[timeline.length - 1].rp, 1) / 75000), 9)
  let ticks = Array.from({length: ytickcount}, (_, i) => 75000*i)
  let session = timeline[0]

  return (
    <AreaChart
      width={600}
      height={400}
      data={timeline}
      margin={{
        top: 5,
        right: 20,
        left: 20,
        bottom: 25,
      }}
    >
      <CartesianGrid vertical={false}/>
      <XAxis interval="equidistantPreserveStart" scale="utc" dataKey="epoch_end" type="number" domain={[timeline[0].epoch_start,timeline[timeline.length-1].epoch_end + 3600]} tick={<CustomizedXAxisTick />} allowDataOverflow/>
      <YAxis type="number" ticks={ticks} tick={<CustomizedYAxisTick />} domain={[0, dataMax => Math.min(dataMax+10000, 635000)]} /> 
      <Tooltip content={<CustomTooltip/>} />
      <Area type="stepAfter" dataKey="sp" stackId="1"  stroke="rgba(55,57,154,0.2)" fill="rgba(55,57,154,0.2)" activeDot={false}/>
      <Area type="stepAfter" dataKey="ep" stackId="1"  stroke="rgba(238,8,144,0.2)" fill="rgba(238,8,144,0.2)" activeDot={{ stroke: "rgb(254,226,19)", r: 2, strokeWidth: 4}}/>
    </AreaChart>
  )
}