
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function reset() {
  const email = "2004arpit@gmail.com";
  const newPassword = await bcrypt.hash("Arpit@123", 10);

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: { password: newPassword, isVerified: true },
      create: { email, password: newPassword, name: "Arpit", isVerified: true },
    });
    console.log("SUCCESS: Password for 2004arpit@gmail.com has been set to: Arpit@123");
  } catch (err) {
    console.error("ERROR:", err);
  } finally {
    await prisma.$disconnect();
  }
}

reset();
