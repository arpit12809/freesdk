
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function reset() {
  const email = "12809arpit@gmail.com";
  const newPassword = await bcrypt.hash("Arpit@456", 10);

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { password: newPassword },
    });
    console.log("SUCCESS: Password for 12809arpit@gmail.com has been set to: Arpit@456");
  } catch (err) {
    console.error("ERROR: Account not found or database error.");
  } finally {
    await prisma.$disconnect();
  }
}

reset();
