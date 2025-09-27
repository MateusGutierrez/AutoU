import { Github, Linkedin, Mail, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Link } from '@tanstack/react-router';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900">
      <div className="mx-auto py-8">
        <div className="mb-6 flex justify-between px-8">
          <div className="flex w-full flex-col items-start space-y-3">
            <h3 className="text-lg font-semibold">Mateus Gutierrez</h3>
            <p className="text-muted-foreground text-sm">Desenvolvedor de Software</p>
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4" />
              <span>Brasil</span>
            </div>
          </div>
          <div className="flex w-full flex-col items-center space-y-3">
            <h4 className="font-medium">Links Rápidos</h4>
            <nav className="flex flex-col space-y-2">
              <a
                href="/"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Home
              </a>{' '}
              <a
                href="/quickStart"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Quick Start
              </a>{' '}
              <a
                href="/history"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                History
              </a>{' '}
            </nav>
          </div>
          <div className="flex w-full flex-col items-end space-y-3">
            <h4 className="font-medium">Conecte-se</h4>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-end gap-3">
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <a
                    href="https://www.linkedin.com/in/mateus-gutierrez-a991aa1b9/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="flex h-full w-full items-center justify-center"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <a
                    href="https://github.com/MateusGutierrez"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="flex h-full w-full items-center justify-center"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <a
                    href="mailto:mateusgutierrez9@gmail.com"
                    aria-label="Email"
                    className="flex h-full w-full items-center justify-center"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </Button>
              </div>
              <p className="text-muted-foreground text-xs">Disponível para oportunidades</p>
            </div>
          </div>
        </div>

        <Separator className="my-6" />
        <div className="text-muted-foreground flex flex-col items-center justify-between gap-4 px-8 text-sm md:flex-row">
          <div className="flex items-center gap-2">
            <span>© {currentYear} Mateus Gutierrez.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs">Vite + React + TypeScript + Python + OpenAI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
