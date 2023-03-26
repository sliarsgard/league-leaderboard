export type Role = 'top'|'jng'|'mid'|'bot'|'sup'

export interface GameDataInput {
    players: PlayerGameDataProp[]
    bans: {
        "blue": string[]
        "red": string
    }
}

export interface PlayerGameDataInput {
    name: string
    champion: string
    team: 'blue' | 'red'
    role: Role
    k: number
    d: number
    a: number
}

export interface PlayerGameDataProp extends PlayerGameDataInput {
    won: boolean
}

export interface PlayerGameData extends PlayerGameDataProp {
    prevElo: number
    eloChange: number
}

export interface Player {
    name: string
    elo: number
    w: number
    l: number
}

export interface Game {
    bans: {
        blue: string[]
        red: string[]
    }
    players: PlayerGameData[]
}