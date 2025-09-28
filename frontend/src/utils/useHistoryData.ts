const historyData = [
  {
    status: 'Improdutivo',
    content: 'Feliz aniversário! Que você tenha um dia incrível cheio de alegrias! 🎉',
    confidence: 0.25,
    is_urgent: false,
    type: 'text',
  },
  {
    status: 'Improdutivo',
    content:
      'Feliz Natal e um próspero Ano Novo! Desejo muita paz e felicidade para você e sua família! 🎄',
    confidence: 0.52,
    is_urgent: false,
    type: 'text',
  },
  {
    status: 'Improdutivo',
    content: 'Muito obrigado pela ajuda de ontem, foi fundamental para o projeto dar certo!',
    confidence: 0.68,
    is_urgent: false,
    type: 'text',
  },
  {
    status: 'Improdutivo',
    content: 'Bom dia! Como foi o final de semana? Espero que tenha descansado bem!',
    confidence: 0.9,
    is_urgent: false,
    type: 'text',
  },
  {
    status: 'Improdutivo',
    content: 'Parabéns pela promoção! Você merece muito esse reconhecimento! 👏',
    confidence: 0.94,
    is_urgent: false,
    type: 'file',
  },
  {
    status: 'Produtivo',
    content:
      'URGENTE: Servidor principal fora do ar. Clientes não conseguem acessar o sistema. Preciso de suporte imediato!',
    confidence: 0.98,
    is_urgent: true,
    type: 'text',
  },
  {
    status: 'Produtivo',
    content:
      'EMERGÊNCIA: Vazamento detectado no laboratório. Evacuação imediata necessária. Contactar equipe de segurança.',
    confidence: 0.99,
    is_urgent: true,
    type: 'text',
  },
  {
    status: 'Produtivo',
    content:
      'Cliente VIP reportou falha crítica no sistema de pagamento. Prejuízo estimado em R$ 50k/hora. Ação imediata necessária.',
    confidence: 0.96,
    is_urgent: true,
    type: 'file',
  },
  {
    status: 'Produtivo',
    content:
      'Reunião de planejamento estratégico agendada para terça-feira às 14h. Confirme presença até segunda-feira.',
    confidence: 0.91,
    is_urgent: false,
    type: 'text',
  },
  {
    status: 'Produtivo',
    content:
      'Relatório mensal de vendas enviado em anexo. Favor revisar os números da região Sul antes da apresentação.',
    confidence: 0.87,
    is_urgent: false,
    type: 'file',
  },
  {
    status: 'Produtivo',
    content:
      'Atualização do projeto: Fase 1 concluída com sucesso. Iniciando Fase 2 conforme cronograma estabelecido.',
    confidence: 0.89,
    is_urgent: false,
    type: 'text',
  },
  {
    status: 'Produtivo',
    content:
      'Novo protocolo de segurança implementado. Todos os funcionários devem realizar o treinamento até o final do mês.',
    confidence: 0.93,
    is_urgent: false,
    type: 'file',
  },
  {
    status: 'Produtivo',
    content:
      'Orçamento para Q4 aprovado. Liberação de recursos para novos projetos a partir de outubro.',
    confidence: 0.85,
    is_urgent: false,
    type: 'text',
  },
];
export default historyData;
