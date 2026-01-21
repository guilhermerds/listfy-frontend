import type { MouseEventHandler } from "react";
import type { IListItem } from "../Pages/ListDetails";
import formatCurrency from "../Utils/Currency";
import Checkbox from "./Checkbox";

interface IProp {
    item: IListItem,
    key: number,
    onCheckClick: MouseEventHandler<HTMLInputElement>,
    onClick: () => void
}

const ItemBar = ({ key, item, onCheckClick, onClick }: IProp) => {
    return (
        <li key={key} className="flex mb-4">
            <Checkbox item={item} onClick={onCheckClick} />

            <div
                onClick={onClick}
                className={`flex justify-between w-full pr-4 cursor-pointer ${item.isDone && "line-through text-gray-400"}`}
            >
                <div className="mr-2 text-left">
                    <p>{item.name}</p>
                    <p className="text-sm text-gray-400">
                        {item.amount} x {formatCurrency(item.price, true)}
                        </p>
                </div>
                <div className="flex items-center">
                    <p>{formatCurrency((item.price*item.amount), true)}</p>
                </div>
            </div>
        </li>
    );
}

export default ItemBar;