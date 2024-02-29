import {
  EaCModifierDetails,
  isEaCModifierDetails,
} from './EaCModifierDetails.ts';

export type EaCMarkdownModifierDetails = {
  Type: 'Markdown';
} & EaCModifierDetails;

export function isEaCMarkdownModifierDetails(
  details: unknown
): details is EaCMarkdownModifierDetails {
  const kvDetails = details as EaCMarkdownModifierDetails;

  return (
    isEaCModifierDetails(kvDetails) &&
    kvDetails.Type === 'Markdown'
  );
}
