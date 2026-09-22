/**
 * The formulas of the screenshots, in the order they appear. The first one
 * sits inline in a paragraph, the rest are Math blocks.
 */
const inline = {
	latex: 'e^{i\\pi} + 1 = 0',
	before: "Euler's identity ",
	after: ' is often called the most beautiful equation, and here it sits inline.',
};

const blocks = [
	'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
	'\\sum_{i=1}^{n} i^2 = \\frac{n(n+1)(2n+1)}{6}',
	'\\cfrac{1}{1 + \\cfrac{1}{1 + \\cfrac{1}{1 + x}}}',
	'\\left( \\frac{a}{b} \\right)^{2} + \\left[ \\sum_{k} x_k \\right]',
	'\\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix}',
	'f(x) = \\begin{cases} x^2 & \\text{if } x \\ge 0 \\\\ -x & \\text{otherwise} \\end{cases}',
	'\\hat{x} + \\vec{v} + \\widehat{abc} + \\overline{z} + \\tilde{n} + \\dot{y}',
	'\\overbrace{a + b + c}^{\\text{sum}} + \\underbrace{d \\cdot e}_{\\text{product}}',
	'\\boxed{E = mc^2}',
	'E = mc^2 \\tag{1}',
	'\\cancel{a} + \\bcancel{b} + \\xcancel{c} + \\sout{d}',
	'A \\xrightarrow{\\;f\\;} B \\xleftarrow[\\text{under}]{\\text{over}} C \\xrightleftharpoons{k} D',
	'\\begin{CD} A @>a>> B \\\\ @VbVV @VVcV \\\\ C @>>d> D \\end{CD}',
	'\\sum_{\\substack{0 < i < m \\\\ 0 < j < n}} P(i, j)',
	'\\underbrace{x_1 + x_2 + \\cdots + x_n}_{n \\text{ terms}} = \\overbrace{y}^{\\mathclap{\\text{wide label here}}}',
];

module.exports = { inline, blocks };
