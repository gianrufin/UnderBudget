/**
 * A tiny, dependency-free, safe arithmetic evaluator.
 *
 * Supports +, -, *, / with correct precedence, unary minus, decimals and
 * parentheses. Implemented with the shunting-yard algorithm so we never touch
 * `eval` / `Function`.
 */

const OPERATORS = {
  '+': { precedence: 1, apply: (a, b) => a + b },
  '-': { precedence: 1, apply: (a, b) => a - b },
  '*': { precedence: 2, apply: (a, b) => a * b },
  '/': { precedence: 2, apply: (a, b) => a / b },
}

function tokenize(expr) {
  const tokens = []
  let i = 0
  while (i < expr.length) {
    const ch = expr[i]

    if (ch === ' ') {
      i++
      continue
    }

    if (ch >= '0' && ch <= '9') {
      let num = ch
      i++
      while (i < expr.length && ((expr[i] >= '0' && expr[i] <= '9') || expr[i] === '.')) {
        num += expr[i]
        i++
      }
      tokens.push({ type: 'number', value: parseFloat(num) })
      continue
    }

    if (ch === '.') {
      // Leading-decimal number, e.g. ".5"
      let num = '0.'
      i++
      while (i < expr.length && expr[i] >= '0' && expr[i] <= '9') {
        num += expr[i]
        i++
      }
      tokens.push({ type: 'number', value: parseFloat(num) })
      continue
    }

    if (ch in OPERATORS || ch === '(' || ch === ')') {
      tokens.push({ type: 'op', value: ch })
      i++
      continue
    }

    throw new Error(`Unexpected character: ${ch}`)
  }
  return tokens
}

/**
 * Evaluate an arithmetic expression string.
 * @returns {number|null} the result, or null if the expression is invalid/empty.
 */
export function evaluate(expr) {
  if (!expr || !expr.trim()) return null

  let tokens
  try {
    tokens = tokenize(expr)
  } catch {
    return null
  }

  const output = []
  const ops = []
  let prev = null // previous token, to detect unary minus

  for (const token of tokens) {
    if (token.type === 'number') {
      output.push(token.value)
    } else if (token.value === '(') {
      ops.push(token.value)
    } else if (token.value === ')') {
      while (ops.length && ops[ops.length - 1] !== '(') {
        output.push(ops.pop())
      }
      if (!ops.length) return null // mismatched parens
      ops.pop() // discard '('
    } else {
      let op = token.value
      // Unary minus: convert to (0 - x) by pushing a 0 first.
      const isUnary =
        op === '-' &&
        (prev === null || prev.value === '(' || (prev.type === 'op' && prev.value in OPERATORS))
      if (isUnary) {
        output.push(0)
      }
      while (
        ops.length &&
        ops[ops.length - 1] !== '(' &&
        OPERATORS[ops[ops.length - 1]].precedence >= OPERATORS[op].precedence
      ) {
        output.push(ops.pop())
      }
      ops.push(op)
    }
    prev = token
  }

  while (ops.length) {
    const op = ops.pop()
    if (op === '(') return null // mismatched parens
    output.push(op)
  }

  // Evaluate the resulting RPN.
  const stack = []
  for (const item of output) {
    if (typeof item === 'number') {
      stack.push(item)
    } else {
      const b = stack.pop()
      const a = stack.pop()
      if (a === undefined || b === undefined) return null
      stack.push(OPERATORS[item].apply(a, b))
    }
  }

  if (stack.length !== 1) return null
  const result = stack[0]
  return Number.isFinite(result) ? result : null
}

/** Round to at most `places` decimals without trailing-zero noise. */
export function roundResult(value, places = 4) {
  if (value === null || !Number.isFinite(value)) return value
  const factor = 10 ** places
  return Math.round(value * factor) / factor
}
