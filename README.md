# Node Js Working 

![image](https://github.com/aditimahabole/understand_nodeJs/assets/78752342/f62e4c90-e037-4bc2-b074-6c18a39b207c)

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

![image](https://github.com/aditimahabole/understand_nodeJs/assets/78752342/abeac61d-673a-4d5c-b017-e399afa11d53)

    

  
