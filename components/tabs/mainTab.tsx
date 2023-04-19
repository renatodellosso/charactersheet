import { Character } from "@/lib/characterDefs"
import AbilityScore from "../abilityScore";

export interface MainTabProps {
    character: Character
}

export default function MainTab(props: MainTabProps) {
    const abilityScores: JSX.Element[] = [];
    const keys = Object.keys(props.character.abilityScores);

    console.log("Rendering main tab...");

    keys.forEach((key) => {
        abilityScores.push(<AbilityScore abilityScore={props.character.abilityScores[key]}></AbilityScore>)
    });

    return <div>
        <div className="max-w-[5%]">
            {abilityScores}
        </div>
    </div>
}