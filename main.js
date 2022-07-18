const mySearch = document.querySelector('#search-input');
const resultDisplay = document.querySelector('#search-result-container');
const myClassSel = document.querySelector('#select-class');
const myTagSel = document.querySelector('#select-tags');
const searchBtn = document.querySelector('#search-btn');
let searchResult = [];
let myStringOnKey = [];
let myString;
let selectedTags = [];
const dataTags = [];
const dataClass = []

/******** INIT START ********/
function getAllTags() {
  let check = false;
  for(let i = 0; i < glossary.length; i++) {
    for(let j = 0; j < glossary[i].tags.length; j++) {
      for(let k = 0; k < dataTags.length; k++) {
        dataTags[k] === glossary[i].tags[j] ? check = true : false;
      }
      check === false ? dataTags.push(glossary[i].tags[j]) : false;
      check = false;
    }
  }
}
function getAllClass() {
  let check = false;
  for(let i = 0; i < glossary.length; i++) {
    for(let k = 0; k < dataClass.length; k++) {
      dataClass[k] === glossary[i].class ? check = true : false;
    }
    check === false ? dataClass.push(glossary[i].class) : false;
    check = false;
  }
}
function init() {
  const selectClass = document.querySelector('#select-class');
  const selectTag = document.querySelector('#select-tags');
  getAllTags();
  getAllClass();
  for(let i = 0; i < dataTags.length; i++) {
    selectTag.innerHTML += `<label for="${dataTags[i]}" class="tag-input-label"><input type="checkbox" name="${dataTags[i]}" id="tag-input-${i}" class="tag-input" value="${dataTags[i]}">${dataTags[i]}</input></label>`;
  }
  for(let j = 0; j < dataClass.length; j++) {
    selectClass.innerHTML += `<option value="${dataClass[j]}">${dataClass[j]}</option>`;
  }
}
init();
/******** INIT END ********/

mySearch.addEventListener('keyup', dynamicKeyIn);
mySearch.addEventListener('keypress', enterPressed);
searchBtn.addEventListener('click', dynamicKeyIn);
myClassSel.addEventListener('change', filterFunc);
myTagSel.addEventListener('change', tagSelectFunc);

// Search when class selection is changed
function filterFunc(e) {
  const classSel = myClassSel.value;
  if(myStringOnKey.length < 1) {
    myStringOnKey = [...mySearch.value];
    searchResult = searchData(glossary, myStringOnKey.join(""), classSel, selectedTags);
    displayResult(searchResult);
  } else {
    myStringOnKey = [...mySearch.value];
    searchResult = searchData(glossary, myStringOnKey.join(""), classSel, selectedTags);
    displayResult(searchResult);
  }
}

// Record the selection of Tag
function tagSelectFunc(e) {
  if(e.target.checked) {
    selectedTags.push(e.target.value);
  } else {
    for(let i = 0; i < selectedTags.length; i++) {
      if(e.target.value === selectedTags[i]) selectedTags.splice(i, 1);
    }
  }
  filterFunc();
} 

// Enter Check
function enterPressed(e) {
  if(e.key === "Enter") {
    e.preventDefault();
    filterFunc();
  } else return false;
}
// Dynamic Searching while Typing in
function dynamicKeyIn(e) {
  const classSel = myClassSel.value;
  if(!(/[a-zA-Z0-9]+/ig).test(e.key) || e.key === "Escape" || e.key === "CapsLock" || e.key === "Tab" || e.key === "Shift" || e.key === "Control" || e.key === "Alt" || e.key === "Meta") {
    return false;
  } else if(e.key === "Backspace") {
    if(myStringOnKey.length > 0) {
      myStringOnKey = [...mySearch.value];
      searchResult = searchData(glossary, myStringOnKey.join(""), classSel, selectedTags);
      displayResult(searchResult);
    } 
    return false;
  } else {
    if(myStringOnKey.length < 1) {
      myStringOnKey = [...mySearch.value];
      searchResult = searchData(glossary, myStringOnKey.join(""), classSel, selectedTags);
    } else {
      myStringOnKey = [...mySearch.value];
      searchResult = searchData(searchResult, myStringOnKey.join(""), classSel, selectedTags);
    }
    displayResult(searchResult);
  }
}

// Searching through Data (data, searching input)
function searchData(data, string, classSel, tagSel) {
  let result = [], classCheck, tagCheck, inputCheck;
  let mString = string.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
  for(let i = 0; i < data.length; i++) {
    classCheck = true; tagCheck = true; inputCheck = true;
    if(classSel != "all") checkDataClass(data[i].class, classSel) ? true : classCheck = false;
    if(tagSel.length > 0 ) checkDataTag(data[i].tags, tagSel) ? true : tagCheck = false;
    if(checkData(data[i].term, mString) || mString.length <= 0) inputCheck = true; else inputCheck = false;
    if(inputCheck === true && classCheck === true && tagCheck === true) result.push(data[i]);
  }
  return result;
}

// Compare passed in class(dClass) with user selected class(mClass)
function checkDataClass(dClass, mClass) {
  if(dClass == mClass) return true;
  else return false;
}

// Compare passed in tag(dTag/array) with user selected tag(mTag)
function checkDataTag(dTag, mTag) {
  let check = true, checkTemp;
  for(let i = 0; i < mTag.length; i++) {
    checkTemp = false;
    for(let j = 0; j < dTag.length; j++) {
      mTag[i] === dTag[j] ? checkTemp = true : false;
    }
    if(check === false || checkTemp === false) check = false;
  }
  return check;
}

// Compare the passed in STRING and DATA(String),
function checkData(data, mString) {
  let check = false;
  let mData = data.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
  for(let i = 0; i < mString.length; i++) { // Compare by String length (how many character has been entered)
    if(mString[i] === mData[i]) {
      check = true;
    } else return false;
  }
  return check;
}

// Display Search Result
function displayResult(data) {
  resultDisplay.classList.remove('fade-in');
  resultDisplay.classList.add('fade-out');
  setTimeout(function() {
    resultDisplay.innerHTML = "";
    if(mySearch.value === "" && selectedTags.length < 1 && myClassSel.value === "all") {
      resultDisplay.innerHTML = `<div class="result-notification-container"><h3 class="result-notification">Start your search by entering a keyword or choosing filter options.</h3></div>`;
    } else {
      for(let i = 0; i < data.length; i++) {
        resultDisplay.innerHTML += `<div class="result-word"><h3>${data[i].term}</h3><p class="word-class"><b>Class:</b> ${data[i].class}</p><p class="word-tag"><b>Tag:</b> ${getTag(data[i])}</p><p>${data[i].definition}</p></div>`
      }
    }
    resultDisplay.classList.remove('fade-out');
    resultDisplay.classList.add('fade-in');
  });
}
// Get Result's Tags for Display
function getTag(data) {
  let mTag = "";
  for(let i = 0; i < data.tags.length; i++) {
    mTag += `${data.tags[i]}`;
    if( i+1 < data.tags.length) mTag += `, `;
    else mTag += ``;
  }
  return mTag;
}