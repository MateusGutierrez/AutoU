import { Link } from "@tanstack/react-router"
import { Separator } from "../ui/separator"
import { Flame } from "lucide-react"


const Header:React.FC = () => {
    return (
        <header>
            <div className="p-2 px-8 flex gap-2 items-center justify-between">
                <div className="flex gap-4 items-center">
              <Link to="/" className="[&.active]:font-bold">
                  <div className="flex gap-1 items-center pr-2">
                  <Flame/>
                  <h1 className="scroll-m-20 text-center text-lg font-extrabold tracking-tight text-balance">SparkMail</h1>
                  </div>
              </Link>{' '}
              <Link to="/" className="[&.active]:font-bold">
                Home
              </Link>{' '}
                <Link to="/quickStart" className="[&.active]:font-bold">
                Quick Start
              </Link>{' '}
                </div>
            </div>
            <Separator/>
        </header>
    )
}
export default Header