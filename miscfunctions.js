
function readCookie(requestedKey) {
   var allcookies = document.cookie;
   // Get all the cookies pairs in an array
   cookiearray = allcookies.split(';');
   // Now take key value pair out of this array
   for(var i=0; i<cookiearray.length; i++) {
      key = cookiearray[i].split('=')[0];
      value = cookiearray[i].split('=')[1];
      if(key.trim()==requestedKey.trim()){
      	return value;
      }
      else if(i==cookiearray.length-1){
      	return '';
      }
   	}
}

function setPreferredGender(choice){
   var genderHolder = document.getElementById('genderHolder');
   genderHolder.innerText = choice;
   document.cookie= 'preferredGender='+choice;

    if(userDetails.loginId==undefined || userDetails.loginId==''){
      setTimeout(function(){
         createLoginAlert();
      },800)
   }

}

function setPreferredLocation(choice){
   var genderHolder = document.getElementById('locationHolder');
   genderHolder.innerText = choice;
   document.cookie= 'preferredLocation='+choice;  

    if(userDetails.loginId==undefined || userDetails.loginId==''){
         setTimeout(function(){
            createLoginAlert();
         },800)
   }

}

function createListElement(value){
   var newDiv = document.createElement('div');
   newDiv.className = 'listElement';
   newDiv.innerText = value;
   return newDiv;
}

function createGenderSelector(filterNameDesc,filterHolderId,value,array){

var selectorHolder = document.createElement('div');
selectorHolder.className = "selectorHolder";

var selectorTable = document.createElement('table');
selectorTable.className = "selectorTable";

var newRow = document.createElement('tr');

var newHeading = document.createElement('td');
newHeading.innerText = filterNameDesc;

var newHeading2 = document.createElement('td');
newHeading2.id=filterHolderId
newHeading2.innerText = value;

var newHeading3 = document.createElement('td');
newHeading3.innerHTML = "<i class='fa fa-caret-down'></i>";

newRow.appendChild(newHeading)
newRow.appendChild(newHeading2)
newRow.appendChild(newHeading3)

selectorTable.appendChild(newRow);
selectorHolder.appendChild(selectorTable);

var listHolder = document.createElement('div');
listHolder.className="listHolder";

var listElement;

for(var i=0;i<array.length;i++){
   let choice = array[i];
   listElement = createListElement(choice);
   listElement.onclick=function(e){
      switch(filterHolderId){
         case 'genderHolder':
         setPreferredGender(choice);
         break;
         case 'locationHolder':
         setPreferredLocation(choice);
         break;
      }
      var animatedSpan = document.createElement('span');
      animatedSpan.className = "animatedSpan";
      e.target.appendChild(animatedSpan);
      setTimeout(function(){
         animatedSpan.remove();
      },1000);
   }
   listHolder.appendChild(listElement);
}

selectorHolder.appendChild(listHolder);
return selectorHolder;

}

function createAgeSelector(){
   var newDiv  =document.createElement('div');
   newDiv.className = "selectorHolder";

   var newTable = document.createElement('table');
   newTable.className="selectorTable";

   var newRow= document.createElement('tr');

   var newHeading = document.createElement('td');
   newHeading.innerText = "Age";

   var newHeading2 = document.createElement('td');
   newHeading2.id="lowerHolder";

   var newHeading3 = document.createElement('td');

   var sliderHolder= document.createElement('div');

   sliderHolder.id= "ageSelector";
   sliderHolder.className = "ageSelector";

   var lowerSpan= document.createElement('span');
   lowerSpan.id="lower";
   lowerSpan.className=" circleInSideAgeSelector ";
   lowerSpan.onmousedown=function(e){
      thumbClickedDown(e,'lower');
   }

   var upperSpan = document.createElement('span');
   upperSpan.id="upper";
   upperSpan.onmousedown=function(e){
      thumbClickedDown(e,'upper')
   }

   upperSpan.className="circleInSideAgeSelector";

   var hintSpan =document.createElement('soan');
   hintSpan.id="hintSpan";

   sliderHolder.appendChild(lowerSpan);
   sliderHolder.appendChild(upperSpan);
   sliderHolder.appendChild(hintSpan);

   newHeading3.appendChild(sliderHolder);


   var newHeading4 =document.createElement('td');
   newHeading4.id="upperHolder";

   newRow.appendChild(newHeading);
   newRow.appendChild(newHeading2);
   newRow.appendChild(newHeading3);
   newRow.appendChild(newHeading4);

   newTable.appendChild(newRow)

   newDiv.appendChild(newTable);
   return newDiv;

}


