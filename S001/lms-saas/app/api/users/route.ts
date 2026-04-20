import { prisma } from "@/lib/prisma";

// Crear usuario
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const user = await prisma.user.create({
      data: {
        email: body.email,
      },
    });

    return Response.json(user);
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}

// Listar usuarios
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        courses: true,
      },
    });

    return Response.json(users);
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}