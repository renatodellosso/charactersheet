import { Character } from "@/lib/characterDefs";
import { ChangeEventHandler } from "react";

interface SheetHeaderProps {
    character: Character,
    onChange: ChangeEventHandler<HTMLInputElement>
}

export default function SheetHeader(props: SheetHeaderProps) {
    return <div className="min-w-screen border-b-2 border-black">
        <h1><input defaultValue={props.character.name} id="name" name="name" type="text" onChange={props.onChange}
            className="pl-1 pr-2 max-w-fit border-solid border-r-2 border-r-black"/></h1>
    </div>
}