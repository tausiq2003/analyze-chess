import { Chess } from "chess.js";
const chess = new Chess();

const pgn = `[Event "Live Chess"]
[Site "Chess.com"]
[Date "2025.02.05"]
[White "utkdalby"]
[Result "0-1"]
[ECO "C41"]
[TimeControl "600"]
[EndTime "6:40:56 GMT+0000"]
[Termination "tausiqsamantaray won by resignation"]
[SetUp "1"]
[FEN "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"]

1. e4 e5 2. Nf3 d6 3. Nc3 Nf6 4. Bc4 Nc6 5. Ng5 d5 6. exd5 Nd4 7. d6 Be6 8. Qe2 Nxe2 9. Kxe2 Bxc4+ 0-1`;

chess.loadPgn(pgn);

console.log(chess.history().length); // gives the total number of moves played
console.log(chess.turn());
const chess2 = new Chess(chess.fen());
console.log(chess2.isDraw());
console.log(chess2.isCheckmate());
console.log(chess2.inCheck());
