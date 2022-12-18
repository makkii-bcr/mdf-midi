export default class MdfMidi {
  isInit = false;
  audioCtx: AudioContext;

  constructor(param) {
    if (param instanceof Object) {
      this.audioCtx = param.audioContext;
    }
  }

  init() {
    if (this.audioCtx == null) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    this.isInit = true;
  }

  play() {
    if (!this.isInit) {
      this.init();
    }
    this.audioCtx.resume();
    const o = this.audioCtx.createOscillator();
    o.connect(this.audioCtx.destination);
    o.start(0);
    setTimeout(() => o.stop(), 2000);
  }
}
