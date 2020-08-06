/*
Made by Imrglop#9295
imrglopyt.000webhostapp.com

Edit and improvement for EZ by Weissnix4711
v0.2
*/

//=============
//== IMPORTS ==
//=============

import {
    iacConfig,
    iacMsg,
    iacIllegalItems,
    iacClipBlocks
} from "./iacConfig.js";

let system = server.registerSystem(0, 0);

if (iacConfig.debugMode) {
    console.log("IAC: Debug mode enabled.")
}

//===============
//== FUNCTIONS ==
//===============

//Custom execute function to provide error handling
function execute(command) {
    function commandCallBack(commandResults) {
        //todo: error logging
    } 
    system.executeCommand(command, (commandResults) => commandCallBack(commandResults));
}

//Debug log
function logDebug(log) {
    if (iacConfig.debugMode) {
        console.log(`IAC (debug): ${log}`);
    }
}

//==========
//== MAIN ==
//==========

//INTERACT WITH ITEM - ILLEGALS
system.listenForEvent("minecraft:entity_use_item", function(eventData) {
    logDebug(`IAC: Player used item: `+ JSON.stringify(eventData.data, null, " "))
    for (let i=0; i < iacIllegalItems.length; i++) {
        if (eventData.data.item_stack.item === "minecraft:"+iacIllegalItems[i]) {
            var pos = system.getComponent(eventData.data.entity, "minecraft:position").data
            execute(`execute @p[x=${pos.x}, y=${pos.y}, z=${pos.z}] ~ ~ ~ execute @s[tag=!staff] ~ ~ ~ clear @p`)
            execute(`execute @p[x=${pos.x}, y=${pos.y}, z=${pos.z}] ~ ~ ~ execute @s ~ ~ ~ tell @a[tag=staff] §r@s[r=10000] §eused an illegal item (minecraft:${iacIllegalItems[i]}).§r`)
            execute(`execute @p[x=${pos.x}, y=${pos.y}, z=${pos.z}] ~ ~ ~ execute @s[tag=!staff] ~ ~ ~ scoreboard players add @s timesflagged 1`)
            execute(`execute @p[x=${pos.x}, y=${pos.y}, z=${pos.z}] ~ ~ ~ execute @s[tag=!staff] ~ ~ ~ kick @s ${iacMsg.spawnitem}`)
        }
    }
})

// Anti Reach
// iacConfig.max client side reach is 3 excluding latency
let currentTick = 0;

system.listenForEvent("minecraft:player_destroyed_block", function(eventData) {
    let pos = system.getComponent(eventData.data.player, "minecraft:position").data;
    execute(`scoreboard players add @p[x=${(pos.x).toString()}, y=${(pos.y).toString()}, z=${(pos.z).toString()}] DPPS 1`)
});

system.listenForEvent("minecraft:player_attacked_entity", function(eventData) {
    if (eventData.data.attacked_entity) {
        //Do not flag if ender dragon
        if (eventData.data.attacked_entity.__identifier__ === "minecraft:ender_dragon") {return false}

        logDebug(JSON.stringify(eventData.data.attacked_entity.__unique_id__));

        let attackedpos = system.getComponent(eventData.data.attacked_entity, "minecraft:position").data;
        let attackerpos = system.getComponent(eventData.data.player, "minecraft:position").data;
		if (system.getComponent(eventData.data.attacked_entity, "minecraft:position") === null || system.getComponent(eventData.data.player, "minecraft:position") === null) {return}

        let attackerhealth = system.getComponent(eventData.data.player, "minecraft:health").data;
        let attackedhealth = system.getComponent(eventData.data.attacked_entity, "minecraft:health").data;
		if (system.getComponent(eventData.data.attacked_entity, "minecraft:health") === null || system.getComponent(eventData.data.player, "minecraft:health") === null) {return}

        if (attackedpos != null) {
        let distX = (Math.abs(attackedpos.x - attackerpos.x))
        let distY = (Math.abs(attackedpos.y - attackerpos.y))
        let distZ = (Math.abs(attackedpos.z - attackerpos.z))

        logDebug(`${distX.toString()} ${distY.toString()} ${distZ.toString()}`);

        if (attackedhealth.value != null) {
            if (iacConfig.showHealthOnActionbar == 1) {
                execute(`title @p[x=${(attackerpos.x).toString()}, y=${(attackerpos.y).toString()}, z=${(attackerpos.z).toString()}] actionbar §cHealth: ${(attackedhealth.value).toString()} / ${attackedhealth.max}`)
            }
        }
        function test(results) {

        }
        system.executeCommand(`scoreboard players add @p[x=${(attackerpos.x).toString()}, y=${(attackerpos.y).toString()}, z=${(attackerpos.z).toString()}] APPS 1`, (commandResults) => test(commandResults))

        logDebug("reach: "+reach.toString()+" iacConfig.maxreach:"+iacConfig.maxreach.toString());

        if (distX >= iacConfig.maxreach || distZ >= iacConfig.maxreach) {
            function commandCallBack(commandResults) {
            }

            execute(`tell @a[tag=staff] §r@p[x=${(attackerpos.x).toString()}, y=${(attackerpos.y).toString()}, z=${(attackerpos.z).toString()}] §cwas flagged for Reach hacks.§r`)
            system.executeCommand(`execute @p[x=${(attackerpos.x).toString()}, y=${(attackerpos.y).toString()}, z=${(attackerpos.z).toString()}] ~ ~ ~ kick @s[tag=!staff] §cKicked by Console: ${iacMsg.reach}`, (commandResults) => commandCallBack(commandResults))
        }
    }
    }
})

