const site = new URLSearchParams(location.search).get("site");
document.getElementById("site").textContent = site ? `${site} is on your focus list` : "This site is on your focus list";
