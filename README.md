Todos after form validation.

Cool, everything now works, csv and ssv too, now it gets stored at localstorage, after everything is done, remember to add google captcha.

Ok now you have gameInput, option, depth and pgn

- [X] This is after submission of the formData

- [x] Now, we have to convert pgn to fen (really abstraction thing here, should be libraries there), if no libraries then parse it.
Processing in UI/user:  
- [x] Store that fen object in localStorage, in form of object or in form of array.

- [] handle each fen object and send to stockfish, ofc write a program to analyze that, stockfish gives best move and ponder too

- [] Now you have handled each fen(ofc check fen, before analyzing), then store that analyzed thing, primarily in localStorage (first thought), to be checked later, with following doing parallely

- [] calculate eval bar, classification. Classification seems easy, because my GUT feels so. Then, you have to show accuracy of them

- [] calculate accuracy too, google it

- [] so you have to store like this
```
{
    "black": "name",
    "white": "name",
    "black elo": "number",
    "white elo": "number",
    "opening": "name",
    "currentpointer": "number",
    "details": {
        "moves": {
            "1": {
                "fen": "string",
                "best move": "string",
                "ponder move": "String", 
                "classification": "string",
                "evaluation":"+/-number",
                "turn": "b/w",
            }

        }
    }
}

```

- [] calculate the classification total and return a object to store it, like {brilliant: 0, best: 1 } for black and like that
- [] show eval bar, and names in the board, and the response should come that analysis-data
- [] there should be a button below named "Start review"
- [] click on it
- [] eval graph should be on top, don't know how to do it, some graphing libraries in js, lets see

- [] users should be able to click on it and move to a fen, searching, so move number might be associated with it, show dots as brilliant and great and blunder moves

- [] now you have all the classification details
- [] now you have a move list below, more details on this
- [] make the div scrollable
- [] now you have the bottom bar where the curr move is a which classification
- [] now you should have a rotate button, prev, next button.
- [] save button will be added, after mvp is done
- [] now you have arrows, it should be added at first


