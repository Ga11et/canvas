import * as PIXI from "pixi.js";

const fragShader = `
  uniform vec2  res;
  uniform float time;
  uniform vec2  mouse;
  uniform bool  invert;
  uniform float rColor;
  uniform float gColor;
  uniform float bColor;
  uniform float blur;
  uniform float blurPower;
  uniform float mouseFactorX;
  uniform float mouseFactorY;
  uniform float xFactor;
  uniform float yFactor;

  uniform vec2 size;
  uniform vec4 dimensions;
  uniform vec4 filterArea;

  uniform vec3 colorA;
  uniform vec3 colorB;
  uniform vec3 colorC;
  uniform vec3 colorD;
  const int grads = 3;

  const float Pi = 3.14159;

  vec3 mixColor(vec3 c1, vec3 c2, float start, float end, float position) {
    float k = (position - start) / (end - start);
    return vec3(
      min(1.0, c1.x*(1.0 - k) + c2.x*k),
      min(1.0, c1.y*(1.0 - k) + c2.y*k),
      min(1.0, c1.z*(1.0 - k) + c2.z*k)
    );
  }

  void main() {
    vec2 coord = vec2(gl_FragCoord.x / res.x, gl_FragCoord.y / res.y);
    coord.y -= pow(mouse.x*mouseFactorX*sin(xFactor*mouse.y*Pi*coord.x), 1.0);
    coord.x -= pow(mouse.y*mouseFactorY*cos(yFactor*mouse.x*Pi*coord.y), 1.0);
    float gP = 1.0 - coord.x*coord.y; float gD = 1.0/float(grads); float gI;
    gP += mouse.y/2.0 - mouse.y;
    vec3 c1 = vec3(.0, .0, .0);
    vec3 c2 = vec3(.0, .0, .0);
    if ((gP >= 0.0) && (gP < gD)) { c1 = colorA; c2 = colorB; gI = 0.0; }
    if ((gP >= 1.0*gD) && (gP < 2.0*gD)) { c1 = colorB; c2 = colorC; gI = 1.0; }
    if ((gP >= 2.0*gD) && (gP <= 3.0*gD)) { c1 = colorC; c2 = colorD; gI = 2.0; }
    vec3 col = mixColor(c1, c2, gI*gD, (gI + 1.0)*gD, gP);
    if (gP < blur) col *= min(1.0, blurPower*sin(gP*Pi/2.0));
    if (gP > 1.0 - blur) col *= min(1.0, blurPower*sin((1.0 - gP)*Pi/2.0));
    if (invert) col.xyz = vec3(1.0, 1.0, 1.0) - col.xyz;
    col.x = min(1.0, col.x * rColor);
    col.y = min(1.0, col.y * gColor);
    col.z = min(1.0, col.z * bColor);
    gl_FragColor = vec4(col, 1.0);
  }

`;

/** Преобразует CSS цвет в шейдерный формат */
const cssColorToVec3 = (cssColor) => {
  const { r, g, b } = new PIXI.Color(cssColor).toRgb();
  return [r, g, b];
};

/** Фильрт искажённого градиента
 * @param {Number} width Ширина области в пикселях
 * @param {Number} height Высота области в пикселях
 */
class GradientFilter extends PIXI.Filter {
  constructor(width, height) {
    super(null, fragShader);
    this.uniforms.invert = false;
    this.uniforms.rColor = 1;
    this.uniforms.gColor = 1;
    this.uniforms.bColor = 1;
    this.uniforms.blur = 0.3;
    this.uniforms.blurPower = 0;
    this.uniforms.xFactor = 4;
    this.uniforms.yFactor = 0.5;
    this.uniforms.colorA = cssColorToVec3("#ff0000");
    this.uniforms.colorB = cssColorToVec3("#00ff00");
    this.uniforms.colorC = cssColorToVec3("#0000ff");
    this.uniforms.colorD = cssColorToVec3("#ffffff");
    this.uniforms.mouseFactorX = 0.25;
    this.uniforms.mouseFactorY = 1;
    this.uniforms.mouseDelay = 10;
    this.uniforms.noise = 10;
    this.uniforms.noiseSeed = 10;
    this.uniforms.res = new PIXI.Point(width, height);
  }

  set mouse(value) {
    this.uniforms.mouse = value;
  }
}

export default GradientFilter;
