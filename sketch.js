var begin = false;

var mic; //microphone of computer
var interruption = false; //Boolean for when there is a true interruption
var sound = false; //Boolean for when surrounding sound is consistent enough to be noticed
var showbuttons = false; //Boolean to show buttons for reaction to notification
var duration = 0; //counts how long interruption takes place / stays there untill next interruption
var time; //timer that runs constantly, used for timing in code
var lasttime = 0; //to create timer for noisetimer
var lasttime2 = 0; //to create timer for sensortimer/interruption
var lasttime3 = 0; //to create timer for soundtimer and pausetimer for sound
var lasttime4 = 0; //timer for errorstate time out code
var lasttime5 = 0; //timer for window.close
var sensortimer; //counts how long interruption takes place / stops when interruption stops
var noisetimer; //counts how long sound is true for boolean interruption
var soundtimer = 0; // counts how long sound is measured from mic
var pausetimer = 0; // counts the pauses between speaking / surrounding noise
var errortimer = 0; //counts how long the error is and allows the code to continue after a certain threshold
var timestamp; //shows time 
var start = false; // for measuring sound 
var notification = false; //Boolean for when to show buttons and play sound
var errorstate = false;
let sound1; // sound for notification when interruption longer than....
var i = 0; //variable that assures amount only is +1 after each interruption
var p = 0;
var amount = 0; // counting amount of interruptions

var q = 0; // counts ignored interruptions
var w = 0; // counts accepted interruptions
var e = 0; // counts errors of interruptions

//variables buttons
var B1C1S1;
var B1C2S1;
var B1C3S1;
var B1C1S2;
var B1C2S2;
var B1C3S2;
var B1C1S3;
var B1C2S3;
var B1C3S3;
var B2C1S1;
var B2C2S1;
var B2C3S1;
var B2C1S2;
var B2C2S2;
var B2C3S2;
var B2C1S3;
var B2C2S3;
var B2C3S3;
var B3C1S1;
var B3C2S1;
var B3C3S1;
var B3C1S2;
var B3C2S2;
var B3C3S2;
var B3C1S3;
var B3C2S3;
var B3C3S3;

//variables placement rings
var o = 384;

var xb = o;
var yb = o;
var xm = o;
var ym = o;
var xc = o;
var yc = o;

var Shakexb = 4;
var Shakexm = -3;
var Shakeyc = -4;
var ShakeGrowth = -5;

var shake1 = false;
var shake2 = false;

//variables strokethickness
var strk = 10;
var strkv = 1;

var vibr = false;

var clicked = false; // to assure when mouse click is used to press buttons that button is only clicked once


function setup() { //everything that only runs once 
  createCanvas(windowWidth, windowHeight); //background
  noLoop();
  mic = new p5.AudioIn(); //connecting microphone of computer
  mic.start(); //starts measuring sound with microphone
  getAudioContext().suspend();
}

function begincode() {
  begin = true;
  loop();
  somebutton.style.visibility = "hidden";
  userStartAudio();
}

