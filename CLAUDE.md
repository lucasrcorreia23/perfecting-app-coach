# Perfecting Field — POC

App mobile (iOS, Android e web) da Perfecting que grava conversas de venda presenciais, gera transcrição e entrega coaching de IA para vendedor e gestor. POC com qualidade de App Store e precisão pixel perfect. Toda a UI é em **português do Brasil**.

- Nome do produto: `APP_NAME`. Nome do assistente: `COACH_NAME`. Ambos ficam em `theme/tokens.ts` e nunca são escritos à mão na UI.
- Referências visuais: `docs/referencias/`. Replicamos layout, hierarquia, proporções e componentes, **não** a cor amarela, a tipografia nem os textos.
- Leia também `AGENTS.md` (regras gerais de Expo: sempre `npx expo install`, docs versionadas).

## Stack

| Área | Lib |
| --- | --- |
| App | Expo SDK 57 (RN 0.86, React 19.2), TypeScript estrito |
| Rotas | Expo Router (`app/`) |
| Estilo | NativeWind 4.2.7 + Tailwind 3.4 (`tailwind.config.js`) |
| Componentes base | react-native-reusables (copiados em `components/ui`, adaptados ao tema) |
| Animação | react-native-reanimated 4 (+ worklets). Use `sv.get()`/`sv.set()` (React Compiler) |
| Áudio | expo-audio (gravação + metering) |
| Outros | expo-haptics, expo-blur, expo-linear-gradient, lucide-react-native, @shopify/flash-list, @gorhom/bottom-sheet (fallback modal na web) |
| Estado/dados | Zustand (local) + TanStack Query sobre mocks com latência simulada |
| Fontes | Anton (display) e Inter 400/500/600 via @expo-google-fonts |

## Comandos

```bash
npx expo start --web         # dev web (frame fixo de 390 centralizado)
npm run typecheck            # tsc app + scripts
npx expo lint                # inclui as regras do grid
npm run audit:scale          # lista medidas fora da escala (rodar ao fim de cada fase)
npx tsx scripts/shot.ts /rota out.png --height=844 --scale=2   # screenshot rápido (servidor rodando)
npm run screenshots                 # 7 cenas em screenshots/ (390x844 @3x)
npm run screenshots -- --marketing  # moldura de iPhone em screenshots/marketing/ (1290x2796)
```

## Tokens (theme/tokens.ts é a fonte única)

`tailwind.config.js` importa `theme/tokens.ts` e **substitui** as escalas (colors, spacing, borderRadius, borderWidth, fontSize, lineHeight, letterSpacing, fontFamily, fontWeight). Classe fora da escala simplesmente não existe, e o Tailwind a ignora sem aviso. Por isso o `audit:scale` existe.

- **Cores:** rampa grafite medida nas referências: background `#1F1F1F`, surface `#2A2A2A`, surface-elevated `#353535`, surface-highlight `#404040`, border `#363636`, border-strong `#4A4A4A`, text `#FFFFFF`, text-muted `#B8B8B8`, text-subtle `#8C8C8C`, glass-* (tab bar em vidro), primary `#FF3D00`, primary-foreground `#0A0A0A` (tinta escura sobre a laranja), primary-highlight `#FF6A33`, veil-* (véus de foto), primary-soft (primary 10%), success/warning/danger (só texto e ícones pequenos) e avatar-1..4 (pastéis dessaturados).
- **Classes:** as chaves numéricas são o valor em pt: `p-16`, `gap-8`, `h-48`, `rounded-12`, `text-14`. Cores: `bg-surface`, `text-text-muted`, `border-border`.
- **Tipografia:** use `<Text variant=…>` (`components/ui/text.tsx`): `display-xl` (Anton 96), `display-lg` (48), `display-md` (32), `display-sm` (24), `title` (Inter 500 16/24), `subtitle` (Inter 400 14/20), `body` (14/20), `caption` (12/16 muted) e `label` (Inter 400 12/16 caixa alta). Peso leve: 600 evitado; Anton com tracking 1. Anton é sempre caixa alta. O peso vem da família (`font-medium`, `font-semibold`), sem `fontWeight`.
- **Tamanhos de componente:** `sizes` em tokens (ícone 16/20/24, botão 32/40/48, avatar 24/32/40, pill de status 24, pill button 40/48, tab bar 64, gravar 48, gráfico 128).
- **Exceções documentadas:** `leading-56` (headline Anton com acento) e `marketing` em tokens (moldura de hardware, fora do app).

