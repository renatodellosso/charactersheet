import { Character } from "@/lib/characterDefs";
import { onChange } from "@/pages/protected/sheet";
import { ChangeEventHandler } from "react";

interface SheetHeaderProps {
    character: Character,
    onChange: ChangeEventHandler<HTMLInputElement>
}

export default function SheetHeader(props: SheetHeaderProps) {
    const divClass = "pl-1 pb-0 mb-0 border-solid border-black border-r-2 border-l-2";
    const inputClass = "max-h-[20px] p-0 mb-0 max-w-fit min-w-max";

    return <div className="min-w-screen border-b-2 border-black flex flex-row max-h-[100px] min-h-[100px]]">
        <h1><input defaultValue={props.character.name} id="name" name="name" type="text" onChange={props.onChange}
            className="pl-1 pr-2 max-w-fit max-h-fit border-solid border-r-2 border-r-black"/></h1>
        <div>
            <div className="flex flex-col">
                <div className={divClass + " border-b-2"}>Classes: <input className={inputClass} type="text" name="classes" id="classes" defaultValue={props.character.classes} onChange={onChange}/></div>
                <div className={divClass}>Race: <input className={inputClass} type="text" name="race" id="race" defaultValue={props.character.race} onChange={onChange}/></div>
            </div>
        </div>
    </div>
}