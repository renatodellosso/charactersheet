import { Character, Stat } from "@/lib/characterDefs"
import { abilityScoreToModifier, formatModifier, getAbilityScoreModifierText, getStatText, getStatValue, refresh, update } from "@/lib/clientUtil";
import { useState } from "react";
import { PopupProps } from "./popup";
import { UpdateFilter } from "mongodb";
import Router from "next/router";

interface AbilityScoreProps {
    abilityScore: Stat,
    setPopup: (value: PopupProps) => void,
}

function getChildren(character: Character, arg: string): JSX.Element {
    const abilityScore = character.abilityScores[arg as keyof typeof character.abilityScores];

    let addNew: Partial<Character> | UpdateFilter<Character> = {
        $push: Object()
    }

    if(addNew.$push != undefined) {
        (addNew.$push as any) = {
            ["abilityScores." + abilityScore.name.toLowerCase() + ".bonuses"]: {
                    reason: "New Bonus " + (abilityScore.bonuses.filter(bonus => bonus.reason.startsWith("New Bonus")).length + 1).toString(),
                    value: 0,
                    nameEditable: true,
                    valueEditable: true
                }
        }
    } else {
        console.error("Error creating addNew");
        console.log(addNew);
    }

    const remove = (reason: string, value: number): any => {
        return {
            $pull: {
                ["abilityScores." + abilityScore.name.toLowerCase() + ".bonuses"]: {
                        reason: reason,
                        value: value
                }
            }
        }
    }

    let content = <div> 
        <table>
            <tbody>
                <tr>
                    <th>Reason</th>
                    <th>Bonus</th>
                </tr>
                {
                    abilityScore.bonuses.map((bonus, index) => {
                        return <tr key={bonus.reason + index}>
                            <td>{
                                bonus.nameEditable ? 
                                    <input name={index + ".name"} id={index + ".name"} defaultValue={bonus.reason}></input> :
                                    bonus.reason
                            }</td>
                            <td>{
                                bonus.valueEditable ? 
                                    <input name={index + ".value"} id={index + ".value"} defaultValue={bonus.value}>
                                    </input> : formatModifier(bonus.value)
                            }</td>
                            {
                                bonus.nameEditable ?
                                <td><button onClick={async ()=>{ await update(remove(bonus.reason, bonus.value)); refresh();}} 
                                    className="rounded-none border-red-200 hover:border-red-500">Delete</button></td> :
                                <></>
                            }
                        </tr>
                    })
                }
            </tbody>
        </table>
        <button onClick={async () => { await update(addNew); refresh(); }}>Add new</button>
    </div>

    return content;
}

function openPopup(setPopup: (value: PopupProps) => void, props: AbilityScoreProps) {
    

    setPopup({
        open: true,
        title: (props.abilityScore.fullName || props.abilityScore.name) + " (" + getStatValue(props.abilityScore) + ", " + 
            formatModifier(abilityScoreToModifier(props.abilityScore)) + ")",
        arg: props.abilityScore.name.toLowerCase(),
        getChildren: getChildren,
    })
}

export default function(props: AbilityScoreProps) {
    const modifer = abilityScoreToModifier(props.abilityScore);
    const label =`${props.abilityScore.name} (` + getStatValue(props.abilityScore) + ")";

    return <button onClick={() => {openPopup(props.setPopup, props)}} 
        className=" bg-white max-w-full min-w-max w-full text-center rounded-none">
        <h2>{label}</h2>
        <h1>{formatModifier(modifer)}</h1>
    </button>
}