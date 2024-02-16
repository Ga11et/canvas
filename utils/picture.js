export const pictureUtils = {
  Pixel: class {
    constructor(effect, x, y, color) {
      this.x = Math.random() * effect.width;
      this.y = Math.random() * effect.height;

      this.originX = Math.floor(x);
      this.originY = Math.floor(y);

      this.color = color;
      this.size = effect.gap;

      this.vx = 0;
      this.vy = 0;
      this.ease = 0.1;

      this.dx = 0;
      this.dy = 0;
      this.fraction = 0.9;
      this.distance = 0;
      this.force = 0;
      this.angle = 0;
    }
    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.size, this.size);
    }
    update(mouse) {
      this.dx = mouse.x - this.x;
      this.dy = mouse.y - this.y;

      this.distance = this.dx * this.dx + this.dy * this.dy;
      this.force = (mouse.r / this.distance) * -1;

      if (this.distance < mouse.r) {
        this.angle = Math.atan2(this.dy, this.dx);
        this.vx += this.force * Math.cos(this.angle);
        this.vy += this.force * Math.sin(this.angle);
      }

      this.x += (this.vx *= this.fraction) + (this.originX - this.x) * this.ease;
      this.y += (this.vy *= this.fraction) + (this.originY - this.y) * this.ease;
    }
  },

  Picture: class {
    constructor(window, image, gap = 20) {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.image = image;
      this.pixels = [];

      this.centerX = this.width * 0.5;
      this.centerY = this.height * 0.5;

      this.x = this.centerX - image.width * 0.5;
      this.y = this.centerY - image.height * 0.5;

      this.gap = gap;

      this.mouse = {
        r: 8000,
        x: null,
        y: null,
      };
      window.addEventListener("mousemove", (e) => {
        if (e.target.classList.contains("canvas-picture")) {
          this.mouse.x = e.offsetX;
          this.mouse.y = e.offsetY;
        }
      });
    }
    init(ctx) {
      ctx.drawImage(this.image, this.x, this.y);
      const { data } = ctx.getImageData(0, 0, this.width, this.height);
      ctx.clearRect(0, 0, this.width, this.height);

      for (let y = 0; y < this.height; y += this.gap) {
        for (let x = 0; x < this.width; x += this.gap) {
          const index = (y * this.width + x) * 4;
          const red = data[index];
          const green = data[index + 1];
          const blue = data[index + 2];
          const alpha = data[index + 3];
          const color = `rgba(${red}, ${green}, ${blue}, ${alpha})`;

          if (alpha > 0) {
            this.pixels.push(new pictureUtils.Pixel(this, x, y, color));
          }
        }
      }
    }
    draw(ctx) {
      this.pixels.forEach((pixel) => pixel.draw(ctx));
    }
    update() {
      this.pixels.forEach((pixel) => pixel.update(this.mouse));
    }
  },
};
