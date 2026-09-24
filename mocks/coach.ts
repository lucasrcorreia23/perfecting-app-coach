import type { CoachBlock, CoachMessage } from '@/types/domain';

import { ts } from './time';

const t = (text: string) => ({ type: 'text' as const, text });
const cite = (n: number, clock: string) => ({ type: 'cite' as const, n, atSec: ts(clock) });

const didWell: CoachBlock[] = [
  { type: 'paragraph', content: [t('Rafael se destacou em três pontos:')] },
  {
    type: 'list',
    items: [
      [t('Rapport: conectou-se ao momento da cliente ao falar do primeiro apartamento e do Tiago.'), cite(1, '02:40')],
      [t('Sondagem: entendeu como a cozinha é usada antes de propor o layout com ilha.'), cite(2, '03:20')],
      [t('Objeção de preço: perguntou o que havia na proposta concorrente em vez de baixar o valor.'), cite(3, '20:30')],
    ],
  },
];

export const coachThreads: Record<string, CoachMessage[]> = {
  c1: [
    { id: 'q1', role: 'user', text: 'O que o vendedor fez bem?' },
    { id: 'a1', role: 'assistant', blocks: didWell },
  ],
};

/** Respostas prontas usadas pelo protótipo ao enviar uma pergunta. */
export const coachAnswers: Record<string, CoachBlock[]> = {
  'O que o vendedor fez bem?': didWell,
  'Quais objeções não foram contornadas?': [
    { type: 'paragraph', content: [t('Duas objeções ficaram parcialmente abertas:')] },
    {
      type: 'list',
      items: [
        [t('Preço da concorrência: o valor de R$ 31 mil só foi respondido com troca de acabamento, sem reforçar garantia e prazo antes.'), cite(1, '20:05')],
        [t('Lavanderia: a cliente perguntou por condição no pedido conjunto e a proposta não foi fechada na hora.'), cite(2, '27:18')],
      ],
    },
    { type: 'paragraph', content: [t('Sugestão: ancorar os diferenciais antes de mexer no escopo e propor os dois ambientes juntos.')] },
  ],
  'Resuma os próximos passos': [
    { type: 'paragraph', content: [t('Próximos passos combinados na visita:')] },
    {
      type: 'list',
      items: [
        [t('Enviar contrato da cozinha com entrada de 30% e saldo em 10 vezes.'), cite(1, '32:15')],
        [t('Mandar orçamento da lavanderia com 15% de desconto no mesmo pedido.'), cite(2, '27:35')],
        [t('Ligar para Marina amanhã às 10h e manter a reserva de fábrica até sexta.'), cite(3, '31:40')],
      ],
    },
  ],
};

export const defaultCoachAnswer: CoachBlock[] = [
  {
    type: 'paragraph',
    content: [
      t('Analisei a conversa. O ponto de maior impacto está na negociação: o valor foi apresentado antes dos diferenciais'),
      cite(1, '19:48'),
      t(' e a comparação com a concorrência pedia mais perguntas antes da contraproposta.'),
      cite(2, '20:30'),
    ],
  },
];

export const promptLibrary = [
  'O que o vendedor fez bem?',
  'Quais objeções não foram contornadas?',
  'Resuma os próximos passos',
];
