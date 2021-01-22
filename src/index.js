import { makeImageUrl } from './api';
import { TIME_SPAN, TIME_START } from './constants';
import { Scroller } from './scroller';
import './index.css';

// assumes all images in the feed will share the same aspect ratio.
const baseImage = document.createElement('img');
baseImage.onload = () => {
  const aspectRatio = baseImage.width / baseImage.height;
  const imageWidth = Math.floor(window.innerWidth / 3) * 0.98;
  const imageHeight = Math.floor(imageWidth / aspectRatio);
  const scroller = new Scroller({
    imageWidth,
    imageHeight,
    numImages: TIME_SPAN / 20,
    makeUrl: (i => makeImageUrl(TIME_START + i * 20)),
  });
  document.body.appendChild(scroller.element);
  console.log('yo!');
}
baseImage.src = makeImageUrl(TIME_START);