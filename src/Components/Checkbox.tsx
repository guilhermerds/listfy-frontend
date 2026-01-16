import type { MouseEventHandler } from "react";
import type { IListItem } from "../Pages/ListDetails";
import CheckIcon from '@mui/icons-material/Check';

type Props = {
    item: IListItem;
    onClick: MouseEventHandler<HTMLInputElement>;
}

const Checkbox = ({ item, onClick }: Props) => {
    return (
        <label className="flex relative items-center space-x-3 cursor-pointer">
            <input 
                className="peer appearance-none border-2 border-primary rounded-sm checked:bg-primary checked:border-0 h-6 w-6 cursor-pointer" 
                type="checkbox" 
                name={item.id}
                id={item.id}
                checked={item.isDone}
                onClick={onClick}
                 />

            <CheckIcon className="absolute h-6 w-6 text-white invisible peer-checked:visible" />
        </label>
    );
}

export default Checkbox;