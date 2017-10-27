import { Marker as LeafletMarker } from 'leaflet';
import { Marker } from 'react-leaflet';
import * as ReactDOM from 'react-dom';

class CustomLeafletMarker extends LeafletMarker {
  constructor(position, options) {
    super(position, options);
    this._zoomAnimated = true;
    this.element = document.createElement('div');
    this.element.classList.add('leaflet-zoom-animated');
  }

  onAdd(map) {
    // this._zoomAnimated = this._zoomAnimated && map.options.markerZoomAnimation;
    //
    // if (this._zoomAnimated) {
    map.on('zoomanim', console.log, this);
    // }
    this._initIcon();
    // this._icon = this.element;
    // this.getPane().appendChild(this._icon);
    // this.update();
  }
}

export default class CustomMarker extends Marker {
  createLeafletElement(props) {
    const marker = new CustomLeafletMarker(props.position, this.getOptions(props));
    this.reactRoot = marker.element;
    return marker;
  }

  renderChildren(children) {
    ReactDOM.render(children, this.reactRoot);
  }

  componentWillReceiveProps(newProps) {
    super.componentWillReceiveProps(newProps);
    this.renderChildren(this.newProps.children);
  }

  componentDidMount() {
    super.componentDidMount();
    this.renderChildren(this.props.children);
    console.log(this.props.key);
    console.log('123');
  }

  render() {
    return null;
  }
}

