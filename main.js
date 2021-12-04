async function main() {
  let ans = "";
  while (ans != "n") {
    console.log("new game");
    let mem = [];
    let gameOver = false;
    let level = 0;
    // Starta nytt spel
    ans = await askQuestion("ready for a new game? (Y,n) ");
    if (ans == "" || ans == "y") {
      while (!gameOver) {
        // add new number loop
        mem.push(randomIntFromInterval(1, 4));
        level = mem.length;
        console.log(`Level: ${level}`);

        // play all numbers
        await playSeq(mem, level);

        // wait for number input loop
        let i = 0;
        while (i < mem.length) {
          ans = await askQuestion("> ");

          if (Number(ans) !== mem[i]) {
            say("Wrong, Game over");
            console.log("WRONG! Game over");
            i = mem.length;
            gameOver = true;
          }
          i++;
        }
      }
    }
  }
  console.log("Exit");
}

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function askQuestion(query) {
  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

async function playSeq(mem, level = 1) {
  const speed = 1000 - level * 50;
  async function play() {
    for (const element of mem) {
      await sleep(speed);
      await say(element);
      //console.log(element);
    }
  }
  return play();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function say(str) {
  const { exec } = require("child_process");

  exec(`say ${str}`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
  });
}

main();
