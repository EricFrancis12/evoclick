

export default function useDragger(onMouseMove: (e: MouseEvent, u?: unknown) => any) {
    let boundHandleMouseMove: (e: MouseEvent) => void;

    function handleMouseDown(e?: React.MouseEvent<Element, MouseEvent>, u?: unknown) {
        document.body.style.cursor = "e-resize";
        document.body.style.userSelect = "none";

        boundHandleMouseMove = (event: MouseEvent) => handleMouseMove(event, u);

        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mousemove", boundHandleMouseMove);
    }

    function handleMouseUp() {
        document.body.style.cursor = "default";
        document.body.style.userSelect = "default";

        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("mousemove", boundHandleMouseMove);
    }

    function handleMouseMove(e: MouseEvent, u?: unknown) {
        onMouseMove(e, u);
    }

    return handleMouseDown;
}
