/////////////////////////////////////////////////////////////////////////////////////////////////
// This code is heavily inspired by https://github.com/tsoding/emoteJAM/blob/master/ts/eval.ts //
/////////////////////////////////////////////////////////////////////////////////////////////////

//#region Types
interface EvalOptions {
	variables?: { [name: string]: number };
	functions?: { [name: string]: (...args: number[]) => number };
}

enum Precedences {
	PR0,
	PR1,
	PR2,
	PRECEDENCE_COUNT,
}

type BinaryOp = '+' | '-' | '*' | '^' | '/' | '%';
type UnaryOp = '-';

const BinaryOps: {
	[op in BinaryOp]: {
		precedence: Precedences;
		operation: (op1: number, op2: number) => number;
	};
} = {
	'+': {
		precedence: Precedences.PR0,
		operation: (op1, op2) => op1 + op2,
	},
	'-': {
		precedence: Precedences.PR0,
		operation: (op1, op2) => op1 - op2,
	},
	'*': {
		precedence: Precedences.PR1,
		operation: (op1, op2) => op1 * op2,
	},
	'^': {
		precedence: Precedences.PR2,
		operation: (op1, op2) => op1 ** op2,
	},
	'/': {
		precedence: Precedences.PR1,
		operation: (op1, op2) => op1 / op2,
	},
	'%': {
		precedence: Precedences.PR1,
		operation: (op1, op2) => op1 % op2,
	},
};
const UnaryOps: {
	[op in UnaryOp]: {
		precedence: Precedences;
		operation: (op: number) => number;
	};
} = {
	'-': { precedence: Precedences.PR1, operation: (op) => -op },
};

type ExpressionTypes = 'BINARY_OP' | 'UNARY_OP' | 'FUNCTION' | 'VARIABLE';

interface BinaryOpExpression {
	op: BinaryOp;
	op1: Expression;
	op2: Expression;
}

interface UnaryOpExpression {
	op: UnaryOp;
	op1: Expression;
}

interface FunctionExpression {
	name: string;
	args: Expression[];
}

interface VariableExpression {
	value: string;
}

interface Expression {
	expressionType: ExpressionTypes;
	expression:
		| BinaryOpExpression
		| UnaryOpExpression
		| FunctionExpression
		| VariableExpression;
}

//#endregion Types

class TokenGenerator {
	#string: string;
	#extraStoppingChars = '(),';

	constructor(string: string) {
		this.#string = string;
	}

	prepend(str: string) {
		this.#string = str + this.#string;
	}

	next() {
		this.#string = this.#string.trimStart();

		if (!this.#string.length) return null;

		const isStoppingToken = (c: string) =>
			c in BinaryOps || c in UnaryOps || this.#extraStoppingChars.includes(c);

		if (isStoppingToken(this.#string[0])) {
			const token = this.#string[0];
			this.#string = this.#string.slice(1);
			return token;
		}

		for (let i = 0; i < this.#string.length; i++) {
			if (isStoppingToken(this.#string[i]) || this.#string[i] == ' ') {
				const token = this.#string.slice(0, i);
				this.#string = this.#string.slice(i);
				return token;
			}
		}

		const token = this.#string;
		this.#string = '';
		return token;
	}
}

function parse(generator: TokenGenerator): Expression {
	let token = generator.next();
	if (token == null) {
		throw new Error('Unexpected end of input');
	} else {
		if (token in UnaryOps) {
			let op1 = parseExpression(
				generator,
				UnaryOps[token as UnaryOp].precedence
			);
			return {
				expressionType: 'UNARY_OP',
				expression: { op: token as UnaryOp, op1 },
			};
		} else if (token == '(') {
			let expression = parseExpression(generator);
			token = generator.next();
			if (token != ')') throw new Error(`Expected \`)\` but got \`${token}\``);
			return expression;
		} else if (token == ')') {
			throw new Error('Expression cannot start with `)`');
		} else {
			let nextToken = generator.next();

			if (nextToken == '(') {
				const args: Expression[] = [];
				nextToken = generator.next();

				if (nextToken == ')')
					return {
						expressionType: 'FUNCTION',
						expression: { name: token, args },
					};
				else if (nextToken == null) throw new Error('Unexpected end of input');
				else {
					generator.prepend(nextToken);

					args.push(parseExpression(generator));
					nextToken = generator.next();
					while (nextToken == ',') {
						args.push(parseExpression(generator));
						nextToken = generator.next();
					}

					if (nextToken != ')') {
						throw Error(`Expected \`)\` but got \`${nextToken}\``);
					}

					return {
						expressionType: 'FUNCTION',
						expression: { name: token, args },
					};
				}
			} else {
				if (nextToken != null) generator.prepend(nextToken);
				return { expressionType: 'VARIABLE', expression: { value: token } };
			}
		}
	}
}

function parseExpression(
	generator: TokenGenerator,
	precedence: Precedences = Precedences.PR0
): Expression {
	if (precedence >= Precedences.PRECEDENCE_COUNT) return parse(generator);

	let op1 = parseExpression(generator, precedence + 1);

	let opToken = generator.next();

	if (opToken != null)
		if (
			opToken in BinaryOps &&
			BinaryOps[opToken as BinaryOp].precedence == precedence
		) {
			let op2 = parseExpression(generator, precedence);

			return {
				expressionType: 'BINARY_OP',
				expression: { op: opToken as BinaryOp, op1, op2 },
			};
		} else generator.prepend(opToken);

	return op1;
}

function compile(string: string): Expression {
	const generator = new TokenGenerator(string);
	const result = parseExpression(generator);
	const token = generator.next();

	if (token == null) return result;
	throw new Error(`Unexpected token \`${token}\``);
}

function evalExpression(expression: Expression, options?: EvalOptions): number {
	if (typeof expression == 'object') {
		switch (expression.expressionType) {
			case 'VARIABLE': {
				const variable = expression.expression as VariableExpression;
				const value = variable.value;
				const number = Number(value);

				if (!isNaN(number)) return number;
				if (options?.variables && value in options.variables)
					return options.variables[value];
				throw new Error(`Unknown variable \`${value}\` `);
			}

			case 'UNARY_OP': {
				const unOp = expression.expression as UnaryOpExpression;

				if (unOp.op in UnaryOps)
					return UnaryOps[unOp.op].operation(evalExpression(unOp.op1, options));
				throw new Error(`Unknown unary operator \`${unOp.op}\` `);
			}

			case 'BINARY_OP': {
				const binOp = expression.expression as BinaryOpExpression;

				if (binOp.op in BinaryOps)
					return BinaryOps[binOp.op].operation(
						evalExpression(binOp.op1, options),
						evalExpression(binOp.op2, options)
					);
				throw new Error(`Unknown unary operator \`${binOp.op}\` `);
			}

			case 'FUNCTION': {
				const func = expression.expression as FunctionExpression;

				if (options?.functions && func.name in options.functions)
					return options.functions[func.name](
						...func.args.map((arg) => evalExpression(arg, options))
					);

				throw new Error(`Unknown function \`${func.name}\` `);
			}

			default:
				throw new Error(`Unexpected \`${expression.expressionType}\``);
		}
	}
	throw new Error('Invalid Expression');
}

const saveEval = (expr: string, options?: EvalOptions) =>
	evalExpression(compile(expr), options);

export default saveEval;
