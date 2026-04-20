// app/api/courses/route.ts
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const body = await req.json();

    // temporal en el endpoint
    // await prisma.user.create({
    //     data: {
    //         id: "test-user",
    //         email: "test@test.com",
    //     },
    // });

    const course = await prisma.course.create({
        data: {
            title: body.title,
            userId: body.userId, // temporal
        },
    });

    return Response.json(course);
}