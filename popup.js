if (typeof browser === "undefined") {
  var browser = chrome;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("filter-tips").addEventListener("blur", function () {
    if (this.value === "") {
      this.value = "0";
    }
  });

  browser.storage.local.get((items) => {
    //      document.getElementById("notifications").checked = items.notifications;
    document.getElementById("room-enter").checked = items.roomEnter;
    document.getElementById("room-leave").checked = items.roomLeave;
    document.getElementById("fade-tips").checked = items.fadeTips;
    document.getElementById("filter-tips").value = items.filterTips;
    document.getElementById("tip-note-filter").checked = items.tipNoteFilter;
  });

  document.getElementById("saveButton").addEventListener("click", function () {
    const options = {
      //      notifications: document.getElementById("notifications").checked,
      roomEnter: document.getElementById("room-enter").checked,
      roomLeave: document.getElementById("room-leave").checked,
      fadeTips: document.getElementById("fade-tips").checked,
      filterTips: parseInt(document.getElementById("filter-tips").value),
      tipNoteFilter: document.getElementById("tip-note-filter").checked,
    };

    browser.storage.local.set(options);

    const matchPattern = "*://chaturbate.com/*";

    browser.tabs.query({ url: matchPattern }, function (tabs) {
      tabs.forEach(function (tab) {
        browser.tabs.sendMessage(tab.id, {
          type: "optionsChanged",
        });
      });
    });

    const saveMessage = document.getElementById("saveMessage");
    saveMessage.style.display = "block";
    saveMessage.style.opacity = "1";

    // Fade out the message after a short delay
    saveMessage.classList.remove("animate");

    // 2. This forces the browser to apply the change immediately
    void saveMessage.offsetWidth;

    // 3. Add the class back to restart the animation from the beginning
    saveMessage.classList.add("animate");
  });
});
