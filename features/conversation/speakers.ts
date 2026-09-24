import { personById } from '@/mocks/people';
import type { Conversation, Speaker, Transcript } from '@/types/domain';

/** Nome, iniciais e tom de avatar de cada falante da conversa. */
export function speakerInfo(conversation: Conversation, transcript: Transcript, speaker: Speaker) {
  if (speaker === 'seller') {
    const seller = personById(conversation.sellerId);
    return { name: seller.name, initials: seller.initials, tone: seller.avatarColor };
  }
  return { name: transcript.customerName, initials: transcript.customerInitials, tone: 'neutral' as const };
}