//SYSTEM UPDATE
let interval = setInterval(() => {
    if (currentTick === 0) {
        execute(`scoreboard objectives add GCD dummy GamingChairDebuff`)
        execute(`scoreboard objectives add flytime dummy FlightTime`)
        //execute(`scoreboard players set config.maxreach GCD 5`)
        execute(`scoreboard objectives add afktime dummy TimeNotMoving`)
        execute(`scoreboard players set flytime GCD 225`)
        execute(`scoreboard objectives add APPS dummy AttackPackets`)
        execute(`scoreboard players set afktime GCD 12000`)
        execute("scoreboard players add showhealth GCD 0")
        execute(`scoreboard objectives add timesflagged dummy TimesFlagged`)
        execute(`scoreboard players add maxtimesflagged GCD 0`)
        execute(`scoreboard objectives add DPPS dummy DestroyPackets`)
        execute(`scoreboard playres add nukerinterval GCD 0`)
    }

    for (var i = 0; i < iacClipBlocks.length; i++) {
        execute(`execute @a[tag=!staff] ~ ~ ~ detect ~ ~1 ~ ${iacClipBlocks[i]} -1 tell @a[tag=staff] §r@s[r=1000] §eis possibly using No-Clip (Clipped through block §aminecraft:${iacClipBlocks[i]}).`)
        execute(`execute @a[tag=!staff] ~ ~ ~ detect ~ ~ ~ ${iacClipBlocks[i]} -1 tell @a[tag=staff] §r@s[r=1000] §eis possibly using No-Clip (Clipped through block §aminecraft:${iacClipBlocks[i]}).`)
        execute(`execute @a[tag=!staff] ~ ~ ~ detect ~ ~1 ~ ${iacClipBlocks[i]} -1 effect @p instant_damage 1 0 true`)
        execute(`execute @a[tag=!staff] ~ ~ ~ detect ~ ~ ~ ${iacClipBlocks[i]} -1 effect @p instant_damage 1 0 true`)
        execute(`execute @a[tag=!staff] ~ ~ ~ detect ~ ~1 ~ ${iacClipBlocks[i]} -1 spreadplayers ~ ~ 0 1 @s`)
        execute(`execute @a[tag=!staff] ~ ~ ~ detect ~ ~ ~ ${iacClipBlocks[i]} -1 spreadplayers ~ ~ 0 1 @s`)
    }

    execute(`scoreboard players add flytime GCD 0`)
    
    function cmdCallback(results) {
        // statusMessage
        let statusMessage = results.data.statusMessage
        let subbed = (statusMessage.split(" "))
        iacConfig.maxFlyTime = Number(subbed[1])
        //execute(`title @a actionbar iacConfig.max fly time:${iacConfig.maxFlyTime.toString()}`)
    }
    system.executeCommand("scoreboard players test flytime GCD -2147483648", (commandResults) => cmdCallback(commandResults))

    function setShowHealth(results) {
        // statusMessage
        let statusMessage = results.data.statusMessage
        let subbed = (statusMessage.split(" "))
        iacConfig.showHealthOnActionbar = Number(subbed[1])
    }
    system.executeCommand("scoreboard players test showhealth GCD -2147483648", (commandResults) => setShowHealth(commandResults))

    function maxTimesFlagged(results) {
        // statusMessage
        let statusMessage = results.data.statusMessage
        let subbed = (statusMessage.split(" "))
        if (Number(subbed[1]) != null) {
            if (Number(subbed[1]) != 0) {
                iacConfig.maxTimesFlagged = Number(subbed[1])
            }
        }
    }
    system.executeCommand("scoreboard players test maxtimesflagged GCD -2147483648", (commandResults) => maxTimesFlagged(commandResults))

    /*
    function maxDPPS(results) {
        statusMessage
        let statusMessage = results.data.statusMessage
        let subbed = (statusMessage.split(" "))

        if (Number(subbed[1]) != null) {
            if (Number(subbed[1]) != 0) {
                iacConfig.maxDPPSExtent = Number(subbed[1])
            }
        }
    }
    system.executeCommand("scoreboard players test nukerinterval GCD -2147483648", (commandResults) => maxDPPS(commandResults))
    */

    //ILLEGAL
    for (let i=0; i < iacIllegalItems.length; i++) {
        execute(`clear @a ${iacIllegalItems[i]}`);
    }

    // FLYHACK
    execute(`execute @a[scores={flytime=${iacConfig.maxFlyTime}..}, tag=!staff] ~ ~ ~ tell @a[tag=staff] §e@s[tag=!staff] was flagged for flight, therefore they are kicked.`)
    execute(`scoreboard players set @a[scores={flytime=${iacConfig.maxFlyTime}..}, tag=!staff] flytime -333`)
    execute(`scoreboard players add @a[scores={flytime=-333}, tag=!staff] timesflagged 1`)
    execute(`kick @a[scores={flytime=-333}, tag=!staff] ${iacMsg.fly}`)
    execute(`scoreboard players add @a timesflagged 0`)
    execute(`scoreboard players add @a flytime 0`)

    // AFKTIME
    execute(`execute @a ~ ~ ~ execute @s[r=0.1] ~ ~ ~ scoreboard players add @s afktime 2`)
    execute(`tag @a remove notmoving`)
    execute(`execute @a ~ ~ ~ execute @s[r=0.1] ~ ~ ~ tag @s add notmoving`)
    execute(`scoreboard players remove @a afktime 1`)
    execute(`execute @a ~ ~ ~ execute @s[tag=!notmoving] ~ ~ ~ scoreboard players reset @s afktime`)
    execute(`execute @a[scores={afktime=${iacConfig.maxAfkTimeInTicks}..}] ~ ~ ~ scoreboard players set @s afktime -301`)
    execute(`kick @a[scores={afktime=-301}] ${iacMsg.afk}`)

    if (currentTick % 30 === 0) {
        execute(`execute @a[scores={flytime=${Math.floor(iacConfig.maxFlyTime*0.60).toString()}..}] ~ ~ ~ execute @s ~ ~ ~ detect ~-1 ~-1 ~1 air 0 execute @s ~ ~ ~ detect ~ ~-1 ~-1 air 0 execute @s ~ ~ ~ detect ~-1 ~-1 ~ air 0 execute @s ~ ~-1 ~ detect ~1 ~-1 ~1 air 0 execute @s ~ ~ ~ detect ~1 ~-1 ~ air 0 execute @s ~ ~ ~ detect ~ ~-1 ~1 air 0 execute @s ~ ~ ~ detect ~-1 ~-1 ~-1 air 0 execute @s ~ ~ ~ detect ~1 ~-1 ~-1 air 0 execute @s ~ ~ ~ detect ~ ~-1 ~ air 0 tell @a[tag=staff] §6[GCD]§e @s[tag=!staff]§c is possibly fly-hacking.§r`)
        execute(`execute @a[scores={flytime=${Math.floor(iacConfig.maxFlyTime*0.60).toString()}..}] ~ ~ ~ execute @s ~ ~ ~ detect ~-1 ~-1 ~1 air 0 execute @s ~ ~ ~ detect ~ ~-1 ~-1 air 0 execute @s ~ ~ ~ detect ~-1 ~-1 ~ air 0 execute @s ~ ~-1 ~ detect ~1 ~-1 ~1 air 0 execute @s ~ ~ ~ detect ~1 ~-1 ~ air 0 execute @s ~ ~ ~ detect ~ ~-1 ~1 air 0 execute @s ~ ~ ~ detect ~-1 ~-1 ~-1 air 0 execute @s ~ ~ ~ detect ~1 ~-1 ~-1 air 0 execute @s ~ ~ ~ detect ~ ~-1 ~ air 0 spreadplayers ~ ~ 0 1 @s`)
    }
    if (currentTick % 8 === 0) {
        execute(`scoreboard players remove @a[scores={flytime=1..}] flytime 1`)
    } else if (currentTick % 2 === 0) {
        execute(`scoreboard players remove @a[scores={APPS=1..}] APPS 1`)
    }

    // KILLAURA
    execute(`scoreboard players add @a[scores={APPS=..-1}] APPS 1`)
    execute(`execute @a[scores={APPS=${iacConfig.maxAPPSExtent}..},tag=!staff] ~ ~ ~ tell @a[tag=staff] §r§e @s §cwas flagged for Killaura.§r`)
    execute(`scoreboard players set @a[scores={APPS=${iacConfig.maxAPPSExtent}..},tag=!staff] APPS -5`)
    execute(`scoreboard players add @a[scores={APPS=-5},tag=!staff] timesflagged 1`)
    execute(`kick @a[scores={APPS=-5},tag=!staff] ${iacMsg.macro}`)

    // NUKER
    execute(`execute @a[scores={DPPS=${iacConfig.maxDPPSExtent}..}] ~ ~ ~ tell @a[tag=staff] §r§e @s §cwas flagged for Nuker.§r`)
    execute(`scoreboard players set @a[scores={DPPS=${iacConfig.maxDPPSExtent}..}] DPPS -5`)
    execute(`scoreboard players add @a[scores={DPPS=-5}] timesflagged 1`)
    execute(`kick @a[scores={DPPS=-5}] ${iacMsg.nuker}`)

    execute(`execute @a ~ ~ ~ execute @s[r=0.1]`)
    execute(`execute @a[tag=!staff] ~ ~ ~ detect ~ ~-2 ~ air 0 execute @s ~ ~ ~ detect ~-1 ~-1 ~1 air 0 execute @s ~ ~ ~ detect ~ ~-1 ~-1 air 0 execute @s ~ ~ ~ detect ~-1 ~-1 ~ air 0 execute @s ~ ~-1 ~ detect ~1 ~-1 ~1 air 0 execute @s ~ ~ ~ detect ~1 ~-1 ~ air 0 execute @s ~ ~ ~ detect ~ ~-1 ~1 air 0 execute @s ~ ~ ~ detect ~-1 ~-1 ~-1 air 0 execute @s ~ ~ ~ detect ~1 ~-1 ~-1 air 0 execute @s ~ ~ ~ detect ~ ~-1 ~ air 0 /scoreboard players add @s flytime 1`)
    execute(`kick @a[tag=GCDBanned] §cYou have been banned from the server.§r`)
    execute(`tell @a[tag=GCDConfig] say GCD Config (/function gcd.help): ${JSON.stringify(iacConfig, null, " ")})`);   
    execute(`tag @a remove GCDConfig`);

    if (currentTick === 10) {
        execute('tellraw @a[tag=staff] {"rawtext":[{"text":"§6[GCD]§r GamingChairDebuff by Imrglop loaded. Do §3/function gcd.help§r for commands. Do /tag <Your Name> add staff to get Admin."}]}');
        execute(`tellraw @a[tag=staff] {"rawtext":[{"text":"§6[GCD]§r GCD Config (settings): ${JSON.stringify(iacConfig, null, " ")}."}]}`)
    }

    execute("scoreboard players add @a[scores={flytime=..-1}] flytime 1");

    currentTick ++;

    //TimesFlagged Kick
    execute(`kick @a[scores={timesflagged=${iacConfig.maxTimesFlagged.toString()}..}, tag=!staff] §4You have been permanently banned for §cCheating§4. Please contact the server administrators to appeal or if you think this is an error.§r`)
    execute(`scoreboard players reset @a DPPS`)
}, iacConfig.intervalTime);

//Log on script load
console.log("iac.js loaded")