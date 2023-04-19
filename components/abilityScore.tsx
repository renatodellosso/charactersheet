import { Stat } from "@/lib/characterDefs"
import { abilityScoreToModifier, formatModifier, getAbilityScoreModifierText, getStatText } from "@/lib/clientUtil";

interface AbilityScoreProps {
    abilityScore: Stat
}

export default function(props: AbilityScoreProps) {
    const modifer = abilityScoreToModifier(props.abilityScore);

    return <button className=" bg-white max-w-full min-w-max text-center rounded-none">
        <h2>{props.abilityScore.name}</h2>
        <h1>{formatModifier(modifer)}</h1>
    </button>
}