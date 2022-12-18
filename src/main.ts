import * as AudioBufferLooper from "./audio-buffer-looper";

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export default class MdfMidi {
  audioCtx: AudioContext;

  constructor(param?: { audioContext: AudioContext } | null) {
    if (param instanceof Object) {
      this.audioCtx = param.audioContext;
    }

    if (this.audioCtx == null) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    AudioBufferLooper.init(this.audioCtx);
  }

  play() {
    this.audioCtx.resume();
    AudioBufferLooper.startLoop();
  }

  stop() {
    AudioBufferLooper.stopLoop();
  }

  noteOn(key: number) {
    AudioBufferLooper.noteOn(key);
  }
}
