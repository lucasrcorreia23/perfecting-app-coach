import { Link, type Href } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { APP_NAME } from '@/theme/tokens';

const ROUTES = [
  { href: '/dev/tokens', title: 'Design system', description: 'Cores, tipografia, escala, botões e prévia' },
  { href: '/dev/marketing', title: 'Marketing', description: 'Cenas na moldura de iPhone (1290x2796)' },
  { href: '/?demo=1', title: 'Demo · Início', description: 'Hero em tela cheia' },
  { href: '/gravar?demo=1', title: 'Demo · Gravação', description: 'Timer em 15:02 e waveform ativa' },
  { href: '/conversas?demo=1', title: 'Demo · Inbox', description: '2 conversas hoje' },
  { href: '/conversa/c1?tab=transcricao&demo=1', title: 'Demo · Transcrição', description: 'Trecho destacado e player em 2 de 8' },
  { href: '/conversa/c1?tab=coach&demo=1', title: 'Demo · Coach', description: 'Pergunta e resposta com citações' },
  { href: '/conversa/c1?tab=comentarios&demo=1', title: 'Demo · Compositor', description: 'Comentário com menção preenchida' },
  { href: '/conversa/c1?tab=feedback&demo=1', title: 'Demo · Feedback', description: 'Scorecard completo' },
] as const;

export default function DevIndex() {
  return (
    <Screen>
      <View className="gap-4">
        <Text variant="label">{APP_NAME}</Text>
        <Text variant="display-lg">Dev</Text>
      </View>
      <View className="rounded-16 border border-border bg-surface">
        {ROUTES.map((r, i) => (
          <View key={r.href}>
            {i > 0 ? <Separator /> : null}
            <Link href={r.href as Href} asChild>
              <Pressable className="flex-row items-center gap-12 p-16">
                <View className="flex-1 gap-4">
                  <Text variant="title">{r.title}</Text>
                  <Text variant="caption">{r.description}</Text>
                </View>
                <Icon as={ChevronRight} size="md" color="text-subtle" />
              </Pressable>
            </Link>
          </View>
        ))}
      </View>
    </Screen>
  );
}
