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
    document.getElementById("filter-tips").value = items.filterTips;
    document.getElementById("tip-note-filter").checked = items.tipNoteFilter;
  });

  document.getElementById("saveButton").addEventListener("click", function () {
    const options = {
      //      notifications: document.getElementById("notifications").checked,
      roomEnter: document.getElementById("room-enter").checked,
      roomLeave: document.getElementById("room-leave").checked,
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
    setTimeout(function () {
      saveMessage.style.opacity = "0";
    }, 200);

    // Hide the message completely after the fade-out effect
    setTimeout(function () {
      saveMessage.style.display = "none";
    }, 2000);
  });
});
