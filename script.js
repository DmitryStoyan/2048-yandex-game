// import "./style.css";

document.addEventListener("DOMContentLoaded", function () {
  let score = 0;
  let ysdk;
  let player;
  let playerData = {};
  let newData = {};

  const platform = "yandex";
  const platforms = {
    yandex: "yandex",
    other: "other",
  };

  const recordsButton = document.querySelector(".records");
  const recordsModal = document.querySelector(".recordsModal");
  const standingsCloseButton = document.querySelector(
    ".standings__close-button"
  );

  function hideAdressBar() {
    setTimeout(function () {
      document.body.style.height = window.outerHeight + "px";
      setTimeout(function () {
        window.scrollTo(0, 1);
      }, 1100);
    }, 1000);
    return false;
  }

  window.onload = function () {
    hideAdressBar();
    window.addEventListener(
      "orientationchange",
      function () {
        hideAdressBar();
      },
      false
    );
  };

  function initGame(params) {
    YaGames.init()
      .then((_ysdk) => {
        console.log("Yandex SDK инициализирован");
        ysdk = _ysdk;
        initPlayer();
      })
      .catch((error) => {
        console.error("Ошибка инициализации Yandex SDK:", error);
      });
  }

  function initPlayer() {
    if (!ysdk) {
      console.error("Ошибка: объект ysdk не был инициализирован.");
      return;
    }
    ysdk
      .getPlayer({ scopes: true })
      .then((_player) => {
        if (_player.getMode() === "lite") {
          console.log("lite");
          ysdk.auth
            .openAuthDialog()
            .then(() => {
              // Игрок успешно авторизован.
              initPlayer().catch((err) => {
                console.log("Ошибка при инициализации объекта Player.2");
                // Ошибка при инициализации объекта Player.
              });
            })
            .catch(() => {
              // Игрок не авторизован.
              ysdk.auth.openAuthDialog();
              console.log("Игрок не авторизован.");
            });
        }
        console.log("Данные игрока:", _player);
        player = _player;
      })
      .catch((error) => {
        console.error("Ошибка инициализации игрока:", error);
      });
  }

  function savesScoretoServer(score) {
    if (!player) {
      console.error("Ошибка: объект player не был инициализирован.");
      return;
    }

    let currentPlayerId = player.getUniqueID();
    let currentPlayerData = playerData[currentPlayerId];

    if (!currentPlayerData || score > currentPlayerData.bestScore) {
      newData = {
        username: player.getName() || "Гость",
        bestScore: score,
        otherData: player.getData(),
      };

      playerData[currentPlayerId] = newData;

      player
        .setData(newData, true)
        .then(() => {
          console.log("Лучший счет успешно обновлён на сервере:", score);
        })
        .catch((error) => {
          console.error("Ошибка при сохранении лучшего счета:", error);
        });
    } else {
      console.warn("Новый счет не лучше текущего лучшего счета.");
    }
  }

  function storage(loadcallback) {
    if (!ysdk) {
      console.error("Ошибка: объект ysdk не был инициализирован.");
      return;
    }

    if (platform == platforms.yandex) {
      console.log("storage");
      ysdk
        .getPlayer()
        .then((player) => {
          player
            .getData()
            .then((data) => {
              console.log("data load");
              console.log(data);
              console.log(player.getName());
              storage.get = function (key) {
                return data[key];
              };
              storage.set = function (key, value) {
                data[key] = value;
              };
              storage.push = function () {
                player.setData(data).then(() => {
                  console.log("yandexsdk cloud push seccuss");
                  console.log(data);
                });
              };

              storage.type = 1;

              storage.getraw = function () {
                return data;
              };

              loadcallback();
              console.log("привязка хранилища к облаку yandexsdk");
            })
            .catch((err) => {
              lssave();
            });
        })
        .catch((err) => {
          lssave();
        });
    } else {
      lssave();
    }

    function lssave() {
      console.log("привязка хранилища к localStorage");
      storage.get = function (key) {
        return localStorage[key];
      };
      storage.set = function (key, value) {
        localStorage[key] = value;
      };
      storage.push = function () {};
      storage.getraw = function () {
        return localStorage;
      };
      storage.type = 0;
      loadcallback();
    }
  }

  function storageCallback() {
    createTable();
  }

  storage(storageCallback);

  initGame();

  function createTable() {
    let tableBody = document.querySelector(".tournamentTable tbody");
    tableBody.innerHTML = "";

    Object.keys(playerData).forEach((playerId, index) => {
      let playerInfo = playerData[playerId];
      let row = document.createElement("tr");

      // Место
      let placeCell = document.createElement("td");
      placeCell.textContent = index + 1;
      row.appendChild(placeCell);

      // Логин игрока (Yandex ID)
      let loginCell = document.createElement("td");
      // loginCell.textContent = playerId;
      loginCell.textContent = playerInfo.username || "Гость";
      row.appendChild(loginCell);

      // Лучший счет
      let bestScoreCell = document.createElement("td");
      // bestScoreCell.textContent = playerInfo.bestScore || 0;
      bestScoreCell.textContent = newData.bestScore || 0;
      row.appendChild(bestScoreCell);

      // Добавляем строку в таблицу
      tableBody.appendChild(row);
    });
  }

  let achivmentsModal = document.querySelector(".achievements");
  let achivmentsCloseButton = document.querySelector(
    ".achievements__close-button"
  );
  let achivmentsButton = document.querySelector(".achievments-button");
  let newGameButton = document.querySelector(".new_game-button");
  let newGameButtonWin = document.querySelector(".win__game-Button");
  let gridContainer = document.querySelector(".grid__container");
  let scoreText = document.querySelector(".score__text");
  let gameContainerWin = document.querySelector(".game__container-win");
  let closeButton = document.querySelector(".close");
  let menu = document.querySelector(".menu");
  let menuButton = document.querySelector(".menu-button");
  let fieldButton4x4 = document.querySelector(".field4x4");
  let fieldButton5x5 = document.querySelector(".field5x5");
  let fieldButton6x6 = document.querySelector(".field6x6");
  let fieldButton8x8 = document.querySelector(".field8x8");
  // let bgMusic = new Audio();
  // bgMusic.src = "/sounds/bacroundMusic.mp3";
  // bgMusic.volume = 0.3;
  let gridCell;
  let canUndo = true;
  let gridSize = 4;
  let touchStart = {
    x: null,
    y: null,
  };

  let returnButton = document.querySelector(".return_button");
  let moveHistory = [];
  let cells = [];
  // bgMusic.play()
  function undoMove() {
    if (moveHistory.length > 0 && canUndo) {
      canUndo = false;
      let previousState = moveHistory.pop();
      cells.forEach((cell, index) => {
        cell.value = previousState[index];
      });
      updateBoard();
    }
  }

  function handleKeyUp(event) {
    if (event.key === "ArrowRight" || event.code === "KeyD") {
      moveRight();
    } else if (event.key === "ArrowLeft" || event.code === "KeyA") {
      moveLeft();
    } else if (event.key === "ArrowDown" || event.code === "KeyS") {
      moveDown();
    } else if (event.key === "ArrowUp" || event.code === "KeyW") {
      moveUp();
    }
  }

  function checkForWin() {
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].value == 2048) {
        gameContainerWin.classList.add("game__container-win__active");
        document.removeEventListener("keyup", handleKeyUp);
      }
    }
  }

  function createGrid() {
    for (let i = 0; i < gridSize * gridSize; i++) {
      gridCell = document.createElement("div");
      gridCell.classList.add("grid-cell");
      gridCell.innerHTML = 0;
      gridContainer.appendChild(gridCell);
      cells.push({ element: gridCell, value: 0 });
    }
    addNumber();
    addNumber();
    updateBoard();
  }

  const mediaQuery = window.matchMedia("(max-width: 480px)");

  function handleMediaChange(mediaQuery) {
    if (mediaQuery.matches) {
      resizeGrid(gridSize);
    }
  }

  mediaQuery.addEventListener("change", handleMediaChange); // Слушаем изменения

  function resizeGrid(size) {
    gridSize = size;
    let cellSize;
    if (gridSize === 4) {
      cellSize = 100; // Размер ячейки для 4x4
    } else if (gridSize === 5) {
      cellSize = 90; // Размер ячейки для 5x5
    } else if (gridSize === 6) {
      cellSize = 70; // Размер ячейки для 6x6
    } else if (gridSize === 8) {
      cellSize = 50; // Размер ячейки для 8x8
    }

    if (mediaQuery.matches && cellSize) {
      cellSize /= 1.5; // Уменьшаем размер ячейки в полтора раза при ширине 480px
    }

    let gridTemplateColumns = `repeat(${gridSize}, ${cellSize}px)`;
    let gridTemplateRows = `repeat(${gridSize}, ${cellSize}px)`;

    gridContainer.style.gridTemplateColumns = gridTemplateColumns;
    gridContainer.style.gridTemplateRows = gridTemplateRows;

    gridContainer.innerHTML = "";
    cells = [];
    for (let i = 0; i < gridSize * gridSize; i++) {
      gridCell = document.createElement("div");
      gridCell.classList.add("grid-cell");
      gridCell.innerHTML = 0;
      gridContainer.appendChild(gridCell);
      cells.push({ element: gridCell, value: 0 });
    }

    addNumber();
    addNumber();
    updateBoard();
  }

  function addNumber() {
    let available = cells.filter((cell) => cell.value === 0);
    if (available.length > 0) {
      let randomCell = available[Math.floor(Math.random() * available.length)];
      randomCell.value = Math.random() > 0.9 ? 4 : 2;
      randomCell.element.innerHTML = randomCell.value;
      if (randomCell.value == 2) {
        randomCell.element.classList.add("grid-cell-2");
      }
      if (randomCell.value == 4) {
        randomCell.element.classList.add("grid-cell-4");
      }
    }
  }

  function slideRight(row) {
    let arr = row.filter((val) => val);
    let missing = gridSize - arr.length;
    let zeros = Array(missing).fill(0);
    arr = zeros.concat(arr);
    return arr;
  }

  function combineDown(row, score) {
    for (let i = gridSize - 1; i >= 1; i--) {
      let a = row[i];
      let b = row[i - 1];
      if (a === b) {
        row[i] = a + b;
        score += row[i];
        row[i - 1] = 0;
      }
    }
    return { row, score };
  }

  function combineRight(row, score) {
    for (let i = gridSize - 1; i > 0; i--) {
      let a = row[i];
      let b = row[i - 1];
      if (a === b) {
        row[i] = a + b;
        score += row[i];
        row[i - 1] = 0;
      }
    }
    return { row, score };
  }

  function moveRight() {
    let currentState = cells.map((cell) => cell.value);
    moveHistory.push(currentState);

    for (let i = 0; i < gridSize * gridSize; i += gridSize) {
      let row = [];
      for (let j = 0; j < gridSize; j++) {
        row.push(cells[i + j].value);
      }
      row = slideRight(row);
      let result = combineRight(row, score); // Передаем score в функцию combineRight
      row = result.row;
      score = result.score;
      row = slideRight(row);
      for (let j = 0; j < gridSize; j++) {
        cells[i + j].value = row[j];
      }
    }

    addNumber();
    updateBoard();
    canUndo = true;
  }

  function moveLeft() {
    let currentState = cells.map((cell) => cell.value);
    moveHistory.push(currentState);

    for (let i = 0; i < gridSize * gridSize; i += gridSize) {
      let row = [];
      for (let j = 0; j < gridSize; j++) {
        row.push(cells[i + gridSize - 1 - j].value);
      }
      row = slideRight(row);
      let result = combineRight(row, score);
      row = result.row;
      score = result.score;
      row = slideRight(row);
      for (let j = 0; j < gridSize; j++) {
        cells[i + gridSize - 1 - j].value = row[j];
      }
    }

    addNumber();
    updateBoard();
    canUndo = true;
  }

  function newGame() {
    gridContainer.innerHTML = "";
    cells = [];
    score = 0;
    updateScore();
    createGrid();
    gameContainerWin.classList.remove("game__container-win__active");
    document.addEventListener("keyup", handleKeyUp);
  }

  function moveUp() {
    let currentState = cells.map((cell) => cell.value);
    moveHistory.push(currentState);
    for (let i = 0; i < gridSize * gridSize; i++) {
      let row = [];
      for (let j = i; j < cells.length; j += gridSize) {
        row.push(cells[j].value);
      }
      row = slideLeft(row);
      let result = combineLeft(row, score);
      row = result.row;
      score = result.score;
      row = slideLeft(row);
      for (
        let j = i, k = 0;
        j < cells.length && k < row.length;
        j += gridSize, k++
      ) {
        cells[j].value = row[k];
      }
    }
    addNumber();
    updateBoard();
    canUndo = true;
  }

  function moveDown() {
    let currentState = cells.map((cell) => cell.value);
    moveHistory.push(currentState);
    for (let i = gridSize - 1; i >= 0; i--) {
      let row = [];
      for (let j = i; j < cells.length; j += gridSize) {
        row.push(cells[j].value);
      }
      row = slideRight(row);
      let result = combineDown(row, score);
      row = result.row;
      score = result.score;
      row = slideRight(row);
      for (
        let j = i, k = 0;
        j < cells.length && k < row.length;
        j += gridSize, k++
      ) {
        cells[j].value = row[k];
      }
    }
    addNumber();
    updateBoard();

    canUndo = true;
  }

  function combineLeft(row, score) {
    for (let i = 0; i <= 2; i++) {
      let a = row[i];
      let b = row[i + 1];
      if (a === b) {
        row[i] = a + b;
        score += row[i];
        row[i + 1] = 0;
      }
    }
    return { row, score };
  }

  function slideLeft(row) {
    if (!Array.isArray(row)) {
      console.error("Ошибка: slideLeft ожидает аргумент типа массив");
      return;
    }
    let arr = row.filter((val) => val);
    let missing = gridSize * gridSize - arr.length;
    let zeros = Array(missing).fill(0);
    arr = arr.concat(zeros);
    return arr;
  }

  function updateBoard() {
    for (let i = 0; i < gridSize * gridSize; i++) {
      let cell = cells[i];

      if (cell.value === 0) {
        cell.element.innerHTML = "";
      } else {
        cell.element.innerHTML = cell.value;
      }
      cell.element.className = "grid-cell";
      if (cell.value) {
        cell.element.classList.add("grid-cell-" + cell.value);
      }
      if (cell.value > 2048) {
        cell.element.classList.add("grid-cell-super");
      }
    }
    updateScore();
    checkForWin();
  }

  function updateScore() {
    scoreText.innerText = score;
    savesScoretoServer(score);
  }

  function closedMenu() {
    menu.classList.add("visibility-hidden");
  }

  function openedMenu(params) {
    menu.classList.remove("visibility-hidden");
  }

  createGrid();

  gridContainer.addEventListener("touchstart", function (event) {
    touchStart.x = event.touches[0].clientX;
    touchStart.y = event.touches[0].clientY;
  });

  gridContainer.addEventListener("touchmove", function (event) {
    if (!touchStart.x || !touchStart.y) {
      return;
    }
    let touchEndX = event.touches[0].clientX;
    let touchEndY = event.touches[0].clientY;
    let dx = touchEndX - touchStart.x;
    let dy = touchEndY - touchStart.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) {
        moveRight();
        console.log("moveRight");
      } else {
        moveLeft();
        console.log("moveLeft");
      }
    } else {
      if (dy > 0) {
        moveDown();
        console.log("moveDown");
      } else {
        moveUp();
        console.log("moveUp");
      }
    }
    touchStart.x = null;
    touchStart.y = null;
  });

  gridContainer.addEventListener("touchend", function () {
    touchStart.x = null;
    touchStart.y = null;
  });

  newGameButtonWin.addEventListener("click", newGame);
  newGameButton.addEventListener("click", newGame);
  document.addEventListener("keyup", handleKeyUp);
  returnButton.addEventListener("click", function () {
    undoMove();
    console.log("returnButton");
    ysdk.adv.showFullscreenAdv();
  });

  closeButton.addEventListener("click", function () {
    resizeGrid(4);
    closedMenu();
  });

  menuButton.addEventListener("click", function () {
    openedMenu();
  });

  fieldButton8x8.addEventListener("click", function () {
    resizeGrid(8);
    closedMenu();
  });

  fieldButton6x6.addEventListener("click", function () {
    resizeGrid(6);
    closedMenu();
  });

  fieldButton5x5.addEventListener("click", function () {
    resizeGrid(5);
    closedMenu();
  });

  fieldButton4x4.addEventListener("click", function () {
    resizeGrid(4);
    closedMenu();
  });

  recordsButton.addEventListener("click", function () {
    recordsModal.classList.add("show-standings");
    document.body.classList.add("standings-open");
    storage(storageCallback);
  });

  standingsCloseButton.addEventListener("click", function () {
    recordsModal.classList.remove("show-standings");
    document.body.classList.remove("standings-open");
  });
});
