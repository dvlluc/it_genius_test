export class ApiError extends Error {
  readonly status?: number;
  readonly code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (typeof error === "object" && error !== null && "isAxiosError" in error) {
    const axiosError = error as unknown as {
      message: string;
      response?: { status?: number; data?: { message?: string } };
      code?: string;
    };
    return new ApiError(
      axiosError.response?.data?.message ?? axiosError.message,
      axiosError.response?.status,
      axiosError.code,
    );
  }

  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError("Unknown error");
}
