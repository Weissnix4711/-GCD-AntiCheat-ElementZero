export var iacConfig = {
    debugMode: false,
    showHealthOnActionbar: 0,
    maxAfkTimeInTicks: 12000,
    maxFlyTime: 300,
    maxAPPSExtent: 30,
    maxTimesFlagged: 5,
    maxReach: 5.1,
    maxDPPSExtent: 20,
    intervalTime: 10 //Leave at 1
}

export var iacMsg = {
    nuker:`§cYou have been kicked for Cheating/Nuker - Block Cheat. If you keep doing so, you may get banned.§r If you believe this is an error, contact the server administrators.`,
    afk:`You have been idle for more than ${iacConfig.maxAfkTimeInTicks/60/20} minutes. §7§oDon't worry, you will not be banned or punished any further§r.`,
    reach:"§cYou have been kicked for Cheating/Reach. If you keep doing so, you may get banned.§r If you believe this is an error, contact the server administrators.",
    fly:"§cYou have been kicked for Cheating/Fly. If you keep doing so, you may get banned.§r If you believe this is an error, contact the server administrators.",
    spawnitem:"§cYou have been kicked for Cheating/Spawning Items. If you keep doing so, you may get banned.§r If you believe this is an error, contact the server administrators.",
    macro:"§cYou have been kicked for Cheating/Killaura:AutoClicker. If you keep doing so, you may get banned.§r If you believe this is an error, contact the server administrators."
}

export var iacIllegalItems = [
    "glowingobsidian",
    "invisiblebedrock",
    "bedrock",
    "netherreactor",
    "barrier",
    "light_block",
    "structure_block",
    "command_block",
    "structure_void",
    "spawn_egg",
    "underwater_torch",
    "lit_furnace",
    "reserved6"
]

export var iacClipBlocks = ["stone", "iron_ore", "coal_ore", "bedrock", "dirt", "grass", "diamond_ore", "quartz_block", "planks", "wood", "log", "log2", "command_block", "repeating_command_block", "chain_command_block"]