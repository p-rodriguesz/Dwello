export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code = 'APP_ERROR'
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function databaseUnavailableError() {
  return new AppError(503, 'Banco de dados não configurado.', 'DATABASE_UNAVAILABLE');
}

export function databaseError(error: unknown): AppError | null {
  // O Drizzle embrulha o erro do MySQL em "Failed query"; o código real fica em error.cause.
  const code = (error as { code?: string }).code ?? (error as { cause?: { code?: string } }).cause?.code;

  if (code === 'ER_DATA_TOO_LONG') {
    return new AppError(400, 'Um dos campos tem texto maior do que o permitido.', 'VALUE_TOO_LONG');
  }

  if (code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD' || code === 'ER_TRUNCATED_WRONG_VALUE' || code === 'WARN_DATA_TRUNCATED' || code === 'ER_WARN_DATA_OUT_OF_RANGE' || code === 'ER_BAD_NULL_ERROR') {
    return new AppError(400, 'Algum campo tem um valor em formato inválido.', 'INVALID_VALUE');
  }

  if (code === 'ER_DUP_ENTRY') {
    return new AppError(409, 'Já existe um registro com estes dados.', 'DUPLICATE_RECORD');
  }

  if (code === 'ER_ROW_IS_REFERENCED_2' || code === 'ER_NO_REFERENCED_ROW_2') {
    return new AppError(409, 'Relacionamento inválido ou registro em uso.', 'INVALID_RELATION');
  }

  return null;
}
