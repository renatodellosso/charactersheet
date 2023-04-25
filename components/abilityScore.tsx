import { Character, Stat } from "@/lib/characterDefs"
import { abilityScoreToModifier, formatModifier, getAbilityScoreModifierText, getStatText, getStatValue, update } from "@/lib/clientUtil";
import { useState } from "react";
import { PopupProps } from "./popup";
import { UpdateFilter } from "mongodb";

interface AbilityScoreProps {
    abilityScore: Stat,
    setPopup: (value: PopupProps) => void,
}

function openPopup(setPopup: (value: PopupProps) => void, props: AbilityScoreProps) {
    let addNew: Partial<Character> | UpdateFilter<Character> = {
            $push: Object()
    }

    if(addNew.$push != undefined) {
        (addNew.$push as any) = {
            ["abilityScores." + props.abilityScore.name.toLowerCase() + ".bonuses"]: {
                    reason: "New Bonus",
                    value: 0,
                    nameEditable: true,
                    valueEditable: true
                }
        }
    } else {
        console.error("Error creating addNew");
        console.log(addNew);
    }

    let content = <div> 
            <table>
                <tbody>
                    <tr>
                        <th>Reason</th>
                        <th>Bonus</th>
                    </tr>
                    {
                        props.abilityScore.bonuses.map((bonus) => {
                            console.log(bonus);
                        return <tr key={bonus.reason}>
                            <td>{
                                bonus.nameEditable ? 
                                    <input name={bonus.reason + ".name"} id={bonus.reason + ".name"} defaultValue={bonus.reason}></input> :
                                    bonus.reason
                            }</td>
                            <td>{
                                bonus.valueEditable ? 
                                    <input name={bonus.reason + ".value"} id={bonus.reason + ".value"} defaultValue={bonus.value}>
                                    </input> : formatModifier(bonus.value)
                            }</td>
                        </tr>
                        })
                    }
                </tbody>
            </table>
            <button onClick={() => update(addNew)}>Add new</button>
        </div>

    setPopup({
        open: true,
        title: (props.abilityScore.fullName || props.abilityScore.name) + " (" + getStatValue(props.abilityScore) + ", " + 
            formatModifier(abilityScoreToModifier(props.abilityScore)) + ")",
        children: content
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