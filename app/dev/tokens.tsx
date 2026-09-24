import {
  AudioLines,
  ChevronLeft,
  CircleCheck,
  Menu,
  MessageSquare,
  Mic,
  Pause,
  Pencil,
  Play,
  Trash2,
} from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { Logo } from '@/components/Logo';
import { PillButton, StopMarker } from '@/components/PillButton';
import { PressableScale } from '@/components/PressableScale';
import { ScreenGradient } from '@/components/ScreenGradient';
import { Screen } from '@/components/Screen';
import { SendButton } from '@/components/SendButton';
import { StatusPill } from '@/components/StatusPill';
import { TabBar, type TabKey } from '@/components/TabBar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Text, type TextVariant } from '@/components/ui/text';
import { APP_NAME, COACH_NAME, colors, radius, spacing, type ColorToken } from '@/theme/tokens';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="gap-12">
      <Text variant="label">{title}</Text>
      {children}
    </View>
  );
}

const SWATCHES: ColorToken[] = [
  'background',
  'surface',
  'surface-elevated',
  'surface-highlight',
  'border',
  'border-strong',
  'text',
  'text-muted',
  'text-subtle',
  'primary',
  'primary-soft',
  'success',
  'warning',
  'danger',
];

const SWATCH_BG: Partial<Record<ColorToken, string>> = {
  background: 'bg-background',
  surface: 'bg-surface',
  'surface-elevated': 'bg-surface-elevated',
  'surface-highlight': 'bg-surface-highlight',
  border: 'bg-border',
  'border-strong': 'bg-border-strong',
  text: 'bg-text',
  'text-muted': 'bg-text-muted',
  'text-subtle': 'bg-text-subtle',
  primary: 'bg-primary',
  'primary-soft': 'bg-primary-soft',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
};

const RADII = [
  ['8', 'rounded-8'],
  ['12', 'rounded-12'],
  ['16', 'rounded-16'],
  ['24', 'rounded-24'],
  ['full', 'rounded-full'],
] as const;

const TYPE_SAMPLES: { variant: TextVariant; sample: string; spec: string }[] = [
  { variant: 'display-xl', sample: '15:02', spec: 'Anton 96/96' },
  { variant: 'display-lg', sample: 'Coach em qualquer lugar', spec: 'Anton 48/48' },
  { variant: 'display-md', sample: '2 conversas', spec: 'Anton 32/40' },
  { variant: 'display-sm', sample: '9/12', spec: 'Anton 24/32' },
  { variant: 'title', sample: 'Projeto cozinha planejada — Marina', spec: 'Inter 600 16/24' },
  { variant: 'subtitle', sample: 'Rafael Souza', spec: 'Inter 500 14/20' },
  { variant: 'body', sample: 'A cliente pediu prazo de entrega em 30 dias.', spec: 'Inter 400 14/20' },
  { variant: 'caption', sample: 'Hoje, 10:30 · 1h 32min', spec: 'Inter 400 12/16' },
  { variant: 'label', sample: 'Hoje', spec: 'Inter 500 12/16 caixa alta' },
];

function PreviewConversation() {
  return (
    <View className="gap-8 py-16">
      <View className="flex-row items-center gap-8">
        <View className="h-24 w-24 items-center justify-center rounded-full bg-avatar-1">
          <Text className="font-sans text-12 text-background">RS</Text>
        </View>
        <Text variant="subtitle" className="text-12">
          Rafael Souza
        </Text>
        <Text variant="caption" className="text-text-subtle">
          Hoje 10:30 · 1h 32min
        </Text>
      </View>
      <Text variant="title">Cozinha planejada — Marina Alves</Text>
      <View className="flex-row gap-8">
        <StatusPill label="9/12" icon={CircleCheck} iconColor="success" />
        <StatusPill label="R$ 18.400" />
        <StatusPill label="Vendido" />
      </View>
      <Text variant="caption" numberOfLines={2} className="text-text-subtle">
        A cliente chegou com planta do apartamento e prazo apertado. O vendedor conduziu bem a sondagem e fechou com
        entrada de 30%.
      </Text>
    </View>
  );
}

