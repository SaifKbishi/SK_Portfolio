const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gradient = ctx.createLinearGradient(0,0, canvas.width, canvas.height);
//addColorStop define what colors our gradient will be made of, it takes offset and color
gradient.addColorStop(0, 'red');
gradient.addColorStop(0.2, 'yellow');
gradient.addColorStop(0.4, 'green');
gradient.addColorStop(0.6, 'cyan');
gradient.addColorStop(0.8, 'blue');
gradient.addColorStop(1, 'magenta');

/**
one of the four main principles of object-oriented programming is encapsulation which means we will wrap variables and related functions that
operate on them in objects. encapsulation helps us to keep our code organized and also could be used to protect the data inside objects from outside interference 
*/
class Symbol{// will create and manage individual symbols
  constructor(x, y, fontSize, canvasHeight){//the constructor method will be automatically triggered when we call class using the new keyword
    this.chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ♔♕♖♗♘♙CHESS♚♛♜♝♞♟☀☁❆❅❄♪♫خحجثتباصشسزرذدقفغعظطضيوهنملك';    
    this.x =x;
    this.y =y;
    this.fontSize = fontSize;
    this.canvasHeight = canvasHeight;
    this.text = ''; //text will be a random number from chars string

  }
  draw(context){
    this.text = this.chars.charAt(Math.floor(Math.random()*this.chars.length)); //chartAt takes a single index argument and returns a new string containing only that one character located at that specific offset of the string
    // context.fillStyle = '#0aff0a';
    context.fillText(this.text, this.x*this.fontSize, this.y*this.fontSize);//fillText takes text we want to draw and x and y for where i want to draw it. multiply by this.fontSize makes chars align next to each other below each other
    if(this.y * this.fontSize > this.canvasHeight && Math.random()>0.98){//the 'Math.random()>0.95' is for if we want each column to have randomized delay 
      this.y = 0; //if a char rerached the buttom we reset its y
    }else{
      this.y += 1;
    }
  }
}

class Effect{//effect class will manage the entire effect all of the symbols at once
  constructor(canvasWidth, canvasHeight){//we will pass it current canvas width and height as arguments
  //in the constructor will have all the global settings for our function (Effect)
    this.canvasWidth = canvasWidth;  //we take these arguments and convert them into class properties 
    this.canvasHeight = canvasHeight;
    this.fontSize = 25;
    this.columns = this.canvasWidth/this.fontSize;
    this.symbols =[];
    this.#init();
    console.log(this.symbols)
  }
  /** abstraction is about hiding internal functionality and implementation details of our objects and only exposing essential information to the user
      abstraction helps to isolate the impact of changes made to the code so that if something goes wrong the change will only affect the implementation details 
      of a class and not the outside code
   */
  #init(){//a private, by the # symbol, method to fill this symbols array with symbol objects, private methods cannot be called directly from the outside.
  //a private method is a good example of OOP abstraction, which means we are hiding unnecessary details from the user
    for(let i=0; i<this.columns; i++){//take symbols array and fill it with symbol objects created using symbol class
      this.symbols[i] = new Symbol(i, 0, this.fontSize, this.canvasHeight);
    }
  }//init
  /** we can expose some of these properties and make them accessible from the outside so that their values can be updated. 
  that way they can be set to a new value. we do that by creating a public resize method on effect class this method will take new width and height and it will set canvas
  width and canvas height to these new values. after we updated the values we recalculate how many columns can fit to the new canvas width.
  we delete all symbol objects from the array by assigning symbols array to an empty array and we call private initialize method that will create new symbol object for each column*/
  resize(width, height){
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.columns = this.canvasWidth/this.fontSize;
    this.symbols=[];
    this.#init();
  }
}

//create an instance of effect class
const effect = new Effect(canvas.width, canvas.height);
let lastTime =0;
const fps = 30;
const nextFrame = 1000/fps;
let timer =0;

function animate(timeStamp){//function that will run 60 times per second updating and drawing our effectover and over to create requestAnimationFrame
  const deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;
  if(timer > nextFrame){
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.textAlign = 'center'; //to fix the japanese alphabet characters different horizontal alignment than latin characters
    ctx.fillRect(0, 0, canvas.width, canvas.height); //clearing the canvas
    ctx.fillStyle = '#0aff0a'; //gradient
    // ctx.fillStyle = gradient;
    ctx.font = effect.fontSize + 'px monospace'; // monospace fonts have characters that occupy the same amount of horizontal space
    effect.symbols.forEach(symbol => symbol.draw(ctx));
    
    timer = 0;
  }else{
    timer += deltaTime;
  }
  requestAnimationFrame(this.animate);//requestAnimationFrame() method has a special feature, it automatically passes a timestamp argument to the method it calls
}
animate(0);

window.addEventListener('resize', ()=>{ //to make the effect responsive
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  effect.resize(canvas.width, canvas.height);
});