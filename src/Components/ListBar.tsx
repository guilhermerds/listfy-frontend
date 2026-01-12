import { Link } from "react-router-dom";
import type { IList } from "../Pages/Lists";
import "../Css/ListBar.css"

type Props = {
    list: IList;
}

const ListBar = ({ list }: Props) => {
    return (
        <div className="list-bar rounded-2xl p-5 text-left bg-secondary-light my-4">
            <Link className="list-link text-white" to={`/lists/${list.id}`}>
                <h4 className="text-lg">{list.name}</h4>
                <p className="text-primary m-0 p-0">{list.category}</p>
                <div className="list-image"></div>
            </Link>
        </div>
    );
}

export default ListBar;