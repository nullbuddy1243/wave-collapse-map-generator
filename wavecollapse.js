// wave function collapse 
// random generator 

const Table = require('cli-table3')

const tableChars = {
    'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
    , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
    , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
    , 'right': '║', 'right-mid': '╢', 'middle': '│'
}

const tiles = ['river', 'hill', 'mountain', 'plain', 'valley']

const border = {
    river: {
        borderOkay: ['river', 'plain', 'valley', 'hill'],
    },
    hill: {
        borderOkay: ['hill', 'plain', 'mountain'],
    },
    mountain: {
        borderOkay: ['hill', 'mountain', 'valley'],
    },
    plain: {
        borderOkay: ['plain', 'river',],
    },
    valley: {
        borderOkay: ['mountain', 'river', 'plain'],
    },
}

// https://symbl.cc/
// https://unicode-explorer.com/

// 🔻 🏕️  🟩
// village: '🛖',
// ruin: '🗿',

const symb = {
    mountain: '⛰',
    hill: '🏕️',
    river: '💧',
    plain: '🌾',
    valley: '🔻',
}

const symbolToName = {
    "⛰": 'mountain',
    "🏕️": 'hill',
    "💧": 'river',
    "🌾": 'plain',
    "🔻": 'valley',
}

const w = 5;
const h = 5;

let grid = []
let gridTileNames = []

let table = new Table({
    chars: tableChars,
})

const initGrid = () => {
    // todo
    // put nested loops below in here 
    // return [grid, gridTileNames, table]
    return [0, 1, 2]
}

let [grid2, gridTileNames2, table2] = initGrid()

for (let i = 0; i < h; i++) {
    grid.push([])
    gridTileNames.push([])
    // console.log("i ", i, " ", grid);
    for (let y = 0; y < w; y++) {
        // console.log("y ", y, " ", grid[i]);
        grid[i].push(undefined)
        gridTileNames[i].push(undefined)

    }
    table.push(grid[i])
}

// console.log(grid);
console.log("Empty Map:\n")
console.log(table.toString())

let x = Math.floor(Math.random() * w)
let y = Math.floor(Math.random() * h)

const randTile = () => {
    return tiles[Math.floor(Math.random() * tiles.length)]
}

const randTileSymbol = () => {
    return symb[tiles[Math.floor(Math.random() * tiles.length)]]
}

const tileToSymbol = (tileName) => {
    return symb[tileName]
}

const symbolToTitle = (symbol) => {
    return symbolToName[symbol]
}

grid[x][y] = randTileSymbol()
gridTileNames[x][y] = symbolToTitle(grid[x][y])

// console.log(grid[x])
// console.log(gridTileNames[x])

// console.log(grid)
// console.log(gridTileNames)

// const getNeighbors = (x, y) => {
const getNeighbors = (y, x) => {
    let right = null;
    let down = null;
    let left = null;
    let up = null;

    if (x + 1 < w) right = grid[y][x+1];
    if (y + 1 < h) down = grid[y+1][x];
    if (x - 1 >= 0) left = grid[y][x-1];
    if (y - 1 >= 0) up = grid[y-1][x];

    const neighbors = {
        right: right,
        down: down,
        left: left,
        up: up
    }
    console.log(`y=${y} x=${x}`)
    console.log(neighbors)
    return neighbors;
}

const genValidTile = (neighbors) => {
    // console.log(`-- genValidTile --`)
    // we're going to filter the arrays under each border key for tiles that have all the neighbors as option
    const neighborsToConsider = []
    for (let [nKey, nValue] of Object.entries(neighbors)) {
        if (nValue != null) {
            neighborsToConsider.push({ [nKey]: nValue })
        } else {
            continue;
        }
    }
    console.log(`///`);
    console.log(neighborsToConsider);
    const neighborConsiderTileNames = neighborsToConsider.map(ntc => symbolToTitle(Object.values(ntc)))
    // console.log(neighborConsiderTileNames);
    // console.log(`///`);
    const result = Object.keys(border).filter(key => {
        let validTilesForKey = border[key].borderOkay;
        let checker = (validTilesForKey, neighborConsiderTileNames) => neighborConsiderTileNames.every(neighbor => validTilesForKey.includes(neighbor))
        let check = checker(validTilesForKey, neighborConsiderTileNames)
        // console.log(`tile key = `, key, ` validTilesForKey `, validTilesForKey)
        // console.log(`check= `, check )
        if (check == true) return key
    })

    console.log(`genValidTile result = `, result)
    return result;
}

