import prisma from "@/app/libs/prismadb"

export const getPatient = async (email: string) => {

  if (!email || email === "")
    return null


  const patient = await prisma.patient.findUnique({
    where: {
      email: email
    }
  })


  if (!patient) return null

  if (patient) {
    return patient
  }

}