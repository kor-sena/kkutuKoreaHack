let kkutuHack = {};

(async () => {
  const response = await fetch(
    "https://raw.githubusercontent.com/DwarfSGJ/kkutuKoreaHack/stable/list.json"
  );
  const text = await response.text();
  const list = JSON.parse(text);
  let historyList = [];
  let option = { sort: false, endWord: "" };

  function getStartWord() {
    return document.getElementsByClassName("jjo-display ellipse")[0].innerText;
  }

  function getWord(startWord, endWord, lwo) {
    if (startWord.includes("(")) {
      startWord = startWord.replace(")", "").split("(");
      const wordList = getWord(startWord[0], endWord)
        .concat(getWord(startWord[1], endWord))
        .filter((e) => e !== undefined);
      if (lwo) wordList.sort((a, b) => b.length - a.length);
      if (endWord !== "")
        wordList.sort((a, b) => (a.endsWith(endWord) ? 1 : -1));
      return wordList;
    }

    const wordList = list.filter(
      (e) => !historyList.includes(e) && e.startsWith(startWord)
    );

    if (lwo) wordList.sort((a, b) => b.length - a.length);
    if (endWord !== "") wordList.sort((a, b) => (a.endsWith(endWord) ? 1 : -1));
    return wordList;
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
        const startWord = getStartWord();
        const wordList = getWord(startWord, option.endWord, option.sort);

        console.log(startWord + ": " + wordList.join("\n"));
      }
    });
  });

  const target = document
    .getElementsByClassName("GameBox Product")[0]
    .getElementsByClassName("game-input")[0];
  observer.observe(target, { attributes: true, attributeFilter: ["style"] });

  const task = setInterval(updateHistory, 100);

  kkutuHack = {
    list,
    getStartWord,
    getWord,
    option,
    observer,
    task,
  };
})();
