const stockfish = new Worker("stockfish.js");

function sendCommand(command) {
    stockfish.postMessage(command);
}

let currentIndex = 0;
let evaluating = false;
const results = [];
let currentResult = null;

const fenList = [
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0",
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
    "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKB1R w KQkq - 1 2",
    "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
    "rnbqkbnr/ppp2ppp/3p4/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3",
    "rnbqkbnr/ppp2ppp/3p4/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R b KQkq - 1 3",
    "rnbqkb1r/ppp2ppp/3p1n2/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 2 4",
    "rnbqkb1r/ppp2ppp/3p1n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R b KQkq - 3 4",
    "r1bqkb1r/ppp2ppp/2np1n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 5",
    "r1bqkb1r/ppp2ppp/2np1n2/4p1N1/2B1P3/2N5/PPPP1PPP/R1BQK2R b KQkq - 5 5",
];

function startEngine(event) {
    const message = event.data;

    if (message === "uciok") {
        sendCommand("isready");
    } else if (message === "readyok") {
        console.log("Stockfish is ready");
        evaluateNext();
    } else if (message.includes("readyok")) {
        throw new Error("FUCKED UP");
    } else {
        handleAnalysisMessage(message);
    }
}

function evaluateNext() {
    if (currentIndex >= fenList.length) {
        console.log("All positions analyzed:", results);
        return;
    }

    const fen = fenList[currentIndex];
    evaluating = true;
    currentResult = {
        fen,
        info: null,
        bestmove: null,
    };

    sendCommand(`position fen ${fen}`);
    sendCommand(`go depth 15`);
}

function handleAnalysisMessage(message) {
    if (!evaluating || !currentResult) return;

    if (message.startsWith("info depth 15")) {
        currentResult.info = message; // Save the info line
    }

    if (message.startsWith("bestmove")) {
        currentResult.bestmove = message.split(" ")[1];
        results.push(currentResult);
        currentResult = null;
        evaluating = false;
        currentIndex++;
        evaluateNext();
    }
}
function sendCommand(cmd) {
    stockfish.postMessage(cmd);
}

stockfish.onmessage = startEngine;
sendCommand("uci");
