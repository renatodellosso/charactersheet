import { Character } from "@/lib/characterDefs"
import AbilityScore from "../abilityScore";
import { PopupProps } from "../popup";

export interface MainTabProps {
    character: Character,
    setPopup: (value: PopupProps) => void
}

export default function MainTab(props: MainTabProps) {
    const abilityScores: JSX.Element[] = [];
    
    let keys;
    if(props.character.abilityScores)
        keys = Object.keys(props.character.abilityScores);

    keys?.forEach((key) => {
        abilityScores.push(<AbilityScore key={key} abilityScore={props.character.abilityScores[key as keyof typeof props.character.abilityScores]} 
            setPopup={props.setPopup}></AbilityScore>)
    });

    return <div>
        <div className="max-w-[5%]">
            {abilityScores}
        </div>
    </div>
}