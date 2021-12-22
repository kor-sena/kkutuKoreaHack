(async () => {
  const response = await fetch(
    "https://raw.githubusercontent.com/DwarfSGJ/kkutuKoreaHack/stable/list.json"
  );
  const text = await response.text();

  const list = JSON.parse(text);
  let historyList = [];

  function getStartWord() {
    return document.getElementsByClassName("jjo-display ellipse")[0].innerText;
  }

  function getWord(startWord, endWord = "") {
    if (startWord.includes("(")) {
      startWord = startWord.replace(")", "").split("(");
      return getWord(startWord[0], endWord)
        .concat(getWord(startWord[1], endWord))
        .filter((e) => e !== undefined);
    }

    return list.filter(
      (e) =>
        !historyList.includes(e) &&
        e.startsWith(startWord) &&
        e.endsWith(endWord)
    );
  }

  function updateHistory() {
    const chain = parseInt(
      document.getElementsByClassName("chain")[0].innerText
    );
    if (1 > chain) {
      historyList = [];
    } else {
      const historyItems = Array.from(
        document.getElementsByClassName("ellipse history-item expl-mother")
      ).map((e) => e.innerHTML.split("<")[0]);
      if (historyItems[0] && !historyList.includes(historyItems[0]))
        historyList.push(historyItems[0]);
    }
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.style.display === "block") {
        console.log(getStartWord() + ": " + getWord(getStartWord()).join("\n"));
      }
    });
  });

  const target = document
    .getElementsByClassName("GameBox Product")[0]
    .getElementsByClassName("game-input")[0];
  observer.observe(target, { attributes: true, attributeFilter: ["style"] });

  setInterval(updateHistory, 100);
})();
