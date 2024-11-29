import MainWorker from "web-worker:./main-worker";

//let intervalSec = 0.016; // create AudioBuffer interval seconds
//let reserveBufSec = 0.100; // reserve AudioBufferSourceNode seconds
let intervalSec = 0.200; // create AudioBuffer interval seconds
let reserveBufSec = 1.000; // reserve AudioBufferSourceNode seconds

let reserveBufCnt = 1 / intervalSec * reserveBufSec;
let audioStartPosSec = 0;
let audioStartAddSec = 0;
let audioStartAddSecOld = 0;
let nowReserveBufSec = 0;
let waveCnt = 0;
let time1 = performance.now();
let time2 = performance.now();
let oldIntervalCallTime = performance.now();
let loopProcCallCnt = 0;
let loopProcCallCntReal = 0;
let postBgCallCnt = 0;
let onMesCallCnt = 0;

var audioCtxStartTime = -1;
var loopProcStartTime = -1;

let intervalCallbackId: NodeJS.Timer;
let mainWorker: Worker;
let audioCtx: AudioContext;

export function init(_audioCtx: AudioContext) {
  audioCtx = _audioCtx;
  mainWorker = new MainWorker();
  mainWorker.onmessage = (event) => {
    onMessage(event);
  };
  mainWorker.onmessageerror = (event) => {
    console.error("wocker messageerror: " + event);
  };
}

export function setBufferConfig(
  intervalSec: number = 0.1,
  reserveBufSec: number = 2.0,
) {
  intervalSec = intervalSec;
  reserveBufSec = reserveBufSec;
  reserveBufCnt = 1 / intervalSec * reserveBufSec;
}

export function startLoop() {
  loopProc();
  for (let i = 0; i < reserveBufCnt / 2; i++) {
    loopProc();
  }
  intervalCallbackId = setInterval(() => {
    loopProc();
  }, intervalSec * 1000);
}

export function stopLoop() {
  clearInterval(intervalCallbackId);
  setTimeout(() => {
    audioCtxStartTime = -1;
    loopProcStartTime = -1;
  }, 0);
}

function loopProc(isRecursionCall: Boolean = false) {
  loopProcCallCntReal++;
  nowReserveBufSec = (audioStartPosSec + audioStartAddSec) -
    (audioCtx.currentTime - audioCtxStartTime);

  // if slowdown worker proccessing, this function skip
  if (nowReserveBufSec > reserveBufSec + intervalSec) return;
  if ((postBgCallCnt - 1) * intervalSec > reserveBufSec - nowReserveBufSec) {
    return;
  }
  loopProcCallCnt++;

  time1 = performance.now();
  if (loopProcStartTime == -1) loopProcStartTime = time1;

  const f32ArrayL = new Float32Array(audioCtx.sampleRate * intervalSec);
  const f32ArrayR = new Float32Array(audioCtx.sampleRate * intervalSec);
  const arrayBufL = f32ArrayL.buffer;
  const arrayBufR = f32ArrayR.buffer;

  mainWorker.postMessage({
    mes: "buf",
    bufL: arrayBufL,
    bufR: arrayBufR,
    ch: 2,
    sampleRate: audioCtx.sampleRate,
    waveCnt: waveCnt,
  }, [arrayBufL, arrayBufR]); // transfer ArrayBuffer (for performance)
  postBgCallCnt++;
  waveCnt += audioCtx.sampleRate * intervalSec;

  // if lack of reserve buffer, speed up create buffer
  if (!isRecursionCall && nowReserveBufSec < reserveBufSec) {
    loopProc(true);
  }

  // console.log("send  ", loopProcCallCnt, time1);
}

function onMessage(event) {
  postBgCallCnt--;
  onMesCallCnt++;
  // console.log("receive time:", performance.now());
  const data = event.data;
  const ch = data.ch;
  const sampleRate = data.sampleRate;
  const bufL = data.bufL;
  const bufR = data.bufR;
  const f32DataL = new Float32Array(bufL);
  const f32DataR = new Float32Array(bufR);
  const dataWaveCnt = data.waveCnt;
  const waveCntStart = data.waveCntStart;
  //console.log("Received:", "ch", ch, "sampleRate", sampleRate, "f32DataL", f32DataL, "f32DataR", f32DataR);
  const myArrayBuffer = audioCtx.createBuffer(
    2,
    audioCtx.sampleRate * 1,
    audioCtx.sampleRate,
  );
  const source = audioCtx.createBufferSource();
  myArrayBuffer.copyToChannel(f32DataL, 0, 0);
  myArrayBuffer.copyToChannel(f32DataR, 1, 0);
  source.buffer = myArrayBuffer;
  source.connect(audioCtx.destination);
  if (audioCtxStartTime == -1) {
    audioCtxStartTime = audioCtx.currentTime;
  }
  // if late start node, start to currentTime (when slowdown measures)
  if (audioCtxStartTime + audioStartPosSec + audioStartAddSec < audioCtx.currentTime) {
    audioStartAddSec += audioCtx.currentTime - (audioCtxStartTime + audioStartPosSec + audioStartAddSec);
  }
  source.start(audioCtxStartTime + audioStartPosSec + audioStartAddSec);
  audioStartPosSec += intervalSec;
  nowReserveBufSec = (audioStartPosSec + audioStartAddSec) - (audioCtx.currentTime - audioCtxStartTime);

}

export function noteOn(key: number) {
  mainWorker.postMessage({
    mes: "noteOn",
    key: key
  });
}
