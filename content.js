const injectScript = `var chRoot = document.querySelector(".msg-list-fvm.message-list");

let FilteredNotice = [];
let FilteredTip = [];
let noticeOn = false;
let tipOn = false;

function callback(mutationList, observer) {
  let newNodes = mutationList[0].addedNodes;
  for (const node of newNodes) {
    let filtered;
    let trgtArray;
    if ((filtered = node.querySelector(".roomNotice"))) {
      if (filtered.classList.contains("isTip")) {
        FilteredTip.push(filtered);
        if (tipOn) filtered.parentElement.style.display = "none";
      } else {
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
}

const observer = new MutationObserver(callback);
observer.observe(chRoot, { childList: true });

function toggleTips() {
  if (tipOn) {
    for (const elm of FilteredTip) elm.parentElement.style.display = "block";
  } else {
    for (const elm of FilteredTip) elm.parentElement.style.display = "none";
  }
  tipOn = !tipOn;
}

function toggleNotice() {
  if (noticeOn) {
    for (const elm of FilteredNotice) elm.parentElement.style.display = "block";
  } else {
    for (const elm of FilteredNotice) elm.parentElement.style.display = "none";
  }
  noticeOn = !noticeOn;
}`;

const url = window.location.href;
console.log("urlhere:" + url);
const reg = /\S*testbed.cb.dev\/b\//;
let css1;
if (reg.test(url)) {
  const elm = document.querySelector(
    ".navigationAlt2BgImage.navigationAlt2BgColor.tabSectionBorder"
  );
  elm.insertAdjacentHTML(
    "beforeend",
    "<span class='spacer'></span><span class='addonbtn' onclick='toggleTips()'>tips</span><span class='addonbtn' onclick='toggleNotice()'>room notice</span>"
  );
  css1 = `.spacer{
            margin-left:auto;
        }`;
} else {
  const elm = document.querySelector("[ts='c']");
  elm.insertAdjacentHTML(
    "afterbegin",
    "<span class='addonbtn' onclick='toggleTips()'>tips</span><span class='addonbtn' onclick='toggleNotice()'>room notice</span>"
  );
  elm.style.width = "auto";
}

const style = document.createElement("style");
style.innerHTML = `
    .addonbtn {
        border: 1px solid rgb(139, 179, 218);
        border-radius: 4px;
        height: 1.6em;
        padding: 0.05em 0.8em;
        margin: auto 0.5em auto;
        width: auto;
        overflow: visible;
        cursor: pointer;
        font-family: UbuntuMedium, Helvetica, Arial, sans-serif;
        font-size: 1.1rem;
    }
    ${css1}
    `;

var addedNode = document.head.appendChild(style);
var scriptNode = document.createElement("script");
scriptNode.innerHTML = injectScript;
document.head.appendChild(scriptNode);
