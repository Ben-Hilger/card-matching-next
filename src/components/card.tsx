'use client'

interface Props {
    icon: string,
    rotated: boolean,
    onClick: () => void
}

export default function Card(props: Props) {

    function getIconClasses() {
        return props.icon + " fa-solid h-10 p-8 w-10 items-center text-xl justify-center";
    }

    function getInnerCardClasses() {
        let classes = "flip-card-inner";
        if (props.rotated) {
            classes += " rotate-card";
        }
        return classes;
    }

    function getFlipCardClasses() {
        if (props.rotated) {
            return "flip-card-back";
        }
        return "flip-card-front";
    }

    return (
        <div className="flip-card flex items-center justify-center  border-black border rounded m-2 cursor-pointer" onClick={() => props.onClick()}>
            <div className={getInnerCardClasses()}>
                <div className={getFlipCardClasses()}>
                    <i style={{ display: "flex!important" }} className={getIconClasses()}></i>
                </div>
            </div>
        </div>
    )
}

