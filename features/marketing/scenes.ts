/** Cenas de apresentação: rota em modo demo + headline da moldura de marketing. */
export const SCENES = [
  { key: 'descanso', route: '/?demo=1&idle=1', headline: 'Coach em\n*qualquer lugar*' },
  { key: 'inicio', route: '/?demo=1', headline: 'Seu dia\nde vendas' },
  { key: 'gravacao', route: '/gravar?demo=1', headline: 'Grave suas\nvisitas' },
  { key: 'inbox', route: '/conversas?demo=1', headline: 'Todas as\nconversas' },
  { key: 'transcricao', route: '/conversa/c1?tab=transcricao&demo=1', headline: 'Mergulhe na\ntranscrição' },
  { key: 'coach', route: '/conversa/c1?tab=coach&demo=1', headline: 'Coach de vendas\ncom IA' },
  { key: 'compositor', route: '/conversa/c1?tab=comentarios&demo=1', headline: 'Dê feedback\nno trecho certo' },
  { key: 'feedback', route: '/conversa/c1?tab=feedback&demo=1', headline: 'Nota por etapa\ndo playbook' },
] as const;

export type SceneKey = (typeof SCENES)[number]['key'];
