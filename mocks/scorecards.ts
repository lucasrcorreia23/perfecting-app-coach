import type { Scorecard } from '@/types/domain';

import { ts } from './time';

export const scorecards: Record<string, Scorecard> = {
  c1: {
    conversationId: 'c1',
    total: 9,
    max: 12,
    teamAverage: 7.4,
    headline: 'Ótima condução da sondagem. A negociação cedeu valor antes de ancorar os diferenciais.',
    stages: [
      {
        key: 'AVA',
        name: 'Abertura e rapport',
        score: 3,
        max: 3,
        strengths: [
          { text: 'Confirmou o agendamento e criou um ambiente acolhedor com o café.', atSec: ts('00:38') },
          { text: 'Conectou-se ao momento da cliente (primeiro apartamento).', atSec: ts('02:40') },
        ],
        improvements: [],
      },
      {
        key: 'SOL',
        name: 'Sondagem e diagnóstico',
        score: 3,
        max: 3,
        strengths: [
          { text: 'Investigou quem usa a cozinha e como, antes de falar de produto.', atSec: ts('03:20') },
          { text: 'Pediu a planta e trouxe uma solução concreta na hora.', atSec: ts('06:05') },
          { text: 'Perguntou a faixa de investimento de forma natural.', atSec: ts('12:10') },
        ],
        improvements: [],
      },
      {
        key: 'NEG',
        name: 'Negociação e objeções',
        score: 1,
        max: 3,
        strengths: [{ text: 'Perguntou o que havia na proposta concorrente em vez de reagir ao preço.', atSec: ts('20:30') }],
        improvements: [
          { text: 'Apresentou o valor cheio antes de reforçar garantia e prazo.', atSec: ts('19:48') },
          { text: 'Trocou o acabamento cedo demais; valia ancorar o valor das ferragens primeiro.', atSec: ts('21:15') },
        ],
      },
      {
        key: 'FECH',
        name: 'Fechamento',
        score: 2,
        max: 3,
        strengths: [{ text: 'Criou urgência real com a agenda da fábrica.', atSec: ts('31:40') }],
        improvements: [{ text: 'Não propôs fechar a lavanderia no mesmo pedido quando a cliente abriu a porta.', atSec: ts('27:18') }],
      },
    ],
    training: {
      objection: 'Em outra loja está mais barato',
      quote: 'Em outra loja me passaram trinta e um mil por uma cozinha parecida.',
      atSec: ts('20:05'),
    },
  },
  c2: {
    conversationId: 'c2',
    total: 6,
    max: 12,
    teamAverage: 7.4,
    headline: 'Test drive envolvente, mas a objeção de valor de troca encerrou a visita sem próximo passo.',
    stages: [
      {
        key: 'AVA',
        name: 'Abertura e rapport',
        score: 2,
        max: 3,
        strengths: [{ text: 'Parabenizou pela família e abriu espaço para o cliente falar.', atSec: ts('00:34') }],
        improvements: [{ text: 'Não perguntou como o cliente conheceu o modelo.', atSec: ts('00:08') }],
      },
      {
        key: 'SOL',
        name: 'Sondagem e diagnóstico',
        score: 2,
        max: 3,
        strengths: [{ text: 'Mapeou uso na cidade e viagens mensais.', atSec: ts('03:12') }],
        improvements: [{ text: 'Não investigou a expectativa de valor do seminovo antes da avaliação.', atSec: ts('05:40') }],
      },
      {
        key: 'NEG',
        name: 'Negociação e objeções',
        score: 2,
        max: 3,
        strengths: [{ text: 'Conectou o consumo do híbrido ao uso real do cliente.', atSec: ts('14:40') }],
        improvements: [{ text: 'Respondeu à objeção de troca falando do preço do SUV, sem tratar a diferença.', atSec: ts('18:40') }],
      },
      {
        key: 'FECH',
        name: 'Fechamento',
        score: 0,
        max: 3,
        strengths: [],
        improvements: [
          { text: 'Aceitou o "vou pensar" sem agendar retorno.', atSec: ts('24:44') },
          { text: 'Perdeu a chance de reservar a unidade cinza com um sinal simbólico.', atSec: ts('38:20') },
        ],
      },
    ],
    training: {
      objection: 'Meu usado vale mais do que isso',
      quote: 'Oitenta e seis? Eu tava contando com pelo menos noventa e oito.',
      atSec: ts('18:20'),
    },
  },
};
