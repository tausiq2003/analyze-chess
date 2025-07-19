## Chess-Analyze

#### Description
A chess analysis tool that uses Stockfish to analyze chess games and positions. It provides a simple web interface to input PGN string or game links (chesscom and lichess) and analyzes the game using [stockfish.js](https://github.com/nmrugg/stockfish.js). 

#### Features
- Analyze chess games using Stockfish.
- Uses [lichess's lila](https://github.com/lichess-org/lila) features to calculate game's win percentage, accuracy, estimated elo.
- Shows graph of the game with eval and mate.
- Shows the classifications of the game using this [source](https://support.chess.com/en/articles/8572705-how-are-moves-classified-what-is-a-blunder-or-brilliant-etc).

#### How it works
- Read here [how it works](https://publish.tausiqsama.me/arch/chess-analyze).

#### Usage
- Demo is being showed in this [video](https://www.youtube.com/watch?v=P0t1GLgNMKk)
- How to get PGN and game links, see this [video](https://www.youtube.com/watch?v=DDkTX70ERSA).

#### Installation

The application is built using Next.js, so you need to have Node.js installed on your machine.

1. Clone the repository:
   ```bash
   git clone https://github.com/tausiq2003/analyze-chess.git
   ```
2. Navigate to the project directory:
   ```bash
   cd analyze-chess
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
#### Contribution
Feel free to contribute to the project by opening issues or pull requests. Your contributions are welcome!
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Do your work.
4.Run the linter:
    ```bash
    npm run lint
    ```
5. Commit your changes and open a pr.

#### Inspiration
Special thanks/shoutout to: 
- https://www.reddit.com/r/ComputerChess/comments/1j85i6s/how_chesscom_classifies_moves/
- https://github.com/WintrCat/freechess (Inspiration for the UI)
- https://github.com/GuillaumeSD/Chesskit (Inspiration for the estimate elo and accuracy)

Enjoy :)
