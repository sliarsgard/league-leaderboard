export interface PlayerGameData {
    name: string
    champion: string
    k: string
    d: string
    a: string
    eloChange?: number
}

export interface Player {
    name: string
    elo: number
    w: number
    l: number
}

export interface Game {
    winningTeam: PlayerGameData[]
    losingTeam: PlayerGameData[]
}