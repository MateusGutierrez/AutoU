import { Github, Linkedin, Mail, MapPin } from "lucide-react"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear()
    
    return (
        <footer className="bg-neutral-900">
            <div className="mx-auto py-8">
                <div className="flex justify-between mb-6 px-8">
                    <div className="space-y-3 w-full flex flex-col items-start">
                        <h3 className="font-semibold text-lg">Mateus Gutierrez</h3>
                        <p className="text-sm text-muted-foreground">
                            Desenvolvedor de Software
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>Brasil</span>
                        </div>
                    </div>
                    <div className="space-y-3 w-full flex flex-col items-center">
                        <h4 className="font-medium">Links Rápidos</h4>
                        <nav className="flex flex-col space-y-2">
                            <a href="#sobre" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Sobre
                            </a>
                            <a href="#projetos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Projetos
                            </a>
                            <a href="#habilidades" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Habilidades
                            </a>
                            <a href="#contato" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Contato
                            </a>
                        </nav>
                    </div>
                    <div className="space-y-3 w-full flex flex-col items-end">
                        <h4 className="font-medium">Conecte-se</h4>
                        <div className="flex flex-col space-y-3">
                            <div className="flex items-center gap-3 justify-end">
                                <Button variant="outline" size="icon" className="h-9 w-9">
                                    <a 
                                        href="https://www.linkedin.com/in/mateus-gutierrez-a991aa1b9/" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        aria-label="LinkedIn"
                                        className="flex items-center justify-center w-full h-full"
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
                                        className="flex items-center justify-center w-full h-full"
                                    >
                                        <Github className="h-4 w-4" />
                                    </a>
                                </Button>
                                <Button variant="outline" size="icon" className="h-9 w-9">
                                    <a 
                                        href="mailto:mateusgutierrez9@gmail.com" 
                                        aria-label="Email"
                                        className="flex items-center justify-center w-full h-full"
                                    >
                                        <Mail className="h-4 w-4" />
                                    </a>
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Disponível para oportunidades
                            </p>
                        </div>
                    </div>
                </div>

                <Separator className="my-6" />
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground px-8">
                    <div className="flex items-center gap-2">
                        <span>© {currentYear} Mateus Gutierrez.</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs">
                            Vite + React + TypeScript + Python + OpenAI
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer