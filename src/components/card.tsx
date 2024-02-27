'use client'

interface Props {
    icon: string,
    onClick: () => void
}

export default function Card(props: Props) {

    function getIconClasses() {
        return props.icon + " fa-solid h-10 w-10 items-center text-xl justify-center";
    }

    return (
        <div onClick={() => props.onClick()} className="flex items-center justify-center p-8 border-black border rounded m-2 cursor-pointer">
            <i style={{ display: "flex!important" }} className={getIconClasses()}></i>
        </div>
    )
}
