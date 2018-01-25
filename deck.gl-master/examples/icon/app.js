/* global window,document */
import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay.js';

import {json as requestJson} from 'd3-request';
import {csv} from 'd3-request';

// Set your mapbox token here
const MAPBOX_TOKEN = 'pk.eyJ1IjoiaGFzZW5vYnUiLCJhIjoiY2oyenNqdnk5MDA0bjMzbXgxdWlnOXVpOCJ9.yvucOT_EjbHMi1-yjPE56A'; // eslint-disable-line

// Source data CSV
//const DATA_URL = 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/icon/meteorites.json';  // eslint-disable-line

class Root extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        ...DeckGLOverlay.defaultViewport,
        width: 500,
        height: 500
      },
      data: null,
      iconMapping: null
    };

    requestJson('./data/workstyling.json', (error, response) => {
      if (!error) {
        this.setState({data: response});
      }
    });
    requestJson('./data/workstyling_logo.json', (error, response) => {
      if (!error) {
        this.setState({iconMapping: response});
      }
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize.bind(this));
    this._resize();
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
    const {viewport, data, iconMapping} = this.state;

    return (
      <MapGL
        {...viewport}
        mapStyle="mapbox://styles/hasenobu/cj79shswa8hm82rm8wnz8b905"
        onViewportChange={this._onViewportChange.bind(this)}
        mapboxApiAccessToken={MAPBOX_TOKEN}>
        <DeckGLOverlay viewport={viewport}
          data={data}
          iconAtlas="data/workstyling_logo.png"
          iconMapping={iconMapping}
          showCluster={true}
          />
      </MapGL>
    );
  }
}

render(<Root />, document.body.appendChild(document.createElement('div')));
