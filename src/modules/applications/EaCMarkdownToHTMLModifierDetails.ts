import {
  EaCModifierDetails,
  isEaCModifierDetails,
} from "./EaCModifierDetails.ts";

export type EaCMarkdownToHTMLModifierDetails =
  & {}
  & EaCModifierDetails<"MarkdownToHTML">;

export function isEaCMarkdownToHTMLModifierDetails(
  details: unknown,
): details is EaCMarkdownToHTMLModifierDetails {
  const x = details as EaCMarkdownToHTMLModifierDetails;

  return isEaCModifierDetails("MarkdownToHTML", x);
}
