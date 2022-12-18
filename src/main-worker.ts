declare function postMessage(message: any, transfer: Transferable[]): void;

let cnt = 0;
let shuhasu = 0;
let shuhasu2 = 0;
let shuhasuCnt = 0;
let shuhasu2Cnt = 0;

onmessage = (event) => {
  //console.log("worker start time:", performance.now());
  console.log("worker shuhasu2Cnt:", shuhasu2Cnt);
  cnt++;

  const data = event.data;
  const mes = data.mes;
  if (mes == "buf") {
    const ch: number = data.ch;
    const sampleRate = data.sampleRate;
    const bufL: ArrayBuffer = data.bufL;
    const bufR: ArrayBuffer = data.bufR;
    const waveCntStart: number = data.waveCnt;
    let waveCnt = data.waveCnt;
  
    const f32DataL = new Float32Array(bufL);
    const f32DataR = new Float32Array(bufR);
  
    //let shuhasu = 441;
  
    let rnd1 = Math.random() < 0.1 ? 1 : 1;
    //shuhasu = 440 + Math.random() * 40;
    for (let i = 0; i < f32DataL.length; ++i, ++waveCnt) {
      //if (waveCnt % 20000 == 0) shuhasu = 440 + Math.random() * 100;
      shuhasu = 440 + Math.sin(waveCnt / sampleRate * 0.1 * 2 * Math.PI) * 110;
      shuhasuCnt += shuhasu;
      if (shuhasuCnt >= sampleRate) shuhasuCnt %= sampleRate;

      shuhasu2 -= 1 / sampleRate * 440;
      if (shuhasu2 < 0) shuhasu2 = 0;
      shuhasu2Cnt += shuhasu2;
      for (let j = 0; j < rnd1; ++j) {
        let w = (Math.sin(shuhasuCnt / sampleRate * 2 * Math.PI)) * 0.25;
        w += (Math.sin(shuhasu2Cnt / sampleRate * 2 * Math.PI)) * 0.25;
        f32DataR[i] = f32DataL[i] = w;
      }
    }
  
    postMessage({
      bufL: bufL,
      bufR: bufR,
      ch: ch,
      sampleRate: sampleRate,
      waveCnt: waveCnt,
      waveCntStart: waveCntStart,
    }, [bufL, bufR]);

  } else if (mes == "noteOn") {
    shuhasu2 = 440;
  }
};

onmessageerror = (event) => {
  console.error("wocker messageerror: " + event);
};
