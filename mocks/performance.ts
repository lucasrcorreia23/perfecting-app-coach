import type { DaySummary, SellerPerformance } from '@/types/domain';

const STAGE_NAMES = {
  AVA: 'Abertura e rapport',
  SOL: 'Sondagem e diagnóstico',
  NEG: 'Negociação e objeções',
  FECH: 'Fechamento',
} as const;

function stages(ava: number, sol: number, neg: number, fech: number) {
  return [
    { key: 'AVA' as const, name: STAGE_NAMES.AVA, average: ava },
    { key: 'SOL' as const, name: STAGE_NAMES.SOL, average: sol },
    { key: 'NEG' as const, name: STAGE_NAMES.NEG, average: neg },
    { key: 'FECH' as const, name: STAGE_NAMES.FECH, average: fech },
  ];
}

const WEEKS = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'];
const weeks = (scores: number[]) => scores.map((score, i) => ({ label: WEEKS[i]!, score }));

export const performance: SellerPerformance[] = [
  {
    sellerId: 'p1',
    weeks: weeks([6.1, 6.4, 6.2, 7.0, 7.3, 7.1, 7.8, 8.4]),
    stages: stages(2.8, 2.6, 1.4, 2.1),
    conversations: 38,
    suggestion: {
      title: 'Objeção "está mais barato na concorrência"',
      description: 'Rafael cede escopo cedo. Treine ancorar garantia e prazo antes de mexer no projeto.',
    },
  },
  {
    sellerId: 'p2',
    weeks: weeks([7.2, 6.8, 6.9, 6.5, 6.7, 6.3, 6.6, 6.0]),
    stages: stages(2.4, 2.0, 1.8, 1.1),
    conversations: 44,
    suggestion: {
      title: 'Fechamento com próximo passo',
      description: 'Camila aceita o "vou pensar" sem agendar retorno. Treine propor reserva e data de volta.',
    },
  },
  {
    sellerId: 'p3',
    weeks: weeks([7.9, 8.1, 8.0, 8.6, 8.2, 8.8, 8.5, 8.7]),
    stages: stages(2.5, 2.9, 2.3, 1.9),
    conversations: 51,
    suggestion: {
      title: 'Confirmação antes do fechamento',
      description: 'Diego fecha rápido, mas pula a checagem de medidas. Treine o resumo de necessidades antes da proposta.',
    },
  },
];

export const daySummary: DaySummary = {
  recordedToday: 2,
  averageScore: 7.5,
  weeklyGoal: { done: 12, target: 20 },
};