const fillNeighbor = (x, y) => {
    console.log([x, y]);
    const pos = grid[x][y];
    const posName = symbolToName[pos]
    console.log((x, y));
    console.log({
        pos: pos,
        posName: posName
    })
    const coords = {
        right: [x + 1, y],
        down: [x, y - 1],
        left: [x - 1, y],
        up: [x, y + 1],
    }
    console.log(symb[posName])
    console.log(`filling position: `, [x, y], ` `, symb[posName] + posName + symb[posName], `neighbor coords: `, coords);
    const selectNeighbor = (potentials) => {
        return potentials[Math.floor(Math.random() * potentials.length)]
    }
    const neighbors = {
        right: selectNeighbor(border[posName].borderOkay),
        down: selectNeighbor(border[posName].borderOkay),
        left: selectNeighbor(border[posName].borderOkay),
        up: selectNeighbor(border[posName].borderOkay),
    }
    console.log(`== fillNeighbor(${x}, ${y}) ==`);
    console.log(`neighbors: `, neighbors);
    const neighborsymb = {
        right: symb[neighbors.right],
        down: symb[neighbors.down],
        left: symb[neighbors.left],
        up: symb[neighbors.up]
    }
    console.log(`neighborsymb: `, neighborsymb)
    console.log("\n===\n");

    console.log(`modifying grid with neighbors`);

    for (let n of Object.entries(neighbors)) {
        const nCoord = coords[n[0]]
        const [nX, nY] = [nCoord[0], nCoord[1]]

        console.log({
            key: n[0],
            val: n[1],
            nCoord: nCoord,
            nX: nX,
            nY: nY,
        })

        if (nX >= 0 && nY >= 0 && nX <= w - 1 && nY <= h - 1) {
            console.log(`valid nCoord [nX,nY] `, nCoord);

            if (grid[nX][nY] == undefined) {
                grid[nX][nY] = neighborsymb[n[0]]
            } else {
                console.log(` skip[${nX} ${nY}] already filled! `)
            }
            if (gridTileNames[nX][nY] == undefined) {
                gridTileNames[nX][nY] = neighbors[n[0]]
            } else { }

        } else {
            console.log(`!!! invalid nCoord !!!`);
            console.log(` nX = ${nX} w = ${w} `)
            console.log(` nY = ${nY} h = ${h} `)
        }

    }

    console.log(`== fillNeighbors(${x}, ${y}) done ==`);
    const tableFilled = new Table({ chars: tableChars })
    for (let row of grid) {
        // console.log(`--- `, row)
        tableFilled.push(row)
    }
    console.log(tableFilled.toString())
    // console.log(grid)

    console.log(`===*===`)
    console.log(`===*===`)
}

fillNeighbor(x, y)


// console.log(grid)

// random fill 

// for (let i = 0; i < 50; i++) {
//     let xx = Math.floor(Math.random() * w)
//     let yy = Math.floor(Math.random() * h)

//     if (grid[xx][yy] == undefined && gridTileNames[xx][yy] == undefined) {
//         grid[xx][yy] = randTileSymbol();
//         gridTileNames[xx][yy] = symbolToTitle(grid[xx][yy])
//     } else {
//         console.log(`skipping [${xx},${yy}] bc it's ${grid[xx][yy]}`)

//     }

//     fillNeighbor(xx,yy)
//     console.log(`__--==*==--__`)
//     console.log(`__--==*==--__`)
// }




const logTable = () => {
    const tableFilled = new Table({ chars: tableChars })
    for (let row of grid) {
        // console.log(`--- `, row)
        tableFilled.push(row)
    }
    console.log(tableFilled.toString())
}

console.log(`before row by row fill`)
logTable()

// row by row smart fill
// fills in from first row to last, cell by cell
// looks at neighbors of each cell and figures out what cells are valid given neighbors
// picks one of the valid neighbors using genValidTile(cell_neighbors)

let row_inc = 0;
let cell_inc = 0;
for (let row of grid) {
    console.log(`== row: ${row_inc} ==`)
    cell_inc = 0;
    // rows 
    for (let c of row) {
        if (c != undefined) {
            console.log(`row: ${row_inc} cell: ${cell_inc} -> ${c}`);
        } else {
            console.log(`row: ${row_inc} cell: ${cell_inc} -> ${c}`);
            console.log(`need to fill [${row_inc} , ${cell_inc}]`);
            const cell_neighbors = getNeighbors(row_inc, cell_inc)
            console.log(`neighbors: `, cell_neighbors);
            const validTiles = genValidTile(cell_neighbors)
            console.log(validTiles)
            const tileChoice = validTiles[Math.floor(Math.random() * validTiles.length)]
            console.log(`chose to fill with `, tileChoice);
            gridTileNames[row_inc][cell_inc] = tileChoice;
            grid[row_inc][cell_inc] = tileToSymbol(tileChoice);
        }
        cell_inc++;
    }
    row_inc++;
    logTable()
}

console.log(`final: `)

logTable()





