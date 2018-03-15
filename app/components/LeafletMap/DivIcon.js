import {DivIcon} from 'leaflet';

export default class extends DivIcon {
  constructor(options) {
    super(options)
  }
  createIcon (oldIcon) {
    const div = super.createIcon(oldIcon);
    this._icon = div;
    return div;
  }
}