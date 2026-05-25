import { NextResponse } from "next/server";

type ApiPayload = Record<string, unknown> | { error: string } | { success: boolean };

export function ok<T extends ApiPayload>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function created<T extends ApiPayload>(data: T) {
  return NextResponse.json(data, { status: 201 });
}

export function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

export function unauthorized(error = "No autenticado") {
  return NextResponse.json({ error }, { status: 401 });
}

export function forbidden(error = "No tienes permiso") {
  return NextResponse.json({ error }, { status: 403 });
}

export function notFound(error = "No encontrado") {
  return NextResponse.json({ error }, { status: 404 });
}

export function tooMany(error = "Demasiadas solicitudes") {
  return NextResponse.json({ error }, { status: 429 });
}

export function serverError(error = "Error interno") {
  return NextResponse.json({ error }, { status: 500 });
}
