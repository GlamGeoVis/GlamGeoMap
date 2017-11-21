/* eslint-disable no-underscore-dangle */
/*
https://github.com/jgimbel/react-leaflet-div-icon
Copyright (c) 2016, Joel

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

import React, { Component } from 'react';
import { render } from 'react-dom';
import { DivIcon, marker } from 'leaflet';
import { MapLayer } from 'react-leaflet';
import PropTypes from 'prop-types';

function createContextProvider(context) {
  class ContextProvider extends Component {
    getChildContext() {
      return context;
    }

    render() {
      return this.props.children;
    }
  }

  ContextProvider.propTypes = {
    children: PropTypes.any,
  };

  ContextProvider.childContextTypes = {};
  Object.keys(context).forEach((key) => {
    ContextProvider.childContextTypes[key] = PropTypes.any;
  });
  return ContextProvider;
}

export default class Divicon extends MapLayer {
  static propTypes = {
    opacity: PropTypes.number,
    zIndexOffset: PropTypes.number,
  };

  static childContextTypes = {
    popupContainer: PropTypes.object,
  };

  getChildContext() {
    return {
      popupContainer: this.leafletElement,
    };
  }

  // See https://github.com/PaulLeCam/react-leaflet/issues/275
  createLeafletElement(newProps) {
    const { map: _map, layerContainer: _lc, position, ...props } = newProps;
    this.icon = new DivIcon(props);
    return marker(position, { icon: this.icon, ...props });
  }

  updateLeafletElement(fromProps, toProps) {
    if (toProps.position !== fromProps.position) {
      this.leafletElement.setLatLng(toProps.position);
    }
    if (toProps.zIndexOffset !== fromProps.zIndexOffset) {
      this.leafletElement.setZIndexOffset(toProps.zIndexOffset);
    }
    if (toProps.opacity !== fromProps.opacity) {
      this.leafletElement.setOpacity(toProps.opacity);
    }
    if (toProps.draggable !== fromProps.draggable) {
      if (toProps.draggable) {
        this.leafletElement.dragging.enable();
      } else {
        this.leafletElement.dragging.disable();
      }
    }
  }

  componentWillMount() {
    super.componentWillMount();
    this.leafletElement = this.createLeafletElement(this.props);
  }

  componentDidMount() {
    super.componentDidMount();
    this.renderComponent();
  }

  componentWillReceiveProps() {
    console.log('divicon will receive props');
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidUpdate(fromProps) {
    console.log('divicon did update');
    this.renderComponent();
    this.updateLeafletElement(fromProps, this.props);
  }

  renderComponent = () => {
    const ContextProvider = createContextProvider({ ...this.context, ...this.getChildContext() });
    // eslint-disable-next-line no-underscore-dangle
    const container = this.leafletElement._icon;
    const component = (
      <ContextProvider>
        {this.props.children}
      </ContextProvider>
    );
    if (container) {
      render(
        component,
        container,
      );
    }
  }

  render() {
    return null;
  }
}
