import { DivIcon } from 'leaflet';

export default class extends DivIcon {
  createIcon(oldIcon) {
    const div = super.createIcon(oldIcon);
    this.icon = div;
    return div;
  }
}
