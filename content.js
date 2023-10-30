if (typeof browser === "undefined") {
  var browser = chrome;
}

var chRoot = document.querySelector(".msg-list-fvm.message-list");

let FilteredNotice = [];
let FilteredTip = [];
let noticeOn = false;
let tipOn = false;

function filterItems(node) {
  let filtered;
  if ((filtered = node.querySelector(".roomNotice"))) {
    if (filtered.classList.contains("isTip")) {
      if (checkTipNote(filtered)) {
        FilteredTip.push(filtered);
        if (tipOn) filtered.parentElement.style.display = "none";
      }
    } else if (checkRoomEnter(filtered) && checkPrivate(filtered)) {
      let cnt = 0;
      let notFound = true;
      for (const elm of FilteredNotice) {
        if (filtered.isEqualNode(elm)) {
          FilteredNotice[cnt].parentElement.remove();
          FilteredNotice[cnt] = filtered;
          if (noticeOn) filtered.parentElement.style.display = "none";
          notFound = false;
          break;
        }
        cnt++;
      }
      if (notFound) FilteredNotice.push(filtered);
      if (noticeOn) filtered.parentElement.style.display = "none";
    }
  }
}

function callback(mutationList, observer) {
  const newNodes = mutationList[0].addedNodes;
  for (const node of newNodes) {
    filterItems(node);
  }
}

function initial() {
  let msgs = document.body.querySelectorAll(".roomNotice");
  console.log(msgs);
  for (let ms of msgs) {
    filterItems(ms.parentElement);
  }
}

function checkTipNote(testnode) {
  let result = testnode.firstChild.childElementCount <= 2;
  return result;
}

function checkRoomEnter(testnode) {
  let result = false;
  for (let elm of testnode.firstChild.children) {
    if (
      elm.textContent == " has joined the room" ||
      elm.textContent == " has left the room."
    )
      result = true;
  }
  return !result;
}

function checkPrivate(testnode) {
  let result = false;
  for (let elm of testnode.firstChild.children) {
    if (elm.textContent.includes(" wants to start a private show."))
      result = true;
  }
  return !result;
}

const observer = new MutationObserver(callback);
observer.observe(chRoot, { childList: true });

const url = window.location.href;
const reg = /\S*chaturbate.com\/b\//;
let css1;
const crossURL = browser.runtime.getURL("resource/cross-svgrepo-com.svg");
const tickURL = browser.runtime.getURL("resource/tick-svgrepo-com.svg");

if (reg.test(url)) {
  const elm = document.querySelector(
    ".navigationAlt2BgImage.navigationAlt2BgColor.tabSectionBorder"
  );
  elm.insertAdjacentHTML(
    "beforeend",
    `<span class='spacer'></span><span class='addonbtn' id='addonTipsBtn'><img src='${crossURL}' id='extTipsSvg' alt='off' class="extBtnSvg"/>tips</span><span class='addonbtn'  id='addonNoteBtn' ><img src='${crossURL}' id='extNoteSvg'  class="extBtnSvg" />room notice</span>`
  );
  css1 = `.spacer{
            margin-left:auto;
        }`;
} else {
  const elm = document.querySelector("[ts='c']");
  elm.insertAdjacentHTML(
    "afterbegin",
    `<span class='addonbtn' id='addonTipsBtn'><img src=${crossURL} id='extTipsSvg'  class="extBtnSvg" />tips</span><span class='addonbtn' id='addonNoteBtn'><img src='${crossURL}' id='extNoteSvg' class="extBtnSvg" />room notice</span>`
  );
  elm.style.width = "auto";
}

const tipimg = document.getElementById("extTipsSvg");
const noteimg = document.getElementById("extNoteSvg");

document.getElementById("addonTipsBtn").addEventListener("click", toggleTips);
document.getElementById("addonNoteBtn").addEventListener("click", toggleNotice);

function toggleTips() {
  if (tipOn) {
    for (const elm of FilteredTip) elm.parentElement.style.display = "block";
    tipimg.src = crossURL;
  } else {
    for (const elm of FilteredTip) elm.parentElement.style.display = "none";
    tipimg.src = tickURL;
  }
  tipOn = !tipOn;
}

function toggleNotice() {
  if (noticeOn) {
    for (const elm of FilteredNotice) elm.parentElement.style.display = "block";
    noteimg.src = crossURL;
  } else {
    for (const elm of FilteredNotice) elm.parentElement.style.display = "none";
    noteimg.src = tickURL;
  }
  noticeOn = !noticeOn;
}

const style = document.createElement("style");
style.innerHTML = `
    .addonbtn {
        border: 1px solid rgb(139, 179, 218);
        display: inline-flex;
        align-items:center;
        border-radius: 4px;
        
        padding: 0.05em 0.8em 0em;
        margin: auto 0.5em auto;
        width: auto;
        overflow: visible;
        cursor: pointer;
        font-family: UbuntuMedium, Helvetica, Arial, sans-serif;
        font-size: 1.1rem;
    }
    .addonbtn + .addonbtn {
      margin-right: 1.5em;
    }    
    .extBtnSvg {
      margin-top:0.15em;
    }

    ${css1}  
    `;

document.head.appendChild(style);