function createSetPreferencesForm(){
   var preferredGender = readCookie('preferredGender');
   var preferredLowerAgeRange = readCookie('preferredLowerAge');
   var preferredHigherAge = readCookie('preferredHigherAge');
   var preferredLocation = readCookie('preferredLocation');

   if(preferredGender==''){
      preferredGender = 'F / M'
   }

   var preferencesHolder = document.createElement('div');
   preferencesHolder.className="preferencesHolder"
  
   preferencesHolder.appendChild(createGenderSelector('Looking For ','genderHolder',preferredGender,['Male','Female']));

   if(preferredLocation==''){
      preferredLocation='Country';
   }

   var totalCountriesOnly = [];

   for(var i=0;i<totalCountries.length;i++){
      totalCountriesOnly.push(totalCountries[i].name);
   }

   preferencesHolder.appendChild(createGenderSelector(' From ','locationHolder',preferredLocation,totalCountriesOnly));


   preferencesHolder.appendChild(createAgeSelector());


   document.body.appendChild(preferencesHolder);
}


function displayThumbs(){


   var thumb1 = document.getElementById('first');
   var thumb2 = document.getElementById('second');

}




function thumbClickedDown(e, whichh){
   let which = whichh;
   console.log(which);
   let span = e.target;
   span.classList.add('active');
   window.onmousemove = function(e){
      var currentX = e.clientX;
      if(currentX>=sliderX+200){
         //span.style.right = "0px";
         switch(which){
            case 'lower':
            lower = 59;
            break;
            case 'upper':
            upper = 59;
         }
      }
      else if(currentX<=sliderX){
         //span.style.left = "0px";
         switch(which){
            case 'lower':
            lower=18;
            break;
            case 'upper':
            upper = 18;
            break;
         }
      }
      else{
          var temp = Math.floor(41/200*(currentX-sliderX)+18);
          switch(which){
            case 'lower':
            lower = temp;
            break;
            case 'upper':
            upper=temp;
            break;
          }
      }
      if(lower>upper){
         displayThumbs(upper,lower);
         displayHintSpan(upper,lower);
      }
      else{
         displayThumbs(lower,upper);
         displayHintSpan(lower,upper);
      }
      filloutAges()
   }
   window.onmouseup=function(e){

     if(userDetails.loginId==undefined || userDetails.loginId==''){
         setTimeout(function(){
            createLoginAlert();
         },800)
      }

      span.classList.remove('active');
      window.onmouseup=function(){}
      window.onmousemove=function(){}
   }
}


function displayThumbs(first,second){
      var lowerSpan = document.getElementById('lower');
      var upperSpan = document.getElementById('upper');
      lowerSpan.style.left =  (first-18)/41*200+"px";
      upperSpan.style.right =  200-(second-18)/41*200+"px";
}


function displayHintSpan(first,second){
   var left1  = (first-18)/41*200;
   var left2 = (second-18)/41*200;
   var hintSpan = document.getElementById('hintSpan');
   if(left1<left2){
      hintSpan.style.left= left1+20+"px"
   }
   else{
      hintSpan.style.left=left2+20+"px"
   }
   var spareWidth =  Math.abs((left1-left2))-40
   if(spareWidth>0){
      hintSpan.style.width = spareWidth+"px";
   }
   else{
      hintSpan.style.width="0px";
   }
}

function filloutAges(){

 

   if(lower<upper){
      lowerHolder.innerText = lower;
      document.cookie='lowerAgeLimit='+lower
      document.cookie='upperAgeLimit='+upper
      upperHolder.innerText= upper;
   }  
   else{
      document.cookie='lowerAgeLimit='+upper
      document.cookie='upperAgeLimit='+lower
      lowerHolder.innerText = upper;
      upperHolder.innerText = lower;
   }
}


function removePreviousOverlay(){
   var overlay  =document.getElementById('overlay')
   if(overlay){overlay.remove()}
      window.onpushstate=showUserDetails;
}

function createLoginAlert(){

   removePreviousOverlay()

   var overlayDiv = document.createElement('div');
   overlayDiv.id = "overlay";

   overlayDiv.onclick=function(){
      removePreviousOverlay();
   }

   var overlayContentDiv =document.createElement('div');
   overlayContentDiv.id = "overlayContent";

   var divTitle =document.createElement('h3');
   divTitle.innerText = "You get what you give!"
   divTitle.className="divTitle";

   var titleDesc = document.createElement('P');
   titleDesc.innerText  ="Login now to access gender, location and age selection features. It's 100% free!";

   var loginBtn =document.createElement('div');
   loginBtn.className = "loginBtn btn";
   loginBtn.innerHTML = "Login";
   loginBtn.onclick=function(){
      window.location.href = "login.php"
   }


   overlayContentDiv.appendChild(divTitle);
   overlayContentDiv.appendChild(titleDesc);
   overlayContentDiv.appendChild(loginBtn);

   overlayDiv.appendChild(overlayContentDiv);

   document.body.appendChild(overlayDiv);

}

