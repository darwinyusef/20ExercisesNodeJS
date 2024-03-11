import './style.css'
import { createButton } from './stories/Button';

let e = createButton({ 'primary': true, 'label': 'Clickeame', 'size': 'large'});
document.getElementById('app').appendChild(e);
