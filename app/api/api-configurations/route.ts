import { NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";
import { db } from '../../_lib/prisma';
import { z } from 'zod';

// Esquema de validação
const APIConfigSchema = z.object({
  type: z.enum(["API_OFICIAL", "API_EVOLUTION", "N8N"]),
  url: z.string().url(),
  token: z.string(),
  senha: z.string().optional(),
  apiId: z.string().optional(),
});

// POST: Criar ou atualizar configuração
export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = APIConfigSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data', details: parsed.error.errors }, { status: 400 });
    }

    const { type, url, token, senha, apiId } = parsed.data;

    // Verificar se já existe uma configuração para o usuário
    const existingConfig = await db.APIConfiguration.findFirst({
      where: { userId },
    });

    if (existingConfig) {
      // Atualizar configuração existente
      const updatedConfig = await db.APIConfiguration.update({
        where: { id: existingConfig.id },
        data: {
          type,
          url,
          token,
          senha: type === "API_OFICIAL" ? senha : null,
          apiId: type === "API_OFICIAL" ? apiId : null,
        },
      });

      return NextResponse.json({ message: 'Configuração atualizada com sucesso!', config: updatedConfig }, { status: 200 });
    } else {
      // Criar nova configuração
      const newConfig = await db.APIConfiguration.create({
        data: {
          userId,
          type,
          url,
          token,
          senha: type === "API_OFICIAL" ? senha : null,
          apiId: type === "API_OFICIAL" ? apiId : null,
        },
      });

      return NextResponse.json({ message: 'Configuração criada com sucesso!', config: newConfig }, { status: 201 });
    }
  } catch (error) {
    console.error('Erro ao salvar configuração:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

// GET: Obter configuração do usuário
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const configuration = await db.APIConfiguration.findFirst({
      where: { userId },
    });

    if (!configuration) {
      return NextResponse.json({ message: 'Nenhuma configuração encontrada.' }, { status: 404 });
    }

    return NextResponse.json(configuration, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar configuração:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

// PUT: Atualizar configuração (opcional, caso prefira separar do POST)
export async function PUT(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = APIConfigSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data', details: parsed.error.errors }, { status: 400 });
    }

    const { id, type, url, token, senha, apiId } = parsed.data;

    const updatedConfig = await db.APIConfiguration.update({
      where: { id },
      data: {
        type,
        url,
        token,
        senha: type === "API_OFICIAL" ? senha : null,
        apiId: type === "API_OFICIAL" ? apiId : null,
      },
    });

    return NextResponse.json({ message: 'Configuração atualizada com sucesso!', config: updatedConfig }, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar configuração:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

// DELETE: Remover configuração
export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 });
    }

    const configToDelete = await db.APIConfiguration.findUnique({
      where: { id },
    });

    if (!configToDelete || configToDelete.userId !== userId) {
      return NextResponse.json({ error: 'Configuração não encontrada ou não autorizada' }, { status: 404 });
    }

    await db.APIConfigurationn.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Configuração removida com sucesso!' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao deletar configuração:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
