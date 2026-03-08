/* Tools */
declare type Obj = Record<PropertyKey, unknown>;

/* Assets */
declare module '*.png' {
  const value: string;
  export default value;
}
declare module '*.gif' {
  const value: string;
  export default value;
}
declare module '*.jpg' {
  const value: string;
  export default value;
}
declare module '*.jpeg' {
  const value: string;
  export default value;
}
declare module '*.svg' {
  const value: string;
  export default value;
}

/* JSON */
declare module '*.json' {
  const value: unknown;
  export default value;
}

/* Pkgs */
declare module '@kdcloudjs/kdesign-icons';

/* Expend */
interface Window {
  initGeetest: (arg: Obj, cb: (captchaObj: Obj) => void) => void;
  wx: Obj;
  WWOpenData: Obj; // 企微的开放数据
  dd: Obj;
}
declare let wx: Window['wx']
declare let dd: Window['dd']
