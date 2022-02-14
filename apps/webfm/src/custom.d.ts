declare module "bci2k";
declare module '*.jpg';
declare module '*.png';
declare module '*.gif';
declare module "worker-loader!*" {
  class WebpackWorker extends Worker {
    constructor();
  }
  export default WebpackWorker;
}
