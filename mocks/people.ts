import type { Person } from '@/types/domain';

export const people: Person[] = [
  { id: 'p1', name: 'Rafael Souza', initials: 'RS', role: 'vendedor', store: 'Móveis planejados', avatarColor: 'avatar-1' },
  { id: 'p2', name: 'Camila Andrade', initials: 'CA', role: 'vendedor', store: 'Concessionária', avatarColor: 'avatar-2' },
  { id: 'p3', name: 'Diego Martins', initials: 'DM', role: 'vendedor', store: 'Eletro e ótica', avatarColor: 'avatar-3' },
  { id: 'p4', name: 'Juliana Prado', initials: 'JP', role: 'gestor', store: 'Gestão comercial', avatarColor: 'avatar-4' },
];

/** Usuária logada no protótipo: a gestora. */
export const CURRENT_USER_ID = 'p4';

export const mentionTargets = [
  { handle: 'Vendas', label: 'Equipe de vendas' },
  { handle: 'Gestão', label: 'Gestores' },
  { handle: 'Rafael', label: 'Rafael Souza' },
  { handle: 'Camila', label: 'Camila Andrade' },
  { handle: 'Diego', label: 'Diego Martins' },
];

export function personById(id: string): Person {
  return people.find((p) => p.id === id) ?? people[0]!;
}
