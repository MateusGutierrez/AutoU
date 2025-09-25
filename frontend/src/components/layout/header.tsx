import { Link } from "@tanstack/react-router"
import { ModeToggle } from "../mode-toggle"
import { Separator } from "../ui/separator"


const Header:React.FC = () => {
    return (
        <header>
            <div className="p-2 px-8 flex gap-2 items-center justify-between">
                <div className="flex gap-4">
              <Link to="/" className="[&.active]:font-bold">
                Home
              </Link>{' '}
              <Link to="/about" className="[&.active]:font-bold">
                About
              </Link>
                </div>
              <ModeToggle/>
            </div>
            <Separator/>
        </header>
    )
}
export default Header