

export interface Player {
    name: string
    points: number
    games: number
}

const createPlayer = (name: string, points: number, games: number) => {
    const player: Player = {
        name,
        points,
        games
    }
    return player
}

export {
    createPlayer
}