function createMarginedDiv(){
   var smallBorder = document.createElement('div');
   smallBorder.className="margined"
   return smallBorder
}


function createBorderDiv(){
   var smallBorder = document.createElement('div');
   smallBorder.className="margined smallBorder"
   return smallBorder
}


function showUserDetails(){
   var overlayDiv = document.createElement('div');
   overlayDiv.id="overlay";

   window.history.pushState('sf',{},'');

   var overlayContentDiv= document.createElement('div');
   overlayContentDiv.id="overlayContent";

   var divTitle = document.createElement('span')
   divTitle.className="divTitle margined";
   divTitle.style.fontSize = "20px"
   divTitle.style.fontWeight="bold"
   divTitle.style.textAlign = "center";
   divTitle.innerHTML="Your Info <span style='cursor:pointer;color:white' onclick = 'removePreviousOverlay()'>[Hide]</span>";
   
   var form = document.createElement('form');
   form.id = "editInfo";

   var p1 =document.createElement('span');
   p1.className="margined";
   p1.innerText = "Login_Id: "+userDetails.loginId;


   var p2 = document.createElement('span');
   p2.innerText = "Gender: ";
   p2.className="margined"

   var genderSelector1 = document.createElement('input')
   genderSelector1.type = "radio"
   genderSelector1.name = "gender"
   genderSelector1.value = "1"
   genderSelector1.id = "male"

   var label1 = document.createElement('label');
   label1.htmlFor =  'male';
   label1.innerText="Male";

   var genderSelector2 = document.createElement('input')
   genderSelector2.type = "radio"
   genderSelector2.name="gender"
   genderSelector2.value="0"
   genderSelector2.id = "female"

   var label2 = document.createElement('label');
   label2.htmlFor =  'female';
   label2.innerText="Female";

   if(userDetails.gender=='1'||userDetails.gender==1||userDetails.gender=="1"){ 
      genderSelector1.checked = true;
   }
   else{
      genderSelector2.checked = true;
   }

   var p3 = document.createElement('span');
   p3.innerText = "Birth Date:  "

   var dateHolder = document.createElement('input');
   dateHolder.type="date";
   dateHolder.value = userDetails.dob;
   dateHolder.name = "dob";

   var saveBtn =  document.createElement('div')
   saveBtn.className="loginBtn btn margined"
   saveBtn.innerText="Save"
   saveBtn.onclick=function(){save()}


   overlayContentDiv.appendChild(divTitle)
   overlayContentDiv.appendChild(createMarginedDiv())
   overlayContentDiv.appendChild(p1)
   overlayContentDiv.appendChild(createMarginedDiv())

   overlayContentDiv.appendChild(p2)
   overlayContentDiv.appendChild(genderSelector1)
   overlayContentDiv.appendChild(label1)
   overlayContentDiv.appendChild(genderSelector2)
   overlayContentDiv.appendChild(label2)
   overlayContentDiv.appendChild(createMarginedDiv())

   overlayContentDiv.appendChild(p3)
   overlayContentDiv.appendChild(dateHolder)
   overlayContentDiv.appendChild(saveBtn)

   overlayContentDiv.appendChild(createBorderDiv())
   
   var logOutLink = document.createElement('div')
   logOutLink.style.textAlign="center"
   logOutLink.style.cursor="pointer"
   logOutLink.innerHTML="<span style = 'padding-bottom:2px;border-bottom:2px solid skyblue'>Log Out</span> "
   logOutLink.onclick=function(){
      window.location.href="logout.php";
   }

   overlayContentDiv.appendChild(logOutLink);

   window.onpopstate = removePreviousOverlay

   overlayDiv.appendChild(overlayContentDiv)
   document.body.appendChild(overlayDiv);


}

function save(){





var gender = document.querySelector('input[name="gender"]:checked').value;


var dob = document.querySelector('input[name="dob"]').value;


userDetails.gender = gender;userDetails.dob = dob;

setStatusMessage('progress','Saving....',true);
fetch('updateinfo.php?gender='+gender+'&dob='+dob)
.then(function(response){
   return response.text()
})
.then(function(data){
   setStatusMessage('info',data,true)
   removePreviousOverlay();
})

}
