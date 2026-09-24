import { router, useFocusEffect } from 'expo-router';
import { Mic, Pause, Pencil, Play, Trash2 } from 'lucide-react-native';
import { useCallback, useRef, useState } from 'react';
import { Linking, TextInput, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FlutedGlass } from '@/components/FlutedGlass';
import { Glow } from '@/components/Glow';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { PillButton, StopMarker } from '@/components/PillButton';
import { PressableScale } from '@/components/PressableScale';
import { Sheet } from '@/components/Sheet';
import { Waveform } from '@/components/Waveform';
import { Text } from '@/components/ui/text';
import { useRecorder } from '@/features/recording/useRecorder';
import { useCreateRecording } from '@/hooks/queries';
import { useDemo } from '@/lib/demo';
import { formatClock, formatTime } from '@/lib/format';
import { haptics } from '@/lib/haptics';
import { colors, motion, spacing } from '@/theme/tokens';

function PermissionGate({
  denied,
  onAllow,
  onCancel,
}: {
  denied: boolean;
  onAllow: () => void;
  onCancel: () => void;
}) {
  return (
    <Animated.View entering={FadeIn.duration(motion.duration.slow)} className="flex-1 items-center justify-center gap-32 px-32">
      <View className="h-80 w-80 items-center justify-center">
        <Glow className="-bottom-40 -left-40 -right-40 -top-40" intensity={0.06} />
        <View className="h-64 w-64 items-center justify-center rounded-full border border-border bg-surface-elevated">
          <Icon as={Mic} size="lg" />
        </View>
      </View>
      <View className="items-center gap-12">
        <Text variant="display-md" className="text-center">
          {denied ? 'Microfone bloqueado' : 'Permita o microfone'}
        </Text>
        <Text variant="body" className="text-center text-text-muted">
          {denied
            ? 'Ative o acesso ao microfone nas configurações para gravar suas conversas.'
            : 'Gravamos a conversa com o cliente para gerar a transcrição e o feedback. Nada é compartilhado sem você.'}
        </Text>
      </View>
      <View className="items-center gap-12">
        <PillButton
          size="lg"
          variant="accent"
          label={denied ? 'Abrir configurações' : 'Permitir microfone'}
          onPress={denied ? () => Linking.openSettings() : onAllow}
        />
        <PillButton size="md" variant="ghost" label="Agora não" onPress={onCancel} />
      </View>
    </Animated.View>
  );
}

