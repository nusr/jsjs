const DEBUG_COLOR_LIST = [
  '#0000CC',
  '#0000FF',
  '#0033CC',
  '#0033FF',
  '#0066CC',
  '#0066FF',
  '#0099CC',
  '#0099FF',
  '#00CC00',
  '#00CC33',
  '#00CC66',
  '#00CC99',
  '#00CCCC',
  '#00CCFF',
  '#3300CC',
  '#3300FF',
  '#3333CC',
  '#3333FF',
  '#3366CC',
  '#3366FF',
  '#3399CC',
  '#3399FF',
  '#33CC00',
  '#33CC33',
  '#33CC66',
  '#33CC99',
  '#33CCCC',
  '#33CCFF',
  '#6600CC',
  '#6600FF',
  '#6633CC',
  '#6633FF',
  '#66CC00',
  '#66CC33',
  '#9900CC',
  '#9900FF',
  '#9933CC',
  '#9933FF',
  '#99CC00',
  '#99CC33',
  '#CC0000',
  '#CC0033',
  '#CC0066',
  '#CC0099',
  '#CC00CC',
  '#CC00FF',
  '#CC3300',
  '#CC3333',
  '#CC3366',
  '#CC3399',
  '#CC33CC',
  '#CC33FF',
  '#CC6600',
  '#CC6633',
  '#CC9900',
  '#CC9933',
  '#CCCC00',
  '#CCCC33',
  '#FF0000',
  '#FF0033',
  '#FF0066',
  '#FF0099',
  '#FF00CC',
  '#FF00FF',
  '#FF3300',
  '#FF3333',
  '#FF3366',
  '#FF3399',
  '#FF33CC',
  '#FF33FF',
  '#FF6600',
  '#FF6633',
  '#FF9900',
  '#FF9933',
  '#FFCC00',
  '#FFCC33',
];
class Debug {
  private namespace: string;

  static readonly colorMap: Map<string, string> = new Map<string, string>();
  constructor(namespace: string) {
    this.namespace = namespace;
    this.setColor();
  }
  init = () => {
    return this.log;
  };
  private log = (...rest: Array<unknown>): void => {
    if (!this.enable()) {
      return;
    }
    const { namespace } = this;
    const color = Debug.colorMap.get(namespace);
    const result = [`%c ${namespace}:`, `color:${color};`, ...rest];
    console.log(...result);
  };
  private enable() {
    return this.checkEnable();
  }
  checkEnable() {
    if (typeof window === 'undefined') {
      if (
        typeof process !== 'undefined' &&
        process &&
        process.env &&
        process.env['DEBUG'] &&
        process.env['DEBUG'] === '*'
      ) {
        return true;
      }
      return false;
    }
    if (
      window &&
      window.localStorage &&
      window.localStorage.getItem &&
      typeof window.localStorage.getItem === 'function'
    ) {
      return localStorage.getItem('debug') === '*';
    }

    return false;
  }
  private setColor() {
    if (!Debug.colorMap.has(this.namespace)) {
      const index = Math.floor(Math.random() * DEBUG_COLOR_LIST.length);
      const color = DEBUG_COLOR_LIST[index];
      if (color) {
        Debug.colorMap.set(this.namespace, color);
      }
    }
  }
}

export default Debug;
