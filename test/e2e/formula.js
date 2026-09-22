/**
 * The markup the inline math format saves: MathML with the LaTeX source in an
 * annotation.
 *
 * @param {string} latex  The LaTeX source.
 * @param {string} mathml The MathML of the formula.
 * @return {string} The `<math>` element.
 */
function formula( latex, mathml ) {
	return `<math data-latex="${ latex }"><semantics><mrow>${ mathml }</mrow><annotation encoding="application/x-tex">${ latex }</annotation></semantics></math>`;
}

module.exports = { formula };
