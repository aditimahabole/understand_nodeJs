# Node Js Working 
![image](https://github.com/aditimahabole/understand_nodeJs/assets/78752342/f62e4c90-e037-4bc2-b074-6c18a39b207c)
# ------Node Js Components -------
+ V8 : 
+ We have V8 engine which helps to execute Javascript file , It is present in Chrome browser and is fast
+ V8 is made up of C++ and JS
+ UVlib :
+ This library that implements  Event Loops and Thread pool
#### ------Components of Node Process----
+ Main thread :  non CPU intensive work is evecuted on this thread
+ Thread pool :  consisting of 4 threads by default
+ These threads are used by CPU intensive works
+ CPU intensive works are Hashing , Encryption , Crypto related
+ Number of threads can be controlled by "process.env.UV_THREADPOOL_SIZE"
#### ------Inside Node Process----
+ Top Level code
+ Modules are required 
+ Event callbacks are registered
+ Then Event Loop Runs 
#### ------Inside Event Loop----
+ First Expired setTimeouts are run 
+ then IO polling runs 
+ then setImmediate callbacks run
+ then close callbacks run 
+ event loop checks is there any pending function left
+ If yes then it executes them else it exits

# Code 1

    const fs = require('fs');
    setTimeout(()=>console.log("Hi from SetTimeout 1"), 0)
    console.log("Hello from Top Level code")

### Output
+ First top level funcations run
+ const fs = require('fs');
+ console.log("Hello from Top Level code")
+ Then Callbacks run as event loops start
+ setTimeout(()=>console.log("Hi from SetTimeout 1"), 0)
+ above is an expired timer call back so it will get executed
  
  ![image](https://github.com/aditimahabole/understand_nodeJs/assets/78752342/a4fbd12e-0a21-4775-b0e8-0b7e4ec7eb3e)
  
  <hr>
# Code 2
    const fs = require('fs');
    setImmediate(()=>console.log("Hey setImmediate function here"))
    setTimeout(()=>console.log("Hi from SetTimeout 1"), 0)
    console.log("Hello from Top Level code")
### Output
+ Top level
+ Set Timeout functions
+ Set Immediate functions

  ![image](https://github.com/aditimahabole/understand_nodeJs/assets/78752342/80242720-f4af-4668-ae2b-c0b94e42d0df)


<hr>

# Code 3
    const fs = require('fs');
    setImmediate(()=>console.log("Hey setImmediate function here"))
    setTimeout(()=>console.log("Hi from SetTimeout 1"), 0)
    
### Output
+ we removed console.log()
+ so the output is like this

![image](https://github.com/aditimahabole/understand_nodeJs/assets/78752342/9f39d484-400c-4db1-906b-ad56632d1a54)

+ here setImmediate is run first but it should run after setTimeout acording to the architecture 

+ Why ?
+ As setImmediate is not within an IO polling so which code runs is non deterministic as it is bounded by performance of the process

![image](https://github.com/aditimahabole/understand_nodeJs/assets/78752342/dd0b80ab-67e7-4403-952a-f6ff53ee1fe8)

### Code 3.0
    const fs = require('fs');
    setTimeout(()=>console.log("Hi from SetTimeout 1"), 0)
    setImmediate(()=>console.log("Hey setImmediate function here"))

#### Output
+ In this case set Timeout is run first and then  set immediate
+ So by comparing two codes we can see that it is non deterministic to tell which function will run first
+ Sequence is Non Deterministic

![image](https://github.com/aditimahabole/understand_nodeJs/assets/78752342/abeac61d-673a-4d5c-b017-e399afa11d53)

# Code 4
    const fs = require('fs');
    const { red, blue, green, yellow } = require('colorette');
    setTimeout(()=>console.log(green("Hi from SetTimeout 1") ), 0)
    setImmediate(()=>console.log(blue("Hey setImmediate function here")))
    fs.readFile('sample.txt','utf-8' , ()=>{
        console.log(yellow("IO Polling Finished"))
    })

### Output
+ Top level executed first
+ Expired timers will run so setTimeout will run
+ If reading file will take time then
+ Execution will move to set Immediate callbacks
+ But in my case reading file is not extensive so IO polling printed
+ At last set Immediate will run
+ Done

![image](https://github.com/aditimahabole/understand_nodeJs/assets/78752342/db6da2f8-16a6-4438-8f84-f011a3629731)

# Code 5 
    const fs = require('fs');
    const { red, blue, green, yellow ,magenta , cyan} = require('colorette');
    setTimeout(()=>console.log(green("Hi from SetTimeout 1") ), 0)
    setImmediate(()=>console.log(blue("Hey setImmediate function here")))
    fs.readFile('sample.txt','utf-8' , ()=>{
        console.log(yellow("IO Polling Finished"))
        setTimeout(()=> console.log(magenta("Hi from SetTimeout 2 inside Readfile")))
        setTimeout(()=> console.log(cyan("Hi from SetTimeout 3 inside Readfile")),5*1000)
    })
    console.log(red("Hi Top Level Code"))

### Output
+ Top level code first evecutes
+ setTimeout , setImmediate , fs readfile are registered not run
+ Now Event loop runs
+ so first expired timers will run i.e. setTimeOut1
+ then IO polling will run so inside that we have console which will run
+ but it also has setTime outs so event loop will start again
+ but as readFile completion is not done yet and is taking time so immediate function will run
+ then the two setTimeouts are run
+ Done

![image](https://github.com/aditimahabole/understand_nodeJs/assets/78752342/28b047c8-ebff-4f35-8b32-4ae139d4f902)

# Code 6
    const fs = require("fs");
    const { red, blue, green, yellow, magenta, cyan } = require("colorette");
    setTimeout(() => console.log(green("Hi from SetTimeout 1")), 0);
    setImmediate(() => console.log(blue("Hey setImmediate function here")));
    setTimeout(() => {
      fs.readFile("sample.txt", "utf-8", () => {
        console.log(yellow("IO Polling Finished"));
    
        // Set timer for 2 seconds after reading file
        setTimeout(() => {
          console.log(magenta("Hi from SetTimeout 2 inside Readfile"));
        }, 2000);
    
        // Set timer for 5 seconds after reading file
        setTimeout(() => {
          console.log(cyan("Hi from SetTimeout 3 inside Readfile"));
        }, 5000);
      });
    }, 3000);
    console.log(red("Hi Top Level Code"));

### Output
+ Top level code first evecutes
+ setTimeout , setImmediate ,setTimeout fs readfile are registered not run
+ Now Event loop runs
+ so first expired timers will run i.e. setTimeOut 1
+ Reading of file will be done after 3 sec so
+ execution will go forward and execute setImmediate
+ then file is being read and IO polling is executed first because reading my text file is not taking much time
+ then due to two setTimeouts event loop starts again
+ Done

![image](https://github.com/aditimahabole/understand_nodeJs/assets/78752342/4e8c6a32-3027-4259-9846-3a1ad4c9388d)

# Code 7
    const fs = require("fs");
    const { red, blue, green, yellow, magenta, cyan, greenBright, yellowBright } = require("colorette");
    setTimeout(() => console.log(green("Hi from SetTimeout 1 0s")), 0);
    setImmediate(() => console.log(blue("Hey setImmediate function here")));
    setTimeout(() => {
      fs.readFile("sample.txt", "utf-8", () => {
        console.log(yellow("IO Polling Finished"));
    
        // Set timer for 2 seconds after reading file
        setTimeout(() => {
          console.log(magenta("Hi from SetTimeout 2 inside Readfile 3s"));
        }, 2000);
    
        // Set timer for 5 seconds after reading file
        setTimeout(() => {
          console.log(cyan("Hi from SetTimeout 3 inside Readfile 5s"));
        }, 5000);
        setTimeout(() => {
            console.log(yellowBright("Hi from SetTimeout 4 inside Readfile 0s"));
          }, 0);
        setImmediate(()=>console.log(greenBright("Hi from SetImmediate 2 inside Readfile")))
      });
    }, 3000);
    console.log(red("Hi Top Level Code"));

### Output
+ Top level code first evecutes
+ setTimeout , setImmediate ,setTimeout fs readfile are registered not run
+ Now Event loop runs
+ so first expired timers will run i.e. setTimeOut 1
+ setImmediate is run then
+ then after file reading is done then IO polling printed
+ now this has 4 functions setTimeout of 2s , 5s , 0s and an setImmediate function
+ now as we know that setImmediate inside this is bounded by IO polling ok?!
+ so setImmediate runs first
+ then setTimeout of 0s
+ then setTimeout of 2s
+ then setTimeout of 5s
+ Done

![image](https://github.com/aditimahabole/understand_nodeJs/assets/78752342/899cddff-483b-4817-b44b-56141504ebf9)


# Code 8
    const fs = require("fs");
    const { red, blue, green, yellow, magenta, cyan, greenBright, yellowBright } = require("colorette");
    setTimeout(() => console.log(green("Hi from SetTimeout 1 0s")), 0);
    setImmediate(() => console.log(blue("Hey setImmediate 1 function here")));
    fs.readFile("sample.txt", "utf-8", () => {
        console.log(yellow("IO Polling Finished"));
        setTimeout(() => {
          console.log(magenta("Hi from SetTimeout 2 inside Readfile 3s"));
        }, 3000);
        setTimeout(() => {
          console.log(cyan("Hi from SetTimeout 3 inside Readfile 5s"));
        }, 5000);
        setTimeout(() => {
            console.log(yellowBright("Hi from SetTimeout 4 inside Readfile 0s"));
          }, 0);
        setImmediate(()=>console.log(greenBright("Hi from SetImmediate 2 inside Readfile")))
      });
    console.log(red("Hi Top Level Code"));


### Output
+ In this code i have removed setTimeout for readfile
+ so first top level code runs
+ then event loop starts
+ so first expired timers will run that is setTimeoutof 0s
+ then as my compiler is able to read file very fast so console IO Polling is printed
+ but then we have 4 functions 3 setTimeout and 1 setImmediate so this will start event loop
+ as it is sent to different queue so evecution goes to setImmediate which is present at global level
+ now event loop runs
+ setImmediate runs first as it is inside a IO polling so it runs first
+ then setTimeout of 0s run (expired call back)
+ then setTimeout of 2s run
+ then setTimeout of 5s run

![image](https://github.com/aditimahabole/understand_nodeJs/assets/78752342/f008798a-9a1f-4964-8af8-0a95c1ff3695)


# Code 9 
    const fs = require("fs");
    const crypto = require('crypto')
    const { red, blue, green, yellow, magenta, cyan, greenBright, yellowBright, bgYellowBright, bgBlue, bgCyan, bgGreenBright, bgRedBright, bgMagenta } = require("colorette");
    const start = Date.now()
    setTimeout(() => console.log(green("Hi from SetTimeout 1 0s")), 0);
    setImmediate(() => console.log(blue("Hey setImmediate 1 function here")));
    fs.readFile("sample.txt", "utf-8", () => {
        console.log(yellow("IO Polling Finished"));
        setImmediate(()=>console.log(greenBright("Hi from SetImmediate 2 inside Readfile")))
        setTimeout(() => {
          console.log(magenta("Hi from SetTimeout 2 inside Readfile 1s"));
        }, 1000);
        setTimeout(() => {
          console.log(cyan("Hi from SetTimeout 3 inside Readfile 2s"));
        }, 2000);
        setTimeout(() => {
            console.log(yellowBright("Hi from SetTimeout 4 inside Readfile 0s"));
          }, 0);
    
          // CPU intensive work to show Threading work 
          // performed in Thread Pool
          crypto.pbkdf2('mypassword1','mysalt1',100000,1024,'sha512',()=>{
            console.log(bgYellowBright(`password 1 Done took ${Date.now() - start}s`))
          })
    
          crypto.pbkdf2('mypassword2','mysalt1',100000,1024,'sha512',()=>{
            console.log(bgBlue(`password 2 Done took ${Date.now() - start}s`))
          })
    
          crypto.pbkdf2('mypassword3','mysalt1',100000,1024,'sha512',()=>{
            console.log(bgMagenta(`password 3 Done took ${Date.now() - start}s`))
          })
    
          crypto.pbkdf2('mypassword4','mysalt1',100000,1024,'sha512',()=>{
            console.log(bgRedBright(`password 4 Done took ${Date.now() - start}s`))
          })
      });
    console.log(red("Hi Top Level Code"));


### Output
+ In this code I have added CPU intensive work
+ So these functions will not execute in main thread
+ They will be executed in Thread Pool
+ Thread pool has by default 4 threads and we can chnage it to 128
+ Now our code has 4 crypto functions that are cpu intensive to each process will take one thread
+ and all will execute in concurrently
+ so we can see time taken by each is very close to each other 


![image](https://github.com/aditimahabole/understand_nodeJs/assets/78752342/379c9c1f-6e57-4256-a51a-ee963e2324b3)

+ I ran code once again and now this time output of CPU intensive is different
+ They are running concurrently and the one who gets resources first and completes first is printed
![image](https://github.com/aditimahabole/understand_nodeJs/assets/78752342/05adbda0-cd5b-4521-95f3-4e730ad8bb6b)

# Code 10
    const fs = require("fs");
    const crypto = require('crypto')
    const { red, blue, green, yellow, magenta, cyan, greenBright, yellowBright, bgYellowBright, bgBlue, bgCyan, bgGreenBright, 
    bgRedBright, bgMagenta } = require("colorette");
    const start = Date.now()
    setTimeout(() => console.log(green("Hi from SetTimeout 1 0s")), 0);
    setImmediate(() => console.log(blue("Hey setImmediate 1 function here")));
    fs.readFile("sample.txt", "utf-8", () => {
        console.log(yellow("IO Polling Finished"));
        setImmediate(()=>console.log(greenBright("Hi from SetImmediate 2 inside Readfile")))
        setTimeout(() => {
          console.log(magenta("Hi from SetTimeout 2 inside Readfile 1s"));
        }, 1000);
        setTimeout(() => {
          console.log(cyan("Hi from SetTimeout 3 inside Readfile 2s"));
        }, 2000);
        setTimeout(() => {
            console.log(yellowBright("Hi from SetTimeout 4 inside Readfile 0s"));
          }, 0);
    
          // CPU intensive work to show Threading work 
          // performed in Thread Pool
          crypto.pbkdf2('mypassword1','mysalt1',100000,1024,'sha512',()=>{
            console.log(bgYellowBright(`password 1 Done took ${Date.now() - start}s`))
          })
    
          crypto.pbkdf2('mypassword2','mysalt1',100000,1024,'sha512',()=>{
            console.log(bgBlue(`password 2 Done took ${Date.now() - start}s`))
          })
    
          crypto.pbkdf2('mypassword3','mysalt1',100000,1024,'sha512',()=>{
            console.log(bgMagenta(`password 3 Done took ${Date.now() - start}s`))
          })
    
          crypto.pbkdf2('mypassword4','mysalt1',100000,1024,'sha512',()=>{
            console.log(bgRedBright(`password 4 Done took ${Date.now() - start}s`))
          })
        //    Adding one more cpu intensive 
        // Thread pool has 4 threads so lets see what happens with 5th work
        crypto.pbkdf2('mypassword5','mysalt1',100000,1024,'sha512',()=>{
            console.log(bgCyan(`password 5 Done took ${Date.now() - start}s`))
          })
      });
    console.log(red("Hi Top Level Code"));

### Output
+ In this code I have added 5th CPU intensive work
+ So this 5th crypto function will not get thread
+ it has to wait for thread to get free
+ as a result it will execute afte one of thread is free




![image](https://github.com/aditimahabole/understand_nodeJs/assets/78752342/32a82288-f491-4ef0-a210-f4305cde665b)

+ I ran code again and this time also 5th password comes last as it does not get thread
+ It will execute when a thread gets free so you can see its time is way more than above 4 passwords

![image](https://github.com/aditimahabole/understand_nodeJs/assets/78752342/d0de62bc-091d-409e-973d-3343bc4ef2fb)

# Code 11
    const fs = require("fs");
    const crypto = require('crypto')
    const { red, blue, green, yellow, magenta, cyan, greenBright, yellowBright, bgYellowBright, bgBlue, bgCyan, bgGreenBright, bgRedBright, bgMagenta, bgGreen } = require("colorette");
    const start = Date.now()
    setTimeout(() => console.log(green("Hi from SetTimeout 1 0s")), 0);
    setImmediate(() => console.log(blue("Hey setImmediate 1 function here")));
    fs.readFile("sample.txt", "utf-8", () => {
        console.log(yellow("IO Polling Finished"));
        setImmediate(()=>console.log(greenBright("Hi from SetImmediate 2 inside Readfile")))
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
            console.log(yellowBright("Hi from SetTimeout 4 inside Readfile 0s"));
          }, 0);
    
          // CPU intensive work to show Threading work 
          // performed in Thread Pool
          crypto.pbkdf2('mypassword1','mysalt1',100000,1024,'sha512',()=>{
            console.log(bgYellowBright(`password 1 Done took ${Date.now() - start}s`))
          })
    
          crypto.pbkdf2('mypassword2','mysalt1',100000,1024,'sha512',()=>{
            console.log(bgBlue(`password 2 Done took ${Date.now() - start}s`))
          })
    
          crypto.pbkdf2('mypassword3','mysalt1',100000,1024,'sha512',()=>{
            console.log(bgMagenta(`password 3 Done took ${Date.now() - start}s`))
          })
    
          crypto.pbkdf2('mypassword4','mysalt1',100000,1024,'sha512',()=>{
            console.log(bgRedBright(`password 4 Done took ${Date.now() - start}s`))
          })
        //    Adding one more cpu intensive 
        // Thread pool has 4 threads so lets see what happens with 5th work
        // this has to wait
        crypto.pbkdf2('mypassword5','mysalt1',100000,1024,'sha512',()=>{
            console.log(bgGreen(`password 5 Done took ${Date.now() - start}s`))
          })
      });
    console.log(red("Hi Top Level Code"));

### Output
+ So first top level code executes
+ Then we have a setTimeout of 0s and setImmediate and readingFile functions
+ So According to Event Loop first expired Timers are run first
+ So SetTimeout 1 runs first
+ then IO polling happens that is reading of file
+ so console.log(IO Polling ) is printed
+ now as readFile has 4 setTimeout 1 setImmediate and 5 CPU intensive work
+ so as we know if setImmediate is bounded inside IO polling that is read file then setImmediate runs first than setTimeout of 0s
+ so after setImmediate setTime of 0s runs
+ then setTimeout of 1s
+ then setTimeout of 2s
+ Now as setTime of 5s has not expired yet so 4 CPU work will execute as they get each thread
+ 5th CPU process does not get Thread as it is not available so it waits
+ till then event loop sees are there any pending expired timers
+ Yes we have setTimeout of 5s as it expires
+ so it gets printed
+ then our 5th CPU work will get thread and executes
+ Done


![image](https://github.com/aditimahabole/understand_nodeJs/assets/78752342/1519d9b7-ab82-40f0-bb70-b23ba54e9634)

# Code 12
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


### Output

![image](https://github.com/aditimahabole/understand_nodeJs/assets/78752342/636626c3-a43d-4200-8a24-7c4c58edd4c5)

# Code 13 

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


### Output
+ In this code I have increased number of threads by process.env.UV_THREADPOOL_SIZE = 10
+ So we have 10 threads so all 5 processes are executed at same time concurrently
+ and suppose if we make process.env.UV_THREADPOOL_SIZE = 2 then first two CPU intensive will evecute
+ then next two
+ then next tow
+ Done

![image](https://github.com/aditimahabole/understand_nodeJs/assets/78752342/ef6e9cf7-63e7-4195-b675-df4f36c8e946)















    

  