## Regra de cor

A base é grafite (não preto chapado), com vários degraus de cinza para dar hierarquia. A primary `#FF3D00` aparece **nos mesmos lugares em que a referência usa amarelo**, sempre como sinal, e o texto sobre ela é escuro (`primary-foreground` = `#0A0A0A`, como o preto sobre amarelo da referência).

- **Pode:**
  - o header em bloco das abas principais (`ScreenHeader`, variante `accent`, com degradê suave até `primary-highlight`);
  - o destaque de headline (`HighlightText`, como o "ANYWHERE" da referência);
  - a ação principal da tela (Concluir, Enviar, Próximo do player) e o botão central de gravar;
  - o sublinhado da aba ativa e a barra vertical do trecho em reprodução ou citado;
  - a waveform da gravação e o trecho percorrido do player;
  - menções (@), números de citação do Coach (círculo `primary-soft`) e o ponto da etapa mais fraca.
- **Não pode:** fundo de card ou bloco grande (fora o header das abas); títulos e textos longos; ícones de navegação inativos, bordas e divisores; pills de status comuns.
- **Densidade:** listas em cartões `surface` separados por 12, sem divisores; só o essencial (vendedor, hora, título, pills). O resumo de IA fica no detalhe (`ConversationCard showSummary` se precisar). Headers com respiro de 24 acima (além da safe area) e 24 abaixo.
- **Hero do Início:** foto `assets/images/hero-ceu-brasa.jpg` (Emanuel Haas, Unsplash License; espelhada na horizontal). Alternativas avaliadas em `docs/hero-opcoes/` com véus `veil-*`.
- **Brilho** (`<Glow>`): só atrás do botão de gravar e do timer, com no máximo 8% de opacidade.
- **Gradientes** (`<ScreenGradient>`): neutros, de `surface-elevated` para `background` no topo.
- Sem sombras. A profundidade vem de bordas e cinzas.

## Grid 4/8 (pixel perfect)

- Frame de 390pt (iPhone 15), com pt = px do Figma. Na web, o app fica preso a `max-w-frame` (390).
- **Espaçamento:** 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80 (mais `px` = 1 para divisores). A margem lateral das telas é 16.
- **Raios:** 8, 12, 16, 24 e full. **Bordas:** sempre 1. **Line-height:** múltiplo de 4.
- **Proibido:** classes arbitrárias (`p-[13px]`) e números soltos em `style`. Em `style`, só expressões com tokens (ex.: `insets.bottom + spacing[16]`). O ESLint e o `audit:scale` barram os dois.
- Alinhe com flexbox e `gap`; nada de posicionamento por tentativa.
- **Toque mínimo de 44:** use `hitSlop` de `sizes.hitSlop` (botão 40 → 4, botão 32 → 8).
- **Overlay:** `?grid=1` na URL, ou o botão flutuante nas rotas `/dev`. Linhas ciano a cada 4 e 8, faixas magenta nas margens de 16.

## Componentes

- `components/ui/`: primitivas (reusables adaptadas): `text`, `button` (cva: variant, shape, size), `skeleton` e `separator`.
- `components/`: componentes de produto:
  - Base: `PressableScale` (escala 0.97 + haptic), `Icon`, `IconButton` (circular; `shape="square"` só para voltar), `PillButton` (`variant="accent"` = Concluir), `SendButton` (círculo primary de 32), `StatusPill`, `Avatar`, `TimestampChip`.
  - Estrutura: `TabBar`, `Screen`, `ScreenHeader`, `SectionLabel`, `EmptyState`, `Sheet` (gorhom no nativo, `Sheet.web.tsx` = modal), `Glow`, `ScreenGradient`, `DotPattern`, `HeroArt`, `GridOverlay`, `Logo` (Perfecting, monocromático; paths em `logo-paths.ts`, gerados de `assets/brand/logotipo.svg`).
  - Produto: `ConversationCard`, `MentionItem`, `Waveform`, `TranscriptLine`, `TimelinePlayer`, `ScoreCard` (+ `ProgressBar`), `WeeklyBars`, `ChatMessage`, `CitationBadge`, `PromptLibrary`, `CommentComposer`, `MentionInput`, `MentionText`, `VisibilityToggle`.
