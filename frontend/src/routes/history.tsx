import History from '@/components/history';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/history')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="mt-4 flex flex-col gap-2">
        <h1 className="scroll-m-20 text-start text-2xl font-extrabold tracking-tight text-balance">
          Histórico de classificação de emails
        </h1>
        <p>
          Visualize o histórico completo de seus e-mails classificados com análise detalhada,
          incluindo status, nível de urgência, índices de confiança e tipo de conteúdo para melhor
          gerenciamento de e-mail.
        </p>
      </div>
      <div className="flex-1 items-center justify-center p-2 py-16">
        <History />
      </div>
    </>
  );
}