export default function GravarScreen() {
  const insets = useSafeAreaInsets();
  const demo = useDemo();
  const rec = useRecorder({ demo });
  const create = useCreateRecording();
  const [title, setTitle] = useState(() =>
    demo ? 'Cozinha planejada — Apto Vila Mariana' : `Atendimento ${formatTime(new Date().toISOString())}`,
  );
  const [editing, setEditing] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  // Ao entrar na aba com permissão concedida, começa a gravar (uma vez por foco).
  const starting = useRef(false);
  // Depois de concluir/descartar, não reinicia até sair e voltar à aba.
  const halted = useRef(false);
  const { permission, phase, start } = rec;
  useFocusEffect(
    useCallback(
      () => () => {
        halted.current = false;
      },
      [],
    ),
  );
  useFocusEffect(
    useCallback(() => {
      if (permission !== 'granted' || phase !== 'idle' || starting.current || halted.current) return;
      starting.current = true;
      start()
        .catch(() => undefined)
        .finally(() => {
          starting.current = false;
        });
    }, [permission, phase, start]),
  );

  const leave = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.navigate('/');
  }, []);

  const conclude = async () => {
    haptics.success();
    halted.current = true;
    const { durationSec } = await rec.stop();
    const conversation = await create.mutateAsync({ title: title.trim() || 'Nova conversa', durationSec });
    router.navigate('/conversas');
    router.push(`/conversa/${conversation.id}`);
  };

  const discard = async () => {
    setConfirmDiscard(false);
    halted.current = true;
    await rec.stop();
    leave();
  };

  if (rec.permission === 'checking') return <View className="flex-1 bg-background" />;

  if (rec.permission !== 'granted') {
    return (
      <View className="flex-1 bg-background" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <PermissionGate
          denied={rec.permission === 'denied'}
          onAllow={async () => {
            if (await rec.requestPermission()) await rec.start();
          }}
          onCancel={leave}
        />
      </View>
    );
  }

  const paused = rec.phase === 'paused';

  return (
    <View className="flex-1 bg-background">
      <FlutedGlass />

      <View className="items-center" style={{ paddingTop: insets.top + spacing[24] }}>
        <Text className={paused || rec.error || rec.phase === 'idle' ? 'font-sans text-12 text-text-muted' : 'font-sans text-12 text-primary'}>
          {rec.error ?? (paused ? 'Pausado' : rec.phase === 'idle' ? 'Preparando…' : 'Gravando')}
        </Text>
      </View>

      <View className="flex-1 items-center justify-center gap-8">
        <View className="items-center justify-center">
          <Glow className="-bottom-80 -left-80 -right-80 -top-80" intensity={paused ? 0.04 : 0.08} />
          <Text
            variant="display-xl"
            accessibilityRole="timer"
            accessibilityLabel={`Tempo de gravação ${formatClock(rec.elapsedSec)}`}
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {formatClock(rec.elapsedSec)}
          </Text>
        </View>
        <Waveform levels={rec.levels} active={!paused} />
      </View>

      <View
        className="gap-24 rounded-t-24 border-t border-border bg-surface px-16 pt-12"
        style={{ paddingBottom: Math.max(insets.bottom, spacing[16]) + spacing[16] }}
      >
        <View className="h-4 w-32 self-center rounded-full bg-border-strong" />

        {editing ? (
          <TextInput
            autoFocus
            value={title}
            onChangeText={setTitle}
            onBlur={() => setEditing(false)}
            onSubmitEditing={() => setEditing(false)}
            returnKeyType="done"
            selectionColor={colors.primary}
            accessibilityLabel="Nome da oportunidade"
            className="h-24 text-center font-medium text-14 text-text"
          />
        ) : (
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={`Editar nome da oportunidade: ${title}`}
            onPress={() => setEditing(true)}
            hitSlop={spacing[12]}
            className="h-24 flex-row items-center justify-center gap-8"
          >
            <Icon as={Pencil} size="sm" color="text-muted" />
            <Text className="font-medium text-14 text-text-muted" numberOfLines={1}>
              {title}
            </Text>
          </PressableScale>
        )}

        <View className="flex-row items-center justify-between px-8">
          <IconButton
            icon={paused || rec.phase === 'idle' ? Play : Pause}
            label={rec.phase === 'idle' ? 'Iniciar gravação' : paused ? 'Retomar gravação' : 'Pausar gravação'}
            haptic="light"
            onPress={rec.phase === 'idle' ? () => rec.start() : paused ? rec.resume : rec.pause}
          />
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel="Concluir gravação"
            haptic="medium"
            disabled={create.isPending}
            onPress={conclude}
            className="h-48 flex-row items-center gap-12 rounded-full border border-primary bg-surface-elevated px-24"
          >
            <StopMarker />
            <Text className="font-medium text-14">{create.isPending ? 'Salvando…' : 'Concluir'}</Text>
          </PressableScale>
          <IconButton icon={Trash2} label="Descartar gravação" iconColor="text-muted" onPress={() => setConfirmDiscard(true)} />
        </View>
      </View>

      <Sheet open={confirmDiscard} onClose={() => setConfirmDiscard(false)} title="Descartar gravação">
        <Text variant="body" className="text-text-muted">
          O áudio de {formatClock(rec.elapsedSec)} será apagado e não poderá ser recuperado.
        </Text>
        <View className="flex-row gap-12 pt-8">
          <PillButton label="Continuar gravando" className="flex-1" onPress={() => setConfirmDiscard(false)} />
          <PillButton label="Descartar" variant="secondary" icon={Trash2} className="flex-1" onPress={discard} />
        </View>
      </Sheet>
    </View>
  );
}
