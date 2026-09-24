import type { Transcript } from '@/types/domain';

import { ts } from '../time';
import { buildUtterances } from './build';

export const transcriptC2: Transcript = {
  conversationId: 'c2',
  customerName: 'Henrique Lima',
  customerInitials: 'HL',
  summary:
    'Henrique quer trocar um sedã 2021 por um SUV híbrido para a família. Gostou do test drive e do consumo, mas esperava R$ 98 mil pelo seminovo e a avaliação saiu em R$ 86 mil. A diferença não foi trabalhada e o cliente saiu para "pensar" sem próximo passo agendado.',
  utterances: buildUtterances(
    'c2',
    [
      ['00:08', 'seller', 'Bom dia, Henrique! Camila, prazer. Você veio pelo SUV híbrido, certo?'],
      ['00:19', 'customer', 'Isso. Tenho um sedã 2021 e a família cresceu, tá ficando apertado.'],
      ['00:34', 'seller', 'Parabéns pela família! Quantas pessoas costumam andar no carro?'],
      ['00:45', 'customer', 'Eu, minha esposa e as duas crianças. E o cachorro, nas viagens.'],
      ['03:12', 'seller', 'E o uso é mais cidade ou estrada?'],
      ['03:20', 'customer', 'Cidade no dia a dia, e descemos pro litoral uma vez por mês.'],
      ['05:40', 'seller', 'Vamos pro test drive? Quero que você sinta o modo elétrico no trânsito.'],
      ['14:22', 'customer', 'Gostei muito. É silencioso e o porta-malas é bem maior do que eu imaginava.'],
      ['14:40', 'seller', 'E no híbrido você faz uns dezesseis quilômetros por litro na cidade.'],
      ['18:05', 'seller', 'Enquanto isso, a avaliação do seu sedã ficou em oitenta e seis mil.'],
      ['18:20', 'customer', 'Oitenta e seis? Eu tava contando com pelo menos noventa e oito. Vi anúncios nesse valor.'],
      ['18:40', 'seller', 'É o valor da tabela de avaliação. Mas o SUV está com uma condição boa esse mês.'],
      ['19:02', 'customer', 'Com essa diferença não fecha a conta pra mim.'],
      ['19:15', 'seller', 'Entendo. O preço do SUV é duzentos e catorze mil e novecentos, com IPVA grátis.'],
      ['24:30', 'customer', 'Vou conversar com a minha esposa e ver outras avaliações.'],
      ['24:44', 'seller', 'Claro. Fica com meu cartão, qualquer coisa me chama.'],
      ['38:10', 'customer', 'Uma última coisa: tem a cor cinza a pronta entrega?'],
      ['38:20', 'seller', 'Tem uma unidade no pátio, mas não consigo segurar sem sinal.'],
      ['40:55', 'customer', 'Tudo bem. Obrigado, Camila.'],
    ],
    2497,
  ),
  moments: [
    { id: 'm1', label: 'Abertura', atSec: ts('00:08') },
    { id: 'm2', label: 'Perfil da família', atSec: ts('00:34') },
    { id: 'm3', label: 'Uso do carro', atSec: ts('03:12') },
    { id: 'm4', label: 'Test drive', atSec: ts('05:40') },
    { id: 'm5', label: 'Avaliação do usado', atSec: ts('18:05') },
    { id: 'm6', label: 'Objeção de troca', atSec: ts('18:20') },
    { id: 'm7', label: 'Preço', atSec: ts('19:15') },
    { id: 'm8', label: 'Saída sem retorno', atSec: ts('24:30') },
  ],
};