export default function TokensScreen() {
  const [tab, setTab] = useState<TabKey>('index');
  const [playing, setPlaying] = useState(false);

  return (
    <Screen tabBarInset contentClassName="gap-40">
      <View className="gap-16">
        <Logo height={24} />
        <View className="gap-4">
          <Text variant="display-lg">Design system</Text>
          <Text variant="caption">
            {APP_NAME} · assistente “{COACH_NAME}” · grid 4/8 · frame 390
          </Text>
        </View>
      </View>

      <Section title="Cores">
        <View className="flex-row flex-wrap gap-12">
          {SWATCHES.map((c) => (
            <View key={c} className="w-80 gap-4">
              <View className={`h-48 rounded-12 border border-border ${SWATCH_BG[c] ?? ''}`} />
              <Text className="font-sans text-12">{c}</Text>
              <Text variant="caption" className="text-text-subtle">
                {colors[c]}
              </Text>
            </View>
          ))}
        </View>
      </Section>

      <Section title="Tipografia">
        <View className="gap-16">
          {TYPE_SAMPLES.map((t) => (
            <View key={t.variant} className="gap-4">
              <Text variant={t.variant} numberOfLines={1}>
                {t.sample}
              </Text>
              <Text variant="caption" className="text-text-subtle">
                {t.variant} · {t.spec}
              </Text>
            </View>
          ))}
        </View>
      </Section>

      <Section title="Espaçamento">
        <View className="gap-8">
          {Object.values(spacing)
            .filter((v) => v >= 4)
            .map((v) => (
              <View key={v} className="flex-row items-center gap-12">
                <Text variant="caption" className="w-24">
                  {v}
                </Text>
                <View className="h-8 rounded-full bg-text-subtle" style={{ width: v }} />
              </View>
            ))}
        </View>
      </Section>

      <Section title="Raios">
        <View className="flex-row gap-12">
          {RADII.map(([r, cls]) => (
            <View key={r} className="items-center gap-4">
              <View className={`h-48 w-48 border border-border-strong bg-surface-elevated ${cls}`} />
              <Text variant="caption">{r === 'full' ? 'full' : radius[r]}</Text>
            </View>
          ))}
        </View>
      </Section>

      <Section title="Botões">
        <View className="gap-16 rounded-16 border border-border bg-surface p-16">
          <View className="flex-row items-center gap-12">
            <IconButton icon={ChevronLeft} label="Voltar" shape="square" />
            <IconButton icon={Mic} label="Áudio" size="sm" />
            <IconButton icon={MessageSquare} label="Comentar" />
            <IconButton icon={playing ? Pause : Play} label="Reproduzir" size="lg" onPress={() => setPlaying((p) => !p)} />
            <SendButton />
          </View>
          <View className="flex-row flex-wrap items-center gap-12">
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Concluir"
              haptic="light"
              className="h-48 flex-row items-center gap-8 rounded-full border border-primary bg-surface-elevated px-20"
            >
              <StopMarker />
              <Text className="font-medium text-14">Concluir</Text>
            </PressableScale>
            <PillButton label="Biblioteca de prompts" icon={Pencil} />
            <PillButton label="Anterior" size="sm" />
          </View>
          <View className="flex-row items-center gap-12">
            <IconButton icon={Pause} label="Pausar" size="lg" />
            <IconButton icon={Trash2} label="Descartar" size="lg" variant="ghost" iconColor="text-muted" />
            <IconButton icon={Menu} label="Menu" variant="ghost" />
          </View>
        </View>
      </Section>

      <Section title="Pills de status">
        <View className="flex-row flex-wrap gap-8">
          <StatusPill label="9/12" icon={CircleCheck} iconColor="success" />
          <StatusPill label="6/12" icon={CircleCheck} />
          <StatusPill label="Vendido" />
          <StatusPill label="Em negociação" />
          <StatusPill label="R$ 18.400" />
        </View>
      </Section>

      <Section title="Carregamento">
        <View className="gap-8 rounded-16 border border-border bg-surface p-16">
          <Skeleton className="h-16 w-1/2" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-3/4" />
        </View>
      </Section>

      <Section title="Tab bar">
        <TabBar active={tab} onSelect={setTab} />
      </Section>

      <Section title="Prévia de tela (proporção 90/10)">
        <View className="overflow-hidden rounded-24 border border-border bg-background">
          <View className="h-80 flex-row items-end justify-between px-16 pb-12">
            <ScreenGradient className="h-80" />
            <Text variant="display-md">2 conversas</Text>
            <IconButton icon={Menu} label="Menu" variant="ghost" />
          </View>
          <View className="px-16">
            <Text variant="label" className="pt-16">
              Hoje
            </Text>
            <PreviewConversation />
            <Separator />
            <PreviewConversation />
          </View>
          <View className="items-center gap-8 py-24">
            <Text variant="caption" className="text-primary">
              Gravando
            </Text>
            <View className="flex-row items-center gap-4">
              <Icon as={AudioLines} size="sm" color="primary" />
              <Text variant="display-sm">15:02</Text>
            </View>
          </View>
          <TabBar active="conversas" onSelect={() => undefined} className="pb-16" />
        </View>
      </Section>
    </Screen>
  );
}
