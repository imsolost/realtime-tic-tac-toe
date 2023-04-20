export const board = [
   {
     "_id":"0",
     "piece":""
   },
   {
     "_id":"1",
     "piece":""
   },
   {
     "_id":"2",
     "piece":""
   },
   {
     "_id":"3",
     "piece":""
   },
   {
     "_id":"4",
     "piece":""
   },
   {
     "_id":"5",
     "piece":""
   },
   {
     "_id":"6",
     "piece":""
   },
   {
     "_id":"7",
     "piece":""
   },
   {
     "_id":"8",
     "piece":""
   }
];

export const calculateWinner = (squares) => {
 const lines = [
   [0, 1, 2],
   [3, 4, 5],
   [6, 7, 8],
   [0, 3, 6],
   [1, 4, 7],
   [2, 5, 8],
   [0, 4, 8],
   [2, 4, 6],
 ];
 for (let i = 0; i < lines.length; i++) {
   const [a, b, c] = lines[i];
   if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
     return squares[a];
   }
 }
 return null;
}

export const squarify = (array) => { return array.map(({ piece }) => piece) }
