// Top Level code
// Modules are required 
// Event callbacks are registered
// Then Event Loop Runs 
// ------Inside Event Loop----
// First Expired setTimeouts are run 
// then IO polling runs 
// then setImmediate callbacks run
// then close callbacks run 
// event loop checks is there any pending function left
// If yes then it executes them else it exits
const fs = require("fs");
const crypto = require("crypto");
const {
  red,
  blue,
  green,
  yellow,
  magenta,
  cyan,
  greenBright,
  yellowBright,
  bgYellowBright,
  bgBlue,
  bgCyan,
  bgGreenBright,
  bgRedBright,
  bgMagenta,
  bgGreen,
} = require("colorette");
const start = Date.now();
process.env.UV_THREADPOOL_SIZE = 10
// setTimeouts , setImmediate , IO polling are registered into Event Loop 
setTimeout(() => console.log(green("Hi from SetTimeout 1 0s")), 0);
setImmediate(() => console.log(blue("Hey setImmediate 1 function here")));
fs.readFile("sample.txt", "utf-8", () => {
  console.log(yellow("IO Polling Finished"));
  // this will run after setImmediate because in event loop in IO polling
  // first setImmediate works then setTimeout of 0s works
  setTimeout(() => {
    console.log(magenta("Hi from SetTimeout 2 inside Readfile 1s"));
  }, 1000);
  setTimeout(() => {
    console.log(cyan("Hi from SetTimeout 3 inside Readfile 2s"));
  }, 2000);
  setTimeout(() => {
    console.log(yellow("Hi from SetTimeout 5 inside Readfile 5s"));
  }, 5000);
  setTimeout(() => {
    console.log(magenta("Hi from SetTimeout 6 inside Readfile 10s"));
  }, 10000);
  setTimeout(() => {
    console.log(yellowBright("Hi from SetTimeout 4 inside Readfile 0s"));
  }, 0);
  // Executed first as it is inside IO polling
  setImmediate(() =>
    console.log(greenBright("Hi from SetImmediate 2 inside Readfile"))
  );

  // CPU intensive work to show Threading work
  // Performed in Thread Pool
  crypto.pbkdf2("mypassword1", "mysalt1", 100000, 1024, "sha512", () => {
    console.log(bgYellowBright(`password 1 Done took ${Date.now() - start}s`));
  });

  crypto.pbkdf2("mypassword2", "mysalt1", 100000, 1024, "sha512", () => {
    console.log(bgBlue(`password 2 Done took ${Date.now() - start}s`));
  });

  crypto.pbkdf2("mypassword3", "mysalt1", 100000, 1024, "sha512", () => {
    console.log(bgMagenta(`password 3 Done took ${Date.now() - start}s`));
  });

  crypto.pbkdf2("mypassword4", "mysalt1", 100000, 1024, "sha512", () => {
    console.log(bgRedBright(`password 4 Done took ${Date.now() - start}s`));
  });
  // Adding one more cpu intensive
  // Thread pool has 4 threads so lets see what happens with 5th work
  // This process has to wait
  crypto.pbkdf2("mypassword5", "mysalt1", 100000, 1024, "sha512", () => {
    console.log(bgGreen(`password 5 Done took ${Date.now() - start}s`));
  });
});
// Top Level Code executes first always 
console.log(red("Hi Top Level Code"));
