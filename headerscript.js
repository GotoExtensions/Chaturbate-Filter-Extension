var chRoot = document.querySelector(".msg-list-fvm.message-list");

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

const tipimg = document.getElementById("extTipsSvg");
const noteimg = document.getElementById("extNoteSvg");
console.log("here elm");
console.log(tipimg);
function toggleTips() {
  if (tipOn) {
    for (const elm of FilteredTip) elm.parentElement.style.display = "block";
    tipimg.src = cross;
  } else {
    for (const elm of FilteredTip) elm.parentElement.style.display = "none";
    tipimg.src = tick;
  }
  tipOn = !tipOn;
}

function toggleNotice() {
  if (noticeOn) {
    for (const elm of FilteredNotice) elm.parentElement.style.display = "block";
    noteimg.src = cross;
  } else {
    for (const elm of FilteredNotice) elm.parentElement.style.display = "none";
    noteimg.src = tick;
  }
  noticeOn = !noticeOn;
}
