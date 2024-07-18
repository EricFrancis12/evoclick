import CheckboxWrapper from "./CheckboxWrapper";

export default function NoRows() {
    return (
        <div className="flex gap-2 w-full">
            <CheckboxWrapper />
            <span className="italic text-grey-300">no data...</span>
        </div>
    )
}
