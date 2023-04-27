import Router from "next/router";
import { Character, Stat } from "./characterDefs";
import { UpdateFilter } from "mongodb";
import toast from "react-hot-toast";

export function getStatValue(stat: Stat): number {
    let value: number = 0;

    stat.bonuses.forEach(bonus => {
        if(typeof bonus.value === "string") bonus.value = parseInt(bonus.value); 
        value += bonus.value;
    });

    return value;
}

export function formatModifier(modifer: number): string {
    return (modifer >= 0 ? "+" : "") + modifer;
}

export function getStatText(stat: Stat): string {
    const value = getStatValue(stat);

    return formatModifier(value);
}

export function abilityScoreToModifier(stat: Stat): number {
    return Math.floor((getStatValue(stat) - 10) / 2);
}

export function getAbilityScoreModifierText(stat: Stat): string {
    const value = abilityScoreToModifier(stat);

    return formatModifier(value);
}

async function updateInternal(update: Partial<Character> | UpdateFilter<Character>) {
    console.log("Updating... Update:");
    console.log(update);

    const res = await fetch('/api/character/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify({
            characterID: Router.query.id,
            update: update
        })
    });
    
    const data = await res.json();
    console.log("Response:");
    console.log(data);
}

export function update(update: Partial<Character> | UpdateFilter<Character>, reload: boolean = true) {
    toast.promise(updateInternal(update),
    {
        loading: "Updating...",
        success: "Updated!",
        error: "Failed to update."
    }).then(() => {
        if(reload) refresh();
    });
}

export function refresh() {
    console.log("Refreshing...");
    toast.promise(Router.push(Router.asPath),
    {
        loading: "Refreshing...",
        success: "Refreshed!",
        error: "Failed to refresh."
    });
}