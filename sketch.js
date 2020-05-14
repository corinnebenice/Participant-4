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
var B1C1;
var B1C2;
var B1C3;
var B2C1;
var B2C2;
var B2C3;
var B3C1;
var B3C2;
var B3C3;

var xb = 100;
var yb = 100;
var xm = 100;
var ym = 100;
var xc = 100;
var yc = 100;

var Shakexb = 4;
var Shakexm = -3;
var Shakeyc = -4;
var ShakeGrowth = -1.002;

var shake1 = false;
var shake2 = false;

var clicked = false; // to assure when mouse click is used to press buttons that button is only clicked once


function setup() { //everything that only runs once 
  createCanvas(500, 500); //background
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
    strokeWeight(5);
    //Magenta Ring
    stroke(0, 255, 255);
    noFill();
    ellipse(xc, yc, 200, 200);

    //Magenta Ring
    stroke(255, 0, 255);
    ellipse(xm, ym, 200, 200);

    //Black Ring
    stroke(0);
    ellipse(xb, yb, 200, 200);

    if ((xb == 104) || (xb == 96)) {
      Shakexb = Shakexb * -1;
      Shakexm = Shakexm * -1;
      Shakeyc = Shakeyc * -1;
    }
    if (Shakexm >= 7) {
      ShakeGrowth = -1;
    }

    if (shake1 == true) {
      xb = xb + Shakexb;
      xm = 100;
      yc = 100;
    } else {
      xb = 100;
      xm = 100;
      yc = 100;
    }

    if (shake2 == true) {
      xm = xm + Shakexm;
      yc = yc + Shakeyc;
    } else {
      xm = 100;
      yc = 100;
    }


    //FUNCTIONALITY

    if (vol > 0.02) { //when volume microphone higher than ...
      start = true;
      shake1 = true;
      // ellipse(250, 250, 50, 50); // draws smallest white elipse 
    } else {
      start = false;
      shake1 = false;
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
      // ellipse(250, 250, 100, 100);
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
      // fill(0, 255, 0);
      // ellipse(100, 100, 100, 100); //green small ellipse for notification
      duration = sensortimer; //set time of interruption to duration variable
      notification = true;
    } else {
      notification = false;
    }

    if (showbuttons == true) { //all buttons shown
      fill(255, 255, 255);
      Button(10, 100, B1C1, B1C2, B1C3);
      Button(10, 130, B2C1, B2C2, B2C3);
      Button(10, 160, B3C1, B3C2, B3C3);
      fill(20, 20, 20);
      strokeWeight(0.5);
      textFont('Helvetica');
      text("Ik werk door", 55, 230); //text of first button
      text("Ik neem een pauze", 70, 290); //text of second button
      text("Foutmelding", 40, 350); //text of third button
    }

    if (notification == true) { //play sound once when notification is true
      if (i < 1) {
        var myWindow = window.open("", "", "status=0,titlebar=0,toolbar=0,scrollbars=0,width=300,height=200,top=300,left=600");
        myWindow.document.write("<p>Een onderbreking is gedetecteerd. Ga naar de window van de research code en klik daar het toepasselijke antwoord.</p>");
        // myWindow.document.write('<html><head><link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css"></head><body>' + '<p>An interruption is detected. Please go to the window of the code.</p>' + '</body></html>')
        showbuttons = true; //show buttons

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
      getAudioContext().suspend();
    }


    if ((time - lasttime4) > 1000) {
      lasttime4 = time;
      if (errorstate == true) {
        errortimer++;
      }else{
        errortimer = 0;
      }
    }
    
    if (errortimer > 300){
      getAudioContext().resume();
      errortimer = 0;
      errorstate = false;
    }

    //BUTTONS

    if (showbuttons == true && mouseX > 20 && mouseX < 180 && mouseY > 200 && mouseY < 250 && mouseIsPressed == true) {
      B1C1 = 190;
      B1C2 = 230;
      B1C3 = 170;

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
      B1C1 = 200;
      B1C2 = 170;
      B1C3 = 230;
    }
    if (showbuttons == true && mouseX > 20 && mouseX < 180 && mouseY > 200 && mouseY < 250) {
      B1C1 = 230;
    }

    if (showbuttons == true && mouseX > 20 && mouseX < 180 && mouseY > 260 && mouseY < 310 && mouseIsPressed == true) {
      B2C1 = 190;
      B2C2 = 230;
      B2C3 = 170;

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
      B2C1 = 200;
      B2C2 = 170;
      B2C3 = 230;
    }
    if (showbuttons == true && mouseX > 20 && mouseX < 180 && mouseY > 260 && mouseY < 310) {
      B2C1 = 230;
    }


    if (showbuttons == true && mouseX > 20 && mouseX < 180 && mouseY > 320 && mouseY < 370 && mouseIsPressed == true) {
      B3C1 = 190;
      B3C2 = 230;
      B3C3 = 170;

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
      B3C1 = 200;
      B3C2 = 170;
      B3C3 = 230;
    }
    if (showbuttons == true && mouseX > 20 && mouseX < 180 && mouseY > 320 && mouseY < 370) {
      B3C1 = 230;
    }

    function Button(xbu, ybu, C1, C2, C3) {
      push();
      translate(xbu, ybu);
      strokeWeight(1);
      stroke(200, 200, 255);

      //main button box
      fill(C1, C1, 255);
      beginShape();
      vertex(xbu + 5, ybu + 5);
      vertex(xbu + 155, ybu + 5);
      vertex(xbu + 155, ybu + 45);
      vertex(xbu + 5, ybu + 45);
      endShape(CLOSE);

      //upper edge
      fill(C2, C2, 255);
      beginShape();
      vertex(xbu, ybu);
      vertex(xbu + 160, ybu);
      vertex(xbu + 155, ybu + 5);
      vertex(xbu + 5, ybu + 5);
      vertex(xbu + 5, ybu + 45);
      vertex(xbu, ybu + 50);
      endShape(CLOSE);

      //lower edge
      fill(C3, C3, 255);
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
  // console.log(soundtimer, pausetimer);
}