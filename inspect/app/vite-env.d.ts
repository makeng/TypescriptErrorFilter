/* Tools */
declare type Obj = Record<PropertyKey, any>;

/* Assets */
declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';

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
