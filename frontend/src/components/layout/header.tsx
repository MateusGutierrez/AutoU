import { Link } from '@tanstack/react-router';
import { Separator } from '../ui/separator';
import logo from '@/assets/sparkmail.png';

const Header: React.FC = () => {
  return (
    <header>
      <div className="flex items-center justify-between gap-2 p-2 px-8">
        <div className="flex items-center gap-4">
          <Link to="/" className="[&.active]:font-bold">
            <div className="flex items-center gap-1 pr-2">
              <h1 className="scroll-m-20 text-center text-lg font-extrabold tracking-tight text-balance">
                SparkMail
              </h1>
              <img src={logo} alt="logo" width={24} />
            </div>
          </Link>{' '}
          <Link to="/" className="[&.active]:font-bold">
            Início
          </Link>{' '}
          <Link to="/quickStart" className="[&.active]:font-bold">
            Formulário
          </Link>{' '}
          <Link to="/history" className="[&.active]:font-bold">
            Histórico
          </Link>{' '}
        </div>
      </div>
      <Separator />
    </header>
  );
};
export default Header;
