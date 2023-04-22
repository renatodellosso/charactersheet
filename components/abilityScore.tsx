import { Stat } from "@/lib/characterDefs"
import { abilityScoreToModifier, formatModifier, getAbilityScoreModifierText, getStatText } from "@/lib/clientUtil";
import { useState } from "react";
import { PopupProps } from "./popup";

interface AbilityScoreProps {
    abilityScore: Stat,
    setPopup: (value: PopupProps) => void
}

function openPopup(setPopup: (value: PopupProps) => void, props: AbilityScoreProps) {
    setPopup({
        open: true,
        title: props.abilityScore.fullName || props.abilityScore.name,
    })
}

export default function(props: AbilityScoreProps) {
    const modifer = abilityScoreToModifier(props.abilityScore);

    return <button onClick={() => {openPopup(props.setPopup, props)}} className=" bg-white max-w-full min-w-max text-center rounded-none">
        <h2>{props.abilityScore.name}</h2>
        <h1>{formatModifier(modifer)}</h1>
    </button>
}