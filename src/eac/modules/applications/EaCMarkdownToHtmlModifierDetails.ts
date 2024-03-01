import {
  EaCModifierDetails,
  isEaCModifierDetails,
} from "./EaCModifierDetails.ts";

export type EaCMarkdownToHtmlModifierDetails =
  & {}
  & EaCModifierDetails<"MarkdownToHtml">;

export function isEaCMarkdownToHtmlModifierDetails(
  details: unknown,
): details is EaCMarkdownToHtmlModifierDetails {
  const x = details as EaCMarkdownToHtmlModifierDetails;

  return isEaCModifierDetails("MarkdownToHtml", x);
}
