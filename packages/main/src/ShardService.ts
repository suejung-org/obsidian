import type { IShardEntry } from "./types.js";

/** @type {Map<number, import("obsidian-main").IShardEntry>} */
const shards: Map<number, IShardEntry> = new Map();

class ShardEntry {
  id: number;
  name: string;
  description: string;
  loginServerIP: string;
  loginServerPort: number;
  lobbyServerIP: string;
  lobbyServerPort: number;
  mcotsServerIP: string;
  statusId: number;
  statusReason: string;
  serverGroupName: string;
  population: number;
  maxPersonasPerUser: number;
  diagServerIP: string;
  diagServerPort: number;
  /**
   * @param {object} values
   * @param {number} values.id
   * @param {string} values.name
   * @param {string} values.description
   * @param {string} values.loginServerIP
   * @param {number} [values.loginServerPort]
   * @param {string} values.lobbyServerIP
   * @param {number} [values.lobbyServerPort]
   * @param {string} values.mcotsServerIP
   * @param {number} [values.statusId]
   * @param {string} [values.statusReason]
   * @param {string} values.serverGroupName
   * @param {number} [values.population]
   * @param {number} [values.maxPersonasPerUser]
   * @param {string} values.diagServerIP
   * @param {number} [values.diagServerPort]
   */
  constructor({
    id,
    name,
    description,
    loginServerIP,
    loginServerPort = 8226,
    lobbyServerIP,
    lobbyServerPort = 7003,
    mcotsServerIP,
    statusId = 0,
    statusReason = "",
    serverGroupName: serverGroupsName,
    population = 0,
    maxPersonasPerUser = 1,
    diagServerIP,
    diagServerPort = 80,
  }: {
    id: number;
    name: string;
    description: string;
    loginServerIP: string;
    loginServerPort?: number;
    lobbyServerIP: string;
    lobbyServerPort?: number;
    mcotsServerIP: string;
    statusId?: number;
    statusReason?: string;
    serverGroupName: string;
    population?: number;
    maxPersonasPerUser?: number;
    diagServerIP: string;
    diagServerPort?: number;
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.loginServerIP = loginServerIP;
    this.loginServerPort = loginServerPort;
    this.lobbyServerIP = lobbyServerIP;
    this.lobbyServerPort = lobbyServerPort;
    this.mcotsServerIP = mcotsServerIP;
    this.statusId = statusId;
    this.statusReason = statusReason;
    this.serverGroupName = serverGroupsName;
    this.population = population;
    this.maxPersonasPerUser = maxPersonasPerUser;
    this.diagServerIP = diagServerIP;
    this.diagServerPort = diagServerPort;
  }

  /**
   *
   * @param {number} population
   */
  setPopulation(population: number) {
    this.population = population;
  }

  /**
   * @returns {string}
   */
  formatForWeb(): string {
    return (
      `[${this.name}]\n` +
      `\tDescription=${this.id}\n` +
      `\tShardId=${this.id}\n` +
      `\tLoginServerIP=${this.loginServerIP}\n` +
      `\tLoginServerPort=${this.loginServerPort}\n` +
      `\tLobbyServerIP=${this.lobbyServerIP}\n` +
      `\tLobbyServerPort=${this.lobbyServerPort}\n` +
      `\tMCOTSServerIP=${this.mcotsServerIP}\n` +
      `\tStatusId=${this.statusId}\n` +
      `\tStatus_Reason=${this.statusReason}\n` +
      `\tServerGroup_Name=${this.serverGroupName}\n` +
      `\tPopulation=${this.population}\n` +
      `\tMaxPersonasPerUser=${this.maxPersonasPerUser}\n` +
      `\tDiagnosticServerHost=${this.diagServerIP}\n` +
      `\tDiagnosticServerPort=${this.diagServerPort}\n`
    );
  }
}

export class ShardService {
  /**
   *
   * @param {number} id
   * @param {string} name
   * @param {string} description
   * @param {string} ip
   * @param {string} serverGroupName
   */
  addShard(
    id: number,
    name: string,
    description: string,
    ip: string,
    serverGroupName: string,
  ) {
    shards.set(
      id,
      new ShardEntry({
        id,
        name,
        description,
        loginServerIP: ip,
        lobbyServerIP: ip,
        serverGroupName,
        mcotsServerIP: ip,
        diagServerIP: ip,
      }),
    );
  }

  /**
   * @returns {string}
   */
  getShardList(): string {
    return Array.from(shards.values())
      .map((entry) => entry.formatForWeb())
      .join("\n\n");
  }
}