- `FlutedGlass`: fundo em vidro canelado (ribbed) com onda de luz branca sutil e animada, portado do FlutedGlass da LP (`growth/lp-perfecting`) para expo-gl (GLSL ES 1.00, roda em iOS, Android e web). Shader em `lib/fx/fluted-glass.ts`. Usado na gravação.
- `features/`: lógica por tela: `recording/useRecorder` (expo-audio + metering, fallback simulado), `conversation/*` (abas do detalhe, header, contexto) e `marketing/scenes`.
- Componentes de terceiros que recebem `className` precisam de `cssInterop` (ver `lib/interop.ts`). Para `Animated.createAnimatedComponent`, registre onde o componente é criado.
- Haptics só via `lib/haptics.ts` (no-op na web). `cn()` em `lib/utils.ts` já conhece as escalas customizadas.

## Estrutura

```
app/              rotas (Expo Router)
  _layout.tsx     fontes, providers, frame 390, GridOverlay, ?grid=1, ?demo=1
  (tabs)/         index (Início), conversas, gravar, comentarios, desempenho + tab bar flutuante
  conversa/[id]/  detalhe com abas (?tab=transcricao|feedback|coach|comentarios, ?at=seg, ?from=&to=)
  dev/            ferramentas internas (/dev, /dev/tokens, /dev/marketing)
components/       componentes de produto
components/ui/    primitivas (react-native-reusables adaptadas)
theme/tokens.ts   design tokens + APP_NAME/COACH_NAME
lib/              utils (cn), haptics, interop, query-client
stores/           Zustand
types/domain.ts   tipos de domínio
mocks/            pessoas, conversas, transcrições, scorecards, comentários, coach, desempenho
api/              fetchers com latência simulada + db em memória (trocar só aqui pela API real)
hooks/            queries.ts (useConversations, useConversation…), useKeyboardInset
stores/           Zustand: dev (grid), player (reprodução simulada)
features/         lógica por tela
scripts/          audit-scale.ts, shot.ts, screenshots.ts (fase 7)
docs/referencias/ imagens de referência
```

## Dados e modo demo

- Dados: hooks em `hooks/queries.ts` sobre `api/index.ts`. A latência é de 300 a 700ms, e o modo demo não tem latência.
- A usuária logada é a gestora (`CURRENT_USER_ID` em `mocks/people.ts`).
- Uma gravação nova vira uma conversa "Processando" por `PROCESSING_MS`. Depois disso ela usa os dados da conversa-modelo `c1`.
- O player é simulado por relógio (`stores/player.ts`). Para áudio real, troque o `tick` pelo status do expo-audio.
- **Home = descanso de tela** (`hooks/useIdleReveal.ts`): em repouso mostra só a foto, o logo, o avatar e a tab bar. Qualquer toque, rolagem, mouse ou tecla revela as informações (fade de 320ms + véu de leitura); após 6s sem interação, no topo, volta ao repouso. Com leitor de tela (só no nativo; na web a API sempre diz true) nunca entra em repouso. `?demo=1&idle=1` força o repouso.
- `?demo=1` fixa os estados de apresentação: timer em 15:02, player em "2 de 8", compositor preenchido e Coach com pergunta digitada. As cenas ficam em `features/marketing/scenes.ts`.

## Convenções

- Nenhuma cor, fonte, raio ou medida hardcoded fora de `theme/tokens.ts`.
- Todo botão de ícone tem `label` (acessibilidade).
- Toda lista tem skeleton de carregamento e estado vazio desenhado.
- Animações com Reanimated; toque com `PressableScale`.
- **Ao fim de cada fase:** rodar `typecheck`, `lint` e `audit:scale`; tirar screenshot de cada tela com `?grid=1`; comparar com `docs/referencias/`; listar as diferenças.
