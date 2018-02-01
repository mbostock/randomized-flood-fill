export default function*(canvas) {
  const w = canvas.width, h = canvas.height;
  const context = canvas.getContext("2d");
  const image = context.getImageData(0, 0, w, h);
  const indexes = [];
  let frame = 0;

  visit(w >> 1, h >> 1, 128, 128, 128);

  function visit(x, y, r, g, b) {
    if (x < 0 || x >= w || y < 0 || y >= h) return;
    const i = y * w + x, j = i << 2;
    if (image.data[j + 3] === 0) {
      image.data[j + 0] = r + (Math.random() < 0.5 ? -1 : 1);
      image.data[j + 1] = g + (Math.random() < 0.5 ? -1 : 1);
      image.data[j + 2] = b + (Math.random() < 0.5 ? -1 : 1);
      image.data[j + 3] = 255;
      indexes.push(i);
    }
  }

  while (indexes.length) {
    const i = Math.random() * indexes.length | 0;
    const j = indexes[i];
    const k = indexes.pop();
    if (i < indexes.length) indexes[i] = k;

    const r = image.data[(j << 2) + 0];
    const g = image.data[(j << 2) + 1];
    const b = image.data[(j << 2) + 2];
    const x = j % w, y = j / w | 0;
    visit(x - 1, y, r, g, b);
    visit(x + 1, y, r, g, b);
    visit(x, y - 1, r, g, b);
    visit(x, y + 1, r, g, b);

    if (!(++frame % 1000)) {
      context.putImageData(image, 0, 0);
      yield canvas;
    }
  }

  context.putImageData(image, 0, 0);
  yield canvas;
}
