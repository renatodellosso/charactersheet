import { Character } from "@/lib/characterDefs"

export interface PopupProps {
    open: boolean,
    character?: Character,
    toggle?: () => void,
    getTitle?: (character: Character, arg: string) => string,
    arg?: string,
    getChildren?: (character: Character, arg: string) => JSX.Element,
    children?: JSX.Element
}

export const Popup = (props: PopupProps) => {
    return <div className="fixed top-0 left-0 z-[999] w-[100vw] h-[100vh] bg-black bg-opacity-75">
        <div className="w-[80%] h-[80%] absolute left-[10%] top-[50%] bg-white translate-y-[-50%] p-10">
            <div className="flex justify-between pb-2">
                <h1>{ props.getTitle ? props.getTitle(props.character!, props.arg ? props.arg : "") : "Unnamed Popup"}</h1>
                <button onClick={props.toggle}>Close</button>
            </div>
            { props.children }
        </div>
    </div>
}