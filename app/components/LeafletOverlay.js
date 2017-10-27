import {DivOverlay, LatLng, Layer} from 'leaflet';
import { MapLayer } from 'react-leaflet';

export default class LeafletOverlay extends MapLayer {
  // componentDidMount() {
  //   console.log('comp did mount');
  // }
  /*

  export function LatLng(lat, lng, alt) {

   */
  createLeafletElement(props) {
    console.log('creating leaflet elemtn', props);
    const overlay = new DivOverlay();
    overlay.setLatLng(new LatLng(51.505, -0.09));
    overlay.setContent('asdsadsadsadsadsa');
    return new DivOverlay();
  }

  updateLeafletElement(fromProps, toProps) {
    console.log('updateing ', fromProps, toProps, this.leafletElement);
  }

  render() {
    return null;
  }
}
