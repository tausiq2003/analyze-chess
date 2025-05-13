importScripts("/stockfish.js");

const engine = Stockfish();

onmessage = function (e) {
    engine.postMessage(e.data);
};

engine.onmessage = function (event) {
    postMessage(event.data);
};
