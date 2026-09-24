import type { Transcript } from '@/types/domain';

import { ts } from '../time';
import { buildUtterances } from './build';

export const transcriptC1: Transcript = {
  conversationId: 'c1',
  customerName: 'Marina Alves',
  customerInitials: 'MA',
  summary:
    'Marina está reformando um apartamento de dois quartos na Vila Mariana e recebe as chaves no próximo mês. O marido, Tiago, cozinha com frequência e precisa de bancada. A faixa inicial era de R$ 30 mil; o projeto com ilha saiu por R$ 42,8 mil e foi ajustado para R$ 38,4 mil com acabamento madeirado. Cozinha fechada na visita, lavanderia em aberto.',
  utterances: buildUtterances(
    'c1',
    [
      ['00:12', 'seller', 'Boa tarde, Marina! Seja bem-vinda. Eu sou o Rafael. Vi que você agendou pelo site, né?'],
      ['00:24', 'customer', 'Isso, agendei ontem. Tô reformando o apartamento e queria começar pela cozinha.'],
      ['00:38', 'seller', 'Perfeito. Aceita um café enquanto a gente conversa? Me conta um pouco do apartamento.'],
      ['00:52', 'customer', 'Aceito sim. É um apê de dois quartos na Vila Mariana, comprei na planta e recebo as chaves mês que vem.'],
      ['02:40', 'seller', 'Que momento bom! Primeiro apartamento é sempre especial. Você vai morar com alguém?'],
      ['02:55', 'customer', 'Eu e meu marido, o Tiago. Ele cozinha muito mais do que eu, então a cozinha é quase dele.'],
      ['03:20', 'seller', 'Então quero entender a rotina do Tiago também. Ele cozinha que tipo de coisa? Isso muda muito o projeto.'],
      ['03:41', 'customer', 'Ele faz pão, massa fresca... usa muita bancada. Na cozinha de hoje a gente briga por espaço.'],
      ['06:05', 'seller', 'Você trouxe a planta? Com ela eu já consigo te mostrar opções de layout hoje mesmo.'],
      ['06:18', 'customer', 'Trouxe, tá aqui no celular. A cozinha é integrada com a sala, tem uns três metros e meio de parede.'],
      ['07:02', 'seller', 'Dá pra fazer uma bancada em L com uma ilha pequena. O Tiago ganharia quase o dobro de área de preparo.'],
      ['11:30', 'seller', 'Marina, além da cozinha, tem mais algum ambiente que vocês pensam em planejar?'],
      ['11:44', 'customer', 'Talvez a lavanderia depois. Mas o orçamento tá bem apertado por causa da mudança.'],
      ['12:10', 'seller', 'Entendo. Vocês já têm uma faixa de investimento em mente para a cozinha?'],
      ['12:25', 'customer', 'A gente pensou em uns trinta mil, no máximo.'],
      ['19:48', 'seller', 'Com a ilha e o acabamento em laca fosca, o projeto fica em quarenta e dois mil e oitocentos.'],
      ['20:05', 'customer', 'Nossa, passou bastante. Em outra loja me passaram trinta e um mil por uma cozinha parecida.'],
      ['20:30', 'seller', 'Faz sentido comparar. Posso te perguntar o que tinha nesse projeto? Material, ferragens, prazo?'],
      ['20:52', 'customer', 'Era MDF comum, sem ilha. E o prazo de entrega era de noventa dias.'],
      ['21:15', 'seller', 'Aqui as ferragens têm amortecimento e dez anos de garantia. E eu consigo trocar a laca por um padrão madeirado que baixa o valor.'],
      ['23:10', 'customer', 'O prazo também me preocupa. A gente muda em quarenta e cinco dias.'],
      ['23:28', 'seller', 'Nossa fábrica está entregando em trinta e cinco dias úteis. Fechando essa semana, a montagem fica antes da mudança.'],
      ['27:02', 'customer', 'Se ficar perto de trinta e oito e der pra montar antes da mudança, eu fecho hoje.'],
      ['27:10', 'seller', 'Consigo trinta e oito mil e quatrocentos com o madeirado e a ilha, em dez vezes sem juros.'],
      ['27:18', 'customer', 'E a lavanderia? Se eu fechar tudo junto tem alguma condição?'],
      ['27:35', 'seller', 'Tem sim: a lavanderia entra com quinze por cento de desconto no mesmo pedido. Posso te mandar os dois orçamentos?'],
      ['28:02', 'customer', 'Manda. Vou mostrar pro Tiago hoje à noite.'],
      ['31:40', 'seller', 'Combinado. Deixo a cozinha reservada na agenda da fábrica até sexta. Posso te ligar amanhã às dez?'],
      ['31:58', 'customer', 'Pode. Aliás, acho que vou fechar a cozinha hoje mesmo e a lavanderia a gente vê depois.'],
      ['32:15', 'seller', 'Ótima decisão. Vou preparar o contrato com entrada de trinta por cento e o restante em dez vezes.'],
      ['33:40', 'customer', 'Perfeito. Obrigada, Rafael, você foi muito atencioso.'],
    ],
    2052,
  ),
  moments: [
    { id: 'm1', label: 'Abertura', atSec: ts('00:12') },
    { id: 'm2', label: 'Rapport', atSec: ts('02:40') },
    { id: 'm3', label: 'Planta e layout', atSec: ts('06:05') },
    { id: 'm4', label: 'Orçamento', atSec: ts('12:10') },
    { id: 'm5', label: 'Objeção de preço', atSec: ts('20:05') },
    { id: 'm6', label: 'Prazo de entrega', atSec: ts('23:10') },
    { id: 'm7', label: 'Proposta', atSec: ts('27:02') },
    { id: 'm8', label: 'Fechamento', atSec: ts('31:58') },
  ],
};
