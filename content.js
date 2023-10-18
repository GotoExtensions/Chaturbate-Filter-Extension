function getScript(attachment) {
  fetch(browser.runtime.getURL("headerscript.js"))
    .then((response) => response.text())
    .then((scriptContent) => {
      let scriptTag = document.createElement("script");
      scriptTag.textContent = attachment + scriptContent;
      document.head.appendChild(scriptTag);
    })
    .catch((error) => {
      console.error("Failed to load script:", error);
    });
}

const url = window.location.href;
const reg = /\S*chaturbate.com\/b\//;
let css1;
const cross = browser.runtime.getURL("resource/cross-svgrepo-com.svg");
const tickURL = browser.runtime.getURL("resource/tick-svgrepo-com.svg");
let urls = `const tick = "${tickURL}";
const cross = "${cross}";
 `;

if (reg.test(url)) {
  const elm = document.querySelector(
    ".navigationAlt2BgImage.navigationAlt2BgColor.tabSectionBorder"
  );
  elm.insertAdjacentHTML(
    "beforeend",
    `<span class='spacer'></span><span class='addonbtn' onclick='toggleTips()'><img src='${cross}' id='extTipsSvg' alt='off' class="extBtnSvg"/>tips</span><span class='addonbtn' onclick='toggleNotice()'><img src='${cross}' id='extNoteSvg'  class="extBtnSvg" />room notice</span>`
  );
  css1 = `.spacer{
            margin-left:auto;
        }`;
} else {
  const elm = document.querySelector("[ts='c']");
  elm.insertAdjacentHTML(
    "afterbegin",
    `<span class='addonbtn' onclick='toggleTips()'><img src=${cross} id='extTipsSvg'  class="extBtnSvg" />tips</span><span class='addonbtn' onclick='toggleNotice()'><img src='${cross}' id='extNoteSvg' class="extBtnSvg" />room notice</span>`
  );
  elm.style.width = "auto";
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

var addedNode = document.head.appendChild(style);
getScript(urls);