function draw() { //code that runs constantly

  if (begin == true) {
    background(255); //background color

    mouseClicked = function() { //registeres when mouse/trackpad clicks
      clicked = true;
    }

    time = millis(); // starting timer      

    var vol = mic.getLevel(); //setting variable vol for level of microphone

    //VISUALS
    strokeWeight(strk);


    //Cyan Ring
    stroke(0, 255, 255);
    noFill();
    ellipse(xc, yc, 200, 200);

    //Magenta Ring
    stroke(255, 0, 255);
    ellipse(xm, ym, 200, 200);

    //Black Ring
    stroke(0);
    ellipse(xb, yb, 200, 200);


    if ((xb == 380) || (xb == 388)) {
      Shakexb = Shakexb * -1;
      Shakexm = Shakexm * -1;
      Shakeyc = Shakeyc * -1;
    }

    if (shake1 == true) {
      xb = xb + Shakexb;
      xm = o;
      yc = o;
    } else {
      xb = o;
      xm = o;
      yc = o;
    }

    if ((strk == 15) || (strk == 5)) {
      strkv = strkv * -1;
    }

    if (shake2 == true) {
      xm = xm + Shakexm;
      yc = yc + Shakeyc;
    } else {
      xm = o;
      yc = o;
    }

    if (vibr == true) {
      strk = strk + strkv;
    } else {
      strk = 10;
    }


    //FUNCTIONALITY

    if (vol > 0.01) { //when volume microphone higher than ...
      start = true;
      // ellipse(250, 250, 50, 50); // draws smallest white elipse 
    } else {
      start = false;
    }

    if ((time - lasttime3) > 1000) { //timer every 0.1 sec
      lasttime3 = time;
      if (start == true) {
        soundtimer++;
        pausetimer = 0;
      } else {
        pausetimer++;
      }
    }

    if (pausetimer > 2) {
      soundtimer = 0;
      pausetimer = 0;
    }

    if (soundtimer > 0) {
      sound = true;
    } else {
      sound = false;
    }

    if (sound == true) {
      vibr = true;
      shake1 = true;
    } else {
      vibr = false;
      shake1 = false;
    }

    if ((time - lasttime) > 1000) {
      lasttime = time;
      if (sound == true) {
        noisetimer++;
      } else {
        noisetimer = 0;
      }
    }

    if (noisetimer > 3) {
      shake2 = true;
    } else {
      shake2 = false;
    }

    if (noisetimer > 5) { //when surrounding noise longer than x there is a true interruption
      interruption = true;
    } else {
      interruption = false;
    }

    if ((time - lasttime2) > 1000) {
      lasttime2 = time;
      if (interruption == true) {
        sensortimer++; //counting lenght of interruption
      } else {
        sensortimer = 0;
      }
    }

    if (sensortimer == 0) {
      if (p < 1) {
        p++;

        $.ajax({ //to send data to the database
          url: 'https://data.id.tue.nl/datasets/entity/396/item/',
          headers: {
            'api_token': 'a4SrY2lElYWyqsk1Xe0e58zuzgUTOt/GyAOUnJCciOTK94Z71GcDyv+cVxUD7jXg',
            'resource_id': 'duration',
            'token': 'token_for_identifier'
          },
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            parameter1: duration
          }),
          success: function(data) {
            console.log(data) //to show whether sending to database went well
          },
          error: function(e) {
            console.log(e) //to show whether sending to database went wrong
          }
        });
      }
    } else {
      p = 0;
    }

    if (sensortimer > 2) { //when interruption longer than 2 sec, then notification will be shown
      duration = sensortimer; //set time of interruption to duration variable
      notification = true;
    } else {
      notification = false;
    }

    if (showbuttons == true) { //all buttons shown
      fill(255, 255, 255);
      Button(270, 150, B1C1S1, B1C2S1, B1C3S1, B1C1S2, B1C2S2, B1C3S2, B1C1S3, B1C2S3, B1C3S3);
      Button(270, 180, B2C1S1, B2C2S1, B2C3S1, B2C1S2, B2C2S2, B2C3S2, B2C1S3, B2C2S3, B2C3S3);
      Button(270, 210, B3C1S1, B3C2S1, B3C3S1, B3C1S2, B3C2S2, B3C3S2, B3C1S3, B3C2S3, B3C3S3);

      fill(20, 20, 20);
      strokeWeight(0.5);
      textFont('Helvetica');
      textSize(15);
      noStroke();
      fill(0);
      text("Ik werk door", 575, 330); //text of first button
      text("Ik neem een pauze", 555, 390); //text of second button
      text("Foutmelding", 575, 450); //text of third button
    }

    if (notification == true) { //play sound once when notification is true
      if (i < 1) {
        var myWindow = window.open("", "", "status=0,titlebar=0,toolbar=0,scrollbars=0,width=300,height=200,top=300,left=600");
        myWindow.document.write("<p>Een onderbreking is gedetecteerd. Ga naar de window van de research code en klik daar op het toepasselijke antwoord.</p>");
        showbuttons = true; //show buttons
        setTimeout(function() {
          myWindow.close();
        }, 300000);

        i++;
        amount++;

        $.ajax({ //to send data to the database
          url: 'https://data.id.tue.nl/datasets/entity/396/item/',
          headers: {
            'api_token': 'a4SrY2lElYWyqsk1Xe0e58zuzgUTOt/GyAOUnJCciOTK94Z71GcDyv+cVxUD7jXg',
            'resource_id': 'amount',
            'token': 'token_for_identifier'
          },
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            parameter2: amount
          }),
          success: function(data) {
            console.log(data) //to show whether sending to database went well
          },
          error: function(e) {
            console.log(e) //to show whether sending to database went wrong
          }
        });
      }
    } else {
      i = 0;
    }


    if (errorstate == true) {
      showbuttons = false;
      notification = false;
      i = 2;
    }


    if ((time - lasttime4) > 1000) {
      lasttime4 = time;
      if (errorstate == true) {
        errortimer++;
      } else {
        errortimer = 0;
      }
    }

    if (errortimer > 600) {
      errortimer = 0;
      i = 0;
      errorstate = false;
    }


    //BUTTONS

    //BUTTON 1

    if (showbuttons == true && mouseX > 540 && mouseX < 700 && mouseY > 300 && mouseY < 350 && mouseIsPressed == true) {
      //pressed base color button 1
      B1C1S1 = 130;
      B1C2S1 = 190;
      B1C3S1 = 255;

      //pressed upper color button 1
      B1C1S2 = 150;
      B1C2S2 = 210;
      B1C3S2 = 255;

      //pressed lower color button 1
      B1C1S3 = 110;
      B1C2S3 = 170;
      B1C3S3 = 255;

      errorstate = true;

      q++; //variable q is for ignore
      $.ajax({ //to send data to the database after the click with all different information
        url: 'https://data.id.tue.nl/datasets/entity/396/item/',
        headers: {
          'api_token': 'a4SrY2lElYWyqsk1Xe0e58zuzgUTOt/GyAOUnJCciOTK94Z71GcDyv+cVxUD7jXg',
          'resource_id': 'button 1', //for participant 1
          'token': 'token_for_identifier'
        },
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          parameter3: q,
          parameter4: w,
          parameter5: e
        }),
        success: function(data) {
          console.log(data) //to show whether sending to database went well
        },
        error: function(e) {
          console.log(e) //to show whether sending to database went wrong
        }
      });
      clicked = false;
      showbuttons = false; //make buttons dissapear after clicking
      
    } else {

      //normal base color button 1
      B1C1S1 = 150;
      B1C2S1 = 210;
      B1C3S1 = 255;

      //normal upper color button 1
      B1C1S2 = 170;
      B1C2S2 = 230;
      B1C3S2 = 255;

      //normal lower color button 1
      B1C1S3 = 130;
      B1C2S3 = 190;
      B1C3S3 = 255;
    }

    if (showbuttons == true && mouseX > 540 && mouseX < 700 && mouseY > 300 && mouseY < 350 && mouseIsPressed == false) {
      //hover base color button 1
      B1C1S1 = 140;
      B1C2S1 = 200;
      B1C3S1 = 255;
    }

    //BUTTON 2

    if (showbuttons == true && mouseX > 540 && mouseX < 700 && mouseY > 360 && mouseY < 410 && mouseIsPressed == true) {
      //pressed base color button 2
      B2C1S1 = 140;
      B2C2S1 = 255;
      B2C3S1 = 140;

      //pressed upper color button 2
      B2C1S2 = 180;
      B2C2S2 = 255;
      B2C3S2 = 180;

      //pressed lower color button 2
      B2C1S3 = 100;
      B2C2S3 = 255;
      B2C3S3 = 100;

      errorstate = true;

      w++; //variable w is for accept / take a break
      $.ajax({
        url: 'https://data.id.tue.nl/datasets/entity/396/item/',
        headers: {
          'api_token': 'a4SrY2lElYWyqsk1Xe0e58zuzgUTOt/GyAOUnJCciOTK94Z71GcDyv+cVxUD7jXg',
          'resource_id': 'button 2',
          'token': 'token_for_identifier'
        },
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          parameter3: q,
          parameter4: w,
          parameter5: e
        }),
        success: function(data) {
          console.log(data)
        },
        error: function(e) {
          console.log(e)
        }
      });
      clicked = false;
      showbuttons = false;
    } else {
      //normal base color button 2
      B2C1S1 = 180;
      B2C2S1 = 255;
      B2C3S1 = 180;

      //normal upper color button 2
      B2C1S2 = 220;
      B2C2S2 = 255;
      B2C3S2 = 220;

      //normal lower color button 2
      B2C1S3 = 140;
      B2C2S3 = 255;
      B2C3S3 = 140;
    }

    if (showbuttons == true && mouseX > 540 && mouseX < 700 && mouseY > 360 && mouseY < 410 && mouseIsPressed == false) {
      //hover base color button 2
      B2C1S1 = 160;
      B2C2S1 = 255;
      B2C3S1 = 160;
    }

    //BUTTON 3  

    if (showbuttons == true && mouseX > 540 && mouseX < 700 && mouseY > 420 && mouseY < 470 && mouseIsPressed == true) {
      //pressed base color button 3
      B3C1S1 = 255;
      B3C2S1 = 160;
      B3C3S1 = 160;

      //pressed upper color button 3
      B3C1S2 = 255;
      B3C2S2 = 180;
      B3C3S2 = 180;

      //pressed lower color button 3
      B3C1S3 = 255;
      B3C2S3 = 140;
      B3C3S3 = 140;

      errorstate = true;

      e++; //variable e is for errors
      $.ajax({
        url: 'https://data.id.tue.nl/datasets/entity/396/item/',
        headers: {
          'api_token': 'a4SrY2lElYWyqsk1Xe0e58zuzgUTOt/GyAOUnJCciOTK94Z71GcDyv+cVxUD7jXg',
          'resource_id': 'button 3',
          'token': 'token_for_identifier'
        },
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          parameter3: q,
          parameter4: w,
          parameter5: e
        }),
        success: function(data) {
          console.log(data)
        },
        error: function(e) {
          console.log(e)
        }
      });
      clicked = false;
      showbuttons = false;
    } else {
      //normal base color button 3
      B3C1S1 = 255;
      B3C2S1 = 180;
      B3C3S1 = 180;

      //normal upper color button 3
      B3C1S2 = 255;
      B3C2S2 = 200;
      B3C3S2 = 200;

      //normal lower color button 3
      B3C1S3 = 255;
      B3C2S3 = 160;
      B3C3S3 = 160;
    }

    if (showbuttons == true && mouseX > 540 && mouseX < 700 && mouseY > 420 && mouseY < 470 && mouseIsPressed == false) {
      //hover base color button 3
      B3C1S1 = 255;
      B3C2S1 = 170;
      B3C3S1 = 170;
    }

    function Button(xbu, ybu, C1S1, C2S1, C3S1, C1S2, C2S2, C3S2, C1S3, C2S3, C3S3) {
      push();
      translate(xbu, ybu);
      noStroke();

      //main button box
      fill(C1S1, C2S1, C3S1);
      beginShape();
      vertex(xbu + 5, ybu + 5);
      vertex(xbu + 155, ybu + 5);
      vertex(xbu + 155, ybu + 45);
      vertex(xbu + 5, ybu + 45);
      endShape(CLOSE);

      //upper edge
      fill(C1S2, C2S2, C3S2);
      beginShape();
      vertex(xbu, ybu);
      vertex(xbu + 160, ybu);
      vertex(xbu + 155, ybu + 5);
      vertex(xbu + 5, ybu + 5);
      vertex(xbu + 5, ybu + 45);
      vertex(xbu, ybu + 50);
      endShape(CLOSE);

      //lower edge
      fill(C1S3, C2S3, C3S3);
      beginShape();
      vertex(xbu + 160, ybu + 50);
      vertex(xbu, ybu + 50);
      vertex(xbu + 5, ybu + 45);
      vertex(xbu + 155, ybu + 45);
      vertex(xbu + 155, ybu + 5);
      vertex(xbu + 160, ybu);
      endShape(CLOSE);

      pop();
    }
  }
}