export class Simon {
  constructor() {
    this.hfo;
    this.kbd;
    this.context;
    this.init();
  }

  get info() {
    return "this is Simon";
  }

  createAudio() {
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    this.context = new AudioContext();
  }

  playNote(note = 1) {
    if (!this.context) this.createAudio();

    const freq = [220.0, 246.94, 164.81, 146.83];
    let hfo = this.context.createOscillator();
    hfo.connect(this.context.destination);
    hfo.frequency.value = freq[note - 1];
    //this.hfo.frequency.value = freq[note - 1];
    hfo.start(0);
    return hfo;
  }

  init() {
    $(`#${"btn-1"}`).addClass("idle");
    $(`#${"btn-2"}`).addClass("idle");
    $(`#${"btn-3"}`).addClass("idle");
    $(`#${"btn-4"}`).addClass("idle");
    this.playSimon();
  }

  enableButtons(enable, cb = null) {
    if (enable) {
      $("#btn-1").mousedown((e) => this.btnAnimate(`#${e.target.id}`, cb));
      $("#btn-2").mousedown((e) => this.btnAnimate(`#${e.target.id}`, cb));
      $("#btn-3").mousedown((e) => this.btnAnimate(`#${e.target.id}`, cb));
      $("#btn-4").mousedown((e) => this.btnAnimate(`#${e.target.id}`, cb));
      return;
    }
    $("#btn-1").off("mousedown");
    $("#btn-2").off("mousedown");
    $("#btn-3").off("mousedown");
    $("#btn-4").off("mousedown");
  }

  showStart(msg = "ready for a new game?") {
    const enableButtons = (enable) => this.enableButtons(enable);
    const play = () => this.play();
    return new Promise((resolve, reject) => {
      enableButtons(false);
      $("#start-screen p").html(`
        ${msg}
        `);
      $("#start-screen").fadeIn("fast");

      $("#start-screen-yes").click(function (e) {
        $("#pop").fadeOut("fast");
        resolve("play");
      });
      $("#start-screen-yes, #start-screen-no").click(function (e) {
        $("#start-screen").fadeOut("fast");
      });
    });
  }

  btnAnimate(id, cb) {
    const buttonNumber = Number(id.slice(5));
    let hfo = this.playNote(buttonNumber);
    const noteOff = () => hfo.stop(0);
    $(id).addClass("btn-press");
    setTimeout(function () {
      $(id).removeClass("btn-press");
      noteOff();
      if (cb) cb(buttonNumber);
    }, 500);
  }
  async playSeq(mem, level = 1) {
    return new Promise((resolve, reject) => {
      this.playback(mem, level, resolve);
    });
  }
  async playback(mem, level, resolve) {
    const speed = 1000 - level * 50;
    for (const element of mem) {
      await this.sleep(speed);
      this.btnAnimate(`#btn-${element}`);
    }
    resolve();
  }
  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async buttonPressed() {
    return new Promise((resolve) => {
      const buttonCallback = (id) => {
        this.enableButtons(false);
        resolve(id);
      };
      this.enableButtons(true, buttonCallback);
    });
  }
  setlevel(level) {
    $("#stat-level").html(`
        ${level}
        `);
  }
  async playSimon() {
    let ans;
    let msg;
    while (true) {
      // Starta nytt spel
      this.setlevel("-");
      ans = await this.showStart(msg);
      let mem = [];
      let gameOver = false;
      let level = 0;

      if (ans == "play") {
        while (!gameOver) {
          // add new number loop
          mem.push(randomIntFromInterval(1, 4));
          level = mem.length;
          //console.log(`Level: ${level}`);
          this.setlevel(level);

          // play all numbers
          await this.playSeq(mem, level);

          // wait for number input loop
          let i = 0;
          while (i < mem.length) {
            //get button
            ans = await this.buttonPressed();

            if (Number(ans) !== mem[i]) {
              msg = `You got to level ${level} but missed! Try again! `;
              i = mem.length;
              gameOver = true;
            }
            i++;
          }
        }
      }
    }

    function randomIntFromInterval(min, max) {
      // min and max included
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
  }
}
