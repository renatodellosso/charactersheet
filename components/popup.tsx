export interface PopupProps {
    open: boolean,
    toggle?: () => void,
    title?: string,
    children?: JSX.Element
}

export const Popup = (props: PopupProps) => {
    return <div className="fixed top-0 left-0 z-[999] w-[100vw] h-[100vh] bg-black bg-opacity-75">
        <div className="w-[80%] h-[80%] absolute left-[10%] top-[50%] bg-white translate-y-[-50%] p-10">
            <div className="flex justify-between">
                <h1>{props.title}</h1>
                <button onClick={props.toggle}>Close</button>
            </div>
            {props.children}
        </div>
    </div>
}