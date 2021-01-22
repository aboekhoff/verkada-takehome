import { TIME_SPAN, TIME_START } from './constants';
import { makeImageUrl } from './api'
import { Row } from './row';
const { floor, ceil } = Math;

export class Scroller {
  constructor() {
    this.offset = 0;
    this.numImages = TIME_SPAN / 20;
    this.numRows = Math.ceil(this.numImages/3);
    this.bufferRatio = 16;
    this.makeUrl = (i) => makeImageUrl(TIME_START + i * 20);
    this.element = document.createElement('div');
    this.element.className = 'scroller';
    this.container = document.createElement('div');
    this.container.className = 'container';
    this.statusBar = document.createElement('div');
    this.statusBar.className = 'statusBar';
    this.element.appendChild(this.statusBar);
    this.element.appendChild(this.container);
    this.rows = [];
    this.init();
    this.addEventListeners();

    window.rows = this.rows;
  }

  computeDimensions() {
    const aspectRatio = this.baseImage.width / this.baseImage.height;
    const imageWidth = Math.floor(window.innerWidth / 3) * 0.98;
    const imageHeight = Math.floor(imageWidth / aspectRatio);
    const rowHeight = imageHeight;
    const height = rowHeight * this.numImages/3;
    this.container.style.height = height + 'px';
    this.updateRows();
    Object.assign(this, {
      aspectRatio,
      imageWidth,
      imageHeight,
      rowHeight,
      height,
    });
  }

  init() {
    this.rows.length = 0;
    const baseImage = document.createElement('img');
    baseImage.onload = () => {
      this.baseImage = baseImage;
      this.updateStatusBar(TIME_START);
      this.computeDimensions();
      this.makeRows();
    }
    baseImage.src = makeImageUrl(TIME_START);
  }

  updateRows() {
    this.rows.forEach(row => {
      row.width = this.imageWidth;
      row.height = this.imageHeight;
      row.update();
    });
  }

  makeRows() {
    const rowsPerScreen = ceil(window.innerHeight / this.imageHeight);
    for (let i = 0; i < rowsPerScreen * this.bufferRatio; i++) {
      const row = new Row({
        offset: i,
        top: i * this.imageHeight,
        makeUrl: this.makeUrl,
        width: this.imageWidth,
        height: this.imageHeight,
      });
      this.container.appendChild(row.element);
      this.rows.push(row);
    }
  }

  updateStatusBar(timestamp) {
    const date = new Date(timestamp * 1000);
    this.statusBar.innerHTML = date;
  }

  handleScroll() {
    const innerHeight = window.innerHeight;
    const rowsPerScreen = ceil(innerHeight / this.imageHeight);
    const screenTop = this.element.scrollTop;
    const screenBottom = screenTop + innerHeight;
    
    const rowsAbove = [];
    const rowsOnScreen = [];
    const rowsBelow = [];

    this.rows.forEach(row => {
      const rowTop = row.top;
      const rowBottom = rowTop + row.height;
      if (rowBottom < screenTop) { rowsAbove.push(row); }
      else if (rowTop > screenBottom) { rowsBelow.push(row); }
      else { rowsOnScreen.push(row) }
    });
      
    // this means we've scrolled out of range of the buffer and need to fix all rows
    if (rowsOnScreen.length < rowsPerScreen) {
      const firstVisibleRow = floor(screenTop / this.rowHeight);
      const topBufferSize = Math.floor((this.rows.length - rowsPerScreen)/2);
      let firstOffset = firstVisibleRow - topBufferSize;
      // if we're at the top don't place rows above the first row
      if (firstOffset < 0) { firstOffset = 0; }
      // if we're at the bottom don't place rows after the last row
      if (firstOffset + this.rows.length >= this.numImages/3) {
        firstOffset = this.numRows - this.rows.length;
      }
      this.rows.forEach((row, i) => {
        row.offset = firstOffset + i;
        row.top = row.offset * this.rowHeight;
        row.update();
      });
      this.updateStatusBar(TIME_START + firstVisibleRow * 3 * 20);
      return;
    }

    if (rowsBelow - rowsAbove > 1) {
      const n = rowsBelow - rowsAbove;
      for (let i = 0; i < n; i++) {
        // don't prepend if we're at the beginning
        if (this.rows[0].offset === 0) { 
          break; 
        }
        const row = rowsBelow[this.rows.length-1];
        row.offset = this.rows[0].offset - 1;
        row.top = row.offset * this.rowHeight;
        this.rows.unshift(row);
        this.container.removeChild(row.element);
        this.container.insertBefore(row.element, row.firstChild);
      }
    }

    else if (rowsAbove - rowsBelow > 1) {
      const n = rowsBelow - rowsAbove;
      for (let i = 0; i < n; i++) {
        const row = rowsAbove[0]
        // don't append if we're at the end
        if (this.rows[this.rows.length-1].offset === (this.numImages/3)-1) {
          break;
        }
        row.offset = this.rows[this.rows.length-1].offset + 1;
        row.top = row.offset * this.rowHeight;
        this.rows.push(row);
        this.container.removeChild(row.element);
        this.container.appendChild(row.element);
      }
    }

    this.updateStatusBar(TIME_START + rowsOnScreen[0].offset * 3 * 20);
  }

  addEventListeners() {
    this.element.addEventListener('scroll', () => this.handleScroll());
  }
}