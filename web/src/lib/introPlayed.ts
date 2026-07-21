/**
 * Onthoudt of de LoadIntro deze pageload al gedraaid heeft.
 *
 * Bewust een module-scope variabele en geen sessionStorage: deze reset bij een
 * echte pageload (hard refresh, nieuw tabblad, externe navigatie) maar overleeft
 * client-side routerwissels. sessionStorage zou een refresh juist overleven en de
 * intro dus voorgoed uitzetten.
 */
let played = false;

export function introHasPlayed() {
  return played;
}

export function markIntroPlayed() {
  played = true;
}
