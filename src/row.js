export class Row {
  constructor(props) {
    const { offset, top, width, height, makeUrl } = props;
    this.offset = offset;
    this.top = top;
    this.width = width;
    this.height = height;
    this.makeUrl = makeUrl;
    this.images = [];
    this.element = document.createElement('div');
    this.element.className = 'row';
    this.element.style.top = top + 'px';
    this.makeImages();
  }

  makeImages() {
    for (let i = 0; i < 3; i++) {
      const img = document.createElement('img');
      this.element.appendChild(img);
      this.images.push(img);
    }
    this.update();
  }

  update() {
    this.element.style.top = this.top + 'px';
    this.images.forEach((img, i) => {
      const url = this.makeUrl(this.offset * 3 + i);
      if (img.src !== url) {
        img.src = url;
      }
      img.width = this.width;
      img.height = this.height;
    });
  }
}