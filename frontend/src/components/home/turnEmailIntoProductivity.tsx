import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import SparkCard from '../card';
import { useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import logo from '@/assets/sparkmail.png';

const content =
  '"Olá! Recebemos sua solicitação e ela está sendo processada. Você receberá uma atualização dentro de 24 horas..."';
const status = 'Produtivo';

const TurnEmailIntoProductivity = () => {
  const navigate = useNavigate();
  const click = useCallback(() => {
    navigate({ to: '/quickStart' });
  }, [navigate]);
  return (
    <section className="px-4 pt-6 pb-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <Badge className="text-emerald-400-400 mb-6 border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-blue-600/10">
          <Sparkles className="mr-2 h-4 w-4" />
          Powered by Open AI
        </Badge>

        <h1 className="mb-8 text-3xl leading-tight font-bold md:text-4xl">
          Transforme seus e-mails em produtividade com
          <div className="flex items-center justify-center">
            <img src={logo} alt="logo" className="w-12 md:w-20" />
            <span className="bg-gradient-to-r from-red-800 via-red-700 to-red-600 bg-clip-text text-6xl text-transparent sm:text-6xl">
              {' '}
              SparkMail
            </span>
          </div>
        </h1>

        <p className="mx-auto mb-12 max-w-4xl text-xl leading-relaxed md:text-2xl">
          A primeira inteligência artificial do Brasil que automaticamente classifica emails
          corporativos, sugere respostas inteligentes e libera seu time para focar no que realmente
          importa.
        </p>

        <div className="mb-16 flex flex-col justify-center gap-4 sm:flex-row">
          <Button className="px-8 py-6" onClick={click} size={'lg'}>
            Começar
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
        <div className="relative mx-auto max-w-5xl">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-rose-500/20 to-red-600/20 blur-3xl"></div>
          <SparkCard status={status} content={content} confidence={0.95} isUrgent />
        </div>
      </div>
    </section>
  );
};
export default TurnEmailIntoProductivity;
