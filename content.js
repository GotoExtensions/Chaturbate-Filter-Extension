if (typeof browser === "undefined") {
	var browser = chrome;
}

let defaultSettings = {
	roomEnter: false,
	roomLeave: false,
	filterTips: 0,
	fadeTips: true,
	tipNoteFilter: false,
	FilterActive: true,
};

let settings;

function checkStoredSettings(storedSettings) {
	if (storedSettings.roomEnter == undefined || storedSettings.FilterActive == undefined) {
		browser.storage.local.set(defaultSettings);
		settings = defaultSettings;
	} else {
		settings = storedSettings;
	}
	initExtension();
}

var chRoot = document.querySelector(".msg-list-fvm.message-list");

let FilteredNotice = [];
let FilteredTip = [];
let filterOn;

function initExtension() {
	filterOn = settings.FilterActive;
	if (filterOn) {
		btnImg.src = tickURL;
		document.getElementById("filterToggle").classList.toggle("filter-active", true);
	} else btnImg.src = crossURL;
	InitialFilter();
	setTimeout(() => {
		observer.observe(chRoot, { childList: true });
	}, 1000);
}

function filterItems(node) {
	let filtered;
	if ((filtered = node.querySelector(".roomNotice"))) {
		if (filtered.classList.contains("isTip")) {
			if (settings.filterTips != 0 && checkTipAmount(filtered) && checkTipNote(filtered)) {
				FilteredTip.push(filtered);
				if (filterOn) {
					const parentElm = filtered.parentElement;

					if (settings.fadeTips) {
						parentElm.classList.add("tip-fade-out");
						parentElm.addEventListener(
							"animationend",
							() => {
								parentElm.style.display = "none";
								parentElm.classList.remove("tip-fade-out");
							},
							{ once: true }
						);
					}
				}
			}
		} else if (!checkRoomEnter(filtered) && !checkRoomLeave(filtered) && !checkPrivate(filtered)) {
			let cnt = 0;
			let notFound = true;
			for (const elm of FilteredNotice) {
				if (filtered.isEqualNode(elm)) {
					FilteredNotice[cnt].parentElement.remove();
					FilteredNotice[cnt] = filtered;
					if (filterOn) filtered.parentElement.style.display = "none";
					notFound = false;
					break;
				}
				cnt++;
			}
			if (notFound) FilteredNotice.push(filtered);
			if (filterOn) filtered.parentElement.style.display = "none";
		}
	}
}

function checkTipAmount(testnode) {
	let result = true;
	const str = testnode.parentElement.querySelector(".isTip > div > div > div> span").textContent;
	const tipAmount = parseInt(str.match(/\b\d+\b/)[0]);
	if (tipAmount > settings.filterTips) result = false;
	return result;
}

function checkTipNote(testnode) {
	if (settings.tipNoteFilter == false && testnode.firstChild.childElementCount > 2) {
		return false;
	} else return true;
}

const userClassList = ["defaultUser", "hasTokens", "tippedRecently", "tippedRecently", "tippedTonsRecently", "tippedALotRecently", "inFanclub", "mod"];

function containsUserclass(checkNode) {
	for (const userClass of userClassList) {
		if (checkNode.classList.contains(userClass)) return true;
	}
}

//check if is Room Enter message
function checkRoomEnter(testnode) {
	if (
		settings.roomEnter == false &&
		testnode.firstChild &&
		testnode.firstChild.childElementCount == 4 &&
		testnode.firstChild.children[0].tagName === "SPAN" &&
		testnode.firstChild.children[1].tagName === "DIV" &&
		testnode.firstChild.children[2].tagName === "SPAN" &&
		testnode.firstChild.children[3].tagName === "SPAN"
	) {
		if (containsUserclass(testnode.firstChild.children[1])) return true;
	} else return false;
}

function checkRoomLeave(testnode) {
	if (
		settings.roomLeave == false &&
		testnode.firstChild &&
		testnode.firstChild.childElementCount == 3 &&
		testnode.firstChild.children[0].tagName === "SPAN" &&
		testnode.firstChild.children[1].tagName === "DIV" &&
		testnode.firstChild.children[2].tagName === "SPAN"
	) {
		if (containsUserclass(testnode.firstChild.children[1])) return true;
	} else return false;
}

function checkPrivate(testnode) {
	let result = false;
	for (let elm of testnode.firstChild.children) {
		if (elm.textContent.includes(" wants to start a private show.")) result = true;
	}
	return result;
}

const url = window.location.href;
const reg = /\S*chaturbate.com\/b\//;
const crossURL = browser.runtime.getURL("resource/cross-svgrepo-com.svg");
const tickURL = browser.runtime.getURL("resource/tick-svgrepo-com.svg");

if (reg.test(url)) {
	const elm = document.querySelector(".BroadcastRoot > .tabSectionBorder");
	elm.insertAdjacentHTML("beforeend", `<div class='spacer'></div><div class='addonbtn' id='filterToggle'>Chat Filter<img src='${crossURL}' id='extButtonSvg' class="extBtnSvg"/></div>`);
} else {
	const elm = document.querySelector(".genderTabs .scanNext");
	elm.insertAdjacentHTML("afterend", `<div class='addonbtn' id='filterToggle'>Chat Filter<img src='${crossURL}' id='extButtonSvg' class="extBtnSvg"/></div>`);
	elm.style.width = "auto";
}

const btnImg = document.getElementById("extButtonSvg");

document.getElementById("filterToggle").addEventListener("click", toggleFilter);

function toggleFilter() {
	filterOn = !filterOn;
	this.classList.toggle("filter-active", filterOn);

	if (filterOn) {
		btnImg.src = tickURL;
		for (const elm of FilteredTip) elm.parentElement.style.display = "none";
		for (const elm of FilteredNotice) elm.parentElement.style.display = "none";
	} else {
		btnImg.src = crossURL;
		for (const elm of FilteredTip) {
			elm.parentElement.style.display = "block";
			elm.parentElement.classList.remove("tip-fade-out");
		}
		for (const elm of FilteredNotice) elm.parentElement.style.display = "block";
	}
	const newSetting = { FilterActive: filterOn };
	browser.storage.local.set(newSetting);
}

function changedSettings() {
	FilteredNotice = [];
	FilteredTip = [];
	browser.storage.local.get((newSettings) => {
		settings = newSettings;
		InitialFilter();
	});
}

const style = document.createElement("style");
style.innerHTML = `
    .addonbtn {
        border: 1px solid rgb(139, 179, 218);
        display: inline-flex;
        align-items:center;
        border-radius: 4px;
        float: right;
        background-color: #e6cccc;




        padding: 0.05em 0.8em 0em;
        margin: auto 0.8em auto;
        width: auto;
        overflow: visible;
        cursor: pointer;
        font-family: UbuntuMedium, Helvetica, Arial, sans-serif;
        font-size: 1.1rem;
    }
    .tabSectionBorder > .addonbtn{
      margin-top:0.2em;
	  margin-left:auto;
    }
    .genderTabs > .addonbtn{
            position:relative; 
        top: 50%;
        transform: translateY(-50%);
        margin-right: 4em
    }

    
    
    .addonbtn.filter-active {
      background-color: #d4edda; 
    }


    
    .extButtonSvg {
      filter: invert(0.5) sepia(1) saturate(5) hue-rotate(180deg);
    }

        @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }

    .tip-fade-out {
        animation: fadeOut 1.5s ease-out forwards;
    }

  
    `;

document.head.appendChild(style);

const observer = new MutationObserver(callback);

function callback(mutationList) {
	for (const mutation of mutationList) {
		const newNodes = mutation.addedNodes;
		for (const node of newNodes) {
			filterItems(node);
		}
	}
}

browser.runtime.onMessage.addListener(function (message) {
	if (message.type === "optionsChanged") {
		changedSettings();
	}
});

browser.storage.local.get(checkStoredSettings);

function InitialFilter() {
	if (chRoot.childElementCount > 4) {
		for (let elm of chRoot.children) {
			if (elm.style.display == "none") elm.style.display = "block";
			filterItems(elm);
		}
	}
}
