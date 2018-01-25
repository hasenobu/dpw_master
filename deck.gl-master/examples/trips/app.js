/* global window,document */
import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay.js';

import {json as requestJson} from 'd3-request';
import {csv as requestCsv} from 'd3-request';

// Set your mapbox token here
const MAPBOX_TOKEN = 'pk.eyJ1IjoiaGFzZW5vYnUiLCJhIjoiY2oyenNqdnk5MDA0bjMzbXgxdWlnOXVpOCJ9.yvucOT_EjbHMi1-yjPE56A'; // eslint-disable-line

// Source data CSV

const DATA_URL = 'D:/data/DB_TP.geojson';  // eslint-disable-line

const DATA_info = 'D:/data/BPO13101.csv'

const DATA_ROAD= 'D:/data/DB_RO.geojson';

const colorScale = r => [r * 255, 140, 200 * (1 - r)];

class Root extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        ...DeckGLOverlay.defaultViewport,
        width: 500,
        height: 500
      },
      // buildings: null,
      // trips: null,
      // time: 0

      plotdata:null,
      shapedata:null,
      roaddata:null
    };

    requestJson(DATA_URL, (error, response) => {
      if (!error) {
        this.setState({shapedata:response});
      }
    });

    requestJson(DATA_ROAD, (error, response) => {
      if (!error) {
        this.setState({roaddata:response});
      }
    });

    requestCsv(DATA_info, (error, response) => {
      if (!error) {
        //const data= response.map(d => ([Number(d.lang), Number(d.lat)]));
        this.setState({plotdata:response});
      }
    });
    
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize.bind(this));
    this._resize();
    this._animate();
  }

  componentWillUnmount() {
    if (this._animationFrame) {
      window.cancelAnimationFrame(this._animationFrame);
    }
  }

  _animate() {
    const timestamp = Date.now();
    const loopLength = 1800;
    const loopTime = 60000;

    this.setState({
      time: ((timestamp % loopTime) / loopTime) * loopLength
    });
    this._animationFrame = window.requestAnimationFrame(this._animate.bind(this));
  }

  _resize() {
    this._onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _onViewportChange(viewport) {
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });
  }

  render() {
    const {viewport, shapedata, trips, time} = this.state;

    return (
      <MapGL
        {...viewport}
        mapStyle="mapbox://styles/hasenobu/cj5nkag5a4g7o2srxo3we35yt"
        onViewportChange={this._onViewportChange.bind(this)}
        mapboxApiAccessToken={MAPBOX_TOKEN}>
        <DeckGLOverlay viewport={viewport}
          data1={shapedata}
          data2={plotdata}
          data3={roaddata}
          colorScale={colorScale}
          radius={30}
          />
      </MapGL>
    );
  }
}

render(<Root />, document.body.appendChild(document.createElement('div')));
